import './globals.css'
import { AuthProvider } from './context/AuthContext'

export const metadata = {
  title: 'Calculator App',
  description: 'Advanced calculator application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-full">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
