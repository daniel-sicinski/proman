export function click(element: HTMLElement) {
  return element.dispatchEvent(new Event("click"));
}

export function dispatchInputEvent(element: HTMLInputElement) {
  return element.dispatchEvent(new Event("input"));
}

export function dispatchSubmitEvent(element: HTMLFormElement) {
  return element.dispatchEvent(new Event("submit"));
}
