"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface AccordionContextValue {
  openItem: string | null
  setOpenItem: (value: string | null) => void
  collapsible: boolean
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  type?: "single"
  collapsible?: boolean
  children: React.ReactNode
  className?: string
}

export function Accordion({
  type = "single",
  collapsible = true,
  children,
  className,
}: AccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null)
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem, collapsible }}>
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = React.createContext<{ value: string } | null>(null)

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({
  value,
  children,
  className,
}: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        className={cn("border-b border-border", className)}
        data-value={value}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const ctx = React.useContext(AccordionContext)
  const parent = React.useContext(AccordionItemContext)
  if (!ctx || !parent) return null
  const isOpen = ctx.openItem === parent.value
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between py-4 text-left text-lg font-semibold transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => {
        ctx.setOpenItem(isOpen && ctx.collapsible ? null : parent.value)
      }}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const ctx = React.useContext(AccordionContext)
  const parent = React.useContext(AccordionItemContext)
  if (!ctx || !parent) return null
  const isOpen = ctx.openItem === parent.value
  if (!isOpen) return null
  return (
    <div className={cn("overflow-hidden pb-4 pt-0 text-sm", className)}>
      {children}
    </div>
  )
}
