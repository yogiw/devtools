import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Copy, RotateCcw, ArrowLeft, Lock, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/tools/password-generator')({
  component: PasswordGenerator,
})

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  })

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const generatePassword = () => {
    let charset = ''
    if (options.includeUppercase) charset += uppercaseChars
    if (options.includeLowercase) charset += lowercaseChars
    if (options.includeNumbers) charset += numberChars
    if (options.includeSymbols) charset += symbolChars

    if (charset.length === 0) {
      setPassword('')
      return
    }

    // Use cryptographically secure random generation with rejection sampling
    // to eliminate modulo bias and ensure uniform distribution
    const charsetLength = charset.length
    // Calculate the maximum value that evenly divides by charset length
    // Values >= maxValid would introduce bias when using modulo
    const maxValid = Math.floor(256 / charsetLength) * charsetLength

    let generated = ''

    for (let i = 0; i < options.length; i++) {
      let randomValue: number
      // Rejection sampling: generate random bytes until we get one in the valid range
      // This ensures each character has equal probability of being selected
      do {
        const randomByte = new Uint8Array(1)
        crypto.getRandomValues(randomByte)
        randomValue = randomByte[0]
      } while (randomValue >= maxValid)

      // Safe to use modulo now since randomValue is guaranteed to be < maxValid
      generated += charset[randomValue % charsetLength]
    }

    setPassword(generated)
  }

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password)
    }
  }

  const handleClear = () => {
    setPassword('')
  }

  const updateOption = <K extends keyof PasswordOptions>(
    key: K,
    value: PasswordOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  // Generate password on mount
  useEffect(() => {
    generatePassword()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-4 shadow-lg shadow-green-500/50">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-3">
            Password Generator
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Generate secure, random passwords with customizable options
          </p>
        </div>

        <div className="space-y-6">
          {/* Password Display */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl">
            <Label htmlFor="password" className="text-white font-semibold text-base mb-4 block">
              Generated Password
            </Label>
            <div className="flex gap-3">
              <Input
                id="password"
                value={password}
                readOnly
                className="flex-1 font-mono text-lg bg-slate-900 text-white border-slate-600 focus:border-green-500 focus:ring-green-500/20"
                placeholder="Click Generate to create a password"
              />
              {password && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="border-slate-600 hover:bg-slate-700/50 hover:border-green-500/50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Options</h2>

            {/* Length Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white font-medium">Length: {options.length}</Label>
              </div>
              <Slider
                value={[options.length]}
                onValueChange={(value) => updateOption('length', value[0])}
                min={4}
                max={128}
                step={1}
                className="w-full"
              />
            </div>

            {/* Character Type Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div>
                  <Label htmlFor="uppercase" className="text-white font-medium cursor-pointer">
                    Uppercase Letters (A-Z)
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">Include uppercase letters</p>
                </div>
                <Switch
                  id="uppercase"
                  checked={options.includeUppercase}
                  onCheckedChange={(checked) => updateOption('includeUppercase', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div>
                  <Label htmlFor="lowercase" className="text-white font-medium cursor-pointer">
                    Lowercase Letters (a-z)
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">Include lowercase letters</p>
                </div>
                <Switch
                  id="lowercase"
                  checked={options.includeLowercase}
                  onCheckedChange={(checked) => updateOption('includeLowercase', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div>
                  <Label htmlFor="numbers" className="text-white font-medium cursor-pointer">
                    Numbers (0-9)
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">Include numbers</p>
                </div>
                <Switch
                  id="numbers"
                  checked={options.includeNumbers}
                  onCheckedChange={(checked) => updateOption('includeNumbers', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div>
                  <Label htmlFor="symbols" className="text-white font-medium cursor-pointer">
                    Symbols (!@#$%...)
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">Include special characters</p>
                </div>
                <Switch
                  id="symbols"
                  checked={options.includeSymbols}
                  onCheckedChange={(checked) => updateOption('includeSymbols', checked)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={generatePassword}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-lg shadow-green-500/50"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate New Password
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
