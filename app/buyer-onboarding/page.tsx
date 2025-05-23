"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Info, Upload, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OnboardingLayout, { FormField } from "@/components/onboarding-layout"
import { supabase } from "@/lib/supabase"

export default function BuyerOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    profession: "",
    licenseNumber: "",
    licenseFile: null as File | null,
    // Step 2 data
    businessName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    // Step 3 data
    contactName: "",
    phoneNumber: "",
    email: "",
    website: "",
  })
  const [errors, setErrors] = useState({
    profession: false,
    licenseNumber: false,
    licenseFile: false,
    businessName: false,
    address: false,
    city: false,
    state: false,
    country: false,
    contactName: false,
    phoneNumber: false,
    email: false,
  })
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1) {
      const newErrors = {
        ...errors,
        profession: !formData.profession,
        licenseNumber: !formData.licenseNumber,
        licenseFile: !formData.licenseFile,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
    } else if (currentStep === 2) {
      const newErrors = {
        ...errors,
        businessName: !formData.businessName,
        address: !formData.address,
        city: !formData.city,
        state: !formData.state,
        country: !formData.country,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
    } else if (currentStep === 3) {
      const newErrors = {
        ...errors,
        contactName: !formData.contactName,
        phoneNumber: !formData.phoneNumber,
        email: !formData.email,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
      
      // Complete onboarding
      setIsSubmitting(true)
      setApiError(null)
      
      try {
        // Format full address
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`
        
        // Get user info from Auth
        const { data: userData } = await supabase.auth.getUser()
        if (!userData?.user) {
          throw new Error("User not authenticated")
        }
        
        // Create healthcare provider data
        const providerData = {
          name: formData.contactName,
          profession: formData.profession,
          license_number: formData.licenseNumber,
          business_name: formData.businessName,
          address: fullAddress,
          phone: formData.phoneNumber,
          email: formData.email,
          website: formData.website || null,
        }
        
        // Submit to API
        const response = await fetch("/api/healthcare-providers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(providerData),
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || "Failed to complete onboarding")
        }
        
        // Redirect to dashboard after successful creation
        router.push("/healthcare-provider-dashboard")
      } catch (error) {
        console.error("Onboarding completion error:", error)
        setApiError(error instanceof Error ? error.message : "Failed to complete onboarding")
      } finally {
        setIsSubmitting(false)
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
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
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
    
    if (field in errors) {
      setErrors({
        ...errors,
        [field]: false,
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
      isNextDisabled={
        (currentStep === 1 && (!formData.profession || !formData.licenseNumber || !formData.licenseFile)) ||
        (currentStep === 3 && isSubmitting)
      }
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
              onValueChange={(value) => handleInputChange("profession", value)}
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
              onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
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
            <Input 
              placeholder="Enter your pharmacy or hospital name" 
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              className={errors.businessName ? "border-red-500" : ""}
            />
            {errors.businessName && <p className="text-red-500 text-sm mt-1">Business name is required</p>}
          </FormField>

          <FormField label="Business Address" required>
            <Input 
              placeholder="Street address" 
              className={`mb-2 ${errors.address ? "border-red-500" : ""}`}
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">Address is required</p>}
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input 
                  placeholder="City" 
                  className={errors.city ? "border-red-500" : ""}
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">City is required</p>}
              </div>
              <div>
                <Input 
                  placeholder="State/Province" 
                  className={errors.state ? "border-red-500" : ""}
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">State is required</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input 
                placeholder="Postal/ZIP Code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
              />
              <div>
                <Input 
                  placeholder="Country" 
                  className={errors.country ? "border-red-500" : ""}
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">Country is required</p>}
              </div>
            </div>
          </FormField>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>

          <FormField label="Contact Person" required>
            <Input 
              placeholder="Full name of primary contact" 
              value={formData.contactName}
              onChange={(e) => handleInputChange("contactName", e.target.value)}
              className={errors.contactName ? "border-red-500" : ""}
            />
            {errors.contactName && <p className="text-red-500 text-sm mt-1">Contact name is required</p>}
          </FormField>

          <FormField label="Phone Number" required>
            <Input 
              placeholder="Business phone number" 
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">Phone number is required</p>}
          </FormField>

          <FormField label="Email Address" required>
            <Input 
              type="email" 
              placeholder="Business email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
          </FormField>

          <FormField label="Website" tooltip="Your business website (if available)">
            <Input 
              placeholder="https://www.example.com" 
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </FormField>

          {apiError && (
            <Alert className="mt-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Error: {apiError}
              </AlertDescription>
            </Alert>
          )}

          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              After submission, your information will be verified within 24-48 hours. You'll receive an email confirmation once your account is approved.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </OnboardingLayout>
  )
}
