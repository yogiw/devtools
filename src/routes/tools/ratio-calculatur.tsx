import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Copy, RotateCcw, Scale } from 'lucide-react'

export const Route = createFileRoute('/tools/ratio-calculatur')({
  component: RatioCalculatur,
})

interface ParsedDimensions {
  width: number
  height: number
}

function RatioCalculatur() {
  const [a1, setA1] = useState('1920')
  const [b1, setB1] = useState('1080')
  const [a2, setA2] = useState('1280')
  const [b2, setB2] = useState('720')
  const [error, setError] = useState('')

  const results = useMemo(() => {
    const original = parseDimensions(a1, b1)
    const target = parseDimensions(a2, b2)

    const originalAspect = original ? getAspectLabel(original.width, original.height) : null
    const targetAspect = target ? getAspectLabel(target.width, target.height) : null

    const isSameRatio =
      original && target ? areSameRatio(original.width, original.height, target.width, target.height) : null

    const scaleX = original && target ? target.width / original.width : null
    const scaleY = original && target ? target.height / original.height : null

    return {
      original,
      target,
      originalAspect,
      targetAspect,
      isSameRatio,
      scaleX,
      scaleY,
    }
  }, [a1, b1, a2, b2])

  const solveTarget = () => {
    setError('')
    const original = parseDimensions(a1, b1)
    if (!original) return setError('Enter A1 and B1 (original width/height) first.')

    const targetWidth = parsePositiveNumber(a2)
    const targetHeight = parsePositiveNumber(b2)

    if (targetWidth && !targetHeight) {
      const computed = (targetWidth * original.height) / original.width
      return setB2(formatNumber(computed))
    }

    if (!targetWidth && targetHeight) {
      const computed = (targetHeight * original.width) / original.height
      return setA2(formatNumber(computed))
    }

    if (targetWidth && targetHeight) return setError('A2 and B2 are already filled.')
    setError('Enter either A2 or B2 to solve the other.')
  }

  const solveOriginal = () => {
    setError('')
    const target = parseDimensions(a2, b2)
    if (!target) return setError('Enter A2 and B2 (target width/height) first.')

    const originalWidth = parsePositiveNumber(a1)
    const originalHeight = parsePositiveNumber(b1)

    if (originalWidth && !originalHeight) {
      const computed = (originalWidth * target.height) / target.width
      return setB1(formatNumber(computed))
    }

    if (!originalWidth && originalHeight) {
      const computed = (originalHeight * target.width) / target.height
      return setA1(formatNumber(computed))
    }

    if (originalWidth && originalHeight) return setError('A1 and B1 are already filled.')
    setError('Enter either A1 or B1 to solve the other.')
  }

  const swap = () => {
    setError('')
    setA1(a2)
    setB1(b2)
    setA2(a1)
    setB2(b1)
  }

  const fillExample = () => {
    setError('')
    setA1('1920')
    setB1('1080')
    setA2('1280')
    setB2('720')
  }

  const handleClear = () => {
    setError('')
    setA1('')
    setB1('')
    setA2('')
    setB2('')
  }

  const handleCopy = async () => {
    const lines = [
      `A1=${a1 || '-'}`,
      `B1=${b1 || '-'}`,
      `A2=${a2 || '-'}`,
      `B2=${b2 || '-'}`,
      '',
      `Original ratio: ${results.originalAspect ?? '-'}`,
      `Target ratio: ${results.targetAspect ?? '-'}`,
      `Same ratio: ${results.isSameRatio === null ? '-' : results.isSameRatio ? 'Yes' : 'No'}`,
      `Scale X: ${results.scaleX === null ? '-' : formatNumber(results.scaleX)}`,
      `Scale Y: ${results.scaleY === null ? '-' : formatNumber(results.scaleY)}`,
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-fuchsia-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 mb-4 shadow-lg shadow-fuchsia-500/40">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-400 mb-3">
            Ratio Calculatur
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Keep aspect ratio while resizing (e.g., 1920×1080 → 1280×720)
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm animate-in slide-in-from-top-2">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Original</h2>
                <div className="text-xs text-gray-400 font-mono">
                  {results.originalAspect ? `Ratio: ${results.originalAspect}` : 'Ratio: -'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="a1" className="text-white font-medium">
                    A1 (Width)
                  </Label>
                  <Input
                    id="a1"
                    inputMode="decimal"
                    value={a1}
                    onChange={(e) => setA1(e.target.value)}
                    placeholder="e.g. 1920"
                    className="bg-slate-900 text-white border-slate-600 focus:border-fuchsia-500 focus:ring-fuchsia-500/20 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b1" className="text-white font-medium">
                    B1 (Height)
                  </Label>
                  <Input
                    id="b1"
                    inputMode="decimal"
                    value={b1}
                    onChange={(e) => setB1(e.target.value)}
                    placeholder="e.g. 1080"
                    className="bg-slate-900 text-white border-slate-600 focus:border-fuchsia-500 focus:ring-fuchsia-500/20 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Target</h2>
                <div className="text-xs text-gray-400 font-mono">
                  {results.targetAspect ? `Ratio: ${results.targetAspect}` : 'Ratio: -'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="a2" className="text-white font-medium">
                    A2 (Width)
                  </Label>
                  <Input
                    id="a2"
                    inputMode="decimal"
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    placeholder="e.g. 1280"
                    className="bg-slate-900 text-white border-slate-600 focus:border-fuchsia-500 focus:ring-fuchsia-500/20 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b2" className="text-white font-medium">
                    B2 (Height)
                  </Label>
                  <Input
                    id="b2"
                    inputMode="decimal"
                    value={b2}
                    onChange={(e) => setB2(e.target.value)}
                    placeholder="e.g. 720"
                    className="bg-slate-900 text-white border-slate-600 focus:border-fuchsia-500 focus:ring-fuchsia-500/20 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
                <div className="text-xs text-gray-400 mb-1">Same aspect ratio?</div>
                <div className="text-white font-semibold text-lg">
                  {results.isSameRatio === null ? '-' : results.isSameRatio ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
                <div className="text-xs text-gray-400 mb-1">Scale (Target / Original)</div>
                <div className="text-white font-semibold text-lg">
                  {results.scaleX === null || results.scaleY === null
                    ? '-'
                    : `X ${formatNumber(results.scaleX)} · Y ${formatNumber(results.scaleY)}`}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <Button
              onClick={solveTarget}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-fuchsia-500 to-rose-500 hover:from-fuchsia-400 hover:to-rose-400 shadow-lg shadow-fuchsia-500/40"
            >
              Solve Target
            </Button>
            <Button
              onClick={solveOriginal}
              variant="outline"
              className="flex-1 h-12 border-slate-600 hover:bg-slate-700/50"
            >
              Solve Original
            </Button>
            <Button
              onClick={swap}
              variant="outline"
              className="flex-1 h-12 border-slate-600 hover:bg-slate-700/50"
            >
              Swap
            </Button>
            <Button
              onClick={fillExample}
              variant="outline"
              className="flex-1 h-12 border-slate-600 hover:bg-slate-700/50"
            >
              Example
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 h-12 border-slate-600 hover:bg-slate-700/50 hover:border-green-500/50 flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1 h-12 border-slate-600 hover:bg-slate-700/50 flex items-center justify-center gap-2"
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

function parseDimensions(widthRaw: string, heightRaw: string): ParsedDimensions | null {
  const width = parsePositiveNumber(widthRaw)
  const height = parsePositiveNumber(heightRaw)
  if (!width || !height) return null
  return { width, height }
}

function parsePositiveNumber(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const normalized = trimmed.replaceAll(',', '')
  const value = Number(normalized)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '-'
  const rounded = Math.round(value * 10000) / 10000
  if (Number.isInteger(rounded)) return String(rounded)
  return String(rounded)
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function getAspectLabel(width: number, height: number): string {
  if (Number.isSafeInteger(width) && Number.isSafeInteger(height)) {
    const divisor = gcd(width, height)
    return `${Math.trunc(width / divisor)}:${Math.trunc(height / divisor)}`
  }
  const ratio = width / height
  return `${formatNumber(ratio)}:1`
}

function areSameRatio(w1: number, h1: number, w2: number, h2: number): boolean {
  const left = w1 * h2
  const right = w2 * h1
  const delta = Math.abs(left - right)
  const tolerance = 1e-9 * Math.max(Math.abs(left), Math.abs(right), 1)
  return delta <= tolerance
}
