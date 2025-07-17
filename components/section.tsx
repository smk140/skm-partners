"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * A simple wrapper around a &lt;section&gt; that forwards props and class names.
 * Allows us to keep semantic markup while attaching Tailwind classes easily.
 */
export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn(className)} {...props}>
      {children}
    </section>
  )
}

export default Section
