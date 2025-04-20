import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleDollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your store overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border/20 hover:bg-muted">
            Download Report
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value="$12,345"
          change="+20.1%"
          trend="up"
          description="from last month"
          icon={CircleDollarSign}
        />
        <StatsCard title="Products" value="245" change="+12" trend="up" description="added this month" icon={Package} />
        <StatsCard title="Customers" value="573" change="+18" trend="up" description="new this month" icon={Users} />
        <StatsCard
          title="Pending Credit"
          value="$2,350"
          change="15"
          trend="neutral"
          description="customers"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 border-border/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-foreground">Sales Overview</CardTitle>
              <CardDescription>Daily sales performance</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-border/20 hover:bg-muted">
                Weekly
              </Button>
              <Button variant="outline" size="sm" className="border-border/20 hover:bg-muted">
                Monthly
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Yearly
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for chart */}
            <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-muted" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activities</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground">New sale completed</p>
                    <p className="text-xs text-muted-foreground">John Doe purchased 5 items</p>
                  </div>
                  <div className="text-xs text-muted-foreground">5m ago</div>
                </div>
              ))}
              <Button variant="ghost" className="w-full hover:bg-muted" asChild>
                <Link href="/dashboard/reports">View All Activities</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, change, trend, description, icon: Icon }) {
  return (
    <Card className="border-border/10 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center mt-1">
          <span
            className={cn(
              "text-xs",
              trend === "up" && "text-green-600",
              trend === "down" && "text-red-600",
              trend === "neutral" && "text-muted-foreground",
            )}
          >
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
