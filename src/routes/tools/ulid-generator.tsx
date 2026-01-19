import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, RotateCcw, ArrowLeft, Fingerprint, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/tools/ulid-generator')({
  component: UlidGenerator,
})

// ULID character set (Crockford's Base32)
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const ENCODING_LEN = ENCODING.length

// Time component is 48 bits (6 bytes)
const TIME_LEN = 10
// Random component is 80 bits (10 bytes)
const RANDOM_LEN = 16

function UlidGenerator() {
  const [ulids, setUlids] = useState<string[]>([])
  const [count, setCount] = useState(1)

  const encodeTime = (now: number): string => {
    let str = ''
    let time = now
    for (let i = 0; i < TIME_LEN; i++) {
      str = ENCODING[time % ENCODING_LEN] + str
      time = Math.floor(time / ENCODING_LEN)
    }
    return str
  }

  const encodeRandom = (): string => {
    const array = new Uint8Array(10)
    crypto.getRandomValues(array)
    
    let str = ''
    // Each base32 character represents 5 bits
    // We need 16 characters for 80 bits (10 bytes)
    let bits = 0
    let bitCount = 0
    
    for (let i = 0; i < array.length; i++) {
      bits = (bits << 8) | array[i]
      bitCount += 8
      
      while (bitCount >= 5) {
        const value = (bits >> (bitCount - 5)) & 0x1f
        str += ENCODING[value]
        bitCount -= 5
      }
    }
    
    // Handle remaining bits
    if (bitCount > 0) {
      const value = (bits << (5 - bitCount)) & 0x1f
      str += ENCODING[value]
    }
    
    // Ensure we have exactly 16 characters
    while (str.length < RANDOM_LEN) {
      str += ENCODING[0]
    }
    
    return str.substring(0, RANDOM_LEN)
  }

  const generateUlid = (): string => {
    const now = Date.now()
    const timePart = encodeTime(now)
    const randomPart = encodeRandom()
    return timePart + randomPart
  }

  const generateUlids = () => {
    const newUlids: string[] = []
    for (let i = 0; i < count; i++) {
      newUlids.push(generateUlid())
    }
    setUlids(newUlids)
  }

  const handleCopy = async () => {
    if (ulids.length > 0) {
      const text = ulids.join('\n')
      await navigator.clipboard.writeText(text)
    }
  }

  const handleClear = () => {
    setUlids([])
  }

  useEffect(() => {
    generateUlids()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 mb-4 shadow-lg shadow-amber-500/50">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 mb-3">
            ULID Generator
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Generate ULID (Universally Unique Lexicographically Sortable Identifier) values
          </p>
        </div>

        <div className="space-y-6">
          {/* Count Input */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <Label htmlFor="count" className="text-white font-semibold text-base mb-4 block">
              Number of ULIDs to generate
            </Label>
            <div className="flex gap-3">
              <input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="flex-1 px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* ULID Display */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ulids" className="text-white font-semibold text-base">
                Generated ULIDs
              </Label>
              {ulids.length > 0 && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-slate-600 hover:bg-slate-700/50 hover:border-green-500/50"
                >
                  <Copy className="w-4 h-4" />
                  Copy All
                </Button>
              )}
            </div>
            <div className="relative">
              <Textarea
                id="ulids"
                value={ulids.join('\n')}
                readOnly
                placeholder="Generated ULIDs will appear here..."
                className="min-h-[24rem] max-h-[24rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600"
              />
              {ulids.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500 py-12">
                    <Fingerprint className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Generated ULIDs will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={generateUlids}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/50"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate {count} ULID{count !== 1 ? 's' : ''}
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
        </div>
      </div>
    </div>
  )
}
