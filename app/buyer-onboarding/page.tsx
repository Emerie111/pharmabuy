"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Info, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OnboardingLayout, { FormField } from "@/components/onboarding-layout"

export default function BuyerOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    profession: "",
    licenseNumber: "",
    licenseFile: null,
  })
  const [errors, setErrors] = useState({
    profession: false,
    licenseNumber: false,
    licenseFile: false,
  })

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      const newErrors = {
        profession: !formData.profession,
        licenseNumber: !formData.licenseNumber,
        licenseFile: !formData.licenseFile,
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
      router.push("/buyer-dashboard")
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
      setFormData({
        ...formData,
        licenseFile: e.target.files[0],
      })
      setErrors({
        ...errors,
        licenseFile: false,
      })
    }
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={3}
      title="Professional Verification"
      description="We need to verify your professional credentials to ensure compliance with pharmaceutical regulations."
      estimatedTime="5-10 minutes"
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={handleNext}
      onSave={handleSave}
      isNextDisabled={currentStep === 1 && (!formData.profession || !formData.licenseNumber || !formData.licenseFile)}
    >
      {currentStep === 1 && (
        <div>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Verification is required to comply with pharmaceutical regulations and ensure the integrity of our
              marketplace.
            </AlertDescription>
          </Alert>

          <FormField
            label="Professional Role"
            required
            tooltip="Select the role that best describes your position within your organization"
          >
            <Select
              value={formData.profession}
              onValueChange={(value) => {
                setFormData({ ...formData, profession: value })
                setErrors({ ...errors, profession: false })
              }}
            >
              <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="hospital-admin">Hospital Administrator</SelectItem>
                <SelectItem value="clinic-manager">Clinic Manager</SelectItem>
                <SelectItem value="procurement-officer">Procurement Officer</SelectItem>
                <SelectItem value="medical-director">Medical Director</SelectItem>
              </SelectContent>
            </Select>
            {errors.profession && <p className="text-red-500 text-sm mt-1">Please select your profession</p>}
          </FormField>

          <FormField
            label="License Number"
            required
            tooltip="Your professional license number issued by your regulatory authority"
          >
            <Input
              placeholder="Enter your license number"
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
            label="License Document"
            required
            tooltip="Upload a clear image or PDF of your professional license"
          >
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center ${errors.licenseFile ? "border-red-500" : "border-gray-300"}`}
            >
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Drag and drop your license document, or click to browse</p>
              <p className="text-xs text-gray-400 mb-4">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
              <Input
                type="file"
                id="license-upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <Label htmlFor="license-upload" asChild>
                <Button variant="outline" size="sm">
                  Select File
                </Button>
              </Label>
              {formData.licenseFile && (
                <p className="text-sm text-green-600 mt-2">File selected: {formData.licenseFile.name}</p>
              )}
              {errors.licenseFile && <p className="text-red-500 text-sm mt-1">Please upload your license document</p>}
            </div>
          </FormField>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Business Information</h3>

          <FormField label="Business Name" required>
            <Input placeholder="Enter your pharmacy or hospital name" />
          </FormField>

          <FormField label="Business Address" required>
            <Input placeholder="Street address" className="mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" />
              <Input placeholder="State/Province" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input placeholder="Postal/ZIP Code" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormField>

          <FormField
            label="Business Registration Number"
            required
            tooltip="Your business tax ID or registration number"
          >
            <Input placeholder="Enter business registration number" />
          </FormField>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Purchasing Preferences</h3>

          <FormField
            label="Primary Product Categories"
            tooltip="Select the categories you're most interested in purchasing"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Input type="checkbox" id="category-general" className="h-4 w-4 mr-2" />
                <Label htmlFor="category-general">General Medications</Label>
              </div>
              <div className="flex items-center">
                <Input type="checkbox" id="category-antibiotics" className="h-4 w-4 mr-2" />
                <Label htmlFor="category-antibiotics">Antibiotics</Label>
              </div>
              <div className="flex items-center">
                <Input type="checkbox" id="category-cardiac" className="h-4 w-4 mr-2" />
                <Label htmlFor="category-cardiac">Cardiac</Label>
              </div>
              <div className="flex items-center">
                <Input type="checkbox" id="category-dermatology" className="h-4 w-4 mr-2" />
                <Label htmlFor="category-dermatology">Dermatology</Label>
              </div>
              <div className="flex items-center">
                <Input type="checkbox" id="category-diabetes" className="h-4 w-4 mr-2" />
                <Label htmlFor="category-diabetes">Diabetes</Label>
              </div>
              <div className="flex items-center">
                <Input type="checkbox" id="category-supplies" className="h-4 w-4 mr-2" />
                <Label htmlFor="category-supplies">Medical Supplies</Label>
              </div>
            </div>
          </FormField>

          <FormField
            label="Estimated Monthly Purchase Volume"
            tooltip="This helps us match you with appropriate suppliers"
          >
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select volume range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Less than $10,000</SelectItem>
                <SelectItem value="medium">$10,000 - $50,000</SelectItem>
                <SelectItem value="large">$50,000 - $100,000</SelectItem>
                <SelectItem value="enterprise">More than $100,000</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Additional Information">
            <textarea
              className="w-full border rounded-md p-2 h-24"
              placeholder="Any specific requirements or information you'd like to share"
            ></textarea>
          </FormField>

          <Alert className="mt-6 bg-green-50 border-green-200">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              You're almost done! After submission, our team will review your information within 1-2 business days.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </OnboardingLayout>
  )
}
