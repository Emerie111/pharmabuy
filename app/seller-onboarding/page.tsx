"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Info, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OnboardingLayout, { FormField } from "@/components/onboarding-layout"
import { supabase } from "@/lib/supabase"

export default function SellerOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessType: "",
    specializations: [] as string[],
    companyName: "",
    foundedYear: "",
    address: "",
    city: "",
    state: "",
    phoneNumber: "",
    productCount: "",
  })
  const [errors, setErrors] = useState({
    businessType: false,
    specializations: false,
    companyName: false,
    foundedYear: false,
    address: false,
    city: false,
    state: false,
    phoneNumber: false,
  })
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        // If no session, redirect to login
        router.push('/signin') // Redirect to our new signin page
        return
      }
      
      // Store the email for later use - handle potential undefined
      if (data.session.user?.email) {
        setUserEmail(data.session.user.email)
      }
    }
    
    checkSession()
  }, [router])

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1) {
      const newErrors = {
        ...errors,
        businessType: !formData.businessType,
        specializations: formData.specializations.length === 0,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
      
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 2) {
      const newErrors = {
        ...errors,
        companyName: !formData.companyName,
        foundedYear: !formData.foundedYear,
        address: !formData.address,
        city: !formData.city,
        state: !formData.state,
        phoneNumber: !formData.phoneNumber,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
      
      // Submit the form at step 2 now
      setIsSubmitting(true)
      setApiError(null)
      
      try {
        if (!userEmail) {
          throw new Error("User email not available. Please log in again.")
        }
        
        // Get placeholder logo URL - in a real app, you would upload the actual logo
        const logoUrl = "/placeholder.svg?height=200&width=200&text=" + encodeURIComponent(formData.companyName.substring(0, 2))
        
        // Format address
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}`
        
        // Create supplier data object - use email from the session
        const supplierData = {
          name: formData.companyName,
          description: `${formData.companyName} is a ${formData.businessType} of pharmaceutical products specializing in ${formData.specializations.join(", ")}.`,
          logo: logoUrl,
          address: fullAddress,
          phone: formData.phoneNumber,
          email: userEmail,
          founded_year: parseInt(formData.foundedYear) || new Date().getFullYear(),
          certifications: [], // You could collect this in another step
        }
        
        // Submit to API
        const response = await fetch("/api/suppliers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supplierData),
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || "Failed to complete onboarding")
        }
        
        // Redirect to dashboard after successful creation
        router.push("/seller-dashboard")
      } catch (error) {
        console.error("Onboarding completion error:", error)
        setApiError(error instanceof Error ? error.message : "Failed to complete onboarding")
      } finally {
        setIsSubmitting(false)
      }
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

  const handleInputChange = (field: string, value: string | string[]) => {
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

  const toggleCheckbox = (field: string, value: string) => {
    const currentValues = [...(formData[field as keyof typeof formData] as string[])]
    if (currentValues.includes(value)) {
      handleInputChange(field, currentValues.filter(item => item !== value))
    } else {
      handleInputChange(field, [...currentValues, value])
    }
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={2}
      title="Business Verification"
      description="We need to verify your business details to ensure compliance with pharmaceutical regulations."
      estimatedTime="5-10 minutes"
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={handleNext}
      onSave={handleSave}
      isNextDisabled={
        (currentStep === 1 &&
        (!formData.businessType ||
          formData.specializations.length === 0)) ||
        (currentStep === 2 && isSubmitting)
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
            {errors.businessType && <p className="text-red-500 text-sm mt-1">Please select a business type</p>}
          </FormField>

          <FormField
            label="Product Specializations"
            required
            tooltip="Select all product categories that your company specializes in"
          >
            <div className="space-y-2 mt-1">
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
                  id="pain_management"
                  checked={formData.specializations.includes("pain_management")}
                  onCheckedChange={() => toggleSpecialization("pain_management")}
                />
                <Label htmlFor="pain_management">Pain Management</Label>
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
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Business Details</h3>

          <FormField label="Company Name" required>
            <Input 
              placeholder="Enter your company's legal name" 
              value={formData.companyName}
              onChange={e => handleInputChange("companyName", e.target.value)}
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">Company name is required</p>}
          </FormField>

          <FormField label="Year Established" tooltip="Year your company was founded" required>
            <Input 
              type="number" 
              placeholder="e.g., 2005" 
              value={formData.foundedYear}
              onChange={e => handleInputChange("foundedYear", e.target.value)}
              className={errors.foundedYear ? "border-red-500" : ""}
            />
            {errors.foundedYear && <p className="text-red-500 text-sm mt-1">Year established is required</p>}
          </FormField>

          <FormField label="Business Address" required>
            <Input 
              placeholder="Street address" 
              className={`mb-2 ${errors.address ? "border-red-500" : ""}`}
              value={formData.address}
              onChange={e => handleInputChange("address", e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">Address is required</p>}
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input 
                  placeholder="City" 
                  className={errors.city ? "border-red-500" : ""}
                  value={formData.city}
                  onChange={e => handleInputChange("city", e.target.value)}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">City is required</p>}
              </div>
              <div>
                <Input 
                  placeholder="State/Province" 
                  className={errors.state ? "border-red-500" : ""}
                  value={formData.state}
                  onChange={e => handleInputChange("state", e.target.value)}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">State is required</p>}
              </div>
            </div>
          </FormField>
          
          <FormField label="Phone Number" required tooltip="Your business phone number for buyers to contact you">
            <Input 
              placeholder="e.g., +234 800 123 4567" 
              value={formData.phoneNumber}
              onChange={e => handleInputChange("phoneNumber", e.target.value)}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">Phone number is required</p>}
          </FormField>

          <FormField label="Number of Products" tooltip="Approximate number of products you plan to list">
            <Input 
              type="number" 
              placeholder="e.g., 50" 
              value={formData.productCount}
              onChange={e => handleInputChange("productCount", e.target.value)}
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
        </div>
      )}
    </OnboardingLayout>
  )
}
