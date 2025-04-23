import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SearchSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
              <Skeleton className="h-9 w-[180px]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {[1, 2].map((group) => (
        <div key={group} className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <Card key={card}>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-4">
                    <div>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <Skeleton className="h-6 w-24 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 