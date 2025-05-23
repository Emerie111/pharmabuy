"use client"

import { Button } from "@/components/ui/button"
import SellerDashboardLayout from "@/components/layouts/seller-dashboard-layout"
import SellerQuickStats from "@/components/seller/seller-quick-stats"
import RecentOrdersWidget from "@/components/seller/recent-orders-widget"
import InventorySummaryWidget from "@/components/seller/inventory-summary-widget"
import AnalyticsSnapshotWidget from "@/components/seller/analytics-snapshot-widget"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SellerDashboardPage() {
  const { user, isLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [supplierName, setSupplierName] = useState<string>("Valued Supplier");
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  
  // Fetch supplier data using email address with normalization
  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!user) {
        setDebugMessage("No authenticated user found");
        return;
      }

      if (!user.email) {
        setDebugMessage("User has no email address");
        return;
      }
      
      const normalizedEmail = user.email.toLowerCase();
      
      setIsLoadingSupplier(true);
      try {
        setDebugMessage(`Attempting to fetch supplier with normalized email: ${normalizedEmail}`);
        
        // Get all suppliers (limited to avoid large datasets)
        const { data: allSuppliers, error: suppliersError } = await supabase
          .from('suppliers')
          .select('id, name, email')
        
        if (suppliersError) {
          console.error("Error fetching suppliers:", suppliersError);
          setDebugMessage(`Error fetching suppliers: ${suppliersError.message}`);
          throw suppliersError;
        }
        
        console.log("All suppliers:", allSuppliers);
        
        // Find a supplier with a case-insensitive match
        const matchingSupplier = allSuppliers.find(
          supplier => supplier.email && supplier.email.toLowerCase() === normalizedEmail
        );
        
        if (matchingSupplier) {
          console.log("Found matching supplier by normalized email:", matchingSupplier);
          setSupplierName(matchingSupplier.name);
          setDebugMessage(null); // Clear debug message on success
          return;
        } else {
          console.log("No supplier found with normalized email:", normalizedEmail);
          setDebugMessage(`No supplier found matching email: ${user.email}`);
        }
      } catch (error: any) {
        console.error('Error fetching supplier data:', error);
        setDebugMessage(`Error: ${error.message}`);
      } finally {
        setIsLoadingSupplier(false);
      }
    };
    
    fetchSupplierData();
  }, [user]);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <SellerDashboardLayout>
      <div className="p-6 space-y-6">
        {debugMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Debug Info</AlertTitle>
            <AlertDescription>{debugMessage}</AlertDescription>
          </Alert>
        )}
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-green-800">
                  {getGreeting()}, {isLoading || isLoadingSupplier ? "..." : supplierName}
                </h1>
                <p className="text-green-600 mt-1">
                  Welcome to your PharmaBuy supplier dashboard
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 text-green-700">
                <Clock className="h-4 w-4 mr-1" />
                <span>{currentTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <SellerQuickStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentOrdersWidget />
          <InventorySummaryWidget />
        </div>

        <AnalyticsSnapshotWidget />

        <div className="flex justify-end">
          <Button variant="outline">View All Reports</Button>
        </div>
      </div>
    </SellerDashboardLayout>
  )
}
