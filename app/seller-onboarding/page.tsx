"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Info, Upload, X, Plus, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OnboardingLayout, { FormField } from "@/components/onboarding-layout"

export default function SellerOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessType: "",
    specializations: [] as string[],
    licenseNumber: "",
    documents: [] as File[],
  })
  const [errors, setErrors] = useState({
    businessType: false,
    specializations: false,
    licenseNumber: false,
    documents: false,
  })

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      const newErrors = {
        businessType: !formData.businessType,
        specializations: formData.specializations.length === 0,
        licenseNumber: !formData.licenseNumber,
        documents: formData.documents.length === 0,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      router.push("/seller-dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    // In a real app, this would save the current progress
    alert("Progress saved! You can continue later.")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newDocuments = [...formData.documents, e.target.files[0]]
      setFormData({
        ...formData,
        documents: newDocuments,
      })
      setErrors({
        ...errors,
        documents: false,
      })
    }
  }

  const removeDocument = (index: number) => {
    const newDocuments = [...formData.documents]
    newDocuments.splice(index, 1)
    setFormData({
      ...formData,
      documents: newDocuments,
    })
    if (newDocuments.length === 0) {
      setErrors({
        ...errors,
        documents: true,
      })
    }
  }

  const toggleSpecialization = (value: string) => {
    const currentSpecializations = [...formData.specializations]
    if (currentSpecializations.includes(value)) {
      const newSpecializations = currentSpecializations.filter((item) => item !== value)
      setFormData({
        ...formData,
        specializations: newSpecializations,
      })
      setErrors({
        ...errors,
        specializations: newSpecializations.length === 0,
      })
    } else {
      const newSpecializations = [...currentSpecializations, value]
      setFormData({
        ...formData,
        specializations: newSpecializations,
      })
      setErrors({
        ...errors,
        specializations: false,
      })
    }
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={3}
      title="Business Verification"
      description="We need to verify your business details to ensure compliance with pharmaceutical regulations."
      estimatedTime="10-15 minutes"
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={handleNext}
      onSave={handleSave}
      isNextDisabled={
        currentStep === 1 &&
        (!formData.businessType ||
          formData.specializations.length === 0 ||
          !formData.licenseNumber ||
          formData.documents.length === 0)
      }
    >
      {currentStep === 1 && (
        <div>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Business verification is required to ensure all sellers meet regulatory requirements and maintain the
              integrity of our marketplace.
            </AlertDescription>
          </Alert>

          <FormField
            label="Business Type"
            required
            tooltip="Select the option that best describes your pharmaceutical business"
          >
            <RadioGroup
              value={formData.businessType}
              onValueChange={(value) => {
                setFormData({ ...formData, businessType: value })
                setErrors({ ...errors, businessType: false })
              }}
              className="space-y-3"
            >
              <div
                className={`flex items-center space-x-2 rounded-md border p-3 ${errors.businessType ? "border-red-500" : ""}`}
              >
                <RadioGroupItem value="manufacturer" id="manufacturer" />
                <Label htmlFor="manufacturer" className="flex-1 cursor-pointer">
                  <div className="font-medium">Manufacturer</div>
                  <div className="text-sm text-gray-500">Companies that produce pharmaceutical products</div>
                </Label>
              </div>
              <div
                className={`flex items-center space-x-2 rounded-md border p-3 ${errors.businessType ? "border-red-500" : ""}`}
              >
                <RadioGroupItem value="distributor" id="distributor" />
                <Label htmlFor="distributor" className="flex-1 cursor-pointer">
                  <div className="font-medium">Distributor</div>
                  <div className="text-sm text-gray-500">Companies that distribute pharmaceutical products</div>
                </Label>
              </div>
              <div
                className={`flex items-center space-x-2 rounded-md border p-3 ${errors.businessType ? "border-red-500" : ""}`}
              >
                <RadioGroupItem value="wholesaler" id="wholesaler" />
                <Label htmlFor="wholesaler" className="flex-1 cursor-pointer">
                  <div className="font-medium">Wholesaler</div>
                  <div className="text-sm text-gray-500">Companies that sell pharmaceutical products in bulk</div>
                </Label>
              </div>
            </RadioGroup>
            {errors.businessType && <p className="text-red-500 text-sm mt-1">Please select your business type</p>}
          </FormField>

          <FormField
            label="Product Specializations"
            required
            tooltip="Select all product categories that your business specializes in"
          >
            <div className={`grid grid-cols-2 gap-3 ${errors.specializations ? "border-red-500" : ""}`}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="general"
                  checked={formData.specializations.includes("general")}
                  onCheckedChange={() => toggleSpecialization("general")}
                />
                <Label htmlFor="general">General</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="antibiotics"
                  checked={formData.specializations.includes("antibiotics")}
                  onCheckedChange={() => toggleSpecialization("antibiotics")}
                />
                <Label htmlFor="antibiotics">Antibiotics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cardiac"
                  checked={formData.specializations.includes("cardiac")}
                  onCheckedChange={() => toggleSpecialization("cardiac")}
                />
                <Label htmlFor="cardiac">Cardiac</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dermatology"
                  checked={formData.specializations.includes("dermatology")}
                  onCheckedChange={() => toggleSpecialization("dermatology")}
                />
                <Label htmlFor="dermatology">Dermatology</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oncology"
                  checked={formData.specializations.includes("oncology")}
                  onCheckedChange={() => toggleSpecialization("oncology")}
                />
                <Label htmlFor="oncology">Oncology</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vaccines"
                  checked={formData.specializations.includes("vaccines")}
                  onCheckedChange={() => toggleSpecialization("vaccines")}
                />
                <Label htmlFor="vaccines">Vaccines</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="supplies"
                  checked={formData.specializations.includes("supplies")}
                  onCheckedChange={() => toggleSpecialization("supplies")}
                />
                <Label htmlFor="supplies">Medical Supplies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={formData.specializations.includes("other")}
                  onCheckedChange={() => toggleSpecialization("other")}
                />
                <Label htmlFor="other">Other</Label>
              </div>
            </div>
            {errors.specializations && (
              <p className="text-red-500 text-sm mt-1">Please select at least one specialization</p>
            )}
          </FormField>

          <FormField
            label="Business License/Authorization Number"
            required
            tooltip="Your pharmaceutical business license or authorization number"
          >
            <Input
              placeholder="Enter your business license number"
              value={formData.licenseNumber}
              onChange={(e) => {
                setFormData({ ...formData, licenseNumber: e.target.value })
                setErrors({ ...errors, licenseNumber: false })
              }}
              className={errors.licenseNumber ? "border-red-500" : ""}
            />
            {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">License number is required</p>}
          </FormField>

          <FormField
            label="Business Documents"
            required
            tooltip="Upload all relevant business licenses, certifications, and authorizations"
          >
            <div
              className={`border-2 border-dashed rounded-md p-6 ${errors.documents ? "border-red-500" : "border-gray-300"}`}
            >
              <div className="space-y-4">
                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center mr-2">
                            <span className="text-blue-600 text-xs">DOC</span>
                          </div>
                          <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    {formData.documents.length === 0
                      ? "Drag and drop your business documents, or click to browse"
                      : "Add more documents"}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">Supported formats: PDF, JPG, PNG (Max 10MB per file)</p>
                  <Input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="document-upload" asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      {formData.documents.length === 0 ? "Select Files" : "Add More Files"}
                    </Button>
                  </Label>
                </div>
              </div>
              {errors.documents && <p className="text-red-500 text-sm mt-1">Please upload at least one document</p>}
            </div>
          </FormField>

          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Verification typically takes 2-3 business days. You'll be notified by email once your account is approved.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Business Details</h3>

          <FormField label="Company Name" required>
            <Input placeholder="Enter your company's legal name" />
          </FormField>

          <FormField label="Year Established" tooltip="Year your company was founded">
            <Input type="number" placeholder="e.g., 2005" />
          </FormField>

          <FormField label="Business Address" required>
            <Input placeholder="Street address" className="mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" />
              <Input placeholder="State/Province" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input placeholder="Postal/ZIP Code" />
              <Input placeholder="Country" />
            </div>
          </FormField>

          <FormField label="Tax Identification Number" required tooltip="Your business tax ID number">
            <Input placeholder="Enter tax ID number" />
          </FormField>

          <FormField label="Website" tooltip="Your company's official website">
            <Input placeholder="https://www.example.com" />
          </FormField>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Product & Distribution Information</h3>

          <FormField label="Number of Products" tooltip="Approximate number of products you plan to list">
            <Input type="number" placeholder="e.g., 50" />
          </FormField>

          <FormField label="Distribution Regions" tooltip="Areas where you can distribute products">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Checkbox id="region-north" className="mr-2" />
                <Label htmlFor="region-north">North America</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="region-south" className="mr-2" />
                <Label htmlFor="region-south">South America</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="region-europe" className="mr-2" />
                <Label htmlFor="region-europe">Europe</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="region-asia" className="mr-2" />
                <Label htmlFor="region-asia">Asia</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="region-africa" className="mr-2" />
                <Label htmlFor="region-africa">Africa</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="region-oceania" className="mr-2" />
                <Label htmlFor="region-oceania">Australia/Oceania</Label>
              </div>
            </div>
          </FormField>

          <FormField label="Shipping Capabilities" tooltip="Select all that apply">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Checkbox id="shipping-standard" className="mr-2" />
                <Label htmlFor="shipping-standard">Standard Shipping</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="shipping-express" className="mr-2" />
                <Label htmlFor="shipping-express">Express Shipping</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="shipping-cold" className="mr-2" />
                <Label htmlFor="shipping-cold">Cold Chain</Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="shipping-hazardous" className="mr-2" />
                <Label htmlFor="shipping-hazardous">Hazardous Materials</Label>
              </div>
            </div>
          </FormField>

          <FormField label="Additional Information">
            <textarea
              className="w-full border rounded-md p-2 h-24"
              placeholder="Any additional information about your business or products"
            ></textarea>
          </FormField>

          <Alert className="mt-6 bg-green-50 border-green-200">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              You're almost done! After submission, our team will review your information within 2-3 business days.
              You'll receive limited access to the platform while verification is in progress.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </OnboardingLayout>
  )
}
