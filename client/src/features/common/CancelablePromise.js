class PromiseStatusError extends Error {
  PromiseStatusError(message, resolved) {
    this.message = message;
    this.resolved = resolved;
  }
}

const makeCancelable = (promise) => {
  let isCanceled = false;

  return {
    promise: new Promise((resolve, reject) => {
      promise.then((value) => (isCanceled ? reject(new PromiseStatusError('Unable to resolve an canceled promise', true)) : resolve(value)))
        .catch((error) => (isCanceled ? reject(new PromiseStatusError('Unable to reject an canceled promise', false)) : reject(error)));
    }),
    cancel: () => { isCanceled = true; },
  };
};

export { PromiseStatusError, makeCancelable };
