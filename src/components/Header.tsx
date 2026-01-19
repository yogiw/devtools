import { Link } from '@tanstack/react-router'
import { Code } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full py-4 px-4 md:px-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-4 shadow-2xl shadow-black/20">
        {/* Left: Icon */}
        <Link
          to="/"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
        >
          <Code className="w-5 h-5 text-cyan-400" />
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8 flex-1 justify-center">
          <Link
            to="/tools/base64"
            className="text-white hover:text-cyan-400 transition-colors font-medium text-sm md:text-base"
            activeProps={{
              className: 'text-cyan-400',
            }}
          >
            Base64
          </Link>
          <Link
            to="/tools/json-viewer"
            className="text-white hover:text-cyan-400 transition-colors font-medium text-sm md:text-base"
            activeProps={{
              className: 'text-cyan-400',
            }}
          >
            JSON Viewer
          </Link>
          <Link
            to="/tools/jwt-extract"
            className="text-white hover:text-cyan-400 transition-colors font-medium text-sm md:text-base"
            activeProps={{
              className: 'text-cyan-400',
            }}
          >
            JWT Extract
          </Link>
          <Link
            to="/tools/image-converter"
            className="text-white hover:text-cyan-400 transition-colors font-medium text-sm md:text-base"
            activeProps={{
              className: 'text-cyan-400',
            }}
          >
            Image Converter
          </Link>
          <Link
            to="/tools/og-meta-seo-viewer"
            className="text-white hover:text-cyan-400 transition-colors font-medium text-sm md:text-base"
            activeProps={{
              className: 'text-cyan-400',
            }}
          >
            SEO Viewer
          </Link>
        </div>
      </nav>
    </header>
  )
}
