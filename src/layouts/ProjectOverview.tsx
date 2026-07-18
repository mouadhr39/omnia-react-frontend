import Base from "@/layouts/Base"

import { ChartRadialGrid } from "@/components/chart/chart.tsx"
import { TableDemo } from "@/components/table/table"

import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

export const ProjectOverview: React.FC = () => {
  return (
    <Base>
      <div className="h-screen flex-1 overflow-y-auto">
        <div className="flex flex-row gap-4 overflow-y-auto p-4">
          <ChartRadialGrid />

          <ChartRadialGrid />
          <Card className="m-4 flex flex-col p-4">
            <CardHeader className="items-center pb-0">
              <CardTitle>Radial Chart - Grid</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <TableDemo />
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                Trending up by 5.2% this month
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>

        <Card className="m-4 flex flex-col p-4">
          <CardHeader className="items-center pb-0">
            <CardTitle>Radial Chart - Grid</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <TableDemo />
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </Base>
  )
}
