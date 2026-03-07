import { prisma } from '@/lib/prisma'

const KEY = 'theme'

export async function getSiteTheme(): Promise<'light' | 'dark'> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: KEY },
    })
    return (row?.value === 'dark' ? 'dark' : 'light') as 'light' | 'dark'
  } catch {
    return 'light'
  }
}

export async function setSiteTheme(theme: 'light' | 'dark'): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, value: theme },
    update: { value: theme },
  })
}
