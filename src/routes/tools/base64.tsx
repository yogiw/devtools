import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, RotateCcw, ArrowLeft, Code } from 'lucide-react'

export const Route = createFileRoute('/tools/base64')({
  component: Base64Tool,
})

function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleEncode = () => {
    try {
      setError('')
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(encoded)
    } catch (err) {
      setError('Failed to encode. Please check your input.')
      setOutput('')
    }
  }

  const handleDecode = () => {
    try {
      setError('')
      const decoded = decodeURIComponent(escape(atob(input)))
      setOutput(decoded)
    } catch (err) {
      setError('Failed to decode. Please check if the input is valid Base64.')
      setOutput('')
    }
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleSwitch = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 mb-4 shadow-lg shadow-cyan-500/50">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-3">
            Base64 Encode & Decode
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Encode text to Base64 or decode Base64 strings back to text
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSwitch}
              variant={mode === 'encode' ? 'default' : 'outline'}
              className={`text-base font-semibold h-12 ${
                mode === 'encode'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/50'
                  : ''
              }`}
            >
              {mode === 'encode' ? '🔒 Encode Mode' : '🔓 Decode Mode'}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="input" className="text-white font-semibold text-base">
                  {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                </Label>
              </div>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'encode'
                    ? 'Enter text to encode to Base64...'
                    : 'Enter Base64 string to decode...'
                }
                className="min-h-[32rem] max-h-[32rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
              <Button
                onClick={mode === 'encode' ? handleEncode : handleDecode}
                className="w-full h-11 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/50"
              >
                {mode === 'encode' ? 'Encode →' : 'Decode →'}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="output" className="text-white font-semibold text-base">
                  {mode === 'encode' ? 'Encoded Base64' : 'Decoded Text'}
                </Label>
                {output && (
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-slate-600 hover:bg-slate-700/50 hover:border-green-500/50"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                )}
              </div>
              <div className="relative">
                <Textarea
                  id="output"
                  value={output}
                  readOnly
                  placeholder={
                    mode === 'encode'
                      ? 'Encoded Base64 will appear here...'
                      : 'Decoded text will appear here...'
                  }
                  className="min-h-[32rem] max-h-[32rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600"
                />
                {!output && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-gray-500 py-12">
                      <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Result will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
