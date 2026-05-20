'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from './cn'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex items-center gap-1 border-b border-sand', className)}
    {...rest}
  />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'px-4 py-2 text-body-sm font-sans font-semibold text-slate transition-colors duration-state',
      'hover:text-ink',
      'data-[state=active]:text-ink data-[state=active]:border-b-2 data-[state=active]:border-ink data-[state=active]:-mb-px',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm',
      className,
    )}
    {...rest}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-6 focus-visible:outline-none', className)}
    {...rest}
  />
))
TabsContent.displayName = 'TabsContent'
