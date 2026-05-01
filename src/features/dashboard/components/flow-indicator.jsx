"use client"

import { motion } from "framer-motion"
import { Link2, Activity, Search, Lightbulb, Zap, ChevronRight } from "lucide-react"
import { cn } from "@/utils/utils"

const flowSteps = [
  { id: "connect", label: "Connect", icon: Link2, description: "Link cloud accounts" },
  { id: "monitor", label: "Monitor", icon: Activity, description: "Track spending" },
  { id: "detect", label: "Detect", icon: Search, description: "Find anomalies" },
  { id: "explain", label: "Explain", icon: Lightbulb, description: "Understand causes" },
  { id: "optimize", label: "Optimize", icon: Zap, description: "Reduce costs" },
]

export function FlowIndicator({ currentStep = "monitor", compact = false }) {
  const currentIndex = flowSteps.findIndex((s) => s.id === currentStep)

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {flowSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <span className={cn(
              "px-2 py-0.5 rounded-full transition-colors",
              index <= currentIndex ? "bg-primary/10 text-primary font-medium" : "bg-muted"
            )}>
              {step.label}
            </span>
            {index < flowSteps.length - 1 && (
              <ChevronRight className="w-3 h-3 mx-0.5 text-muted-foreground/50" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-4"
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        {flowSteps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentIndex
          const isComplete = index < currentIndex

          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg flex-1 min-w-0 transition-all",
                isActive && "bg-primary/10 border border-primary/20",
                isComplete && "opacity-70",
                !isActive && !isComplete && "opacity-40"
              )}>
                <div className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                  isActive && "bg-primary text-primary-foreground",
                  isComplete && "bg-success/20 text-success",
                  !isActive && !isComplete && "bg-muted text-muted-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                </div>
              </div>
              {index < flowSteps.length - 1 && (
                <div className={cn(
                  "w-6 h-0.5 flex-shrink-0 mx-1",
                  index < currentIndex ? "bg-success/50" : "bg-border"
                )} />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export function FlowIndicatorMinimal({ currentStep = "monitor" }) {
  const currentIndex = flowSteps.findIndex((s) => s.id === currentStep)

  return (
    <div className="hidden md:flex items-center gap-1">
      {flowSteps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentIndex
        const isComplete = index < currentIndex

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
                isActive && "bg-primary/10 text-primary",
                isComplete && "text-success",
                !isActive && !isComplete && "text-muted-foreground/50"
              )}
              title={step.description}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className={cn("hidden lg:inline", isActive && "font-medium")}>{step.label}</span>
            </div>
            {index < flowSteps.length - 1 && (
              <ChevronRight className={cn("w-3 h-3", index < currentIndex ? "text-success/50" : "text-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}
