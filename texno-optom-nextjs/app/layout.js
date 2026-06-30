import './globals.css'

export const metadata = {
  title: 'Texno Optom | PC Konfigurator',
  description: 'O\\'zbekistondagi eng zo\\'r xarakteristika hisoblovchi web sayt.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}
