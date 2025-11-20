import { axiosInstance } from "../lib/axios"

export async function uploadSong(file) {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axiosInstance.post("/songs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data

  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Song upload failed")
  }
}

// Upload song from URL: POST /upload-url
export async function uploadSongFromUrl(url) {
  try {
    const response = await axiosInstance.post("/upload-url", {
      url
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Song URL upload failed")
  }
}

// Get song analysis status: GET /songs/{songId}/status
export async function getSongAnalysisStatus(songId) {
  try {
    const response = await axiosInstance.get(`/songs/${songId}/status`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to get song analysis status")
  }
}

// Get song analysis result: GET /songs/{songId}
export async function getSongAnalysis(songId) {
  try {
    const response = await axiosInstance.get(`/songs/${songId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to get song analysis")
  }
}

// Get song lyrics: GET /songs/{songId}/lyrics
export async function getSongLyrics(songId) {
  try {
    const response = await axiosInstance.get(`/songs/${songId}/lyrics`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Failed to get song lyrics")
  }
}