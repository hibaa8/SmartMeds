export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return re.test(password)
}

export const validateMedicationForm = (formData) => {
  const errors = {}

  if (!formData.name.trim()) {
    errors.name = "Medication name is required"
  }

  if (!formData.dosage.trim()) {
    errors.dosage = "Dosage is required"
  }

  if (!formData.frequency.trim()) {
    errors.frequency = "Frequency is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

