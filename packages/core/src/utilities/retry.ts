async function delay(pause: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, pause)
  );
}

export async function retry(
  fn: () => Promise<void>,
  {attempts = 2, delay: _delay = 300}: {attempts: number; delay?: number}
) {
  let lastError: Error | void = undefined;

  for (let i: number = 0; i !== attempts; ++i) {
    lastError = undefined;
    try {
      await fn();
      return;
    } catch (e) {
      lastError = e;
    }

    await delay(_delay);
  }

  throw lastError;
}
