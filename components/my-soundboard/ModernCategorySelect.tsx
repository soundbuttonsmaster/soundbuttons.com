"use client"

import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryOption {
  id: number
  name: string
  children?: CategoryOption[]
}

interface ModernCategorySelectProps {
  options: CategoryOption[]
  value: number
  onValueChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ModernCategorySelect({
  options,
  value,
  onValueChange,
  placeholder = "Select a category",
  disabled = false,
  className,
}: ModernCategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<CategoryOption | null>(null)
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0, openUp: false })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const findOption = (cats: CategoryOption[], targetId: number): CategoryOption | null => {
      for (const cat of cats) {
        if (cat.id === targetId) return cat
        if (cat.children) {
          const found = findOption(cat.children, targetId)
          if (found) return found
        }
      }
      return null
    }
    setSelectedOption(findOption(options, value) ?? null)
  }, [value, options])

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const openUp = spaceBelow < 220 && rect.top > 220
      setDropdownStyle({
        top: openUp ? rect.top : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        openUp,
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => setIsOpen(false)
    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true)
    }
    return () => window.removeEventListener("scroll", handleScroll, true)
  }, [isOpen])

  const handleSelect = (option: CategoryOption) => {
    onValueChange(option.id)
    setIsOpen(false)
  }

  const renderOptions = (cats: CategoryOption[], level = 0) =>
    cats.map((category) => (
      <React.Fragment key={category.id}>
        <button
          type="button"
          onClick={() => handleSelect(category)}
          className={cn(
            "flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
            value === category.id && "bg-accent text-accent-foreground",
            level > 0 && "pl-6"
          )}
        >
          <span className="truncate flex-1">{category.name}</span>
          {value === category.id && <Check className="h-4 w-4 shrink-0" />}
        </button>
        {category.children?.length ? renderOptions(category.children, level + 1) : null}
      </React.Fragment>
    ))

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed z-[9999] max-h-[280px] overflow-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-lg"
      style={{
        top: dropdownStyle.top,
        left: dropdownStyle.left,
        width: dropdownStyle.width,
        transform: dropdownStyle.openUp ? "translateY(-100%)" : undefined,
      }}
    >
      <div className="p-1">
        {options.length === 0 ? (
          <div className="p-2 text-center text-muted-foreground text-sm">
            No categories available
          </div>
        ) : (
          renderOptions(options)
        )}
      </div>
    </div>
  )

  return (
    <div className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 shrink-0", isOpen && "rotate-180")} />
      </button>
      {mounted && isOpen && createPortal(dropdownContent, document.body)}
    </div>
  )
}
