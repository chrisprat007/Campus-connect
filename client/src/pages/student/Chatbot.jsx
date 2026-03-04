import { useState, useRef, useEffect } from 'react'
import { AiBubble, UserBubble, TypingIndicator } from '../../components/ChatBubble'
import Icon from '../../components/Icon'
import api from '../../hooks/useApi'
const suggestions = [
  'How should I prepare for DSA?',
  'What CGPA cutoffs do top companies have?',
  'Tips for system design interviews',
  'How to write a strong resume?',
]

const initMessages = [
  {
    role: 'ai',
    text: "Hi Arjun! 👋 I'm your AI placement assistant. I can help you with interview prep, career advice, resume tips, and more. What would you like to know?",
    ts: 'Just now',
  },
]

export default function Chatbot() {
  const [messages, setMessages] = useState(initMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async (text) => {
  const msg = text || input
  if (!msg.trim()) return

  const ts = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Add user message
  setMessages((m) => [...m, { role: 'user', text: msg, ts }])
  setInput('')
  setTyping(true)

  try {
    const res = await api.post('/semanticsearch/student', {
      query: msg
    })

    const ts2 = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    setMessages((m) => [
      ...m,
      {
        role: 'ai',
        text: res.data.roadmap || res.data.message || "No response generated.",
        ts: ts2
      }
    ])
  } catch (err) {
    console.error('Chatbot Error:', err)

    const ts2 = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    setMessages((m) => [
      ...m,
      {
        role: 'ai',
        text: "⚠️ Something went wrong. Please try again.",
        ts: ts2
      }
    ])
  } finally {
    setTyping(false)
  }
}

  return (
    <div className="fade-in flex flex-col" style={{ height: 'calc(100vh - 40px)' }}>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div
          style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)' }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
        >
          <Icon name="bot" size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">AI Placement Assistant</h1>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) =>
            m.role === 'ai'
              ? <AiBubble key={i} text={m.text} ts={m.ts} />
              : <UserBubble key={i} text={m.text} ts={m.ts} />
          )}
          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs bg-slate-50 hover:bg-brand-50 hover:text-brand-600 border border-slate-200 hover:border-brand-200 text-slate-600 rounded-lg px-3 py-2 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-3">
            <input
              className="input-field flex-1"
              placeholder="Ask about placements, interviews, career paths…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              disabled={typing}
            />
            <button
              className="btn-primary px-4"
              onClick={() => send()}
              disabled={!input.trim() || typing}
            >
              <Icon name="send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}