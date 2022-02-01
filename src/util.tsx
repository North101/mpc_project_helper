export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function replace<T>(list: T[], index: number, item: T) {
  return [
    ...list.slice(0, index),
    item,
    ...list.slice(index + 1),
  ];
}

export function remove<T>(list: T[], index: number) {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1),
  ];
}

export async function setStateAsync<P, S, K extends keyof S>(
  component: React.Component<P, S>,
  state:
    ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) |
    Pick<S, K> |
    S |
    null
) {
  return new Promise(resolve => component.setState(state, () => resolve(null)));
}

export async function analyseCard(img: HTMLImageElement, file: File) {
  const promise = new Promise<{ width: number; height: number; }>((resolve, reject) => {
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      resolve({ width, height });
    };
    img.onerror = reject;
  });
  img.src = URL.createObjectURL(file);

  return await promise;
}