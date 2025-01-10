import { Card } from "@/components/ui/card"

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back!</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Active Campaigns</h3>
          <p className="text-muted-foreground">No active campaigns yet</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Earnings</h3>
          <p className="text-muted-foreground">$0.00</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Pending Tasks</h3>
          <p className="text-muted-foreground">No pending tasks</p>
        </Card>
      </div>
    </div>
  )
}

export default DashboardHome