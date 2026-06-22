import type { ChatMessage } from '../lib/types'

// Minimal, safe markdown-ish renderer: bold, bullet lists, paragraphs.
// We avoid dangerouslySetInnerHTML by building React nodes.
function renderContent(text: string) {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let list: string[] = []

  const flushList = (key: string) => {
    if (!list.length) return
    nodes.push(
      <ul key={key}>
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>,
    )
    list = []
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (/^[-*]\s+/.test(trimmed)) {
      list.push(trimmed.replace(/^[-*]\s+/, ''))
    } else {
      flushList(`ul-${i}`)
      if (trimmed) nodes.push(<p key={`p-${i}`}>{renderInline(trimmed)}</p>)
    }
  })
  flushList('ul-end')
  return nodes
}

// Inline **bold** handling.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

interface Props {
  message: ChatMessage
  onSpeak?: (text: string) => void
}

export function MessageBubble({ message, onSpeak }: Props) {
  const isUser = message.role === 'user'

  if (message.pending) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl bg-exam-panel2 px-4 py-3 text-sm text-slate-300">
          <span className="inline-flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-exam-accent text-white'
            : 'bg-exam-panel2 text-slate-100 border border-exam-border'
        }`}
      >
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">
          {isUser ? 'Resident' : 'Examiner'}
        </div>
        <div className="prose-answer">{renderContent(message.content)}</div>

        {!isUser && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              {onSpeak && (
                <button
                  onClick={() => onSpeak(message.content)}
                  className="text-xs text-slate-400 hover:text-white"
                  title="Read aloud"
                >
                  🔊 Read aloud
                </button>
              )}
              {message.sources && message.sources.length > 0 && (
                <span className="text-[11px] text-slate-500">
                  Material: {message.sources.join(', ')}
                </span>
              )}
            </div>
            {message.note && <span className="text-[11px] italic text-slate-500">{message.note}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
