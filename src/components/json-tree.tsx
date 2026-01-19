import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface JsonTreeProps {
  data: unknown
  level?: number
  isLast?: boolean
  keyName?: string
}

function JsonTreeItem({ data, level = 0, isLast = true, keyName }: JsonTreeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  const getValueType = (value: unknown): string => {
    if (value === null) return 'null'
    if (Array.isArray(value)) return 'array'
    if (typeof value === 'object') return 'object'
    return typeof value
  }

  const formatValue = (value: unknown): string => {
    if (value === null) return 'null'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return ''
  }

  const type = getValueType(data)
  const indent = level * 20

  if (type === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    const keys = Object.keys(obj)
    const hasChildren = keys.length > 0

    return (
      <div className="select-none">
        <div
          className="flex items-center gap-1 py-1 hover:bg-slate-800/50 rounded px-1"
          style={{ paddingLeft: `${indent}px` }}
        >
          {keyName && (
            <>
              <span className="text-cyan-400">"{keyName}"</span>
              <span className="text-gray-500">: </span>
            </>
          )}
          {hasChildren ? (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
              <span className="text-purple-400">{'{'}</span>
            </div>
          ) : (
            <span className="text-purple-400">{'{ }'}</span>
          )}
          {!hasChildren && !isLast && <span className="text-gray-500">,</span>}
        </div>
        {isExpanded && hasChildren && (
          <div>
            {keys.map((key, index) => (
              <JsonTreeItem
                key={key}
                data={obj[key]}
                level={level + 1}
                isLast={index === keys.length - 1}
                keyName={key}
              />
            ))}
            <div
              className="py-1 text-purple-400"
              style={{ paddingLeft: `${indent}px` }}
            >
              {'}'}
              {!isLast && <span className="text-gray-500">,</span>}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (type === 'array') {
    const arr = data as unknown[]
    const hasChildren = arr.length > 0

    return (
      <div className="select-none">
        <div
          className="flex items-center gap-1 py-1 hover:bg-slate-800/50 rounded px-1"
          style={{ paddingLeft: `${indent}px` }}
        >
          {keyName && (
            <>
              <span className="text-cyan-400">"{keyName}"</span>
              <span className="text-gray-500">: </span>
            </>
          )}
          {hasChildren ? (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
              <span className="text-purple-400">[</span>
            </div>
          ) : (
            <span className="text-purple-400">[ ]</span>
          )}
          {!hasChildren && !isLast && <span className="text-gray-500">,</span>}
        </div>
        {isExpanded && hasChildren && (
          <div>
            {arr.map((item, index) => (
              <JsonTreeItem
                key={index}
                data={item}
                level={level + 1}
                isLast={index === arr.length - 1}
              />
            ))}
            <div
              className="py-1 text-purple-400"
              style={{ paddingLeft: `${indent}px` }}
            >
              {']'}
              {!isLast && <span className="text-gray-500">,</span>}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-2 py-0.5 hover:bg-slate-800/50 rounded px-1"
      style={{ paddingLeft: `${indent}px` }}
    >
      {keyName && (
        <>
          <span className="text-cyan-400">"{keyName}"</span>
          <span className="text-gray-500">: </span>
        </>
      )}
      <span className={type === 'string' ? 'text-green-400' : type === 'number' ? 'text-yellow-400' : type === 'boolean' ? 'text-blue-400' : 'text-gray-400'}>
        {formatValue(data)}
      </span>
      {!isLast && <span className="text-gray-500">,</span>}
    </div>
  )
}

export function JsonTree({ data }: { data: unknown }) {
  return (
    <div className="font-mono text-sm overflow-auto max-h-[32rem] p-2">
      <JsonTreeItem data={data} />
    </div>
  )
}
