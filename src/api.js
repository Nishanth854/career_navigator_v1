const API_BASE_URL = 'http://127.0.0.1:8001/api/v1';

/**
 * Sends a resume image to the backend for OCR and analysis.
 * Uses FormData for file upload.
 */
export const uploadAndAnalyzeResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to analyze resume');
    }

    return await response.json();
  } catch (error) {
    console.error('OCR Upload Error:', error);
    throw error;
  }
};

/**
 * Sends manual student details (GPA, Skills) to the backend.
 * Uses JSON for the request body.
 */
export const manualValuation = async (studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manual-valuation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gpa: studentData.gpa,
        skills: studentData.skills,
        experience: studentData.experience || ""
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to calculate manual valuation');
    }

    return await response.json();
  } catch (error) {
    console.error('Manual Valuation Error:', error);
    throw error;
  }
};