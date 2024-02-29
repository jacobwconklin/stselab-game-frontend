import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const ConfettiHolder = () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
        style={{position: 'absolute', top: 0, left: 0}}
        width={width - 40}
        height={height - 180}
        recycle={false}
        numberOfPieces={200}
    />
  )
}

export default ConfettiHolder;