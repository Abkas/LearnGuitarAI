import requests
import os
import traceback
from bson import ObjectId
from dotenv import load_dotenv
from ..core.database import get_songs_collection

load_dotenv()

HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"
headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}

# Prefer the modern InferenceClient from huggingface_hub when available.
try:
    from huggingface_hub import InferenceClient
except Exception:
    InferenceClient = None

# Keep a fallback to the legacy InferenceApi for older versions.
try:
    from huggingface_hub import InferenceApi
except Exception:
    InferenceApi = None

# Initialize HF client if possible. We track the client type to select
# the correct calling pattern later.
hf_client = None
hf_client_type = None
if InferenceClient and HUGGINGFACE_TOKEN:
    try:
        # Prefer using the Hugging Face hosted inference provider explicitly
        # to avoid picking a third-party provider (like 'sambanova') that
        # may not support the automatic-speech-recognition task for this model.
        try:
            hf_client = InferenceClient(api_key=HUGGINGFACE_TOKEN, provider="hf-inference")
        except Exception:
            # If specifying the provider fails (account/config), fall back to default
            hf_client = InferenceClient(api_key=HUGGINGFACE_TOKEN)
        hf_client_type = "inference_client"
    except Exception as e:
        print("Could not initialize Hugging Face InferenceClient:", e)

if hf_client is None and InferenceApi and HUGGINGFACE_TOKEN:
    try:
        hf_client = InferenceApi(repo_id="openai/whisper-large-v3", token=HUGGINGFACE_TOKEN)
        hf_client_type = "inference_api"
    except Exception as e:
        print("Could not initialize Hugging Face InferenceApi client:", e)

async def generate_lyrics(song_id: str, current_user: dict):
    """Helper to generate lyrics using Whisper"""
    songs_collection = get_songs_collection()
    print(f"generate_lyrics: started for song_id={song_id} user={current_user}")
    # Fetch by _id first, then validate ownership. Some records store user_id as
    # a string and some as ObjectId; comparing str(...) avoids mismatches.
    song = songs_collection.find_one({"_id": ObjectId(song_id)})
    if not song:
        print(f"generate_lyrics: no song found with id={song_id}")
        return

    stored_user_id = song.get("user_id")
    if str(stored_user_id) != str(current_user["_id"]):
        print(f"generate_lyrics: song found but user mismatch: stored={stored_user_id} current={current_user['_id']}")
        return
        
    try:
        if not os.path.exists(song["file_path"]):
            print(f"generate_lyrics: audio file not found at {song['file_path']}")
            songs_collection.update_one({"_id": ObjectId(song_id)}, {"$set": {"processed": False}})
            return
        size = os.path.getsize(song["file_path"])
        print(f"generate_lyrics: reading audio file {song['file_path']} ({size} bytes)")
        with open(song["file_path"], "rb") as f:
            audio_data = f.read()
        
        transcription = None

        # Try multiple HF calling patterns to maximize chance of success and
        # ensure that any transcription we receive is printed.
        result = None
        tmp_path = None
        import tempfile
        try:
            # Write a temp file for clients that need a path to infer content-type
            suffix = os.path.splitext(song.get("file_path", "audio.mp3"))[1] or ".mp3"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(audio_data)
                tmp_path = tmp.name

            # 1) Try huggingface_hub InferenceClient / InferenceApi if available
            if hf_client is not None:
                print(f"generate_lyrics: attempting huggingface_hub client ({hf_client_type})")
                try:
                    # Try a few call patterns depending on client capabilities
                    if hf_client_type == "inference_client":
                        # Preferred call: many versions accept a file path
                        for call_input in (tmp_path, audio_data):
                            try:
                                # Try calling automatic_speech_recognition if present
                                if hasattr(hf_client, "automatic_speech_recognition"):
                                    print("generate_lyrics: calling automatic_speech_recognition with", type(call_input))
                                    result = hf_client.automatic_speech_recognition(call_input)
                                    break
                                # Some builds may expose a generic __call__ that accepts inputs
                                if callable(hf_client):
                                    print("generate_lyrics: calling hf_client(...) with", type(call_input))
                                    result = hf_client(call_input)
                                    break
                            except Exception as e_call:
                                print("Client call pattern failed:", e_call)
                                continue

                    elif hf_client_type == "inference_api":
                        # Legacy client: try sending the temp file path and use raw_response
                        try:
                            print("generate_lyrics: calling legacy InferenceApi with raw_response")
                            try:
                                resp = hf_client(inputs=tmp_path, raw_response=True)
                            except TypeError:
                                resp = hf_client(tmp_path, raw_response=True)

                            status = getattr(resp, "status_code", None)
                            ct = resp.headers.get("content-type", "") if hasattr(resp, "headers") else ""
                            print(f"HF raw response status={status} content-type={ct}")
                            try:
                                parsed = resp.json()
                            except Exception:
                                parsed = None

                            if status == 200:
                                result = parsed if parsed is not None else getattr(resp, "text", None)
                            else:
                                # keep parsed if it's an error dict to inspect
                                result = parsed or getattr(resp, "text", None)
                        except Exception as e_legacy:
                            print("Legacy client call failed:", e_legacy)
                            traceback.print_exc()
                except Exception:
                    print("HF client attempts raised an exception")
                    traceback.print_exc()

            # 2) If hf_client attempts didn't produce a usable result, call router
            if not result:
                print("generate_lyrics: calling router.huggingface.co with raw audio body", tmp_path)
                import mimetypes
                mime_type, _ = mimetypes.guess_type(tmp_path)
                if not mime_type:
                    mime_type = "audio/mpeg"
                router_url = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3"
                headers_router = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}", "Content-Type": mime_type}
                params = {"task": "transcribe", "return_timestamps": "true"}
                try:
                    with open(tmp_path, "rb") as f:
                        file_bytes = f.read()
                    r = requests.post(router_url, headers=headers_router, params=params, data=file_bytes, timeout=180)
                    print(f"Router response status: {r.status_code}")
                    if r.status_code == 200:
                        try:
                            result = r.json()
                        except Exception:
                            result = r.text
                    else:
                        print("Router response body (truncated):", r.text[:2000])
                except Exception as e_router:
                    print("Router request failed:", e_router)
                    traceback.print_exc()

            # 3) Fallback: try multipart/form-data (some earlier runs used this and printed)
            if not result:
                try:
                    print("generate_lyrics: trying multipart/form-data fallback to router")
                    router_url = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3"
                    with open(tmp_path, "rb") as f:
                        files = {"file": (os.path.basename(tmp_path), f, "audio/mpeg")}
                        r2 = requests.post(router_url, headers={"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}, files=files, data={"task": "transcribe", "return_timestamps": "true"}, timeout=180)
                    print(f"Multipart router status: {r2.status_code}")
                    if r2.status_code == 200:
                        try:
                            result = r2.json()
                        except Exception:
                            result = r2.text
                    else:
                        print("Multipart router body (truncated):", r2.text[:2000])
                except Exception as e_mp:
                    print("Multipart fallback failed:", e_mp)
                    traceback.print_exc()

        finally:
            try:
                if tmp_path and os.path.exists(tmp_path):
                    os.remove(tmp_path)
            except Exception:
                pass

        # Normalize transcription out of whatever `result` shape we got
        try:
            if result is None:
                transcription = None
            elif isinstance(result, dict):
                transcription = result.get("text") or result.get("transcription") or result.get("output") or None
            elif hasattr(result, "text"):
                transcription = getattr(result, "text")
            elif isinstance(result, str):
                transcription = result
            else:
                transcription = str(result)
        except Exception:
            transcription = None

        # If we got a transcription, persist it and return
        if transcription:
            print("--- Transcription result ---")
            try:
                print(transcription)
            except Exception:
                print(str(transcription))
            print("--- End transcription ---")

            # Build a structured analysis object. Try to extract timed segments
            # from the raw `result` when available (segments, chunks, etc.).
            parsed_segments = []
            try:
                # If result is a dict with segments/chunks
                if isinstance(result, dict):
                    for key in ("segments", "chunks"):
                        if key in result and isinstance(result[key], list):
                            for seg in result[key]:
                                if not isinstance(seg, dict):
                                    continue
                                start = seg.get("start") or seg.get("begin") or seg.get("timestamp") or seg.get("from")
                                end = seg.get("end") or seg.get("finish") or seg.get("to")
                                text = seg.get("text") or seg.get("transcript") or seg.get("chunk") or seg.get("sentence")
                                parsed_segments.append({"start": start, "end": end, "text": text})
                            break
                # If result is an object with attribute .segments (HF typed output)
                elif hasattr(result, "segments"):
                    try:
                        for seg in result.segments:
                            start = getattr(seg, "start", None)
                            end = getattr(seg, "end", None)
                            text = getattr(seg, "text", None) or getattr(seg, "chunk", None)
                            parsed_segments.append({"start": start, "end": end, "text": text})
                    except Exception:
                        pass
            except Exception:
                # Don't let parsing failures block saving the transcript
                parsed_segments = []

            analysis_obj = {"lyrics": transcription, "segments": parsed_segments}

            # Save transcription and any parsed segments back into DB
            songs_collection.update_one(
                {"_id": ObjectId(song_id)},
                {"$set": {"processed": True, "analysis": analysis_obj}}
            )
            return transcription
    except Exception as e:
        print("Error generating lyrics:")
        traceback.print_exc()
        songs_collection.update_one(
            {"_id": ObjectId(song_id)},
            {"$set": {"processed": False}}
        )
        return None