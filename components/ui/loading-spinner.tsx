import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps = {}) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className={cn("animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900", className)}></div>
    </div>
  )
} 