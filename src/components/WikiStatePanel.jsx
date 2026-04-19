function panelTone(type) {
  switch (type) {
    case 'error':
      return 'border-rose-300/18 bg-rose-500/8 text-rose-50/90'
    case 'empty':
      return 'border-white/10 bg-black/18 text-white/76'
    default:
      return 'border-white/10 bg-black/18 text-white/82'
  }
}

function WikiStatePanel({ title, body, action, type = 'info' }) {
  return (
    <div
      className={`rounded-[1.6rem] border px-5 py-5 sm:px-6 sm:py-6 ${panelTone(type)}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <p className="section-label">{title}</p>
      <p className="mt-3 font-body text-[1.08rem] leading-relaxed">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export default WikiStatePanel
