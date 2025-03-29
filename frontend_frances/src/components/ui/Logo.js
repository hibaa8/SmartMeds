const Logo = ({ className = "", size = "medium" }) => {
  const sizes = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  }

  const sizeClass = sizes[size] || sizes.medium

  return (
    <svg
      className={`${sizeClass} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Leaf shape with three sections */}
      <path
        d="M50 10 L80 50 L50 90 L20 50 Z"
        fill="#90C290"
        className="transition-colors"
      />
      <path
        d="M20 50 L50 10 L50 50 Z"
        fill="#2D572C"
        className="transition-colors"
      />
      <path
        d="M50 50 L50 90 L80 50 Z"
        fill="#458B44"
        className="transition-colors"
      />
    </svg>
  )
}

export default Logo 