import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type VerificationStatus = "unverified" | "verified" | "counterfeit" | "checking"

interface ProductVerificationProps {
  nafdacNumber?: string
  className?: string
  compact?: boolean
}

export default function ProductVerification({
  nafdacNumber = "",
  className,
  compact = false,
}: ProductVerificationProps) {
  const [status, setStatus] = useState<VerificationStatus>("unverified")
  const [inputNumber, setInputNumber] = useState(nafdacNumber)

  const handleVerify = () => {
    if (!inputNumber.trim()) return
    
    setStatus("checking")
    
    // Simulate verification check
    setTimeout(() => {
      // For demo, verify based on input pattern
      if (inputNumber.startsWith("A") || inputNumber.startsWith("B")) {
        setStatus("verified")
      } else if (inputNumber.startsWith("X") || inputNumber.startsWith("Z")) {
        setStatus("counterfeit")
      } else {
        setStatus("unverified")
      }
    }, 1500)
  }

  const statusDisplay = {
    unverified: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      text: "Unverified",
      description: "This product has not been verified yet",
      color: "bg-amber-50 border-amber-200 text-amber-800",
    },
    checking: {
      icon: <ShieldCheck className="h-5 w-5 text-blue-500 animate-pulse" />,
      text: "Checking...",
      description: "Verifying with NAFDAC database",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    verified: {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      text: "Verified",
      description: "This product is registered with NAFDAC",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    },
    counterfeit: {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      text: "Counterfeit Alert",
      description: "This product may be counterfeit or unregistered",
      color: "bg-red-50 border-red-200 text-red-800",
    },
  }
  
  const currentStatus = statusDisplay[status]
  
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {currentStatus.icon}
        <span className="font-medium text-sm">{currentStatus.text}</span>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <div className={cn("p-3 border rounded-lg flex items-start gap-3", currentStatus.color)}>
          {currentStatus.icon}
          <div>
            <p className="font-medium">{currentStatus.text}</p>
            <p className="text-sm">{currentStatus.description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input 
            value={inputNumber} 
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Enter NAFDAC number"
            className="flex-1"
          />
          <Button 
            onClick={handleVerify} 
            disabled={status === "checking" || !inputNumber.trim()}
            size="sm"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 