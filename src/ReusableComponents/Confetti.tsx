import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

export const HeroConfetti = () => {
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

export const FullScreenConfetti = () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
        style={{position: 'fixed', top: 0, left: 0}}
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
    />
  )
}