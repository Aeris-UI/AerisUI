export function aerisInternalDisplayInvalid(invalid: boolean, touched: boolean | null): boolean {
  return invalid && (touched ?? true);
}
