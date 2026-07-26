/*import Base from '@/layouts/Base';

import { ChartRadialGrid } from '@/components/chart/chart.tsx';
import { PolarGrid, RadialBar, RadialBarChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResolvedIcon } from '@/lib/iconutils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { TableDemo } from '@/components/table/table';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardAction,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { CreateProjectView } from '@/components/view/CreateProjectView';*/
/*
const MiniCard: React.FC<{}> = () => {
  <Card className="@container/card">
    <CardHeader>
      <CardDescription>Total Revenue</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        $1,250.00
      </CardTitle>
      <CardAction>
        <Badge variant="outline">
          <ResolvedIcon name="IconTrendingDown" className="size-4" />
          +12.5%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        Trending up this month <ResolvedIcon name="Plus" className="size-4" />
      </div>
      <div className="text-muted-foreground">
        Visitors for the last 6 months
      </div>
    </CardFooter>
  </Card>;
};

export const ProjectOverview: React.FC = () => {
 /* const chartData = [
    { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
    { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
  ];
  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    chrome: {
      label: 'Chrome',
      color: 'var(--chart-1)',
    },
    safari: {
      label: 'Safari',
      color: 'var(--chart-2)',
    },
    firefox: {
      label: 'Firefox',
      color: 'var(--chart-3)',
    },
    edge: {
      label: 'Edge',
      color: 'var(--chart-4)',
    },
    other: {
      label: 'Other',
      color: 'var(--chart-5)',
    },
  } satisfies ChartConfig;
  return (
    <Base>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-row items-stretch gap-4 p-4 m-2">
              <Card className="@container/card flex-1/4 m-1">
               <CardHeader>
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    $ ---
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <ResolvedIcon
                        name="TrendingDown"
                        className="size-4"
                      />
                      +0.0%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="w-full">
                  
                </CardContent>
                <CardFooter className="flex w-full flex-1 items-center justify-center">
                  <Button variant="default" size="lg" className="w-full">
                    <ResolvedIcon name="SquarePlus" />{' '}
                    <span>Start new project</span>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="@container/card flex-1/4 m-1">
                <CardHeader>
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    $1,250.00
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <ResolvedIcon
                        name="IconTrendingDown"
                        className="size-4"
                      />
                      +12.5%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Trending up this month{' '}
                    <ResolvedIcon name="Plus" className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Visitors for the last 6 months
                  </div>
                </CardFooter>
              </Card>
              <Card className="@container/card flex-1/4 m-1">
                <CardHeader>
                  <CardDescription>New Customers</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    1,234
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <ResolvedIcon name="IconTrendingDown" />
                      -20%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Down 20% this period{' '}
                    <ResolvedIcon name="IconTrendingDown" className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Acquisition needs attention
                  </div>
                </CardFooter>
              </Card>
                         <Card className="@container/card flex-1/4 m-1">
                <CardHeader>
                  <CardDescription>New Customers</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    1,234
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <ResolvedIcon name="IconTrendingDown" />
                      -20%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Down 20% this period{' '}
                    <ResolvedIcon name="IconTrendingDown" className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Acquisition needs attention
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/*<div className="h-screen flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">
          <div className="flex flex-row gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-1/4">
                <Item variant="outline">
                  <ItemHeader>Start</ItemHeader>
                  <ItemContent>
                    <ItemTitle className="uppercase text-center">Title</ItemTitle>
                    <ItemDescription><span className="cn-font-heading text-lg font-semibold">May 25, 2026</span></ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <ResolvedIcon name="SquarePlus" />
                    </Button>
                  </ItemActions>
                  <ItemFooter>
                    Footer
                  </ItemFooter>
                </Item>
              </div>
            ))}
          </div>
          
            <Card className="flex flex-col justify-center item-center max-w-50">
              
              <CardContent className="flex flex-col justify-center items-center">
                  <Button variant="ghost"><ResolvedIcon name="SquarePlus"></ResolvedIcon></Button>
                  <span>Create New Database</span>
                </CardContent>
                <CardFooter className="">
                  fddf
                </CardFooter>
            </Card>
          
          <div className="flex flex-row gap-4">
              <div className="flex-1/2">
                  <TableDemo />
              </div>
               <div className="flex-1/2">
                  <TableDemo />
              </div>
              
          </div>
        
        </div>
      </div>*}
    </Base>
  );
};*/
