import { getHouseStatPillClass, getHouseStatPillOverlay } from '../design-system/houseDesignSystems'

function StatPill({ houseId = 'slytherin', label, value }) {
  const overlay = getHouseStatPillOverlay(houseId)

  return (
    <div className={getHouseStatPillClass(houseId, 'px-5 py-4')}>
      <div className={overlay.className} style={overlay.style} />
      <p className="section-label">{label}</p>
      <p className="mt-3 font-display text-[1.8rem] leading-none text-white sm:text-[2rem]">
        {value}
      </p>
    </div>
  )
}

export default StatPill
