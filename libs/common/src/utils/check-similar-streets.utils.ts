import { Street } from '@types'

export const checkSimilarStreets = (streets: Street[]): boolean => {
  const similarOwner: Array<number | null> = []

  streets.forEach(({ owner, isPledged }) => {
    similarOwner.push(owner && !isPledged ? owner : null)
  })
  if (!similarOwner.includes(null)) {
    return similarOwner.every((el) => el === similarOwner[0])
  }
  return false
}
