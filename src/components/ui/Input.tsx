"use client"
import * as React from "react"

import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/Label"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const input = (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
          error ? "border-red-500 focus-visible:ring-red-500" : "hover:border-turquoise",
          className
        )}
        ref={ref}
        {...props}
      />
    )

    if (label || error) {
      return (
        <div className="space-y-2 w-full">
          {label && <Label htmlFor={props.id} className={error ? "text-red-500" : "text-black"}>{label}</Label>}
          {input}
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
      )
    }

    return input
  }
)
Input.displayName = "Input"

export { Input }
