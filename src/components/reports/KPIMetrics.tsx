
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, PieChart, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KPIMetricsProps {
  data: any;
  isLoading: boolean;
}

export const KPIMetrics = ({ data, isLoading }: KPIMetricsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[150px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className={cn("bg-[#E3F2FD]", "dark:bg-blue-950/20")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.totalRevenue?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <p className="text-xs text-muted-foreground">Sur la période sélectionnée</p>
        </CardContent>
      </Card>

      <Card className={cn("bg-[#E8F5E9]", "dark:bg-green-950/20")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de courses</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.numberOfRides}</div>
          <p className="text-xs text-muted-foreground">Courses effectuées</p>
        </CardContent>
      </Card>

      <Card className={cn("bg-[#F3E5F5]", "dark:bg-purple-950/20")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distance totale</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalDistance?.toLocaleString('fr-FR')} km</div>
          <p className="text-xs text-muted-foreground">Kilomètres parcourus</p>
        </CardContent>
      </Card>

      <Card className={cn("bg-[#E0F7FA]", "dark:bg-cyan-950/20")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prix moyen/km</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.avgPricePerKm?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <p className="text-xs text-muted-foreground">Par kilomètre</p>
        </CardContent>
      </Card>
    </div>
  );
};
