/**
 * wrap `setTimeout` function with Promise
 * @param delay
 */
export function timeout(delay: number): Promise<void> {
  return new Promise((resolve): void => {
    setTimeout(function () {
      resolve();
    }, delay);
  });
}
