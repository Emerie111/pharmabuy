"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BioequivalenceDetailsProps {
  data: {
    referenceProduct: {
      name: string
      manufacturer: string
    }
    testProduct: {
      name: string
      manufacturer: string
    }
    testingInfo: {
      authority: string
      date: string
      certificateNumber: string
    }
    metrics: {
      auc: {
        test: number
        reference: number
        ratio: number
        confidenceInterval: [number, number]
        result: "PASS" | "FAIL"
      }
      cmax: {
        test: number
        reference: number
        ratio: number
        confidenceInterval: [number, number]
        result: "PASS" | "FAIL"
      }
      tmax: {
        test: number
        reference: number
      }
    }
    status: "BIOEQUIVALENT" | "NOT BIOEQUIVALENT" | "PENDING"
  }
}

export function BioequivalenceDetails({ data }: BioequivalenceDetailsProps) {
  return (
    <div className="space-y-6 bg-white rounded-lg border shadow-sm">
      {/* Status Banner */}
      <div className={`p-4 rounded-t-lg flex items-center justify-between ${
        data.status === "BIOEQUIVALENT" ? "bg-green-50" : 
        data.status === "NOT BIOEQUIVALENT" ? "bg-red-50" : "bg-yellow-50"
      }`}>
        <div className="flex items-center gap-2">
          {data.status === "BIOEQUIVALENT" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : data.status === "NOT BIOEQUIVALENT" ? (
            <AlertCircle className="h-5 w-5 text-red-600" />
          ) : (
            <HelpCircle className="h-5 w-5 text-yellow-600" />
          )}
          <span className="font-medium">
            {data.status === "BIOEQUIVALENT" ? "Bioequivalent to Reference Product" :
             data.status === "NOT BIOEQUIVALENT" ? "Not Bioequivalent" : "Pending Assessment"}
          </span>
        </div>
        <Badge className={`uppercase ${
          data.status === "BIOEQUIVALENT" ? "bg-green-100 text-green-800" :
          data.status === "NOT BIOEQUIVALENT" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
        }`} variant={
          data.status === "BIOEQUIVALENT" ? "default" :
          data.status === "NOT BIOEQUIVALENT" ? "destructive" : "default"
        }>
          {data.status}
        </Badge>
      </div>

      <div className="px-6 py-4">
        {/* Product Comparison */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Reference Product</h4>
              <p className="font-medium">{data.referenceProduct.name}</p>
              <p className="text-gray-500 text-sm">{data.referenceProduct.manufacturer}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Test Product</h4>
              <p className="font-medium">{data.testProduct.name}</p>
              <p className="text-gray-500 text-sm">{data.testProduct.manufacturer}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Testing Authority</h4>
              <p className="font-medium">{data.testingInfo.authority}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Test Date</h4>
              <p className="font-medium">{data.testingInfo.date}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Certificate Number</h4>
              <p className="font-medium">{data.testingInfo.certificateNumber}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-6">
          {/* AUC Metric */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between items-start p-4">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-2 text-left">
                      <h4 className="font-medium">Area Under Curve (AUC)</h4>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">AUC measures the total drug exposure over time</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-gray-500">Measures total drug absorption</p>
              </div>
              <Badge className={data.metrics.auc.result === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} 
                variant={data.metrics.auc.result === "PASS" ? "default" : "destructive"}>
                {data.metrics.auc.result}
              </Badge>
            </div>
            
            <div className="px-4 pb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Ratio: {data.metrics.auc.ratio}%</span>
                <span className="text-gray-500">Target: 80-125%</span>
              </div>
              <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`absolute h-full ${
                    data.metrics.auc.ratio >= 80 && data.metrics.auc.ratio <= 125 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.max((data.metrics.auc.ratio / 150) * 100, 0), 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">CI: {data.metrics.auc.confidenceInterval[0]}-{data.metrics.auc.confidenceInterval[1]}%</span>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Test: {data.metrics.auc.test} μg·h/mL</span>
                  <span>Reference: {data.metrics.auc.reference} μg·h/mL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cmax Metric */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between items-start p-4">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-2 text-left">
                      <h4 className="font-medium">Maximum Concentration (Cmax)</h4>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Cmax indicates the peak concentration of the drug in blood</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-gray-500">Peak blood concentration</p>
              </div>
              <Badge className={data.metrics.cmax.result === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                variant={data.metrics.cmax.result === "PASS" ? "default" : "destructive"}>
                {data.metrics.cmax.result}
              </Badge>
            </div>
            
            <div className="px-4 pb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Ratio: {data.metrics.cmax.ratio}%</span>
                <span className="text-gray-500">Target: 80-125%</span>
              </div>
              <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`absolute h-full ${
                    data.metrics.cmax.ratio >= 80 && data.metrics.cmax.ratio <= 125 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.max((data.metrics.cmax.ratio / 150) * 100, 0), 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">CI: {data.metrics.cmax.confidenceInterval[0]}-{data.metrics.cmax.confidenceInterval[1]}%</span>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Test: {data.metrics.cmax.test} μg/mL</span>
                  <span>Reference: {data.metrics.cmax.reference} μg/mL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tmax Comparison */}
          <div className="border rounded-lg overflow-hidden p-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2 text-left">
                  <h4 className="font-medium">Time to Peak (Tmax)</h4>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Time taken to reach maximum concentration</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Test Product</p>
                <p className="font-medium">{data.metrics.tmax.test} hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference Product</p>
                <p className="font-medium">{data.metrics.tmax.reference} hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Understanding Bioequivalence</h4>
          <p className="text-sm text-gray-600">
            Bioequivalence ensures that generic medications deliver the same active ingredient 
            at the same rate and extent as the original brand-name drug. A product is considered 
            bioequivalent when key metrics (AUC and Cmax) fall within 80-125% of the reference 
            product, with 90% confidence.
          </p>
        </div>
      </div>
    </div>
  )
} 