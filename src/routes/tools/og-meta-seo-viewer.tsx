import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Search, Globe, FileText, Eye, Loader2 } from 'lucide-react'
import { analyzeSeo, type MetaData } from '@/lib/seo-analyzer'

export const Route = createFileRoute('/tools/og-meta-seo-viewer')({
  component: OgMetaSeoViewer,
})

function OgMetaSeoViewer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [showAllMetaTags, setShowAllMetaTags] = useState(false)

  const fetchAndParse = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError('')
    setMetaData(null)

    try {
      // Add protocol if missing
      let targetUrl = url.trim()
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`
      }

      // Use server function to fetch and parse (no CORS issues)
      const data = await analyzeSeo({ data: targetUrl })
      setMetaData(data)
      setShowAllMetaTags(false) // Reset to show first 20 when new data loads
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch URL. Please check the URL and try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      fetchAndParse()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 mb-4 shadow-lg shadow-indigo-500/50">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-3">
            OG, Meta & SEO Viewer
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Analyze Open Graph tags, meta tags, and SEO information from any URL
          </p>
        </div>

        {/* URL Input */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl mb-6">
          <div className="space-y-4">
            <Label htmlFor="url" className="text-white font-semibold text-base">
              Website URL
            </Label>
            <div className="flex gap-4">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com or example.com"
                className="flex-1 font-mono text-sm h-12 bg-slate-900 text-white placeholder:text-gray-500 border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
              <Button
                onClick={fetchAndParse}
                disabled={loading}
                className="h-12 px-6 text-base font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 shadow-lg shadow-indigo-500/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {metaData && (
          <div className="space-y-6">
            {/* OG Image Preview */}
            {metaData.ogImage && (
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white">OG Image Preview</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <img
                      src={metaData.ogImage}
                      alt="OG Image Preview"
                      className="w-full h-auto rounded-lg border border-slate-600 max-h-96 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.innerHTML = '<p class="text-red-400 text-sm">Failed to load image</p>'
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Image URL</Label>
                    <p className="text-white text-sm mt-1 break-all font-mono bg-slate-900/50 p-2 rounded border border-slate-700">
                      {metaData.ogImage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Meta Tags */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Basic Meta Tags</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Title</Label>
                  <p className="text-white font-medium mt-1">
                    {metaData.title || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Description</Label>
                  <p className="text-white mt-1">
                    {metaData.description || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Keywords</Label>
                  <p className="text-white mt-1">
                    {metaData.keywords || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Author</Label>
                  <p className="text-white mt-1">
                    {metaData.author || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Charset</Label>
                  <p className="text-white mt-1">
                    {metaData.charset || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Language</Label>
                  <p className="text-white mt-1">
                    {metaData.language || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Viewport</Label>
                  <p className="text-white mt-1">
                    {metaData.viewport || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Robots</Label>
                  <p className="text-white mt-1">
                    {metaData.robots || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Canonical URL</Label>
                  <p className="text-white mt-1 break-all">
                    {metaData.canonical || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Open Graph Tags */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Open Graph Tags</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">OG Title</Label>
                  <p className="text-white font-medium mt-1">
                    {metaData.ogTitle || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">OG Description</Label>
                  <p className="text-white mt-1">
                    {metaData.ogDescription || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">OG Image</Label>
                  {metaData.ogImage ? (
                    <div className="mt-2 space-y-2">
                      <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                        <img
                          src={metaData.ogImage}
                          alt="OG Image"
                          className="w-full h-auto rounded border border-slate-600 max-h-48 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = '<p class="text-red-400 text-xs">Failed to load image</p>'
                            }
                          }}
                        />
                      </div>
                      <p className="text-white text-xs break-all font-mono bg-slate-900/50 p-2 rounded border border-slate-700">
                        {metaData.ogImage}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-1">Not set</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">OG URL</Label>
                  <p className="text-white mt-1 break-all">
                    {metaData.ogUrl || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">OG Type</Label>
                  <p className="text-white mt-1">
                    {metaData.ogType || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">OG Site Name</Label>
                  <p className="text-white mt-1">
                    {metaData.ogSiteName || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
              </div>
            </div>
            </div>

            {/* Twitter Card Tags */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Twitter Card Tags</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Twitter Card</Label>
                  <p className="text-white mt-1">
                    {metaData.twitterCard || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Twitter Title</Label>
                  <p className="text-white font-medium mt-1">
                    {metaData.twitterTitle || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Twitter Description</Label>
                  <p className="text-white mt-1">
                    {metaData.twitterDescription || <span className="text-gray-500">Not set</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Twitter Image</Label>
                  {metaData.twitterImage ? (
                    <div className="mt-2 space-y-2">
                      <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                        <img
                          src={metaData.twitterImage}
                          alt="Twitter Image"
                          className="w-full h-auto rounded border border-slate-600 max-h-48 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = '<p class="text-red-400 text-xs">Failed to load image</p>'
                            }
                          }}
                        />
                      </div>
                      <p className="text-white text-xs break-all font-mono bg-slate-900/50 p-2 rounded border border-slate-700">
                        {metaData.twitterImage}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-1">Not set</p>
                  )}
                </div>
              </div>
            </div>

            {/* All Meta Tags */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white">
                    All Meta Tags
                    {metaData.allMetaTags.length > 0 && (
                      <span className="text-sm font-normal text-gray-400 ml-2">
                        ({metaData.allMetaTags.length})
                      </span>
                    )}
                  </h2>
                </div>
              </div>
              <div className="max-h-[32rem] overflow-y-auto space-y-2">
                {metaData.allMetaTags.length > 0 ? (
                  <>
                    {(showAllMetaTags
                      ? metaData.allMetaTags
                      : metaData.allMetaTags.slice(0, 20)
                    ).map((tag, index) => (
                      <div
                        key={index}
                        className="bg-slate-900/50 rounded-lg p-3 border border-slate-700"
                      >
                        <p className="text-indigo-400 text-sm font-medium">{tag.name}</p>
                        <p className="text-white text-sm mt-1 break-all">{tag.content}</p>
                      </div>
                    ))}
                    {metaData.allMetaTags.length > 20 && (
                      <div className="pt-2">
                        <Button
                          onClick={() => setShowAllMetaTags(!showAllMetaTags)}
                          variant="outline"
                          className="w-full"
                        >
                          {showAllMetaTags
                            ? `Show Less (First 20)`
                            : `Show All (${metaData.allMetaTags.length} tags)`}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No meta tags found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
