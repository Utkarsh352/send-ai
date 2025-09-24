import * as React from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps {
  className?: string;
}

export function DatePickerWithRange({ className }: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        id="date"
        variant={"outline"}
        className={cn(
          "w-[300px] justify-start text-left font-normal",
          className
        )}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Select date range
      </Button>
    </div>
  )
}