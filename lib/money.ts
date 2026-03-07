export function formatEGP(cents: number) {
  const egp = cents / 100
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EGP' }).format(egp)
}
