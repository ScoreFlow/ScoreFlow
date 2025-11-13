export const updateDiffs = <T>(oldData: T[], newData: T[]): { create: T[]; delete: T[] } => {
  const oldSet = new Set(oldData)
  const newSet = new Set(newData)

  return {
    create: Array.from(newSet.difference(oldSet)),
    delete: Array.from(oldSet.difference(newSet))
  }
}

export const updateHelper = async <T, R>(
  oldData: T[],
  newData: T[],
  deleteCallback: (data: T) => Promise<R>,
  createCallback: (data: T) => Promise<R>
): Promise<R[]> => {
  const diff = updateDiffs(oldData, newData)

  return Promise.all([
    ...Array.from(diff.delete).map(role => deleteCallback(role)),
    ...Array.from(diff.create).map(role => createCallback(role))
  ])
}
