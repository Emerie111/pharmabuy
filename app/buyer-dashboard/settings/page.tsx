import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { User, Bell, Shield, CreditCard, Lock } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-emerald-600" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+234 (0) 123 456 7890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="ABC Pharmacy" />
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Bell className="h-5 w-5 mr-2 text-emerald-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    "Order updates",
                    "Shipment tracking",
                    "Payment confirmations",
                    "Product restocks",
                    "Price alerts",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Label htmlFor={`email-${index}`} className="cursor-pointer">
                        {item}
                      </Label>
                      <Switch id={`email-${index}`} defaultChecked={index < 3} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Push Notifications</h3>
                <div className="space-y-3">
                  {["Order status changes", "Delivery updates", "Special offers", "Market insights"].map(
                    (item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Label htmlFor={`push-${index}`} className="cursor-pointer">
                          {item}
                        </Label>
                        <Switch id={`push-${index}`} defaultChecked={index < 2} />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="pt-4">
                <Button>Update Password</Button>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa" className="block mb-1">
                      Enable Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts" className="block mb-1">
                      Login Alerts
                    </Label>
                    <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                  </div>
                  <Switch id="login-alerts" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500 mb-2">Your payment methods will appear here</p>
                  <p className="text-sm text-gray-400">Add and manage your credit cards and bank accounts</p>
                  <Button className="mt-4">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
