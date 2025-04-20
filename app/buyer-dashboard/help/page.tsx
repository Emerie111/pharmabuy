import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, HelpCircle, FileText, MessageSquare, Phone, Mail } from "lucide-react"

export default function HelpCenterPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Help Center</h1>
          <p className="text-gray-500">Find answers and get support</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search for help articles, FAQs, or topics..." className="pl-9 pr-4" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-emerald-600" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "How do I verify a product's authenticity?",
                  "What payment methods are accepted?",
                  "How do I track my order?",
                  "What is PharmCredit and how does it work?",
                  "How do I return a product?",
                ].map((question, index) => (
                  <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                    <Button variant="link" className="h-auto p-0 justify-start text-left">
                      <span>{question}</span>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: "Order Management", icon: FileText },
                    { title: "Product Verification", icon: HelpCircle },
                    { title: "Shipping & Delivery", icon: Phone },
                    { title: "Payment Options", icon: Mail },
                  ].map((topic, index) => (
                    <Button key={index} variant="outline" className="justify-start h-auto py-3">
                      <topic.icon className="h-4 w-4 mr-2" />
                      <span>{topic.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="mt-4">
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-6">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 mb-2">User guides and tutorials will appear here</p>
              <p className="text-sm text-gray-400">Step-by-step instructions for using PharmaBuy features</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-emerald-600" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Chat with our support team in real-time</p>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-emerald-600" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Call our dedicated support line</p>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  +234 (0) 123 456 7890
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-emerald-600" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Send us an email and we'll respond within 24 hours</p>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  support@pharmabuy.com
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
