function isInspectableValue(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  if (value instanceof Error) return false;
  if (value instanceof Date) return false;
  if (value instanceof RegExp) return false;
  return true;
}

export function getInspectableArgs(args: unknown[]): unknown[] {
  return args.filter(isInspectableValue);
}


