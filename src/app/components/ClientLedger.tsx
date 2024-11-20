'use client'

import React, { useState, useEffect } from 'react'
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileText, Download, Plus, Search, Check, X } from 'lucide-react'
import { format } from 'date-fns'

interface ClientLedgerEntry {
  id: string
  ledgerId: string
  sessionId?: string
  type: 'credit' | 'payee'
  amount: number
  previousBalance: number
  newBalance: number
  date: Date
  notes?: string
  session?: {
    name: string
    status: string
    finalResult?: number
  }
}

interface ClientBalance {
  clientId: string
  clientName: string
  totalCredit: number
  totalPayee: number
  currentBalance: number
  lastUpdated: Date
  status: string
  isVIP: boolean
  verificationRequired: boolean
  lastVerificationDate?: Date
  verificationStatus?: string
}

interface ClientNotification {
  id: string
  type: 'balance_alert' | 'verification_needed' | 'withdrawal_large'
  message: string
  status: 'unread' | 'read' | 'dismissed'
  createdAt: Date
}

interface Session {
  id: string
  name: string
  status: string
  startDate: Date
  endDate?: Date
  totalAmount?: number
  finalResult?: number
  forms: {
    id: string
    name: string
    result?: string
  }[]
  verifications: {
    id: string
    status: string
    difference?: number
  }[]
}

export default function ClientLedger() {
  const [entries, setEntries] = useState<ClientLedgerEntry[]>([])
  const [clientBalances, setClientBalances] = useState<ClientBalance[]>([])
  const [notifications, setNotifications] = useState<ClientNotification[]>([])
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<string>('')
  const [showVIPOnly, setShowVIPOnly] = useState(false)

  // Fetch client ledger entries, sessions, and notifications
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [ledgerRes, sessionsRes, notificationsRes] = await Promise.all([
          fetch('/api/client-ledger' + (selectedClient ? `?clientId=${selectedClient}` : '')),
          fetch('/api/hsseb'),
          fetch('/api/notifications' + (selectedClient ? `?clientId=${selectedClient}` : ''))
        ])
        
        const ledgerData = await ledgerRes.json()
        const sessionsData = await sessionsRes.json()
        const notificationsData = await notificationsRes.json()
        
        setEntries(ledgerData.entries)
        setClientBalances(ledgerData.balances)
        setSessions(sessionsData.sessions)
        setNotifications(notificationsData.notifications)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }

    fetchData()
  }, [selectedClient])

  // Handle notification dismissal
  const dismissNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/dismiss`, {
        method: 'POST'
      })
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'dismissed' as const } : n)
      )
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  // Handle client verification
  const verifyClient = async (clientId: string) => {
    try {
      await fetch(`/api/client-ledger/${clientId}/verify`, {
        method: 'POST'
      })
      // Refresh data after verification
      const ledgerRes = await fetch('/api/client-ledger' + (selectedClient ? `?clientId=${selectedClient}` : ''))
      const ledgerData = await ledgerRes.json()
      setClientBalances(ledgerData.balances)
    } catch (error) {
      console.error('Error verifying client:', error)
    }
  }

  // Generate PDF report
  const generateReport = async () => {
    try {
      const response = await fetch('/api/client-ledger/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: selectedClient,
          dateRange,
          sessionId: selectedSession
        }),
      })
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ledger-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesClient = !selectedClient || entry.ledgerId === selectedClient
    const matchesSession = !selectedSession || entry.sessionId === selectedSession
    const matchesSearch = !searchQuery || 
      entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.session?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const entryDate = new Date(entry.date)
    const matchesDateRange = 
      (!dateRange.start || entryDate >= new Date(dateRange.start)) &&
      (!dateRange.end || entryDate <= new Date(dateRange.end))
    
    return matchesClient && matchesSession && matchesSearch && matchesDateRange
  })

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Client Ledger</CardTitle>
          <CardDescription>
            Track and manage client balances and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Notifications Section */}
          {notifications.length > 0 && (
            <div className="mb-6 space-y-2">
              {notifications
                .filter(n => n.status !== 'dismissed')
                .map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      notification.type === 'balance_alert' ? 'bg-yellow-100' :
                      notification.type === 'verification_needed' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}
                  >
                    <span className="flex-1">{notification.message}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <Select
              value={selectedClient}
              onValueChange={setSelectedClient}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Clients</SelectItem>
                {clientBalances
                  .filter(client => !showVIPOnly || client.isVIP)
                  .map(client => (
                    <SelectItem key={client.clientId} value={client.clientId}>
                      {client.clientName} {client.isVIP && '⭐'}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSession}
              onValueChange={setSelectedSession}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sessions</SelectItem>
                {sessions.map(session => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-[150px]"
            />
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-[150px]"
            />

            <Button onClick={generateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowVIPOnly(!showVIPOnly)}
              className={showVIPOnly ? 'bg-yellow-100' : ''}
            >
              {showVIPOnly ? 'Show All Clients' : 'Show VIP Only'}
            </Button>
          </div>

          {/* Client Balances Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {clientBalances
              .filter(balance => !showVIPOnly || balance.isVIP)
              .map(balance => (
                <Card key={balance.clientId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {balance.clientName}
                        {balance.isVIP && (
                          <span className="text-yellow-500 text-sm">⭐ VIP</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {balance.verificationRequired && (
                          <span className="text-sm px-2 py-1 rounded bg-red-100 text-red-800">
                            Verification Required
                          </span>
                        )}
                        <span className={`text-sm px-2 py-1 rounded ${
                          balance.status === 'active' ? 'bg-green-100 text-green-800' :
                          balance.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {balance.status}
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      <div className="flex flex-col">
                        <span>Last updated: {format(new Date(balance.lastUpdated), 'PPp')}</span>
                        {balance.lastVerificationDate && (
                          <span>Last verified: {format(new Date(balance.lastVerificationDate), 'PPp')}</span>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Credit:</span>
                        <span className="font-medium">{balance.totalCredit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Payée:</span>
                        <span className="font-medium">{balance.totalPayee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Current Balance:</span>
                        <span className={balance.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {balance.currentBalance.toFixed(2)}
                        </span>
                      </div>
                      {balance.verificationRequired && (
                        <Button
                          onClick={() => verifyClient(balance.clientId)}
                          className="w-full mt-2"
                          variant="outline"
                        >
                          Verify Balance
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Transactions Table */}
          <Table>
            <TableCaption>A list of your recent transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Previous Balance</TableHead>
                <TableHead>New Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {format(new Date(entry.date), 'PPp')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{entry.session?.name}</span>
                      {entry.session?.status === 'verified' && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                      {entry.session?.status === 'disputed' && (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{entry.type}</TableCell>
                  <TableCell>{entry.amount.toFixed(2)}</TableCell>
                  <TableCell>{entry.previousBalance.toFixed(2)}</TableCell>
                  <TableCell 
                    className={entry.newBalance >= 0 ? 'text-green-600' : 'text-red-600'}
                  >
                    {entry.newBalance.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm ${
                      entry.session?.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      entry.session?.status === 'completed' ? 'bg-green-100 text-green-800' :
                      entry.session?.status === 'disputed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.session?.status || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>{entry.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
