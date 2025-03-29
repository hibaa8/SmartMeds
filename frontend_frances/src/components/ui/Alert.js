import React from "react"

export const Alert = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    destructive: "bg-red-100 text-red-900",
    warning: "bg-yellow-100 text-yellow-900",
    success: "bg-green-100 text-green-900",
  }

  const variantStyle = variants[variant] || variants.default

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${variantStyle} ${className}`}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

export const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5 ref={ref} className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props} />
))
AlertTitle.displayName = "AlertTitle"

export const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
))
AlertDescription.displayName = "AlertDescription"

