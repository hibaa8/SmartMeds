import { format, formatDistanceToNow } from "date-fns"

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return format(date, "MMM dd, yyyy")
  } catch (error) {
    return "Invalid date"
  }
}

export const formatRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return "Unknown"
  }
}

