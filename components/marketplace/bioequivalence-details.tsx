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
    <div className="space-y-8">
      {/* Status Banner */}
      <div className={`p-4 rounded-lg flex items-center justify-between ${
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

      {/* Product Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Reference Product</h4>
          <p className="text-lg font-semibold">{data.referenceProduct.name}</p>
          <p className="text-sm text-gray-600">{data.referenceProduct.manufacturer}</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Test Product</h4>
          <p className="text-lg font-semibold">{data.testProduct.name}</p>
          <p className="text-sm text-gray-600">{data.testProduct.manufacturer}</p>
        </div>
      </div>
      
      {/* Testing Authority Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-gray-50 rounded-lg">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Testing Authority</h4>
          <p className="text-base font-medium">{data.testingInfo.authority}</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Test Date</h4>
          <p className="text-base font-medium">{data.testingInfo.date}</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Certificate Number</h4>
          <p className="text-base font-medium">{data.testingInfo.certificateNumber}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-8">
        {/* AUC Metric */}
        <Card className="overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Area Under Curve (AUC)</h4>
              <Badge className={`${
                data.metrics.auc.result === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {data.metrics.auc.result}
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-medium">Ratio: {data.metrics.auc.ratio}%</span>
              <span className="text-gray-500">Target: 80-125%</span>
            </div>
            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
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
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">CI: {data.metrics.auc.confidenceInterval[0]}-{data.metrics.auc.confidenceInterval[1]}%</span>
              <div className="flex gap-6">
                <span className="text-gray-500">Test: {data.metrics.auc.test} μg·h/mL</span>
                <span className="text-gray-500">Reference: {data.metrics.auc.reference} μg·h/mL</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cmax Metric */}
        <Card className="overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Maximum Concentration (Cmax)</h4>
              <Badge className={`${
                data.metrics.cmax.result === "PASS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {data.metrics.cmax.result}
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-medium">Ratio: {data.metrics.cmax.ratio}%</span>
              <span className="text-gray-500">Target: 80-125%</span>
            </div>
            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
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
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">CI: {data.metrics.cmax.confidenceInterval[0]}-{data.metrics.cmax.confidenceInterval[1]}%</span>
              <div className="flex gap-6">
                <span className="text-gray-500">Test: {data.metrics.cmax.test} μg/mL</span>
                <span className="text-gray-500">Reference: {data.metrics.cmax.reference} μg/mL</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tmax Comparison */}
        <Card className="overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Time to Peak (Tmax)</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Time taken to reach maximum concentration</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Test Product</p>
                <p className="text-lg font-medium">{data.metrics.tmax.test} hours</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Reference Product</p>
                <p className="text-lg font-medium">{data.metrics.tmax.reference} hours</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Educational Section */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-medium mb-3">Understanding Bioequivalence</h4>
        <p className="text-sm text-gray-600">
          Bioequivalence ensures that generic medications deliver the same active ingredient 
          at the same rate and extent as the original brand-name drug. A product is considered 
          bioequivalent when key metrics (AUC and Cmax) fall within 80-125% of the reference 
          product, with 90% confidence.
        </p>
      </div>
    </div>
  )
} 