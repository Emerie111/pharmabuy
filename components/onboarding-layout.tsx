"use client"

import type React from "react"
import { ArrowLeft, HelpCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OnboardingLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  title: string
  description: string
  estimatedTime: string
  onBack?: () => void
  onNext?: () => void
  onSave?: () => void
  isNextDisabled?: boolean
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  estimatedTime,
  onBack,
  onNext,
  onSave,
  isNextDisabled = false,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Rx</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-900">PharmaBuy</h1>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{description}</p>

            <div className="flex items-center mt-4 text-sm text-gray-500">
              <Info className="h-4 w-4 mr-2" />
              Estimated time to complete: {estimatedTime}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-500">Progress</div>
                <div className="text-sm font-medium text-blue-600">
                  {currentStep} of {totalSteps}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {children}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={onSave}>
                Save and continue later
              </Button>
              <Button onClick={onNext} disabled={isNextDisabled}>
                {currentStep === totalSteps ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormField({
  label,
  children,
  required = false,
  tooltip,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  tooltip?: string
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 p-0">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <span className="sr-only">Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </div>
  )
}
