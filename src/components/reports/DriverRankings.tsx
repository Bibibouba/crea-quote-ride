
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DriverRankingsProps {
  data: any;
  period: string;
}

export const DriverRankings = ({ data, period }: DriverRankingsProps) => {
  if (!data?.drivers?.length) return null;

  // Sort drivers by different metrics
  const sortByDistance = [...(data.drivers || [])].sort((a, b) => 
    (b.totalDistance || 0) - (a.totalDistance || 0)
  );

  const sortByRides = [...(data.drivers || [])].sort((a, b) =>
    (b.numberOfRides || 0) - (a.numberOfRides || 0)
  );

  const sortByRevenue = [...(data.drivers || [])].sort((a, b) =>
    (b.totalRevenue || 0) - (a.totalRevenue || 0)
  );

  const periodLabel = {
    week: 'de la semaine',
    month: 'du mois',
    year: 'de l\'année'
  }[period];

  return (
    <div className="grid gap-4">
      <Card className={cn("bg-[#E3F2FD]/15", "dark:bg-blue-950/20")}>
        <CardHeader>
          <CardTitle>Classement {periodLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Par distance parcourue</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Distance totale</TableHead>
                    <TableHead>Moyenne par course</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortByDistance.map((driver, index) => (
                    <TableRow key={driver.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{driver.company_name || `${driver.first_name} ${driver.last_name}`}</TableCell>
                      <TableCell>{driver.totalDistance?.toFixed(1)} km</TableCell>
                      <TableCell>
                        {driver.numberOfRides ? (driver.totalDistance / driver.numberOfRides).toFixed(1) : 0} km
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Par nombre de courses</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Nombre de courses</TableHead>
                    <TableHead>Moyenne par jour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortByRides.map((driver, index) => (
                    <TableRow key={driver.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{driver.company_name || `${driver.first_name} ${driver.last_name}`}</TableCell>
                      <TableCell>{driver.numberOfRides}</TableCell>
                      <TableCell>
                        {(driver.numberOfRides / (period === 'week' ? 7 : period === 'month' ? 30 : 365)).toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Par chiffre d'affaires</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>CA total</TableHead>
                    <TableHead>Moyenne par course</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortByRevenue.map((driver, index) => (
                    <TableRow key={driver.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{driver.company_name || `${driver.first_name} ${driver.last_name}`}</TableCell>
                      <TableCell>
                        {driver.totalRevenue?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </TableCell>
                      <TableCell>
                        {driver.numberOfRides
                          ? (driver.totalRevenue / driver.numberOfRides).toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                            })
                          : '0 €'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
