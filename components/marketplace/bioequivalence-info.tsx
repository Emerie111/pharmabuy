import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface BioequivalenceInfoProps {
  value: number | "pending" | "N/A"
  showIcon?: boolean
  className?: string
}

export default function BioequivalenceInfo({ value, showIcon = true, className }: BioequivalenceInfoProps) {
  // Function to determine bioequivalence color
  const getBioequivalenceColor = (value: number | "pending" | "N/A") => {
    if (typeof value !== "number") return "bg-gray-200 text-gray-700"
    if (value >= 95) return "bg-blue-500 text-white"
    if (value >= 90) return "bg-blue-400 text-white"
    if (value >= 85) return "bg-blue-300 text-blue-900"
    return "bg-blue-200 text-blue-900"
  }

  // Function to determine bioequivalence text
  const getBioequivalenceText = (value: number | "pending" | "N/A") => {
    if (value === "pending") return "Pending"
    if (value === "N/A") return "N/A"
    return `${value}%`
  }

  // Function to determine bioequivalence gauge percentage
  const getBioequivalencePercentage = (value: number | "pending" | "N/A") => {
    if (typeof value !== "number") return 0
    return value
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center", className)}>
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getBioequivalenceColor(value),
              )}
            >
              <div className="relative h-3 w-3 rounded-full bg-white/30 flex items-center justify-center">
                <div
                  className="absolute h-3 w-3 rounded-full"
                  style={{
                    background:
                      typeof value === "number"
                        ? `conic-gradient(currentColor ${getBioequivalencePercentage(value)}%, transparent 0)`
                        : undefined,
                  }}
                />
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
              </div>
              <span>BE: {getBioequivalenceText(value)}</span>
            </div>
            {showIcon && (
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                <Info className="h-3 w-3" />
                <span className="sr-only">Bioequivalence Info</span>
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[250px]">
          <p className="text-xs">
            Bioequivalence (BE) indicates how closely a generic medication matches the reference brand in terms of
            active ingredient absorption.
            {typeof value === "number" && (
              <>
                <br />
                <br />
                This product has a bioequivalence rating of {value}%.
                {value >= 90
                  ? " This is considered a high rating, indicating the product closely matches the reference brand."
                  : value >= 80
                    ? " This is considered a medium rating."
                    : " This is considered a low rating."}
              </>
            )}
            {value === "pending" && (
              <>
                <br />
                <br />
                This product's bioequivalence testing is pending.
              </>
            )}
            {value === "N/A" && (
              <>
                <br />
                <br />
                This product is exempt from bioequivalence testing.
              </>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
