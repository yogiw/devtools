import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Copy, RotateCcw, ArrowLeft, Webhook, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/tools/json-to-openrouter-output')({
  component: JsonToOpenRouterOutput,
})

interface JsonSchema {
  type?: string
  properties?: Record<string, { type?: string; description?: string; items?: unknown }>
  required?: string[]
  additionalProperties?: boolean
  [key: string]: unknown
}

function inferSchemaFromObject(obj: unknown): JsonSchema {
  if (obj === null) return { type: 'object', properties: {}, required: [] }
  if (Array.isArray(obj)) {
    const itemSchema = obj.length > 0 ? inferSchemaFromObject(obj[0]) : { type: 'object' }
    return { type: 'array', items: itemSchema }
  }
  if (typeof obj === 'object') {
    const properties: Record<string, { type: string; description?: string }> = {}
    const required: string[] = []
    for (const [key, value] of Object.entries(obj)) {
      required.push(key)
      if (value === null) properties[key] = { type: 'string', description: '' }
      else if (typeof value === 'string') properties[key] = { type: 'string', description: '' }
      else if (typeof value === 'number') properties[key] = { type: 'number', description: '' }
      else if (typeof value === 'boolean') properties[key] = { type: 'boolean', description: '' }
      else if (Array.isArray(value))
        properties[key] = {
          type: 'array',
          description: '',
          items: value.length > 0 ? inferSchemaFromObject(value[0]) : { type: 'object' },
        }
      else if (typeof value === 'object')
        properties[key] = { type: 'object', description: '', ...inferSchemaFromObject(value) }
    }
    return {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
    }
  }
  return { type: typeof obj, properties: {}, required: [] }
}

function isJsonSchema(obj: unknown): obj is JsonSchema {
  if (typeof obj !== 'object' || obj === null) return false
  const o = obj as Record<string, unknown>
  return 'type' in o || 'properties' in o
}

function buildOpenRouterFormat(
  schema: JsonSchema,
  options: { schemaName: string; userMessage: string; strict: boolean }
): string {
  const { schemaName, userMessage, strict } = options

  const openRouterBody = {
    messages: [{ role: 'user', content: userMessage }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: schemaName,
        strict,
        schema: {
          type: schema.type ?? 'object',
          properties: schema.properties ?? {},
          required: schema.required ?? [],
          additionalProperties: schema.additionalProperties ?? false,
          ...(schema.items && { items: schema.items }),
        },
      },
    },
  }

  return JSON.stringify(openRouterBody, null, 2)
}

function JsonToOpenRouterOutput() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [schemaName, setSchemaName] = useState('response')
  const [userMessage, setUserMessage] = useState('')
  const [strict, setStrict] = useState(true)
  const [inferFromSample, setInferFromSample] = useState(false)

  const output = useMemo(() => {
    if (!input.trim() || !isValid) return ''

    try {
      const parsed = JSON.parse(input) as unknown
      let schema: JsonSchema

      if (inferFromSample && !isJsonSchema(parsed)) {
        schema = inferSchemaFromObject(parsed)
      } else if (isJsonSchema(parsed)) {
        schema = parsed
      } else {
        schema = inferSchemaFromObject(parsed)
      }

      return buildOpenRouterFormat(schema, {
        schemaName: schemaName || 'response',
        userMessage: userMessage || 'Your prompt here',
        strict,
      })
    } catch {
      return ''
    }
  }, [input, isValid, schemaName, userMessage, strict, inferFromSample])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInput(newValue)

    if (newValue.trim()) {
      try {
        JSON.parse(newValue)
        setIsValid(true)
        setError('')
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : 'Invalid JSON format')
      }
    } else {
      setIsValid(false)
      setError('')
    }
  }

  const handleCopy = async () => {
    if (output) await navigator.clipboard.writeText(output)
  }

  const handleClear = () => {
    setInput('')
    setError('')
    setIsValid(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-sky-400 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 mb-4 shadow-lg shadow-sky-500/50">
            <Webhook className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-3">
            JSON to OpenRouter Output
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Convert JSON Schema or sample objects to OpenRouter API response_format
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={inferFromSample}
                    onCheckedChange={setInferFromSample}
                    id="infer-schema"
                  />
                  <Label htmlFor="infer-schema" className="text-white font-medium cursor-pointer">
                    Infer schema from sample object
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={strict} onCheckedChange={setStrict} id="strict" />
                  <Label htmlFor="strict" className="text-white font-medium cursor-pointer">
                    Strict mode
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="schema-name" className="text-gray-300 font-medium">
                    Schema name:
                  </Label>
                  <input
                    id="schema-name"
                    type="text"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value || 'response')}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
                    placeholder="response"
                  />
                </div>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-slate-600 hover:bg-slate-700/50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </Button>
              </div>
              <div>
                <Label htmlFor="user-message" className="text-gray-300 font-medium block mb-2">
                  User message (for messages array):
                </Label>
                <input
                  id="user-message"
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Your prompt here"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm animate-in slide-in-from-top-2">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="input" className="text-white font-semibold text-base">
                JSON Schema or Sample Object
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
              placeholder={`Paste JSON Schema or sample object...

Example schema:
{
  "type": "object",
  "properties": {
    "location": { "type": "string", "description": "City name" },
    "temperature": { "type": "number", "description": "Temp in Celsius" }
  },
  "required": ["location", "temperature"],
  "additionalProperties": false
}`}
              className="min-h-[28rem] max-h-[28rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600 focus:border-sky-500 focus:ring-sky-500/20"
            />
          </div>

          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="output" className="text-white font-semibold text-base">
                OpenRouter Output
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
                placeholder="OpenRouter format will appear here..."
                className="min-h-[28rem] max-h-[28rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600"
              />
              {!output && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500 py-12">
                    <Webhook className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">
                      {isValid
                        ? 'OpenRouter format will appear here'
                        : 'Enter valid JSON Schema or sample object'}
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
