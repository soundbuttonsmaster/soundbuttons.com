"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackButton() {
  return (
    <Button
      variant="ghost"
      type="button"
      className="flex items-center gap-2 px-6 w-full sm:w-auto"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  )
}
