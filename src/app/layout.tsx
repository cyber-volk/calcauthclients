import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from "@/components/ui/toaster"
import Navigation from './components/Navigation'

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
          <Navigation />
          <div className="pt-16">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
