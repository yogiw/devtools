import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, RotateCcw, ArrowLeft, Key } from 'lucide-react'

export const Route = createFileRoute('/tools/jwt-extract')({
  component: JwtExtract,
})

interface JwtPayload {
  [key: string]: unknown
}

function JwtExtract() {
  const [token, setToken] = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [error, setError] = useState('')

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    if (pad) {
      base64 += new Array(5 - pad).join('=')
    }
    try {
      return decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    } catch (e) {
      throw new Error('Invalid base64url encoding')
    }
  }

  const extractJwt = () => {
    try {
      setError('')
      const parts = token.trim().split('.')

      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.')
      }

      const [headerPart, payloadPart] = parts

      const decodedHeader = base64UrlDecode(headerPart)
      const decodedPayload = base64UrlDecode(payloadPart)

      const headerObj = JSON.parse(decodedHeader) as JwtPayload
      const payloadObj = JSON.parse(decodedPayload) as JwtPayload

      setHeader(JSON.stringify(headerObj, null, 2))
      setPayload(JSON.stringify(payloadObj, null, 2))
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to extract JWT data'
      setError(errorMessage)
      setHeader('')
      setPayload('')
    }
  }

  const handleCopy = async (text: string) => {
    if (text) {
      await navigator.clipboard.writeText(text)
    }
  }

  const handleClear = () => {
    setToken('')
    setHeader('')
    setPayload('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 shadow-lg shadow-emerald-500/50">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-3">
            JWT Extract
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Decode and extract information from JWT tokens
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={extractJwt}
              className="text-base font-semibold h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/50"
            >
              Extract JWT →
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex items-center justify-center gap-2 h-12 border-slate-600 hover:bg-slate-700/50"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm animate-in slide-in-from-top-2">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
              <Label htmlFor="token" className="text-white font-semibold text-base">
                JWT Token
              </Label>
              <Textarea
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT token here..."
                className="min-h-[32rem] max-h-[32rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {header && payload ? (
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="header" className="text-white font-semibold text-base">
                      Header
                    </Label>
                    <Button
                      onClick={() => handleCopy(header)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-slate-600 hover:bg-slate-700/50 hover:border-green-500/50"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    id="header"
                    value={header}
                    readOnly
                    className="min-h-48 max-h-48 overflow-y-auto font-mono text-sm bg-slate-900 text-white border-slate-600"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payload" className="text-white font-semibold text-base">
                      Payload
                    </Label>
                    <Button
                      onClick={() => handleCopy(payload)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-slate-600 hover:bg-slate-700/50 hover:border-green-500/50"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    id="payload"
                    value={payload}
                    readOnly
                    className="min-h-48 max-h-48 overflow-y-auto font-mono text-sm bg-slate-900 text-white border-slate-600"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
                <Label className="text-white font-semibold text-base">Extracted Data</Label>
                <div className="relative min-h-[32rem] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Key className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Extracted header and payload will appear here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
