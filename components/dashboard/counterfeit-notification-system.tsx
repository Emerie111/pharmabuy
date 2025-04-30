"use client"

import { useState } from "react"
import { 
  AlertTriangle, 
  Bell, 
  BellOff, 
  CheckCircle2, 
  ChevronDown, 
  ExternalLink, 
  X 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Sample alert data
const sampleAlerts = [
  {
    id: "CA1052",
    title: "URGENT: Counterfeit Hypertension Medication",
    description: "Falsified Lisinopril 20mg tablets with NAFDAC number D8-1294 found in multiple markets. Contains unknown substances that may cause severe health risks.",
    severity: "critical",
    date: "2023-06-18T09:30:00Z",
    regions: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
    image: "https://placehold.co/400x300/red/white?text=Counterfeit+Lisinopril",
    originalManufacturer: "PharmaTrust Nigeria Ltd",
    reportedBy: "NAFDAC Surveillance Team",
    actionRequired: "Remove from inventory immediately. Report if you've received this product."
  },
  {
    id: "CA1051",
    title: "Substandard Diabetes Medication Alert",
    description: "Metformin 500mg with batch number MT20230314 contains less than 80% of stated active ingredient. Can lead to uncontrolled blood sugar levels.",
    severity: "high",
    date: "2023-06-15T14:45:00Z",
    regions: ["Nationwide"],
    image: "https://placehold.co/400x300/orange/white?text=Substandard+Metformin",
    originalManufacturer: "MediCore Pharmaceuticals",
    reportedBy: "PharmaTrust Quality Control",
    actionRequired: "Check inventory for this batch. Quarantine affected products."
  },
  {
    id: "CA1050",
    title: "Packaging Variation Warning",
    description: "Genuine Amoxicillin products from BestPharma have updated packaging that may differ from previous versions. Verify with manufacturer if uncertain.",
    severity: "medium",
    date: "2023-06-10T11:20:00Z",
    regions: ["Nationwide"],
    image: "https://placehold.co/400x300/yellow/black?text=Packaging+Update",
    originalManufacturer: "BestPharma Ltd",
    reportedBy: "BestPharma Ltd",
    actionRequired: "Be aware of packaging changes. No immediate action required."
  }
]

interface CounterfeitAlertProps {
  alert: typeof sampleAlerts[0]
  onClose: (id: string) => void
  onViewDetails: (alert: typeof sampleAlerts[0]) => void
}

function CounterfeitAlert({ alert, onClose, onViewDetails }: CounterfeitAlertProps) {
  return (
    <div className={`rounded-lg border p-4 mb-3 ${
      alert.severity === "critical" ? "border-red-200 bg-red-50" :
      alert.severity === "high" ? "border-orange-200 bg-orange-50" :
      "border-yellow-200 bg-yellow-50"
    }`}>
      <div className="flex items-start">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
          alert.severity === "critical" ? "bg-red-100 text-red-700" :
          alert.severity === "high" ? "bg-orange-100 text-orange-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>
          <AlertTriangle className="h-4 w-4" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${
              alert.severity === "critical" ? "text-red-800" :
              alert.severity === "high" ? "text-orange-800" :
              "text-yellow-800"
            }`}>
              {alert.title}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onClose(alert.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm mt-1 line-clamp-2">
            {alert.description}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className={`${
              alert.severity === "critical" ? "border-red-200 bg-red-100 text-red-800" :
              alert.severity === "high" ? "border-orange-200 bg-orange-100 text-orange-800" :
              "border-yellow-200 bg-yellow-100 text-yellow-800"
            }`}>
              {alert.severity === "critical" ? "CRITICAL" : 
               alert.severity === "high" ? "HIGH PRIORITY" : "MEDIUM PRIORITY"}
            </Badge>
            
            <Button 
              variant="link" 
              size="sm" 
              className={`p-0 h-auto ${
                alert.severity === "critical" ? "text-red-700" :
                alert.severity === "high" ? "text-orange-700" :
                "text-yellow-700"
              }`}
              onClick={() => onViewDetails(alert)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CounterfeitNotificationSystem() {
  const [notifications, setNotifications] = useState(sampleAlerts)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<typeof sampleAlerts[0] | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    inApp: true,
    push: false,
    criticalOnly: false,
    regions: {
      lagos: true,
      abuja: true,
      kano: true,
      portHarcourt: true,
      ibadan: true,
      otherRegions: true
    }
  })
  
  const hasNotifications = notifications.length > 0
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(alert => alert.id !== id))
  }
  
  const viewAlertDetails = (alert: typeof sampleAlerts[0]) => {
    setSelectedAlert(alert)
  }
  
  const clearAllNotifications = () => {
    setNotifications([])
  }
  
  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev)
  }
  
  const handleUpdateSettings = () => {
    // In a real app, this would save settings to the backend
    setShowSettings(false)
  }

  return (
    <div>
      {/* Main Notification Component */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Bell className="h-5 w-5 mr-2" />
            Counterfeit Alert System
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={toggleNotifications}
                  >
                    {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{notificationsEnabled ? "Mute Notifications" : "Enable Notifications"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notification Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  Notification Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAllNotifications}>
                  Clear All Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <a href="/verification" className="flex items-center">
                    Verify Products
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          {notificationsEnabled ? (
            hasNotifications ? (
              <div className="space-y-1">
                {notifications.map(alert => (
                  <CounterfeitAlert 
                    key={alert.id} 
                    alert={alert} 
                    onClose={dismissNotification}
                    onViewDetails={viewAlertDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium text-gray-700">No Active Alerts</h3>
                <p className="text-sm text-gray-500 mt-1">
                  You'll be notified when critical counterfeit alerts are issued
                </p>
              </div>
            )
          ) : (
            <div className="py-8 text-center">
              <BellOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium text-gray-700">Notifications Disabled</h3>
              <p className="text-sm text-gray-500 mt-1">
                You won't receive counterfeit alerts while notifications are disabled
              </p>
              <Button variant="outline" className="mt-4" onClick={toggleNotifications}>
                Enable Notifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Alert Details Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className={`flex items-center ${
              selectedAlert?.severity === "critical" ? "text-red-700" :
              selectedAlert?.severity === "high" ? "text-orange-700" :
              "text-yellow-700"
            }`}>
              <AlertTriangle className="h-5 w-5 mr-2" />
              {selectedAlert?.title}
            </DialogTitle>
            <DialogDescription>
              Alert ID: {selectedAlert?.id} • Issued: {selectedAlert && new Date(selectedAlert.date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={selectedAlert.image} 
                  alt={selectedAlert.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h4 className="font-medium">Alert Details</h4>
                <p className="text-sm text-gray-700 mt-1">{selectedAlert.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Severity</h4>
                  <Badge className={`mt-1 ${
                    selectedAlert.severity === "critical" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                    selectedAlert.severity === "high" ? "bg-orange-100 text-orange-800 hover:bg-orange-100" :
                    "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }`}>
                    {selectedAlert.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Reported By</h4>
                  <p className="font-medium">{selectedAlert.reportedBy}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Original Manufacturer</h4>
                  <p className="font-medium">{selectedAlert.originalManufacturer}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Affected Regions</h4>
                  <p className="font-medium">{selectedAlert.regions.join(", ")}</p>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${
                selectedAlert.severity === "critical" ? "bg-red-50" :
                selectedAlert.severity === "high" ? "bg-orange-50" :
                "bg-yellow-50"
              }`}>
                <h4 className="font-medium">Required Action</h4>
                <p className="text-sm mt-1">{selectedAlert.actionRequired}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSelectedAlert(null)}>
              Close
            </Button>
            <Button>
              Report Similar Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Notification Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Configure how you want to receive counterfeit alerts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-4">
              <h4 className="font-medium">Notification Methods</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex flex-col">
                  <span>Email Notifications</span>
                  <span className="text-xs text-gray-500">Send alerts to abc@pharmacy.com</span>
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, email: checked}))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications" className="flex flex-col">
                  <span>SMS Notifications</span>
                  <span className="text-xs text-gray-500">Send alerts to +234 800 123 4567</span>
                </Label>
                <Switch 
                  id="sms-notifications" 
                  checked={notificationSettings.sms}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, sms: checked}))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="inapp-notifications" className="flex flex-col">
                  <span>In-App Notifications</span>
                  <span className="text-xs text-gray-500">Show alerts in the notification center</span>
                </Label>
                <Switch 
                  id="inapp-notifications" 
                  checked={notificationSettings.inApp}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, inApp: checked}))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex flex-col">
                  <span>Push Notifications</span>
                  <span className="text-xs text-gray-500">Send alerts to your mobile device</span>
                </Label>
                <Switch 
                  id="push-notifications" 
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, push: checked}))
                  }
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Filter Options</h4>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="critical-only" 
                  checked={notificationSettings.criticalOnly}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({
                      ...prev, 
                      criticalOnly: checked === true
                    }))
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor="critical-only" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Critical alerts only
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Only receive notifications for critical counterfeit alerts
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Region-Specific Alerts</h4>
              <p className="text-xs text-gray-500 mb-3">
                Select regions you want to receive alerts for
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-lagos" 
                    checked={notificationSettings.regions.lagos}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev, 
                        regions: {
                          ...prev.regions,
                          lagos: checked === true
                        }
                      }))
                    }
                  />
                  <Label htmlFor="region-lagos">Lagos</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-abuja" 
                    checked={notificationSettings.regions.abuja}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev, 
                        regions: {
                          ...prev.regions,
                          abuja: checked === true
                        }
                      }))
                    }
                  />
                  <Label htmlFor="region-abuja">Abuja</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-kano" 
                    checked={notificationSettings.regions.kano}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev, 
                        regions: {
                          ...prev.regions,
                          kano: checked === true
                        }
                      }))
                    }
                  />
                  <Label htmlFor="region-kano">Kano</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-ph" 
                    checked={notificationSettings.regions.portHarcourt}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev, 
                        regions: {
                          ...prev.regions,
                          portHarcourt: checked === true
                        }
                      }))
                    }
                  />
                  <Label htmlFor="region-ph">Port Harcourt</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-ibadan" 
                    checked={notificationSettings.regions.ibadan}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev, 
                        regions: {
                          ...prev.regions,
                          ibadan: checked === true
                        }
                      }))
                    }
                  />
                  <Label htmlFor="region-ibadan">Ibadan</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-others" 
                    checked={notificationSettings.regions.otherRegions}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev, 
                        regions: {
                          ...prev.regions,
                          otherRegions: checked === true
                        }
                      }))
                    }
                  />
                  <Label htmlFor="region-others">Other Regions</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 