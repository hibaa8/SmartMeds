export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Error getting user from localStorage:", error)
    return null
  }
}

export const storeUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user))
  } catch (error) {
    console.error("Error storing user in localStorage:", error)
  }
}

export const removeStoredUser = () => {
  try {
    localStorage.removeItem("user")
  } catch (error) {
    console.error("Error removing user from localStorage:", error)
  }
}

export const getToken = () => {
  return localStorage.getItem("token")
}

export const storeToken = (token) => {
  localStorage.setItem("token", token)
}

export const removeToken = () => {
  localStorage.removeItem("token")
}

