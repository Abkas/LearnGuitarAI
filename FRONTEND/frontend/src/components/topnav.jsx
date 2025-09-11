import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <nav
      className="w-full flex items-center justify-end px-8 py-2 mb-2"
      style={{ minHeight: '48px', background: 'none', border: 'none', boxShadow: 'none' }}
      aria-label="Main Navigation"
    >
      <Link to="/login" onClick={() => window.sessionStorage.setItem('prevLocation', window.location.pathname)}>
        <button
          className="px-5 py-2 rounded-lg bg-primary text-white font-semibold shadow transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Login"
        >
          Login
        </button>
      </Link>
    </nav>
  )
}
