import { createFileRoute, Link } from '@tanstack/react-router'
import { Code, FileJson, Key, Image as ImageIcon, Eye, ArrowRight, Lock, Hash, Fingerprint, Code2 } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const tools = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Base64 Encode & Decode',
      description: 'Encode and decode Base64 strings quickly and easily.',
      href: '/tools/base64',
      gradient: 'from-cyan-500 to-blue-500',
      hoverGradient: 'hover:from-cyan-400 hover:to-blue-400',
    },
    {
      icon: <FileJson className="w-8 h-8" />,
      title: 'JSON Viewer',
      description: 'Format, validate, and view JSON data in a readable format.',
      href: '/tools/json-viewer',
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'hover:from-purple-400 hover:to-pink-400',
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'JSON to TypeScript',
      description: 'Convert JSON objects to TypeScript types or interfaces.',
      href: '/tools/json-to-typescript',
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'hover:from-amber-400 hover:to-orange-400',
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: 'JWT Extract',
      description: 'Decode and extract information from JWT tokens.',
      href: '/tools/jwt-extract',
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'hover:from-emerald-400 hover:to-teal-400',
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      title: 'Image Converter',
      description: 'Convert images to WebP, PNG, or JPG instantly in your browser.',
      href: '/tools/image-converter',
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'hover:from-orange-400 hover:to-red-400',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'OG, Meta & SEO Viewer',
      description: 'Analyze Open Graph tags, meta tags, and SEO information from any URL.',
      href: '/tools/og-meta-seo-viewer',
      gradient: 'from-indigo-500 to-blue-500',
      hoverGradient: 'hover:from-indigo-400 hover:to-blue-400',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Password Generator',
      description: 'Generate secure, random passwords with customizable options.',
      href: '/tools/password-generator',
      gradient: 'from-green-500 to-emerald-500',
      hoverGradient: 'hover:from-green-400 hover:to-emerald-400',
    },
    {
      icon: <Hash className="w-8 h-8" />,
      title: 'UUID Generator',
      description: 'Generate RFC 4122 compliant UUID v4 identifiers.',
      href: '/tools/uuid-generator',
      gradient: 'from-violet-500 to-purple-500',
      hoverGradient: 'hover:from-violet-400 hover:to-purple-400',
    },
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: 'ULID Generator',
      description: 'Generate ULID (Universally Unique Lexicographically Sortable Identifier) values.',
      href: '/tools/ulid-generator',
      gradient: 'from-amber-500 to-yellow-500',
      hoverGradient: 'hover:from-amber-400 hover:to-yellow-400',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="relative max-w-5xl mx-auto z-10">
          <div className="inline-block mb-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4 [letter-spacing:-0.08em] animate-gradient">
              Dev Tools
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"></div>
          </div>
          <p className="text-2xl md:text-3xl text-gray-200 mb-4 font-light">
            Collection of useful development tools
          </p>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Quick access to essential utilities for encoding, decoding, and
            viewing data
          </p>
        </div>
      </section>

      <section className="relative py-12 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.href}
              className="group relative block bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${tool.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{tool.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
                  {tool.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                  {tool.description}
                </p>
                <div className="flex items-center text-cyan-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
