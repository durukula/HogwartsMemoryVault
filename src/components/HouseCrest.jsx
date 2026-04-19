import gryfindorLogo from '../assets/gryfindor.png'
import hufflepufLogo from '../assets/hufflepuf.png'
import ravenclawLogo from '../assets/ravenclaw.png'
import slytherinLogo from '../assets/slytherin.png'

function HouseCrest({ house = 'slytherin', className = 'h-14 w-12 sm:h-16 sm:w-14' }) {
  const crest =
    house === 'gryffindor'
      ? gryfindorLogo
      : house === 'hufflepuff'
        ? hufflepufLogo
        : house === 'ravenclaw'
          ? ravenclawLogo
          : slytherinLogo

  return (
    <img alt="" aria-hidden="true" className={`${className} object-contain`} src={crest} />
  )
}

export default HouseCrest
