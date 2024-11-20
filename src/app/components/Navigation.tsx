'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, Book, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const Navigation = () => {
  const pathname = usePathname()

  const navigation = [
    { name: 'Calculator', href: '/', icon: Calculator },
    { name: 'Client Ledger', href: '/client-ledger', icon: Book },
  ]

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
              CalcBet301
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              )
            })}
            <button
              onClick={() => signOut()}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
