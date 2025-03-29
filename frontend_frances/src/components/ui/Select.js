"use client"

import React, { useState } from "react"

export const Select = ({ children, value, onValueChange, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")

  const handleSelect = (value) => {
    setSelectedValue(value)
    onValueChange(value)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <SelectTrigger onClick={() => setIsOpen(!isOpen)} value={selectedValue} placeholder={placeholder} />
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, {
              onSelect: handleSelect,
            })
          })}
        </SelectContent>
      )}
    </div>
  )
}

export const SelectTrigger = ({ onClick, value, placeholder }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span>{value || placeholder}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

export const SelectContent = ({ children }) => {
  return (
    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-base shadow-lg focus:outline-none sm:text-sm">
      <div className="p-1">{children}</div>
    </div>
  )
}

export const SelectItem = ({ value, children, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(value)}
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      {children}
    </div>
  )
}

