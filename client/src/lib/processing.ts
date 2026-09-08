export const CANCELLATION_ERROR = "__CANCELLED__";

export function isCancellationError(error: unknown) {
  return error instanceof Error && error.message === CANCELLATION_ERROR;
}

export function abortable<T>(promise: Promise<T>, signal: AbortSignal) {
  if (signal.aborted) return Promise.reject(new Error(CANCELLATION_ERROR));
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new Error(CANCELLATION_ERROR));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      value => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      error => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}
