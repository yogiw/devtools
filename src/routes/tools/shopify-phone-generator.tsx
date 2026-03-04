import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Copy, RotateCcw, ArrowLeft, Phone, RefreshCw, Search, ChevronDown } from 'lucide-react'
import { SHOPIFY_PHONE_COUNTRIES, type CountryPhoneConfig } from '@/data/shopify-phone-countries'

export const Route = createFileRoute('/tools/shopify-phone-generator')({
  component: ShopifyPhoneGenerator,
})

function randomDigit(excludeZero = false): string {
  const bytes = new Uint8Array(1)
  crypto.getRandomValues(bytes)
  const n = excludeZero ? 1 + (bytes[0] % 9) : bytes[0] % 10
  return String(n)
}

function randomDigits(length: number, firstDigitExcludeZero = false): string {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += randomDigit(i === 0 && firstDigitExcludeZero)
  }
  return out
}

function generateNationalNumber(country: CountryPhoneConfig): string {
  if (country.nationalPrefixes && country.nationalPrefixes.length > 0) {
    const prefix = country.nationalPrefixes[Math.floor(Math.random() * country.nationalPrefixes.length)]
    const remainingLength = country.nationalLength - prefix.length
    const rest = randomDigits(remainingLength, false)
    return prefix + rest
  }
  return randomDigits(country.nationalLength, true)
}

function generateE164(country: CountryPhoneConfig): string {
  const national = generateNationalNumber(country)
  return `+${country.dialCode}${national}`
}

function filterCountries(query: string): CountryPhoneConfig[] {
  const q = query.trim().toLowerCase()
  if (!q) return SHOPIFY_PHONE_COUNTRIES
  return SHOPIFY_PHONE_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dialCode.includes(q)
  )
}

function ShopifyPhoneGenerator() {
  const [country, setCountry] = useState<CountryPhoneConfig>(SHOPIFY_PHONE_COUNTRIES[0])
  const [countrySearch, setCountrySearch] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const [count, setCount] = useState(5)
  const [phones, setPhones] = useState<string[]>([])
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredCountries = useMemo(
    () => filterCountries(countrySearch),
    [countrySearch]
  )

  useEffect(() => {
    if (!countryOpen) return
    const t = requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
    return () => cancelAnimationFrame(t)
  }, [countryOpen])

  useEffect(() => {
    if (!countryOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current?.contains(e.target as Node)) return
      setCountryOpen(false)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCountryOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [countryOpen])

  const generate = () => {
    const list: string[] = []
    for (let i = 0; i < count; i++) {
      list.push(generateE164(country))
    }
    setPhones(list)
  }

  const handleCopy = async () => {
    if (phones.length > 0) {
      await navigator.clipboard.writeText(phones.join('\n'))
    }
  }

  const handleCopySingle = async (value: string) => {
    await navigator.clipboard.writeText(value)
  }

  const handleClear = () => {
    setPhones([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 mb-4 shadow-lg shadow-teal-500/50">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-3">
            Shopify Phone Generator
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Generate random dummy phone numbers in E.164 format that pass Shopify phone validation for various countries
          </p>
        </div>

        <div className="space-y-6">
          <div
            ref={countryDropdownRef}
            className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4 ${countryOpen ? 'relative z-[100]' : ''}`}
          >
            <Label className="text-white font-semibold text-base block">Country</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCountryOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-left text-white shadow-xs transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-expanded={countryOpen}
                aria-haspopup="listbox"
                aria-label="Select country"
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">{country.name}</span>
                  <span className="text-gray-400 text-sm">+{country.dialCode}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${countryOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {countryOpen && (
                <div
                  className="absolute top-full left-0 right-0 z-[100] mt-1 max-h-80 overflow-hidden rounded-md border border-slate-600 bg-slate-900 shadow-lg"
                  role="listbox"
                >
                  <div className="border-b border-slate-700 p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search country (e.g. France, Belgium, Spain)"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="h-9 border-slate-600 bg-slate-800 pl-9 text-white placeholder:text-gray-500 focus-visible:ring-teal-500"
                        aria-label="Search countries"
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto p-1">
                    {filteredCountries.length === 0 ? (
                      <div className="py-6 text-center text-sm text-gray-500">
                        No country found. Try &quot;France&quot;, &quot;Belgium&quot;, &quot;Spain&quot;, or dial code.
                      </div>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          role="option"
                          aria-selected={country.code === c.code}
                          onClick={() => {
                            setCountry(c)
                            setCountrySearch('')
                            setCountryOpen(false)
                          }}
                          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:bg-slate-800 ${
                            country.code === c.code
                              ? 'bg-teal-500/20 text-teal-400'
                              : 'text-gray-200 hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-medium">{c.name}</span>
                          <span className="text-gray-400">+{c.dialCode}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400">
              Numbers are generated in E.164 format (+{country.dialCode}…) suitable for Shopify checkout and API.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <Label htmlFor="count" className="text-white font-semibold text-base mb-4 block">
              Number of phone numbers to generate
            </Label>
            <div className="flex gap-3">
              <input
                id="count"
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) =>
                  setCount(Math.max(1, Math.min(50, parseInt(e.target.value, 10) || 1)))
                }
                className="flex-1 px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Label className="text-white font-semibold text-base">Generated numbers (E.164)</Label>
              {phones.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-slate-600 hover:bg-slate-700/50 hover:border-teal-500/50"
                  >
                    <Copy className="w-4 h-4" />
                    Copy all
                  </Button>
                </div>
              )}
            </div>
            <div className="relative">
              <Textarea
                value={phones.join('\n')}
                readOnly
                placeholder="Click Generate to create phone numbers..."
                className="min-h-[16rem] max-h-[24rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600"
              />
              {phones.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500 py-12">
                    <Phone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Generated numbers will appear here</p>
                  </div>
                </div>
              )}
            </div>
            {phones.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {phones.map((p, i) => (
                  <button
                    key={`${p}-${i}`}
                    type="button"
                    onClick={() => handleCopySingle(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-sm font-mono text-gray-200 hover:border-teal-500/50 hover:text-teal-400 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={generate}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/50"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate {count} number{count !== 1 ? 's' : ''}
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
