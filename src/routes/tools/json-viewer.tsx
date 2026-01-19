import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, RotateCcw, CheckCircle2, ArrowLeft, FileJson } from 'lucide-react'
import { JsonTree } from '@/components/json-tree'

export const Route = createFileRoute('/tools/json-viewer')({
  component: JsonViewer,
})

function JsonViewer() {
  const [input, setInput] = useState('')
  const [parsedData, setParsedData] = useState<unknown>(null)
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleFormat = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      const formattedJson = JSON.stringify(parsed, null, 2)
      setInput(formattedJson)
      setParsedData(parsed)
      setIsValid(true)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid JSON format'
      setError(errorMessage)
      setParsedData(null)
      setIsValid(false)
    }
  }

  const handleCopy = async () => {
    if (input) {
      await navigator.clipboard.writeText(input)
    }
  }

  const handleClear = () => {
    setInput('')
    setParsedData(null)
    setError('')
    setIsValid(false)
  }

  const handleMinify = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setInput(minified)
      setParsedData(parsed)
      setIsValid(true)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid JSON format'
      setError(errorMessage)
      setParsedData(null)
      setIsValid(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInput(newValue)
    setIsValid(false)
    setError('')
    setParsedData(null)
    
    // Try to parse and update tree in real-time if valid
    if (newValue.trim()) {
      try {
        const parsed = JSON.parse(newValue)
        setParsedData(parsed)
        setIsValid(true)
      } catch {
        // Invalid JSON, don't update tree
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/50">
            <FileJson className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
            JSON Viewer
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Format, validate, and view JSON data in a readable format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="input" className="text-white font-semibold text-base">
                JSON Input
              </Label>
              {isValid && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Valid JSON
                </div>
              )}
            </div>
            <Textarea
              id="input"
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your JSON here..."
              className="min-h-[32rem] max-h-[32rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleFormat}
                className="flex-1 h-11 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/50"
              >
                Format
              </Button>
              <Button
                onClick={handleMinify}
                variant="outline"
                className="flex-1 h-11 border-slate-600 hover:bg-slate-700/50"
              >
                Minify
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex items-center justify-center gap-2 h-11 border-slate-600 hover:bg-slate-700/50"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm animate-in slide-in-from-top-2">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white font-semibold text-base">
                JSON Tree View
              </Label>
              {input && isValid && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-slate-600 hover:bg-slate-700/50 hover:border-green-500/50"
                >
                  <Copy className="w-4 h-4" />
                  Copy JSON
                </Button>
              )}
            </div>
            <div className="relative min-h-[32rem] max-h-[32rem] bg-slate-900 rounded-lg border border-slate-600 overflow-auto">
              {parsedData !== null && isValid ? (
                <JsonTree data={parsedData} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500 py-12">
                    <FileJson className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">
                      {error ? 'Invalid JSON format' : 'Enter JSON and click Format or Minify to see the tree view'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
