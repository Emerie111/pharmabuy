import SignupForm from "@/components/signup-form"

export default function Home() {
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
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                About
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Contact
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Support
              </a>
            </div>
          </div>
        </header>

        <main className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <SignupForm />
          </div>

          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="text-center md:text-left mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Connect, Trade, Thrive</h2>
              <p className="text-lg text-gray-600 mb-6">
                Join PharmaBuy, the leading B2B pharmaceutical marketplace connecting pharmacies, hospitals,
                manufacturers, and distributors in one secure platform.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <span className="text-gray-700">Verified suppliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <span className="text-gray-700">Secure transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <span className="text-gray-700">Compliance focused</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Pharmaceutical marketplace illustration"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
