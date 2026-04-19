function WikiSearchBar({
  system,
  label,
  value,
  onChange,
  placeholder,
  hint,
  filters = null,
}) {
  return (
    <div className={`${system.inputShell} h-full`}>
      <div className="relative z-10 flex h-full flex-col gap-4">
        <div>
          <label className={system.inputLabel} htmlFor="wiki-search">
            {label}
          </label>
          <input
            id="wiki-search"
            className={system.input}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            spellCheck="false"
            type="text"
            value={value}
          />
          {hint ? <p className={system.inputHint}>{hint}</p> : null}
        </div>

        {filters ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filters}</div> : null}
      </div>
    </div>
  )
}

export default WikiSearchBar
