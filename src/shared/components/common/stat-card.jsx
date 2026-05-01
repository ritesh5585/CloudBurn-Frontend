"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/shared/components/ui/card"
import { cn } from "@/utils/utils"

const variantClasses = {
  default: "",
  danger: "border-destructive/30 bg-destructive/5",
  warning: "border-warning/30 bg-warning/5",
  success: "border-success/30 bg-success/5",
}

export function StatCard({ icon, label, value, variant = "default", delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={cn(variantClasses[variant], className)}>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
