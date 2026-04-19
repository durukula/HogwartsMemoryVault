import { useOutletContext } from 'react-router-dom'
import HousePortalLayout from '../components/HousePortalLayout'

function GamePage() {
  const { house } = useOutletContext()

  return <HousePortalLayout house={house} />
}

export default GamePage
