function cx(...values) {
  return values.filter(Boolean).join(' ')
}

const sharedText = {
  eyebrow: 'font-ui whitespace-nowrap text-[0.66rem] tracking-[0.12em] text-white/45',
  title: 'font-display text-[1.9rem] leading-none text-white sm:text-[2.2rem]',
  body: 'font-body text-[1.05rem] leading-relaxed text-white/72',
}

export const houseDesignSystems = {
  slytherin: {
    summary:
      'Elite control surfaces with emerald glass, surgical edges, and hover states that feel expensive and dangerous.',
    navbar: cx(
      'relative isolate overflow-hidden border border-emerald-200/15',
      'rounded-[1rem] bg-black/30 px-4 py-4 backdrop-blur-2xl',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_55px_-26px_rgba(0,0,0,0.9)]',
      'before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[0.9rem]',
      'before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,transparent_72%,rgba(74,255,153,0.08))]',
    ),
    navbarCrest: cx(
      'grid h-12 w-12 place-items-center rounded-[0.8rem] border border-emerald-200/15 bg-emerald-950/50',
      'shadow-[0_0_24px_rgba(57,255,156,0.08)]',
    ),
    navItem: cx(
      'rounded-[0.85rem] border border-transparent px-4 py-2 font-ui text-[0.7rem] whitespace-nowrap tracking-[0.12em] text-emerald-50/66',
      'transition-all duration-300 ease-out hover:scale-[1.03] hover:border-emerald-300/30 hover:text-emerald-50',
      'hover:shadow-[0_0_26px_rgba(57,255,156,0.16)]',
    ),
    navItemActive: cx(
      'rounded-[0.85rem] border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 font-ui text-[0.7rem]',
      'whitespace-nowrap tracking-[0.12em] text-emerald-50 shadow-[0_0_28px_rgba(57,255,156,0.16)]',
    ),
    navbarBadge: cx(
      'rounded-[0.85rem] border border-emerald-300/28 bg-emerald-400/10 px-4 py-2 font-ui text-[0.64rem]',
      'whitespace-nowrap tracking-[0.12em] text-emerald-50/85 shadow-[0_0_22px_rgba(57,255,156,0.14)]',
    ),
    card: cx(
      'group relative isolate min-w-0 overflow-hidden rounded-[1rem] border border-emerald-200/15',
      'bg-black/35 p-6 backdrop-blur-2xl',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_26px_70px_-34px_rgba(0,0,0,0.95)]',
      'transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-300/32',
      'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_0_0_1px_rgba(57,255,156,0.12),0_30px_70px_-32px_rgba(0,0,0,0.98),0_0_38px_rgba(57,255,156,0.16)]',
      'before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[0.9rem]',
      'before:bg-[radial-gradient(circle_at_85%_20%,rgba(74,255,153,0.12),transparent_18%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_28%)]',
    ),
    cardBadge: cx(
      'inline-flex whitespace-nowrap rounded-[0.75rem] border border-emerald-300/22 bg-emerald-400/10 px-3 py-2 font-ui text-[0.62rem]',
      'tracking-[0.12em] text-emerald-50/80',
    ),
    buttonPrimary: cx(
      'relative isolate inline-flex items-center justify-center overflow-hidden rounded-[0.85rem]',
      'border border-emerald-300/22 px-5 py-3 font-ui text-[0.72rem] font-semibold whitespace-nowrap tracking-[0.12em] text-emerald-50',
      'bg-[linear-gradient(180deg,rgba(14,30,22,0.82),rgba(4,10,8,0.96))] backdrop-blur-xl',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_46px_-18px_rgba(0,0,0,0.9)]',
      'transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:border-emerald-300/42',
      'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(110,255,187,0.14),0_0_34px_rgba(57,255,156,0.24),0_22px_52px_-18px_rgba(0,0,0,0.95)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/35',
      'before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[0.7rem]',
      'before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%,transparent_74%,rgba(74,255,153,0.08))]',
    ),
    buttonSecondary: cx(
      'inline-flex items-center justify-center rounded-[0.85rem] border border-emerald-200/16 px-5 py-3 font-ui',
      'text-[0.72rem] font-semibold whitespace-nowrap tracking-[0.12em] text-emerald-50/78',
      'bg-black/26 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_34px_-22px_rgba(0,0,0,0.9)]',
      'transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-emerald-300/26 hover:text-emerald-50',
      'hover:shadow-[0_0_24px_rgba(57,255,156,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/25',
    ),
    inputShell: cx(
      'relative isolate overflow-hidden rounded-[1rem] border border-emerald-200/15 bg-black/35 p-5 backdrop-blur-2xl',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_56px_-32px_rgba(0,0,0,0.92)]',
      'before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[0.9rem]',
      'before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,transparent_78%,rgba(74,255,153,0.08))]',
    ),
    inputLabel: 'font-ui whitespace-nowrap text-[0.64rem] tracking-[0.12em] text-emerald-50/48',
    input: cx(
      'mt-3 w-full rounded-[0.8rem] border border-emerald-200/14 bg-emerald-950/35 px-4 py-3',
      'font-ui text-sm text-emerald-50 placeholder:text-emerald-50/28',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 ease-out',
      'focus:border-emerald-300/36 focus:bg-emerald-950/48 focus:outline-none focus:ring-2 focus:ring-emerald-300/22 focus:shadow-[0_0_28px_rgba(57,255,156,0.16)]',
    ),
    inputHint: 'mt-3 font-body text-[0.98rem] leading-relaxed text-emerald-50/58',
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/74 px-4 backdrop-blur-md',
    modalPanel: cx(
      'relative isolate w-full max-w-xl overflow-hidden rounded-[1rem] border border-emerald-200/16 bg-black/48 p-6 backdrop-blur-2xl sm:p-7',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_34px_80px_-34px_rgba(0,0,0,0.98),0_0_42px_rgba(57,255,156,0.12)]',
      'before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[0.9rem]',
      'before:bg-[radial-gradient(circle_at_85%_18%,rgba(74,255,153,0.14),transparent_18%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%)]',
    ),
    modalBadge: cx(
      'inline-flex rounded-[0.8rem] border border-emerald-300/24 bg-emerald-400/10 px-3 py-2 font-ui text-[0.64rem]',
      'whitespace-nowrap tracking-[0.12em] text-emerald-50/82 shadow-[0_0_18px_rgba(57,255,156,0.12)]',
    ),
    modalClose: cx(
      'absolute right-4 top-4 rounded-[0.65rem] border border-emerald-300/16 bg-black/24 px-3 py-2 font-ui text-[0.62rem]',
      'whitespace-nowrap tracking-[0.12em] text-emerald-50/68 transition-all duration-300 hover:border-emerald-300/30 hover:text-emerald-50 hover:shadow-[0_0_18px_rgba(57,255,156,0.14)]',
    ),
  },
  gryffindor: {
    summary:
      'Heroic control surfaces with thick gold framing, confident mass, and bold motion that reads like a trophy product.',
    navbar: cx(
      'relative overflow-hidden rounded-[1.2rem] border-2 border-amber-300/60 bg-[#2b0b08] px-4 py-4',
      'shadow-[0_24px_50px_-24px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,245,224,0.12)]',
    ),
    navbarCrest: cx(
      'grid h-12 w-12 place-items-center rounded-[0.9rem] border-2 border-amber-300/60 bg-[#48120f]',
      'shadow-[0_12px_24px_-16px_rgba(255,180,88,0.42)]',
    ),
    navItem: cx(
      'rounded-[0.9rem] border-2 border-transparent bg-[#3b100c] px-4 py-2 font-ui text-[0.7rem]',
      'whitespace-nowrap tracking-[0.12em] text-amber-100/76 transition-all duration-150 ease-out',
      'hover:-translate-y-1 hover:scale-[1.03] hover:border-amber-300/55 hover:text-amber-50',
      'hover:shadow-[0_18px_26px_-18px_rgba(0,0,0,0.72)]',
    ),
    navItemActive: cx(
      'rounded-[0.9rem] border-2 border-amber-300/70 bg-[linear-gradient(135deg,#8b281a_0%,#d25e31_100%)]',
      'px-4 py-2 font-ui text-[0.7rem] whitespace-nowrap tracking-[0.12em] text-[#fff5e8]',
      'shadow-[0_18px_28px_-18px_rgba(0,0,0,0.74)]',
    ),
    navbarBadge: cx(
      'rounded-[0.9rem] border-2 border-amber-300/60 bg-amber-300/16 px-4 py-2 font-ui text-[0.64rem]',
      'whitespace-nowrap tracking-[0.12em] text-amber-50',
    ),
    card: cx(
      'group relative min-w-0 overflow-hidden rounded-[1.2rem] border-2 border-amber-300/68 bg-[#2b0b08] p-6',
      'shadow-[0_30px_72px_-28px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,240,214,0.14)]',
      'transition-all duration-150 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-amber-300/72',
      'hover:shadow-[0_0_0_1px_rgba(255,198,111,0.16),0_38px_80px_-28px_rgba(0,0,0,0.96),0_0_42px_rgba(255,166,74,0.18)]',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_20%,rgba(255,214,143,0.18),transparent_18%),radial-gradient(circle_at_86%_14%,rgba(255,93,46,0.16),transparent_20%),linear-gradient(180deg,rgba(255,214,143,0.09),transparent_26%)]',
    ),
    cardBadge: cx(
      'inline-flex whitespace-nowrap rounded-[0.8rem] border-2 border-amber-300/58 bg-[#4f1610] px-3 py-2 font-ui text-[0.62rem]',
      'tracking-[0.12em] text-amber-50',
    ),
    buttonPrimary: cx(
      'inline-flex items-center justify-center rounded-[0.95rem] border-2 border-amber-300/72',
      'bg-[linear-gradient(135deg,#ffd28b_0%,#c6462d_100%)] px-5 py-3 font-ui text-[0.74rem] font-bold',
      'whitespace-nowrap tracking-[0.12em] text-[#2b0806] shadow-[0_20px_36px_-20px_rgba(0,0,0,0.76)]',
      'transition-all duration-150 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_28px_42px_-18px_rgba(0,0,0,0.88)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/55',
    ),
    buttonSecondary: cx(
      'inline-flex items-center justify-center rounded-[0.95rem] border-2 border-amber-300/52 bg-[#3a100c] px-5 py-3',
      'font-ui text-[0.74rem] font-bold whitespace-nowrap tracking-[0.12em] text-amber-50',
      'shadow-[0_16px_30px_-22px_rgba(0,0,0,0.8)] transition-all duration-150 ease-out',
      'hover:-translate-y-1 hover:scale-[1.03] hover:border-amber-300/68 hover:bg-[#4c140e] hover:shadow-[0_26px_38px_-20px_rgba(0,0,0,0.86)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/45',
    ),
    inputShell: cx(
      'rounded-[1.2rem] border-2 border-amber-300/56 bg-[#2b0b08] p-5',
      'shadow-[0_24px_54px_-30px_rgba(0,0,0,0.86)]',
    ),
    inputLabel: 'font-ui whitespace-nowrap text-[0.64rem] tracking-[0.12em] text-amber-100/54',
    input: cx(
      'mt-3 w-full rounded-[0.95rem] border-2 border-amber-300/42 bg-[#47120e] px-4 py-3 font-ui text-sm text-amber-50',
      'placeholder:text-amber-50/35 transition-all duration-150 ease-out focus:-translate-y-0.5',
      'focus:border-amber-200/78 focus:bg-[#561611] focus:outline-none focus:shadow-[0_14px_24px_-18px_rgba(0,0,0,0.82)]',
    ),
    inputHint: 'mt-3 font-body text-[1rem] leading-relaxed text-amber-50/66',
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/76 px-4',
    modalPanel: cx(
      'relative w-full max-w-xl overflow-hidden rounded-[1.2rem] border-2 border-amber-300/65 bg-[#2c0c08] p-6 sm:p-7',
      'shadow-[0_36px_84px_-32px_rgba(0,0,0,0.94)]',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,220,164,0.08),transparent_24%)]',
    ),
    modalBadge: cx(
      'inline-flex rounded-[0.8rem] border-2 border-amber-300/60 bg-[#4b140e] px-3 py-2 font-ui text-[0.64rem]',
      'whitespace-nowrap tracking-[0.12em] text-amber-50',
    ),
    modalClose: cx(
      'absolute right-4 top-4 rounded-[0.8rem] border-2 border-amber-300/52 bg-[#3a100c] px-3 py-2 font-ui text-[0.62rem]',
      'whitespace-nowrap tracking-[0.12em] text-amber-50/82 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_24px_-18px_rgba(0,0,0,0.82)]',
    ),
  },
  ravenclaw: {
    summary:
      'Analytical UI with balanced whitespace, thin geometry, and precise interactions that feel more engineered than emotional.',
    navbar: cx(
      'relative overflow-hidden rounded-[1rem] border border-sky-100/22 bg-slate-950/74 px-5 py-4',
      'shadow-[0_24px_54px_-30px_rgba(0,0,0,0.86),0_0_40px_rgba(76,171,255,0.08)]',
      'before:pointer-events-none before:absolute before:inset-0',
      'before:bg-[linear-gradient(rgba(177,214,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(177,214,255,0.07)_1px,transparent_1px),radial-gradient(circle_at_86%_16%,rgba(255,208,120,0.12),transparent_16%)] before:[background-size:30px_30px,30px_30px,auto]',
      'before:[opacity:0.35]',
    ),
    navbarCrest: cx(
      'grid h-12 w-12 place-items-center rounded-[0.95rem_0.35rem_0.95rem_0.35rem] border border-sky-100/20 bg-slate-900/80',
    ),
    navItem: cx(
      'rounded-[0.9rem_0.35rem_0.9rem_0.35rem] border border-transparent px-4 py-2 font-ui text-[0.7rem]',
      'whitespace-nowrap tracking-[0.12em] text-sky-50/58 transition-all duration-300 ease-out',
      'hover:border-sky-200/26 hover:bg-sky-300/[0.04] hover:text-sky-50',
    ),
    navItemActive: cx(
      'rounded-[0.9rem_0.35rem_0.9rem_0.35rem] border border-sky-200/32 bg-[linear-gradient(135deg,rgba(125,205,255,0.16),rgba(17,34,58,0.92))] px-4 py-2',
      'font-ui text-[0.7rem] whitespace-nowrap tracking-[0.12em] text-sky-50 shadow-[0_0_26px_rgba(120,196,255,0.12)]',
    ),
    navbarBadge: cx(
      'rounded-[0.9rem_0.35rem_0.9rem_0.35rem] border border-sky-200/22 bg-slate-900/90 px-4 py-2 font-ui',
      'whitespace-nowrap text-[0.64rem] tracking-[0.12em] text-sky-50/72',
    ),
    card: cx(
      'group relative min-w-0 overflow-hidden rounded-[1rem] border border-sky-100/20 bg-slate-950/76 p-6',
      'shadow-[0_24px_50px_-32px_rgba(0,0,0,0.86),0_0_34px_rgba(82,170,255,0.07)] transition-all duration-300 ease-out',
      'hover:border-sky-200/32 hover:bg-slate-950/88',
      'before:pointer-events-none before:absolute before:inset-0',
      'before:bg-[linear-gradient(rgba(177,214,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(177,214,255,0.06)_1px,transparent_1px),radial-gradient(circle_at_84%_18%,rgba(255,208,120,0.12),transparent_18%)] before:[background-size:32px_32px,32px_32px,auto] before:[opacity:0.24]',
    ),
    cardBadge: cx(
      'inline-flex whitespace-nowrap rounded-[0.8rem_0.35rem_0.8rem_0.35rem] border border-sky-200/22 bg-sky-300/[0.05] px-3 py-2',
      'font-ui text-[0.62rem] tracking-[0.12em] text-sky-50/78',
    ),
    buttonPrimary: cx(
      'inline-flex items-center justify-center rounded-[0.9rem_0.35rem_0.9rem_0.35rem] border border-sky-200/26',
      'bg-[linear-gradient(135deg,rgba(136,205,255,0.14),rgba(8,18,34,0.9))] px-5 py-3 font-ui text-[0.72rem]',
      'font-semibold whitespace-nowrap tracking-[0.12em] text-sky-50 shadow-[0_14px_28px_-24px_rgba(0,0,0,0.82)]',
      'transition-all duration-300 ease-out hover:border-sky-200/34 hover:bg-[linear-gradient(135deg,rgba(136,205,255,0.18),rgba(8,18,34,0.94))] hover:text-white',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/30',
    ),
    buttonSecondary: cx(
      'inline-flex items-center justify-center rounded-[0.9rem_0.35rem_0.9rem_0.35rem] border border-sky-200/18 bg-slate-950/84',
      'px-5 py-3 font-ui text-[0.72rem] font-semibold whitespace-nowrap tracking-[0.12em] text-sky-50/72',
      'transition-all duration-300 ease-out hover:border-sky-200/28 hover:text-sky-50 hover:opacity-100',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/24',
    ),
    inputShell: cx(
      'relative overflow-hidden rounded-[1rem] border border-sky-100/18 bg-slate-950/72 p-5',
      'before:pointer-events-none before:absolute before:inset-0',
      'before:bg-[linear-gradient(rgba(177,214,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(177,214,255,0.05)_1px,transparent_1px)] before:[background-size:28px_28px] before:[opacity:0.2]',
    ),
    inputLabel: 'font-ui whitespace-nowrap text-[0.64rem] tracking-[0.12em] text-sky-50/46',
    input: cx(
      'mt-3 w-full rounded-[0.9rem_0.35rem_0.9rem_0.35rem] border border-sky-200/18 bg-slate-900/80 px-4 py-3 font-ui text-sm text-sky-50',
      'placeholder:text-sky-50/32 transition-all duration-300 ease-out',
      'focus:border-sky-200/30 focus:bg-slate-900/92 focus:outline-none focus:ring-2 focus:ring-sky-200/20',
    ),
    inputHint: 'mt-3 font-body text-[0.98rem] leading-relaxed text-sky-50/56',
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/82 px-4 backdrop-blur-sm',
    modalPanel: cx(
      'relative w-full max-w-xl overflow-hidden rounded-[1rem] border border-sky-100/18 bg-slate-950/88 p-6 sm:p-7',
      'shadow-[0_28px_60px_-34px_rgba(0,0,0,0.9)]',
      'before:pointer-events-none before:absolute before:inset-0',
      'before:bg-[linear-gradient(rgba(177,214,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(177,214,255,0.05)_1px,transparent_1px)] before:[background-size:32px_32px] before:[opacity:0.18]',
    ),
    modalBadge: cx(
      'inline-flex rounded-[0.8rem_0.35rem_0.8rem_0.35rem] border border-sky-200/22 bg-sky-300/[0.05] px-3 py-2 font-ui',
      'text-[0.64rem] whitespace-nowrap tracking-[0.12em] text-sky-50/78',
    ),
    modalClose: cx(
      'absolute right-4 top-4 rounded-[0.75rem_0.3rem_0.75rem_0.3rem] border border-sky-200/18 bg-slate-900/86 px-3 py-2',
      'font-ui text-[0.62rem] whitespace-nowrap tracking-[0.12em] text-sky-50/62 transition-all duration-300 ease-out hover:border-sky-200/28 hover:text-sky-50',
    ),
  },
  hufflepuff: {
    summary:
      'Cozy, generous controls with soft volume, friendly rounded silhouettes, and micro-interactions that feel inviting instead of forceful.',
    navbar: cx(
      'relative overflow-hidden rounded-[2rem] border border-amber-100/36 bg-[#2a1d0d]/94 px-4 py-4',
      'shadow-[0_26px_56px_-24px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,248,227,0.14),0_0_36px_rgba(255,208,104,0.08)]',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_20%,rgba(255,252,241,0.16),transparent_22%),radial-gradient(circle_at_84%_78%,rgba(255,215,110,0.12),transparent_22%),linear-gradient(180deg,rgba(255,241,198,0.04),transparent_28%)]',
    ),
    navbarCrest: cx(
      'grid h-12 w-12 place-items-center rounded-[1.4rem] border border-amber-100/34 bg-amber-100/10',
      'shadow-[0_16px_28px_-18px_rgba(0,0,0,0.42)]',
    ),
    navItem: cx(
      'rounded-full border border-transparent px-4 py-2 font-ui text-[0.7rem] whitespace-nowrap tracking-[0.12em] text-amber-50/70',
      'transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-amber-100/30 hover:bg-amber-100/8 hover:text-amber-50 hover:animate-[cozy-bob_420ms_ease-out]',
    ),
    navItemActive: cx(
      'rounded-full border border-amber-100/40 bg-[linear-gradient(135deg,rgba(255,241,198,0.22),rgba(176,125,36,0.22))] px-4 py-2 font-ui text-[0.7rem] whitespace-nowrap tracking-[0.12em] text-amber-50',
      'shadow-[0_16px_30px_-18px_rgba(0,0,0,0.48),0_0_28px_rgba(255,214,111,0.12)]',
    ),
    navbarBadge: cx(
      'rounded-full border border-amber-100/34 bg-amber-100/14 px-4 py-2 font-ui whitespace-nowrap text-[0.64rem] tracking-[0.12em] text-amber-50/84',
    ),
    card: cx(
      'group relative min-w-0 overflow-hidden rounded-[2rem] border border-amber-100/34 bg-[#2a1d0d]/92 p-6',
      'shadow-[0_26px_52px_-26px_rgba(0,0,0,0.74),inset_0_1px_0_rgba(255,248,227,0.14),inset_0_-4px_0_rgba(0,0,0,0.1),0_0_34px_rgba(255,214,111,0.08)]',
      'transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:animate-[cozy-bob_520ms_ease-out] hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.74)]',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_20%,rgba(255,252,241,0.16),transparent_20%),radial-gradient(circle_at_84%_82%,rgba(255,215,110,0.12),transparent_22%),linear-gradient(180deg,rgba(255,241,198,0.04),transparent_28%)]',
    ),
    cardBadge: cx(
      'inline-flex whitespace-nowrap rounded-full border border-amber-100/34 bg-amber-100/12 px-3 py-2 font-ui text-[0.62rem]',
      'tracking-[0.12em] text-amber-50/82',
    ),
    buttonPrimary: cx(
      'inline-flex items-center justify-center rounded-full border border-amber-100/40',
      'bg-[linear-gradient(135deg,#fff2c6_0%,#f0c75f_45%,#8c6420_100%)] px-5 py-3 font-ui text-[0.74rem] font-semibold',
      'whitespace-nowrap tracking-[0.12em] text-[#2c1d07] shadow-[0_18px_34px_-20px_rgba(0,0,0,0.56)]',
      'transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:animate-[cozy-bob_460ms_ease-out] hover:shadow-[0_24px_42px_-18px_rgba(0,0,0,0.6)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/45',
    ),
    buttonSecondary: cx(
      'inline-flex items-center justify-center rounded-full border border-amber-100/34 bg-amber-100/10 px-5 py-3 font-ui text-[0.74rem]',
      'font-semibold whitespace-nowrap tracking-[0.12em] text-amber-50/82 shadow-[0_14px_28px_-22px_rgba(0,0,0,0.5)]',
      'transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:animate-[cozy-bob_420ms_ease-out] hover:bg-amber-100/16',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/35',
    ),
    inputShell: cx(
      'relative overflow-hidden rounded-[1.9rem] border border-amber-100/30 bg-[#2a1d0d]/92 p-5',
      'shadow-[0_20px_42px_-26px_rgba(0,0,0,0.66),inset_0_1px_0_rgba(255,248,227,0.12)]',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_20%,rgba(255,252,241,0.12),transparent_20%),radial-gradient(circle_at_84%_82%,rgba(255,215,110,0.08),transparent_22%)]',
    ),
    inputLabel: 'font-ui whitespace-nowrap text-[0.64rem] tracking-[0.12em] text-amber-50/52',
    input: cx(
      'mt-3 w-full rounded-full border border-amber-100/34 bg-[#3a2913] px-5 py-3 font-ui text-sm text-amber-50',
      'placeholder:text-amber-50/36 transition-all duration-300 ease-out',
      'focus:-translate-y-0.5 focus:scale-[1.01] focus:border-amber-100/46 focus:outline-none focus:ring-2 focus:ring-amber-100/24',
    ),
    inputHint: 'mt-3 font-body text-[1rem] leading-relaxed text-amber-50/62',
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-[#120d07]/70 px-4 backdrop-blur-sm',
    modalPanel: cx(
      'relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-amber-100/30 bg-[#2a1d0d]/96 p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.72)] sm:p-7',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_20%,rgba(255,252,241,0.12),transparent_20%),radial-gradient(circle_at_84%_82%,rgba(255,215,110,0.08),transparent_22%)]',
    ),
    modalBadge: cx(
      'inline-flex rounded-full border border-amber-100/34 bg-amber-100/12 px-3 py-2 font-ui text-[0.64rem]',
      'whitespace-nowrap tracking-[0.12em] text-amber-50/82',
    ),
    modalClose: cx(
      'absolute right-4 top-4 rounded-full border border-amber-100/30 bg-amber-100/10 px-3 py-2 font-ui text-[0.62rem]',
      'whitespace-nowrap tracking-[0.12em] text-amber-50/76 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:animate-[cozy-bob_320ms_ease-out] hover:bg-amber-100/14',
    ),
  },
}

export function getHouseGlassPanelClass(houseId, ...extraClasses) {
  const base = cx(
    'relative overflow-hidden border border-[var(--panel-border)]',
    'bg-[linear-gradient(180deg,var(--panel-top),var(--panel-bottom)),rgba(7,18,13,0.74)]',
    'shadow-[0_25px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)]',
    'backdrop-blur-[26px]',
    'before:pointer-events-none before:absolute before:inset-0',
    'before:bg-[linear-gradient(135deg,rgba(255,255,255,0.09),transparent_26%,transparent_72%,var(--glass-highlight))]',
  )

  switch (houseId) {
    case 'gryffindor':
      return cx(
        base,
        'rounded-[1.15rem] backdrop-blur-[18px]',
        'shadow-[0_24px_70px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,240,220,0.06),inset_0_0_0_1px_rgba(255,196,129,0.05)]',
        ...extraClasses,
      )
    case 'ravenclaw':
      return cx(
        base,
        'rounded-[1rem] backdrop-blur-[18px]',
        'shadow-[0_24px_74px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(220,240,255,0.06),inset_0_0_0_1px_rgba(111,172,255,0.06)]',
        ...extraClasses,
      )
    case 'hufflepuff':
      return cx(
        base,
        'rounded-[2.2rem] backdrop-blur-[24px]',
        'shadow-[0_28px_82px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,248,220,0.08),inset_0_-1px_0_rgba(60,42,10,0.22)]',
        ...extraClasses,
      )
    default:
      return cx(base, ...extraClasses)
  }
}

export function getHouseAccentPillClass(houseId, ...extraClasses) {
  const base = cx(
    'border border-[var(--accent-border)] bg-[var(--accent-soft-bg)] text-[var(--accent-soft-text)]',
    'shadow-[0_0_24px_var(--accent-glow)]',
  )

  switch (houseId) {
    case 'gryffindor':
      return cx(
        base,
        'rounded-none [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]',
        ...extraClasses,
      )
    case 'ravenclaw':
      return cx(
        base,
        'rounded-[1rem_0.35rem_1rem_0.35rem]',
        'bg-[linear-gradient(135deg,rgba(109,177,255,0.22),rgba(255,207,132,0.12)),rgba(12,28,48,0.68)]',
        'shadow-[0_0_26px_rgba(109,177,255,0.16),inset_0_1px_0_rgba(245,250,255,0.08)]',
        ...extraClasses,
      )
    case 'hufflepuff':
      return cx(
        base,
        'rounded-full',
        'bg-[linear-gradient(135deg,rgba(255,226,145,0.2),rgba(255,248,227,0.1)),rgba(52,38,10,0.72)]',
        'shadow-[0_0_28px_rgba(255,208,102,0.16),inset_0_1px_0_rgba(255,250,238,0.08)]',
        ...extraClasses,
      )
    default:
      return cx(base, 'rounded-full', ...extraClasses)
  }
}

export function getHouseStatPillClass(houseId, ...extraClasses) {
  switch (houseId) {
    case 'gryffindor':
      return getHouseGlassPanelClass(houseId, 'rounded-[0.8rem]', ...extraClasses)
    case 'ravenclaw':
      return getHouseGlassPanelClass(houseId, 'rounded-[1rem]', ...extraClasses)
    case 'hufflepuff':
      return getHouseGlassPanelClass(houseId, 'rounded-[2rem]', ...extraClasses)
    default:
      return getHouseGlassPanelClass(houseId, 'rounded-[1.5rem]', ...extraClasses)
  }
}

export function getHouseStatPillOverlay(houseId) {
  if (houseId === 'gryffindor') {
    return {
      className: 'absolute inset-x-0 left-0 top-0 h-[4px] pointer-events-none opacity-95',
      style: { background: 'var(--button-gradient)' },
    }
  }

  return {
    className:
      'absolute pointer-events-none opacity-70 rounded-full h-[6.5rem] w-[6.5rem] right-[-12%] bottom-[-45%]',
    style: { background: 'radial-gradient(circle, var(--accent-wash), transparent 70%)' },
  }
}

export function getHouseSwitcherPanelClass(houseId, ...extraClasses) {
  switch (houseId) {
    case 'gryffindor':
      return getHouseGlassPanelClass(houseId, 'rounded-[1.15rem]', ...extraClasses)
    case 'ravenclaw':
      return cx(
        'relative overflow-hidden rounded-[1rem] border border-[var(--panel-border)] backdrop-blur-[18px]',
        'bg-[linear-gradient(180deg,rgba(9,22,40,0.94),rgba(4,9,20,0.82)),rgba(0,0,0,0.28)]',
        'shadow-[0_32px_88px_rgba(0,0,0,0.44),inset_0_1px_0_rgba(232,245,255,0.08),inset_0_0_0_1px_rgba(105,170,255,0.08)]',
        'before:pointer-events-none before:absolute before:inset-0',
        'before:bg-[radial-gradient(circle_at_16%_22%,rgba(113,187,255,0.14),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(255,207,132,0.12),transparent_18%),linear-gradient(rgba(177,214,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(177,214,255,0.08)_1px,transparent_1px)]',
        'before:[background-size:auto,auto,38px_38px,38px_38px] before:opacity-[0.42]',
        ...extraClasses,
      )
    case 'hufflepuff':
      return cx(
        'relative overflow-hidden rounded-[2.2rem] border border-[var(--panel-border)] backdrop-blur-[24px]',
        'bg-[linear-gradient(180deg,rgba(42,30,10,0.94),rgba(17,11,4,0.84)),rgba(0,0,0,0.28)]',
        'shadow-[0_34px_92px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,248,224,0.1),inset_0_-1px_0_rgba(76,54,14,0.2)]',
        'before:pointer-events-none before:absolute before:inset-0',
        'before:bg-[radial-gradient(circle_at_18%_24%,rgba(255,248,219,0.14),transparent_22%),radial-gradient(circle_at_78%_18%,rgba(255,215,122,0.12),transparent_20%),linear-gradient(135deg,rgba(255,240,198,0.06),transparent_40%)]',
        'before:opacity-[0.56]',
        ...extraClasses,
      )
    default:
      return getHouseGlassPanelClass(houseId, 'rounded-[2rem]', ...extraClasses)
  }
}

export function getHouseSwitcherPanelOverlay(houseId) {
  switch (houseId) {
    case 'gryffindor':
      return {
        className: 'absolute inset-x-[1rem] top-[1rem] h-[6px] pointer-events-none',
        style: {
          background: 'linear-gradient(90deg, transparent, rgba(255, 213, 162, 0.8), transparent)',
        },
      }
    case 'ravenclaw':
      return {
        className: 'absolute inset-x-[1rem] bottom-[1rem] h-px pointer-events-none',
        style: {
          background:
            'linear-gradient(90deg, transparent, rgba(191, 226, 255, 0.34), transparent), linear-gradient(90deg, transparent 0 35%, rgba(255, 208, 134, 0.12) 35% 65%, transparent 65%)',
        },
      }
    case 'hufflepuff':
      return {
        className: 'absolute inset-[1rem] rounded-[1.5rem] pointer-events-none',
        style: {
          background:
            'radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.08), transparent 22%), radial-gradient(circle at 80% 74%, rgba(255, 255, 255, 0.05), transparent 20%), linear-gradient(90deg, transparent, rgba(255, 235, 186, 0.34), transparent), linear-gradient(90deg, transparent 0 38%, rgba(255, 214, 122, 0.14) 38% 62%, transparent 62%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto, auto, calc(100% - 3rem) 1px, calc(100% - 4.5rem) 1px',
          backgroundPosition: 'center, center, center bottom 0.1rem, center bottom 0.1rem',
        },
      }
    default:
      return {
        className: 'absolute inset-x-[1.2rem] bottom-[1.1rem] h-px pointer-events-none',
        style: { background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14), transparent)' },
      }
  }
}

export function getHouseVaultInvocationClass(houseId, ...extraClasses) {
  const base = 'ui-nowrap mt-3 font-ui text-[0.68rem] tracking-[0.12em] text-white/54'

  switch (houseId) {
    case 'ravenclaw':
      return cx(base, 'text-[rgba(191,226,255,0.76)] [text-shadow:0_0_18px_rgba(94,166,255,0.24)]', ...extraClasses)
    case 'hufflepuff':
      return cx(base, 'text-[rgba(255,235,171,0.76)] [text-shadow:0_0_18px_rgba(255,196,78,0.22)]', ...extraClasses)
    default:
      return cx(base, ...extraClasses)
  }
}

export function getHouseVaultLegendClass(houseId, ...extraClasses) {
  const base =
    'mt-4 max-w-3xl font-body text-[1.08rem] leading-relaxed text-white/74 sm:text-[1.12rem] [text-wrap:balance]'

  switch (houseId) {
    case 'ravenclaw':
      return cx(base, 'max-w-[42rem] text-[rgba(231,244,255,0.8)]', ...extraClasses)
    case 'hufflepuff':
      return cx(base, 'max-w-[42rem] text-[rgba(255,244,214,0.82)]', ...extraClasses)
    default:
      return cx(base, ...extraClasses)
  }
}

export function getHouseSwitchClass(houseId, isActive, ...extraClasses) {
  const base = cx(
    'relative overflow-hidden border border-[var(--panel-border)] p-4 text-left',
    'bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)),rgba(0,0,0,0.2)]',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_34px_rgba(0,0,0,0.22)]',
    'transition-[transform,border-color,box-shadow] duration-300 ease-out',
    'after:pointer-events-none after:absolute',
    'after:inset-[auto_-15%_-45%_auto] after:h-32 after:w-32 after:rounded-full',
    'after:bg-[radial-gradient(circle,var(--accent-wash),transparent_68%)] after:opacity-80',
  )
  const elevated = isActive
    ? 'translate-y-[-4px] border-[var(--accent-border)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_42px_rgba(0,0,0,0.28),0_0_0_1px_var(--accent-border),0_0_34px_var(--accent-glow)]'
    : 'hover:translate-y-[-4px] hover:border-[var(--accent-border)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_42px_rgba(0,0,0,0.28),0_0_0_1px_var(--accent-border),0_0_34px_var(--accent-glow)]'

  switch (houseId) {
    case 'gryffindor':
      return cx(
        base,
        'rounded-[0.8rem]',
        'after:inset-[auto_-24%_-18%_auto] after:h-36 after:w-48 after:rounded-none',
        'after:bg-[linear-gradient(135deg,rgba(255,177,94,0.22),transparent_70%)]',
        elevated,
        ...extraClasses,
      )
    case 'ravenclaw':
      return cx(
        'relative overflow-hidden border border-[var(--panel-border)] p-4 text-left rounded-[1rem_0.35rem_1rem_0.35rem]',
        'bg-[linear-gradient(180deg,rgba(17,35,60,0.92),rgba(7,13,26,0.8)),rgba(0,0,0,0.22)]',
        'shadow-[inset_0_1px_0_rgba(234,246,255,0.08),inset_0_0_0_1px_rgba(111,172,255,0.08),0_16px_36px_rgba(0,0,0,0.28)]',
        'transition-[transform,border-color,box-shadow] duration-300 ease-out',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
        'after:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%),linear-gradient(90deg,transparent_48%,rgba(255,255,255,0.06)_50%,transparent_52%),radial-gradient(circle_at_86%_18%,rgba(255,209,134,0.12),transparent_20%)] after:opacity-[0.74]',
        elevated,
        ...extraClasses,
      )
    case 'hufflepuff':
      return cx(
        'relative overflow-hidden border border-[var(--panel-border)] p-4 text-left rounded-[2rem]',
        'bg-[linear-gradient(180deg,rgba(55,39,12,0.92),rgba(23,15,4,0.8)),rgba(0,0,0,0.2)]',
        'shadow-[inset_0_1px_0_rgba(255,251,236,0.08),inset_0_-4px_0_rgba(0,0,0,0.14),0_14px_34px_rgba(0,0,0,0.22)]',
        'transition-[transform,border-color,box-shadow] duration-300 ease-out',
        'after:pointer-events-none after:absolute after:inset-[auto_auto_-35%_-15%] after:h-32 after:w-32 after:rounded-full',
        'after:bg-[radial-gradient(circle,rgba(255,214,118,0.22),transparent_70%)]',
        elevated,
        ...extraClasses,
      )
    default:
      return cx(base, 'rounded-[1.05rem]', elevated, ...extraClasses)
  }
}

export function getHouseSwitchNameClass(houseId, ...extraClasses) {
  const base = 'font-display text-[1.35rem] text-white max-sm:text-[1.2rem]'

  switch (houseId) {
    case 'gryffindor':
      return cx(base, 'uppercase tracking-[0.08em] rounded-none', ...extraClasses)
    case 'ravenclaw':
      return cx(base, 'text-[1.28rem] uppercase tracking-[0.08em] [text-shadow:0_0_16px_rgba(111,172,255,0.18)]', ...extraClasses)
    case 'hufflepuff':
      return cx(base, 'text-[1.4rem] [text-shadow:0_0_16px_rgba(255,212,111,0.16)]', ...extraClasses)
    default:
      return cx(base, ...extraClasses)
  }
}

export function getHouseSwitchCopyClass(houseId, ...extraClasses) {
  const base = 'font-body text-[1.02rem] leading-[1.25] text-white/72'

  switch (houseId) {
    case 'ravenclaw':
      return cx(base, 'max-w-[20ch] text-[rgba(224,239,255,0.76)]', ...extraClasses)
    default:
      return cx(base, ...extraClasses)
  }
}

export function getHouseSwitchTagClass(houseId, ...extraClasses) {
  return getHouseAccentPillClass(
    houseId,
    'relative z-[1] ui-nowrap px-3 py-2 font-ui text-[0.62rem] tracking-[0.12em]',
    ...(houseId === 'gryffindor' ? ['rounded-none'] : []),
    ...extraClasses,
  )
}

export function getHouseMistOrbs(houseId) {
  const base = {
    className:
      'absolute rounded-full opacity-70 blur-[16px] animate-[drift_18s_ease-in-out_infinite]',
  }

  switch (houseId) {
    case 'ravenclaw':
      return [
        {
          ...base,
          className: `${base.className} top-[-10rem] right-[-4rem] h-[32rem] w-[32rem]`,
          style: { background: 'radial-gradient(circle, var(--orb-one), transparent 65%)' },
        },
        {
          ...base,
          className: `${base.className} left-[-7rem] top-[12rem] h-[26rem] w-[26rem]`,
          style: {
            background: 'radial-gradient(circle, var(--orb-two), transparent 68%)',
            animationDelay: '-5s',
          },
        },
        {
          ...base,
          className: `${base.className} right-[10%] bottom-[8rem] h-[30rem] w-[30rem]`,
          style: {
            background: 'radial-gradient(circle, var(--orb-three), transparent 68%)',
            animationDelay: '-10s',
          },
        },
      ]
    case 'hufflepuff':
      return [
        {
          ...base,
          className: `${base.className} top-[-9rem] right-[-6rem] h-[30rem] w-[30rem]`,
          style: { background: 'radial-gradient(circle, var(--orb-one), transparent 65%)' },
        },
        {
          ...base,
          className: `${base.className} left-[-4rem] top-[20rem] h-[24rem] w-[24rem]`,
          style: {
            background: 'radial-gradient(circle, var(--orb-two), transparent 68%)',
            animationDelay: '-5s',
          },
        },
        {
          ...base,
          className: `${base.className} right-[24%] bottom-[1rem] h-[28rem] w-[28rem]`,
          style: {
            background: 'radial-gradient(circle, var(--orb-three), transparent 68%)',
            animationDelay: '-10s',
          },
        },
      ]
    default:
      return [
        {
          ...base,
          className: `${base.className} top-[-8rem] right-[-8rem] h-[28rem] w-[28rem]`,
          style: { background: 'radial-gradient(circle, var(--orb-one), transparent 65%)' },
        },
        {
          ...base,
          className: `${base.className} left-[-5rem] top-[18rem] h-[22rem] w-[22rem]`,
          style: {
            background: 'radial-gradient(circle, var(--orb-two), transparent 68%)',
            animationDelay: '-5s',
          },
        },
        {
          ...base,
          className: `${base.className} right-[20%] bottom-[4rem] h-[24rem] w-[24rem]`,
          style: {
            background: 'radial-gradient(circle, var(--orb-three), transparent 68%)',
            animationDelay: '-10s',
          },
        },
      ]
  }
}

export function getHouseGridOverlay(houseId) {
  switch (houseId) {
    case 'gryffindor':
      return {
        className: 'absolute inset-0 opacity-[0.22]',
        style: {
          backgroundImage:
            'linear-gradient(rgba(255, 220, 179, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 220, 179, 0.08) 1px, transparent 1px)',
          backgroundSize: '92px 92px',
          maskImage: 'linear-gradient(180deg, transparent 6%, black 34%, black 70%, transparent 100%)',
        },
      }
    case 'ravenclaw':
      return {
        className: 'absolute inset-0 opacity-[0.28]',
        style: {
          backgroundImage:
            'linear-gradient(rgba(179, 223, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(179, 223, 255, 0.12) 1px, transparent 1px), radial-gradient(rgba(255, 224, 184, 0.22) 1px, transparent 1px), radial-gradient(rgba(188, 222, 255, 0.1) 1px, transparent 1px)',
          backgroundPosition: '0 0, 0 0, 0 0, 11px 11px',
          backgroundSize: '60px 60px, 60px 60px, 24px 24px, 24px 24px',
          maskImage: 'radial-gradient(circle at center, black 22%, transparent 94%)',
        },
      }
    case 'hufflepuff':
      return {
        className: 'absolute inset-0 opacity-[0.22]',
        style: {
          backgroundImage:
            'radial-gradient(rgba(255, 236, 189, 0.22) 1px, transparent 1px), radial-gradient(rgba(255, 236, 189, 0.14) 1px, transparent 1px), linear-gradient(rgba(255, 212, 126, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 212, 126, 0.06) 1px, transparent 1px)',
          backgroundPosition: '0 0, 15px 15px, 0 0, 0 0',
          backgroundSize: '30px 30px, 30px 30px, 90px 90px, 90px 90px',
          maskImage: 'radial-gradient(circle at center, black 24%, transparent 92%)',
        },
      }
    default:
      return {
        className: 'absolute inset-0 opacity-[0.28]',
        style: {
          backgroundImage:
            'linear-gradient(rgba(217, 232, 223, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 232, 223, 0.06) 1px, transparent 1px)',
          backgroundSize: '82px 82px',
          maskImage: 'radial-gradient(circle at center, black 28%, transparent 88%)',
        },
      }
  }
}

export function getSnitchToastClass(...extraClasses) {
  return cx(
    'relative overflow-hidden border border-[var(--accent-border)] rounded-[1.6rem] px-5 py-4',
    'bg-[radial-gradient(circle_at_84%_18%,rgba(255,218,123,0.16),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)),rgba(0,0,0,0.24)]',
    'shadow-[0_18px_44px_rgba(0,0,0,0.22),0_0_28px_var(--accent-glow)]',
    'before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%)]',
    ...extraClasses,
  )
}

export const designSystemText = sharedText
