"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Info, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import OnboardingLayout, { FormField } from "@/components/onboarding-layout"
import { supabase } from "@/lib/supabase"

// Add a dynamic directive for explicit clarity
export const dynamic = 'force-dynamic'

export default function SupplierOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    businessType: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    foundedYear: "",
    phoneNumber: "",
    productSpecType: "general",
    specificProductSpec: "",
    deliveryCapability: "",
  })
  const [errors, setErrors] = useState({
    businessType: false,
    companyName: false,
    address: false,
    city: false,
    state: false,
    foundedYear: false,
    phoneNumber: false,
    productSpecType: false,
    specificProductSpec: false,
    deliveryCapability: false,
  })
  const [apiError, setApiError] = useState<React.ReactNode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if the user is authenticated and get their email on component mount
  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session in SupplierOnboarding...")
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log("Session from client:", session ? "Found" : "Not found")
      
      if (!session) {
        // Redirect to login if not authenticated
        console.log("No session found, redirecting to /signin")
        router.push("/signin")
        return
      }
      
      // Store user email for later use - handle type safely
      if (session.user && session.user.email) {
        setUserEmail(session.user.email)
        console.log("User email set:", session.user.email)
      }
    }
    
    checkSession()
  }, [router])

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = localStorage.getItem('supplierOnboardingData')
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setFormData(parsedData)
        } catch (error) {
          console.error('Error loading saved data:', error)
        }
      }
    }
    loadSavedData()
  }, [])

  // Save data whenever form changes
  useEffect(() => {
    localStorage.setItem('supplierOnboardingData', JSON.stringify(formData))
  }, [formData])

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1) {
      const newErrors = {
        ...errors,
        businessType: !formData.businessType,
        specificProductSpec: formData.productSpecType === "specific" && !formData.specificProductSpec.trim(),
        deliveryCapability: !formData.deliveryCapability,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
    } else if (currentStep === 2) {
      const newErrors = {
        ...errors,
        companyName: !formData.companyName,
        address: !formData.address,
        city: !formData.city,
        state: !formData.state,
        foundedYear: !formData.foundedYear,
        phoneNumber: !formData.phoneNumber,
      }

      setErrors(newErrors)

      if (Object.values(newErrors).some(Boolean)) {
        return
      }
      
      // Complete onboarding
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
        
        // Get user info
        const { data: userData } = await supabase.auth.getUser()
        if (!userData?.user) {
          throw new Error("Please log in again to continue")
        }
        
        // Create supplier data object
        const supplierData = {
          user_id: userData.user.id,
          name: formData.companyName,
          description: `${formData.companyName} is a ${formData.businessType} of pharmaceutical products${formData.productSpecType === "specific" ? ` specializing in ${formData.specificProductSpec}` : ""}.`,
          logo: logoUrl,
          address: fullAddress,
          phone: formData.phoneNumber,
          email: userEmail,
          founded_year: parseInt(formData.foundedYear) || new Date().getFullYear(),
          certifications: [], // You could collect this in another step
          product_spec_type: formData.productSpecType,
          product_categories: formData.productSpecType === "specific" ? [formData.specificProductSpec] : [],
          delivery_capability: formData.deliveryCapability,
        }
        
        console.log("Submitting supplier data:", supplierData)
        
        // Submit to API
        const response = await fetch("/api/suppliers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify(supplierData),
        })
        
        console.log("API response status:", response.status)
        
        const result = await response.json()
        console.log("API response body:", result)
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error("Authentication error:", result)
            throw new Error("Your session has expired. Please log in again.")
          } else if (response.status === 403) {
            console.error("Authorization error:", result)
            throw new Error("You are not authorized as a supplier. Please contact support.")
          } else {
            console.error("API error:", result)
            throw new Error(result.error || "Failed to complete onboarding. Please try again.")
          }
        }
        
        // Clear saved data after successful submission
        localStorage.removeItem('supplierOnboardingData')
        
        // Redirect to dashboard after successful creation
        router.push("/supplier-dashboard")
      } catch (error) {
        console.error("Onboarding completion error:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to complete onboarding. Please try again."
        
        // Create error message with appropriate action link
        let errorContent: React.ReactNode = errorMessage
        if (errorMessage.includes("log in")) {
          errorContent = (
            <div className="flex items-center gap-2">
              <span>{errorMessage}</span>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-800"
                onClick={() => router.push("/signin")}
              >
                Click here to sign in
              </Button>
            </div>
          )
        } else if (errorMessage.includes("contact support")) {
          errorContent = (
            <div className="flex items-center gap-2">
              <span>{errorMessage}</span>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-800"
                onClick={() => window.location.href = "mailto:support@pharmamarketplace.com"}
              >
                Contact Support
              </Button>
            </div>
          )
        }
        
        setApiError(errorContent)
      } finally {
        setIsSubmitting(false)
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    // Save current progress to localStorage
    localStorage.setItem('supplierOnboardingData', JSON.stringify(formData))
    alert("Progress saved! You can continue later.")
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
          (formData.productSpecType === "specific" && !formData.specificProductSpec.trim()) ||
          !formData.deliveryCapability)) ||
        (currentStep === 2 && isSubmitting)
      }
    >
      {currentStep === 1 && (
        <div>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Business verification is required to ensure all suppliers meet regulatory requirements and maintain the
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
            label="Product Specification"
            required
            tooltip="Select how you want to specify your product categories"
          >
            <RadioGroup
              value={formData.productSpecType}
              onValueChange={(value) => {
                setFormData({ ...formData, productSpecType: value })
                setErrors({ ...errors, productSpecType: false })
              }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general" className="flex-1 cursor-pointer">
                  <div className="font-medium">General Categories</div>
                  <div className="text-sm text-gray-500">We stock products across multiple categories</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific" className="flex-1 cursor-pointer">
                  <div className="font-medium">Specific Category</div>
                  <div className="text-sm text-gray-500">We focus on a specific category of products</div>
                </Label>
              </div>
            </RadioGroup>
          </FormField>

          {formData.productSpecType === "specific" && (
            <FormField
              label="Specific Category"
              required
              tooltip="Enter your specific product category"
            >
              <Input
                placeholder="e.g., Vaccines, Foreign Medications, Supplements"
                value={formData.specificProductSpec}
                onChange={(e) => {
                  setFormData({ ...formData, specificProductSpec: e.target.value })
                  setErrors({ ...errors, specificProductSpec: false })
                }}
                className={errors.specificProductSpec ? "border-red-500" : ""}
              />
              {errors.specificProductSpec && <p className="text-red-500 text-sm mt-1">Please enter your specific category</p>}
            </FormField>
          )}

          <FormField
            label="Delivery Capability"
            required
            tooltip="Select how your business handles product delivery"
          >
            <RadioGroup
              value={formData.deliveryCapability}
              onValueChange={(value) => {
                setFormData({ ...formData, deliveryCapability: value })
                setErrors({ ...errors, deliveryCapability: false })
              }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="inhouse" id="inhouse" />
                <Label htmlFor="inhouse" className="flex-1 cursor-pointer">
                  <div className="font-medium">In-house Delivery</div>
                  <div className="text-sm text-gray-500">We have our own delivery fleet and logistics team</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="outsourced" id="outsourced" />
                <Label htmlFor="outsourced" className="flex-1 cursor-pointer">
                  <div className="font-medium">Outsourced Delivery</div>
                  <div className="text-sm text-gray-500">We work with third-party logistics providers</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="flex-1 cursor-pointer">
                  <div className="font-medium">No Delivery Service</div>
                  <div className="text-sm text-gray-500">We currently don't provide delivery, but can arrange it through a delivery service</div>
                </Label>
              </div>
            </RadioGroup>
            {errors.deliveryCapability && <p className="text-red-500 text-sm mt-1">Please select a delivery option</p>}
          </FormField>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Company Information</h3>

          <FormField label="Company Name" required>
            <Input
              placeholder="Enter your company's legal name"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">Company name is required</p>}
          </FormField>

          <FormField label="Street Address" required>
            <Input
              placeholder="Enter your business address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">Address is required</p>}
          </FormField>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label="City" required>
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">City is required</p>}
            </FormField>

            <FormField label="State/Province" required>
              <Input
                placeholder="State/Province"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">State is required</p>}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Year Founded" required>
              <Input
                placeholder="e.g., 2010"
                value={formData.foundedYear}
                onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                className={errors.foundedYear ? "border-red-500" : ""}
              />
              {errors.foundedYear && <p className="text-red-500 text-sm mt-1">Year founded is required</p>}
            </FormField>

            <FormField label="Phone Number" required tooltip="Your business phone number for healthcare providers to contact you">
              <Input
                placeholder="Business phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">Phone number is required</p>}
            </FormField>
          </div>

          {apiError && (
            <Alert className="mt-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {apiError}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </OnboardingLayout>
  )
} 