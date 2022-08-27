export function truncate(str: string, max: number) {
  return str.length > max ? str.substr(0, max - 1) + '…' : str
}
