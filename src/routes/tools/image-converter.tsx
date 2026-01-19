import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useCallback, useRef } from 'react'
import JSZip from 'jszip'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, Image as ImageIcon, X, Download, Loader2, Camera } from 'lucide-react'

export const Route = createFileRoute('/tools/image-converter')({
  component: ImageConverter,
})

interface ImageFile {
  id: string
  file: File
  preview: string
  convertedBlob: Blob | null
  convertedUrl: string | null
  status: 'pending' | 'converting' | 'done' | 'error'
  originalSize: number
  convertedSize: number | null
}

type OutputFormat = 'webp' | 'png' | 'jpeg'

interface FormatOption {
  value: OutputFormat
  label: string
  mimeType: string
  extension: string
  supportsQuality: boolean
}

const FORMAT_OPTIONS: FormatOption[] = [
  { value: 'webp', label: 'WebP', mimeType: 'image/webp', extension: 'webp', supportsQuality: true },
  { value: 'png', label: 'PNG', mimeType: 'image/png', extension: 'png', supportsQuality: false },
  { value: 'jpeg', label: 'JPG', mimeType: 'image/jpeg', extension: 'jpg', supportsQuality: true },
]

interface ConversionSettings {
  quality: number
  scale: number
  format: OutputFormat
}

function ImageConverter() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 100,
    scale: 100,
    format: 'webp',
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const handleFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    )

    const newImages: ImageFile[] = imageFiles.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      convertedBlob: null,
      convertedUrl: null,
      status: 'pending' as const,
      originalSize: file.size,
      convertedSize: null,
    }))

    setImages((prev) => [...prev, ...newImages])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const convertImage = async (imageFile: ImageFile): Promise<ImageFile> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve({ ...imageFile, status: 'error' })
          return
        }

        const scaleFactor = settings.scale / 100
        canvas.width = img.width * scaleFactor
        canvas.height = img.height * scaleFactor

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const formatOption =
          FORMAT_OPTIONS.find((f) => f.value === settings.format) ||
          FORMAT_OPTIONS[0]
        const quality = formatOption.supportsQuality
          ? settings.quality / 100
          : undefined

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const convertedUrl = URL.createObjectURL(blob)
              resolve({
                ...imageFile,
                convertedBlob: blob,
                convertedUrl,
                convertedSize: blob.size,
                status: 'done',
              })
            } else {
              resolve({ ...imageFile, status: 'error' })
            }
          },
          formatOption.mimeType,
          quality
        )
      }

      img.onerror = () => {
        resolve({ ...imageFile, status: 'error' })
      }

      img.src = imageFile.preview
    })
  }

  const handleConvert = async () => {
    if (images.length === 0) return

    setIsConverting(true)

    setImages((prev) =>
      prev.map((img) =>
        img.status === 'pending' ? { ...img, status: 'converting' } : img
      )
    )

    const updatedImages = await Promise.all(
      images.map(async (img) => {
        if (img.status === 'done') return img
        return await convertImage(img)
      })
    )

    setImages(updatedImages)
    setIsConverting(false)
  }

  const getFileExtension = () => {
    const formatOption = FORMAT_OPTIONS.find((f) => f.value === settings.format)
    return formatOption?.extension || 'webp'
  }

  const downloadSingle = (image: ImageFile) => {
    if (!image.convertedUrl) return

    const link = document.createElement('a')
    link.href = image.convertedUrl
    const originalName = image.file.name.replace(/\.[^/.]+$/, '')
    link.download = `${originalName}.${getFileExtension()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAll = async () => {
    const convertedImages = images.filter(
      (img) => img.status === 'done' && img.convertedBlob
    )
    if (convertedImages.length === 0) return

    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0])
      return
    }

    const zip = new JSZip()

    const extension = getFileExtension()
    convertedImages.forEach((img) => {
      if (img.convertedBlob) {
        const originalName = img.file.name.replace(/\.[^/.]+$/, '')
        zip.file(`${originalName}.${extension}`, img.convertedBlob)
      }
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'converted-images.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
        if (image.convertedUrl) URL.revokeObjectURL(image.convertedUrl)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const clearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.preview)
      if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl)
    })
    setImages([])
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const hasConvertedImages = images.some((img) => img.status === 'done')
  const hasPendingImages = images.some((img) => img.status === 'pending')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-4 shadow-lg shadow-orange-500/50">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-3">
            Image Converter
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Convert images to WebP, PNG, or JPG instantly in your browser
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-white font-semibold text-base">
                Output Format
              </Label>
              <div className="flex gap-2">
                {FORMAT_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={settings.format === option.value ? 'default' : 'outline'}
                    className={`flex-1 ${
                      settings.format === option.value
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg shadow-orange-500/50'
                        : ''
                    }`}
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, format: option.value }))
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white font-semibold text-base">
                  Quality
                </Label>
                <span className="text-gray-400 text-sm">{settings.quality}%</span>
              </div>
              <Slider
                value={[settings.quality]}
                onValueChange={([value]) =>
                  setSettings((prev) => ({ ...prev, quality: value }))
                }
                min={1}
                max={100}
                disabled={
                  !FORMAT_OPTIONS.find((f) => f.value === settings.format)
                    ?.supportsQuality
                }
                className="w-full"
              />
              {!FORMAT_OPTIONS.find((f) => f.value === settings.format)
                ?.supportsQuality && (
                <p className="text-xs text-gray-500">PNG uses lossless compression</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white font-semibold text-base">Scale</Label>
                <span className="text-gray-400 text-sm">{settings.scale}%</span>
              </div>
              <Slider
                value={[settings.scale]}
                onValueChange={([value]) =>
                  setSettings((prev) => ({ ...prev, scale: value }))
                }
                min={10}
                max={100}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 mb-6 ${
            isDragging
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <Camera className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-white mb-1">
                <span className="text-orange-400">Drop images here</span> or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supports JPG, PNG, GIF, BMP, and more
              </p>
            </div>
          </div>
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <div className="space-y-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </h2>
              <Button onClick={clearAll} variant="outline">
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-lg relative group"
                >
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-900 mb-3">
                    <img
                      src={image.convertedUrl || image.preview}
                      alt={image.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <p
                      className="text-sm font-medium text-white truncate"
                      title={image.file.name}
                    >
                      {image.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatSize(image.originalSize)}</span>
                      {image.convertedSize && (
                        <>
                          <span>→</span>
                          <span>{formatSize(image.convertedSize)}</span>
                          <span
                            className={
                              image.convertedSize < image.originalSize
                                ? 'text-green-400'
                                : 'text-red-400'
                            }
                          >
                            {image.convertedSize < image.originalSize ? '-' : '+'}
                            {Math.abs(
                              Math.round(
                                (1 - image.convertedSize / image.originalSize) * 100
                              )
                            )}
                            %
                          </span>
                        </>
                      )}
                    </div>
                    <div className="pt-2">
                      {image.status === 'pending' && (
                        <span className="text-xs text-gray-400">Ready</span>
                      )}
                      {image.status === 'converting' && (
                        <div className="flex items-center gap-2 text-xs text-orange-400">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Converting...
                        </div>
                      )}
                      {image.status === 'done' && (
                        <Button
                          onClick={() => downloadSingle(image)}
                          size="sm"
                          className="w-full h-8 text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      )}
                      {image.status === 'error' && (
                        <span className="text-xs text-red-400">Error</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {images.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hasPendingImages && (
              <Button
                onClick={handleConvert}
                disabled={isConverting}
                className="h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg shadow-orange-500/50"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    Convert to{' '}
                    {FORMAT_OPTIONS.find((f) => f.value === settings.format)?.label}
                  </>
                )}
              </Button>
            )}

            {hasConvertedImages && (
              <Button
                onClick={downloadAll}
                variant="outline"
                className="h-12 text-base font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All{' '}
                {images.filter((img) => img.status === 'done').length > 1
                  ? '(ZIP)'
                  : ''}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
