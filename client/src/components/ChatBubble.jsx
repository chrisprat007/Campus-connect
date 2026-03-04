import Icon from './Icon'

export function AiBubble({ text, ts }) {
  return (
    <div className="flex justify-start items-end gap-2">
      <div
        style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)' }}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0 mb-1"
      >
        <Icon name="bot" size={13} />
      </div>
      <div>
        <div className="chat-bubble-ai">
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
        <div className="text-xs text-slate-400 mt-1">{ts}</div>
      </div>
    </div>
  )
}

export function UserBubble({ text, ts }) {
  return (
    <div className="flex justify-end items-end gap-2">
      <div>
        <div className="chat-bubble-user">
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
        <div className="text-xs text-slate-400 mt-1 text-right">{ts}</div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div
        style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)' }}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
      >
        <Icon name="bot" size={13} />
      </div>
      <div className="chat-bubble-ai">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-slate-400"
              style={{ animation: `pulse 1s ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
