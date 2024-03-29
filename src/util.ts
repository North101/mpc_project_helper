export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export function replace<T>(list: T[], index: number, item: T) {
  return [
    ...list.slice(0, index),
    item,
    ...list.slice(index + 1),
  ]
}

export function remove<T>(list: T[], index: number) {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1),
  ]
}

export function analyseCard(file: File) {
  const img = document.createElement('img')
  try {
    const promise = new Promise<{ file: File, width: number, height: number, }>((resolve, reject) => {
      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight
        resolve({ file, width, height })
      }
      img.onerror = reject
    })
    img.src = URL.createObjectURL(file)

    return promise
  } finally {
    img.remove()
  }
}
