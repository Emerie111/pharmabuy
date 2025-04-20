import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Cross, MessageSquare, Pill, BookOpen, AlertCircle } from "lucide-react"

export default function PharmAssistPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">PharmAssist</h1>
          <p className="text-gray-500">Your pharmaceutical information assistant</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Cross className="h-5 w-5 mr-2 text-emerald-600" />
            Medical Information Assistant
          </CardTitle>
          <CardDescription>Ask questions about medications, treatments, and pharmaceutical information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Ask a question about medications or treatments..." className="pl-9 pr-4" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Pill className="h-3 w-3 mr-1" />
              What are contraindications for ciprofloxacin?
            </Button>
            <Button variant="outline" size="sm">
              <Pill className="h-3 w-3 mr-1" />
              How should amoxicillin be stored?
            </Button>
            <Button variant="outline" size="sm">
              <Pill className="h-3 w-3 mr-1" />
              What are the side effects of metformin?
            </Button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
              <p className="text-gray-700 font-medium mb-2">Medical assistant feature coming soon</p>
              <p className="text-sm text-gray-500 mb-4">
                Our AI-powered pharmaceutical assistant will help answer your medication questions
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 inline-block text-left">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-amber-800 text-sm">Always consult healthcare professionals for medical advice</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
              Drug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">Access comprehensive information about pharmaceutical products</p>
            <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Drug database coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-emerald-600" />
              Interaction Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">Check for potential drug interactions between medications</p>
            <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Interaction checker coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
