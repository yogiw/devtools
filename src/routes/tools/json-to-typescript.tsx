import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Copy, RotateCcw, ArrowLeft, Code2, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/tools/json-to-typescript')({
    component: JsonToTypeScript,
})

interface ConversionOptions {
    useMultipleInterfaces: boolean
    rootName: string
}

function JsonToTypeScript() {
    const [input, setInput] = useState('')
    const [error, setError] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [useMultipleInterfaces, setUseMultipleInterfaces] = useState(false)
    const [rootName, setRootName] = useState('Root')

    const output = useMemo(() => {
        if (!input.trim() || !isValid) return ''

        try {
            const parsed = JSON.parse(input)
            return convertToTypeScript(parsed, { useMultipleInterfaces, rootName })
        } catch {
            return ''
        }
    }, [input, isValid, useMultipleInterfaces, rootName])

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
        if (output) {
            await navigator.clipboard.writeText(output)
        }
    }

    const handleClear = () => {
        setInput('')
        setError('')
        setIsValid(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-24">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto py-12 px-6 z-10">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 mb-6 transition-colors duration-200 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4 shadow-lg shadow-amber-500/50">
                        <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-3">
                        JSON to TypeScript
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Convert JSON objects to TypeScript types or interfaces
                    </p>
                </div>

                <div className="mb-6 space-y-4">
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={useMultipleInterfaces}
                                    onCheckedChange={setUseMultipleInterfaces}
                                    id="multiple-interfaces"
                                />
                                <Label
                                    htmlFor="multiple-interfaces"
                                    className="text-white font-medium cursor-pointer"
                                >
                                    Use Multiple Interfaces
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Label htmlFor="root-name" className="text-gray-300 font-medium">
                                    Root Name:
                                </Label>
                                <input
                                    id="root-name"
                                    type="text"
                                    value={rootName}
                                    onChange={(e) => setRootName(e.target.value || 'Root')}
                                    className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                                    placeholder="Root"
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
                            className="min-h-[32rem] max-h-[32rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600 focus:border-amber-500 focus:ring-amber-500/20"
                        />
                    </div>

                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="output" className="text-white font-semibold text-base">
                                TypeScript Output
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
                                placeholder="TypeScript types will appear here..."
                                className="min-h-[32rem] max-h-[32rem] overflow-y-auto font-mono text-sm bg-slate-900 text-white placeholder:text-gray-500 border-slate-600"
                            />
                            {!output && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center text-gray-500 py-12">
                                        <Code2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">
                                            {isValid
                                                ? 'TypeScript types will appear here'
                                                : 'Enter valid JSON to see TypeScript types'}
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

function convertToTypeScript(
    data: unknown,
    options: ConversionOptions
): string {
    const { useMultipleInterfaces, rootName } = options
    const allInterfaces: string[] = []
    const usedNames = new Set<string>()

    function sanitizeName(name: string): string {
        let sanitized = name.replace(/[^a-zA-Z0-9_$]/g, '')
        if (sanitized.length === 0 || /^[0-9]/.test(sanitized)) {
            sanitized = `_${sanitized}`
        }
        return sanitized || 'Item'
    }

    function generateInterfaceName(baseName: string): string {
        const sanitized = sanitizeName(baseName)
        let name = sanitized.charAt(0).toUpperCase() + sanitized.slice(1)

        if (usedNames.has(name)) {
            let counter = 1
            while (usedNames.has(`${name}${counter}`)) {
                counter++
            }
            name = `${name}${counter}`
        }

        usedNames.add(name)
        return name
    }

    function getType(value: unknown, key: string = '', indent: number = 0): string {
        const indentStr = '  '.repeat(indent)
        const nextIndent = indent + 1

        if (value === null) {
            return 'null'
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return 'unknown[]'
            }
            const itemType = getType(value[0], key, indent)
            return `${itemType}[]`
        }

        if (typeof value === 'object' && value !== null) {
            const obj = value as Record<string, unknown>

            if (useMultipleInterfaces) {
                const interfaceName = generateInterfaceName(key || 'Item')
                const properties: string[] = []

                for (const [propKey, propValue] of Object.entries(obj)) {
                    // Check if this is a nested object that should be extracted
                    if (
                        typeof propValue === 'object' &&
                        propValue !== null &&
                        !Array.isArray(propValue)
                    ) {
                        const nestedName = generateInterfaceName(propKey)
                        const nestedInterface = convertObjectToInterface(
                            propValue as Record<string, unknown>,
                            nestedName
                        )
                        allInterfaces.push(nestedInterface)
                        properties.push(`  ${sanitizeName(propKey)}: ${nestedName}`)
                    } else if (Array.isArray(propValue) && propValue.length > 0) {
                        const firstItem = propValue[0]
                        if (
                            typeof firstItem === 'object' &&
                            firstItem !== null &&
                            !Array.isArray(firstItem)
                        ) {
                            const nestedName = generateInterfaceName(propKey)
                            const nestedInterface = convertObjectToInterface(
                                firstItem as Record<string, unknown>,
                                nestedName
                            )
                            allInterfaces.push(nestedInterface)
                            properties.push(`  ${sanitizeName(propKey)}: ${nestedName}[]`)
                        } else {
                            properties.push(`  ${sanitizeName(propKey)}: ${getType(propValue, propKey, indent)}`)
                        }
                    } else {
                        properties.push(`  ${sanitizeName(propKey)}: ${getType(propValue, propKey, indent)}`)
                    }
                }

                const interfaceDef = `interface ${interfaceName} {\n${properties.join('\n')}\n}`
                allInterfaces.push(interfaceDef)
                return interfaceName
            } else {
                // Single type mode - inline object type
                const properties: string[] = []
                for (const [propKey, propValue] of Object.entries(obj)) {
                    const propType = getType(propValue, propKey, nextIndent)
                    // If propType is a nested object (starts with {), format it properly
                    if (propType.startsWith('{')) {
                        const lines = propType.split('\n')
                        // Remove the first line (opening brace) and last line (closing brace)
                        const middleLines = lines.slice(1, -1)
                        // Add additional indentation to middle lines (they're already indented from nextIndent,
                        // but we need to add the current indent level too)
                        const indentedMiddleLines = middleLines.map((line) => `${indentStr}  ${line}`)
                        // The opening brace goes on the same line as the property name
                        // The closing brace needs to be at the current indent level
                        const formattedType = `{\n${indentedMiddleLines.join('\n')}\n${indentStr}  }`
                        properties.push(`${indentStr}  ${sanitizeName(propKey)}: ${formattedType}`)
                    } else {
                        properties.push(`${indentStr}  ${sanitizeName(propKey)}: ${propType}`)
                    }
                }
                return `{\n${properties.join('\n')}\n${indentStr}}`
            }
        }

        return typeof value
    }

    function convertObjectToInterface(
        obj: Record<string, unknown>,
        interfaceName: string
    ): string {
        const properties: string[] = []

        for (const [key, value] of Object.entries(obj)) {
            if (
                typeof value === 'object' &&
                value !== null &&
                !Array.isArray(value) &&
                useMultipleInterfaces
            ) {
                const nestedName = generateInterfaceName(key)
                const nestedInterface = convertObjectToInterface(
                    value as Record<string, unknown>,
                    nestedName
                )
                allInterfaces.push(nestedInterface)
                properties.push(`  ${sanitizeName(key)}: ${nestedName}`)
            } else if (Array.isArray(value) && value.length > 0 && useMultipleInterfaces) {
                const firstItem = value[0]
                if (
                    typeof firstItem === 'object' &&
                    firstItem !== null &&
                    !Array.isArray(firstItem)
                ) {
                    const nestedName = generateInterfaceName(key)
                    const nestedInterface = convertObjectToInterface(
                        firstItem as Record<string, unknown>,
                        nestedName
                    )
                    allInterfaces.push(nestedInterface)
                    properties.push(`  ${sanitizeName(key)}: ${nestedName}[]`)
                } else {
                    properties.push(`  ${sanitizeName(key)}: ${getType(value, key, 0)}`)
                }
            } else {
                properties.push(`  ${sanitizeName(key)}: ${getType(value, key, 0)}`)
            }
        }

        return `interface ${interfaceName} {\n${properties.join('\n')}\n}`
    }

    const sanitizedRootName = sanitizeName(rootName)
    const finalRootName = sanitizedRootName.charAt(0).toUpperCase() + sanitizedRootName.slice(1)

    if (useMultipleInterfaces) {
        // Get the root type (this will create the root interface and add it to allInterfaces)
        getType(data, finalRootName, 0)

        // Remove duplicates while preserving order
        const uniqueInterfaces = Array.from(new Set(allInterfaces))
        return uniqueInterfaces.join('\n\n')
    } else {
        const rootType = getType(data, rootName, 0)
        return `type ${finalRootName} = ${rootType}`
    }
}
