export declare function retry(
  fn: () => Promise<void>,
  {
    attempts,
    delay: _delay,
  }: {
    attempts: number;
    delay?: number;
  }
): Promise<void>;
