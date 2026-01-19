import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as Select from '@/components/ui/select'
import { Copy, RotateCcw, ArrowLeft, Hash, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/tools/uuid-generator')({
  component: UuidGenerator,
})

type UuidVersion = '1' | '4' | '5'

// Predefined namespace UUIDs for v5
const NAMESPACE_DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
const NAMESPACE_URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
const NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8'
const NAMESPACE_X500 = '6ba7b814-9dad-11d1-80b4-00c04fd430c8'

function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState<UuidVersion>('4')
  const [v5Namespace, setV5Namespace] = useState(NAMESPACE_DNS)
  const [v5Name, setV5Name] = useState('')
  const [useCustomNamespace, setUseCustomNamespace] = useState(false)
  const [customNamespace, setCustomNamespace] = useState('')

  // Convert UUID string to bytes
  const uuidToBytes = (uuid: string): Uint8Array => {
    const hex = uuid.replace(/-/g, '')
    const bytes = new Uint8Array(16)
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
    }
    return bytes
  }

  // Convert bytes to UUID string
  const bytesToUuid = (bytes: Uint8Array): string => {
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return [
      hex.substr(0, 8),
      hex.substr(8, 4),
      hex.substr(12, 4),
      hex.substr(16, 4),
      hex.substr(20, 12),
    ].join('-')
  }

  // Generate UUID v1 (time-based)
  const generateUuidV1 = (): string => {
    const now = Date.now()
    const timestamp = BigInt(now) * 10000n + 0x01b21dd213814000n // Unix epoch to UUID timestamp

    // Create random node ID (6 bytes)
    const nodeBytes = new Uint8Array(6)
    crypto.getRandomValues(nodeBytes)
    nodeBytes[0] |= 0x01 // Set multicast bit

    // Create random clock sequence (2 bytes)
    const clockSeqBytes = new Uint8Array(2)
    crypto.getRandomValues(clockSeqBytes)
    clockSeqBytes[0] = (clockSeqBytes[0] & 0x3f) | 0x80 // Set variant bits

    // Build UUID bytes
    const uuidBytes = new Uint8Array(16)
    
    // Time low (4 bytes)
    const timeLow = Number(timestamp & 0xffffffffn)
    uuidBytes[0] = (timeLow >>> 24) & 0xff
    uuidBytes[1] = (timeLow >>> 16) & 0xff
    uuidBytes[2] = (timeLow >>> 8) & 0xff
    uuidBytes[3] = timeLow & 0xff

    // Time mid (2 bytes)
    const timeMid = Number((timestamp >>> 32n) & 0xffffn)
    uuidBytes[4] = (timeMid >>> 8) & 0xff
    uuidBytes[5] = timeMid & 0xff

    // Time high and version (2 bytes)
    const timeHigh = Number((timestamp >>> 48n) & 0x0fffn)
    uuidBytes[6] = ((timeHigh >>> 8) & 0x0f) | 0x10 // Version 1
    uuidBytes[7] = timeHigh & 0xff

    // Clock sequence (2 bytes)
    uuidBytes[8] = clockSeqBytes[0]
    uuidBytes[9] = clockSeqBytes[1]

    // Node (6 bytes)
    uuidBytes.set(nodeBytes, 10)

    return bytesToUuid(uuidBytes)
  }

  // Generate UUID v4 (random)
  const generateUuidV4 = (): string => {
    return crypto.randomUUID()
  }

  // Generate UUID v5 (name-based with SHA-1)
  const generateUuidV5 = async (namespace: string, name: string): Promise<string> => {
    if (!name.trim()) {
      throw new Error('Name is required for UUID v5')
    }

    // Validate namespace UUID format
    const namespaceRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!namespaceRegex.test(namespace)) {
      throw new Error('Invalid namespace UUID format')
    }

    const namespaceBytes = uuidToBytes(namespace)
    const nameBytes = new TextEncoder().encode(name)
    const combined = new Uint8Array(namespaceBytes.length + nameBytes.length)
    combined.set(namespaceBytes)
    combined.set(nameBytes, namespaceBytes.length)

    // Hash with SHA-1
    return crypto.subtle.digest('SHA-1', combined).then((hash) => {
      const hashBytes = new Uint8Array(hash)
      
      // Set version (5) and variant bits
      hashBytes[6] = (hashBytes[6] & 0x0f) | 0x50 // Version 5
      hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80 // Variant bits

      return bytesToUuid(hashBytes)
    })
  }

  const generateUuid = async (): Promise<string> => {
    if (version === '1') {
      return generateUuidV1()
    } else if (version === '4') {
      return generateUuidV4()
    } else if (version === '5') {
      if (!v5Name.trim()) {
        throw new Error('Name is required for UUID v5')
      }
      const namespace = useCustomNamespace ? customNamespace : v5Namespace
      if (!namespace.trim()) {
        throw new Error('Namespace UUID is required for UUID v5')
      }
      return await generateUuidV5(namespace, v5Name)
    }
    return generateUuidV4()
  }

  const generateUuids = async () => {
    try {
      const newUuids: string[] = []
      for (let i = 0; i < count; i++) {
        const uuid = await generateUuid()
        newUuids.push(uuid)
      }
      setUuids(newUuids)
    } catch (error) {
      console.error('Error generating UUIDs:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate UUIDs')
    }
  }

  const handleCopy = async () => {
    if (uuids.length > 0) {
      const text = uuids.join('\n')
      await navigator.clipboard.writeText(text)
    }
  }

  const handleClear = () => {
    setUuids([])
  }

  useEffect(() => {
    if (version !== '5' || v5Name.trim()) {
      generateUuids()
    }
  }, [version])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-violet-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 mb-4 shadow-lg shadow-violet-500/50">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-3">
            UUID Generator
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Generate RFC 4122 compliant UUID identifiers (v1, v4, v5)
          </p>
        </div>

        <div className="space-y-6">
          {/* Version Selection */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <Label className="text-white font-semibold text-base block">
              UUID Version
            </Label>
            <Select.Select value={version} onValueChange={(value) => setVersion(value as UuidVersion)}>
              <Select.SelectTrigger className="w-full bg-slate-900 text-white border-slate-600">
                <Select.SelectValue placeholder="Select UUID version" />
              </Select.SelectTrigger>
              <Select.SelectContent>
                <Select.SelectItem value="1">
                  <div>
                    <div className="font-semibold">UUID v1</div>
                    <div className="text-xs text-gray-400">Time-based UUID</div>
                  </div>
                </Select.SelectItem>
                <Select.SelectItem value="4">
                  <div>
                    <div className="font-semibold">UUID v4</div>
                    <div className="text-xs text-gray-400">Random UUID (most common)</div>
                  </div>
                </Select.SelectItem>
                <Select.SelectItem value="5">
                  <div>
                    <div className="font-semibold">UUID v5</div>
                    <div className="text-xs text-gray-400">Name-based UUID (SHA-1)</div>
                  </div>
                </Select.SelectItem>
              </Select.SelectContent>
            </Select.Select>
            {version === '1' && (
              <p className="text-sm text-gray-400">
                Time-based UUIDs include timestamp and random node identifier. Useful for sorting by creation time.
              </p>
            )}
            {version === '4' && (
              <p className="text-sm text-gray-400">
                Random UUIDs are cryptographically secure and most commonly used. Generated using secure random numbers.
              </p>
            )}
            {version === '5' && (
              <p className="text-sm text-gray-400">
                Name-based UUIDs are deterministic - the same namespace and name always produce the same UUID.
              </p>
            )}
          </div>

          {/* v5 Specific Options */}
          {version === '5' && (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
              <Label className="text-white font-semibold text-base block">
                UUID v5 Options
              </Label>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="v5-namespace" className="text-white font-medium text-sm">
                      Namespace UUID
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="custom-namespace"
                        checked={useCustomNamespace}
                        onChange={(e) => setUseCustomNamespace(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-violet-500 focus:ring-violet-500"
                      />
                      <Label htmlFor="custom-namespace" className="text-white text-xs cursor-pointer">
                        Custom
                      </Label>
                    </div>
                  </div>
                  {!useCustomNamespace ? (
                    <Select.Select value={v5Namespace} onValueChange={setV5Namespace}>
                      <Select.SelectTrigger className="w-full bg-slate-900 text-white border-slate-600">
                        <Select.SelectValue />
                      </Select.SelectTrigger>
                      <Select.SelectContent>
                        <Select.SelectItem value={NAMESPACE_DNS}>
                          <div>
                            <div className="font-semibold">DNS</div>
                            <div className="text-xs text-gray-400 font-mono">{NAMESPACE_DNS}</div>
                          </div>
                        </Select.SelectItem>
                        <Select.SelectItem value={NAMESPACE_URL}>
                          <div>
                            <div className="font-semibold">URL</div>
                            <div className="text-xs text-gray-400 font-mono">{NAMESPACE_URL}</div>
                          </div>
                        </Select.SelectItem>
                        <Select.SelectItem value={NAMESPACE_OID}>
                          <div>
                            <div className="font-semibold">OID</div>
                            <div className="text-xs text-gray-400 font-mono">{NAMESPACE_OID}</div>
                          </div>
                        </Select.SelectItem>
                        <Select.SelectItem value={NAMESPACE_X500}>
                          <div>
                            <div className="font-semibold">X.500</div>
                            <div className="text-xs text-gray-400 font-mono">{NAMESPACE_X500}</div>
                          </div>
                        </Select.SelectItem>
                      </Select.SelectContent>
                    </Select.Select>
                  ) : (
                    <Input
                      id="v5-namespace"
                      value={customNamespace}
                      onChange={(e) => setCustomNamespace(e.target.value)}
                      placeholder="00000000-0000-0000-0000-000000000000"
                      className="bg-slate-900 text-white border-slate-600 focus:border-violet-500 focus:ring-violet-500/20 font-mono text-sm"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="v5-name" className="text-white font-medium text-sm mb-2 block">
                    Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="v5-name"
                    value={v5Name}
                    onChange={(e) => setV5Name(e.target.value)}
                    placeholder="Enter name (e.g., example.com, /path/to/resource)"
                    className="bg-slate-900 text-white border-slate-600 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    The name to generate UUID from. Same namespace + name = same UUID.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Count Input */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <Label htmlFor="count" className="text-white font-semibold text-base mb-4 block">
              Number of UUIDs to generate
            </Label>
            <div className="flex gap-3">
              <input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="flex-1 px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            {version === '5' && count > 1 && (
              <p className="text-sm text-amber-400 mt-2">
                Note: UUID v5 with the same namespace and name will always generate the same UUID. Multiple UUIDs will be identical.
              </p>
            )}
          </div>

          {/* UUID Display */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="uuids" className="text-white font-semibold text-base">
                Generated UUIDs
              </Label>
              {uuids.length > 0 && (
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
                id="uuids"
                value={uuids.join('\n')}
                readOnly
                placeholder="Generated UUIDs will appear here..."
                className="min-h-[24rem] max-h-[24rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600"
              />
              {uuids.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500 py-12">
                    <Hash className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Generated UUIDs will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={generateUuids}
              disabled={version === '5' && (!v5Name.trim() || (useCustomNamespace && !customNamespace.trim()))}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 shadow-lg shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate {count} UUID{count !== 1 ? 's' : ''}
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
