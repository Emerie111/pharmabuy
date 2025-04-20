import VerificationTool from "@/components/marketplace/verification-tool"

export default function VerificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NAFDAC Verification</h1>
        <p className="text-gray-600 mt-2">Verify the authenticity of pharmaceutical products before purchase</p>
      </div>

      <VerificationTool />
    </div>
  )
}
