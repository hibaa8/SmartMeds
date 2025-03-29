const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-green-600 text-white",
    secondary: "bg-gray-100 text-gray-900",
    outline: "text-gray-900 border border-gray-200",
    destructive: "bg-red-600 text-white",
  }

  const variantStyle = variants[variant] || variants.default

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge

