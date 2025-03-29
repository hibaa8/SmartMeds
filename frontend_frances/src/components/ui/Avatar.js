import React from "react"

export const Avatar = ({ className = "", ...props }) => {
  return <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props} />
}

export const AvatarImage = React.forwardRef(({ className = "", ...props }, ref) => {
  return <img ref={ref} className={`aspect-square h-full w-full ${className}`} {...props} />
})
AvatarImage.displayName = "AvatarImage"

export const AvatarFallback = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-900 ${className}`}
      {...props}
    />
  )
})
AvatarFallback.displayName = "AvatarFallback"

