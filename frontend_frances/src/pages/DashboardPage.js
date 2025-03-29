import { medicationService } from '../services/api';

const handleAddMedication = async (medicationData) => {
  try {
    const response = await medicationService.addMedication(medicationData);
    if (response.id) {
      // Refresh medications list
      const medications = await medicationService.getMedications();
      setMedications(medications);
    }
  } catch (error) {
    console.error('Error adding medication:', error);
    // Handle error (show message to user)
  }
};

const handleDeleteMedication = async (medicationId) => {
  try {
    await medicationService.deleteMedication(medicationId);
    // Refresh medications list
    const medications = await medicationService.getMedications();
    setMedications(medications);
  } catch (error) {
    console.error('Error deleting medication:', error);
    // Handle error (show message to user)
  }
};

useEffect(() => {
  const fetchMedications = async () => {
    try {
      const medications = await medicationService.getMedications();
      setMedications(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      // Handle error (show message to user)
    }
  };
  fetchMedications();
}, []); 