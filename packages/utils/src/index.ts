export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${String(value)}`);
};

export const createTimestamp = (): string => new Date().toISOString();
