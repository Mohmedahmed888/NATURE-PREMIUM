export function formatEGP(cents: number) {
  const egp = cents / 100
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(egp)
}
