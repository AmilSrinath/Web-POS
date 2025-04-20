"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, DollarSign } from "lucide-react"

// Sample credit sales data
const initialCreditSales = [
  {
    id: "1",
    customer: "John Doe",
    date: "2023-04-10",
    amount: 150.0,
    amountPaid: 0,
    status: "unpaid",
  },
  {
    id: "2",
    customer: "Jane Smith",
    date: "2023-04-08",
    amount: 75.5,
    amountPaid: 75.5,
    status: "paid",
  },
  {
    id: "3",
    customer: "Bob Johnson",
    date: "2023-04-05",
    amount: 200.0,
    amountPaid: 50.0,
    status: "partial",
  },
]

export default function CreditPage() {
  const [creditSales, setCreditSales] = useState(initialCreditSales)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState("")

  const filteredSales = creditSales.filter((sale) => sale.customer.toLowerCase().includes(searchTerm.toLowerCase()))

  const handlePayment = () => {
    const amount = Number.parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) return

    const updatedSales = creditSales.map((sale) => {
      if (sale.id === selectedSale.id) {
        const newAmountPaid = sale.amountPaid + amount
        const newStatus = newAmountPaid >= sale.amount ? "paid" : "partial"

        return {
          ...sale,
          amountPaid: Math.min(newAmountPaid, sale.amount),
          status: newStatus,
        }
      }
      return sale
    })

    setCreditSales(updatedSales)
    setPaymentDialogOpen(false)
    setPaymentAmount("")
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      case "partial":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Partial</Badge>
      case "unpaid":
        return <Badge className="bg-red-500 hover:bg-red-600">Unpaid</Badge>
      default:
        return null
    }
  }

  const totalCredit = creditSales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalPaid = creditSales.reduce((sum, sale) => sum + sale.amountPaid, 0)
  const totalOutstanding = totalCredit - totalPaid

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Sales</h1>
          <p className="text-muted-foreground">Track and manage customer credit and payments.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCredit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {creditSales.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((totalPaid / totalCredit) * 100)}% of total credit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {creditSales.filter((sale) => sale.status !== "paid").length} unpaid transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Credit Transactions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by customer..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>Track all credit sales and payment status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(sale.customer)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{sale.customer}</div>
                      </div>
                    </TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">${sale.amount.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Paid: ${sale.amountPaid.toFixed(2)}</div>
                        <Progress value={(sale.amountPaid / sale.amount) * 100} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={sale.status === "paid"}
                        onClick={() => {
                          setSelectedSale(sale)
                          setPaymentDialogOpen(true)
                        }}
                        className="flex items-center gap-1"
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        Record Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No credit sales found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {selectedSale && `Record a payment for ${selectedSale.customer}'s credit sale.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedSale && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Total Amount</Label>
                    <div className="font-medium">${selectedSale.amount.toFixed(2)}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Remaining</Label>
                    <div className="font-medium">${(selectedSale.amount - selectedSale.amountPaid).toFixed(2)}</div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payment">Payment Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="payment"
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      max={selectedSale.amount - selectedSale.amountPaid}
                      className="pl-9"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
