"use client"

import { Sparkles, TrendingDown, ArrowRight, Server, Database, HardDrive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Progress } from "@/shared/components/ui/progress"
import { aiInsights, formatCurrency } from "@/api/mock-data"

const categoryIcons = {
  compute: Server,
  storage: HardDrive,
  database: Database,
}

export function AIInsightsPanel() {
  const totalSavings = aiInsights.reduce((sum, i) => sum + i.savings, 0)

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          AI Recommendations
        </CardTitle>
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <TrendingDown className="w-3 h-3 mr-1" />
          {formatCurrency(totalSavings)} potential savings
        </Badge>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {aiInsights.map((insight) => {
          const Icon = categoryIcons[insight.category] || Server

          return (
            <div
              key={insight.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant="secondary" className="text-xs h-5">{insight.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Savings</p>
                        <p className="text-sm font-semibold text-success">{formatCurrency(insight.savings)}/mo</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.confidence * 100} className="w-16 h-1.5" />
                          <span className="text-xs font-medium">{Math.round(insight.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                      Apply
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
