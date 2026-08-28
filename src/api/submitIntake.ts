export type IntakeFormData = {
  fullName: string;
  dob: string;
  nationality: string;
  phone: string;
  company: string;
  symptoms: string[];
  symptomNotes: string;
  conditions: string;
  medications: string;
  allergies: string;
  surgeries: string;
  jobType: string;
  hoursPerWeek: string;
  physicalDemand: string;
  exposures: string[];
};

export type IntakeResponse = {
  id: number;
  fullName: string;
  dob: string | null;
  nationality: string | null;
  phone: string | null;
  company: string | null;
  symptoms: string[];
  symptomNotes: string | null;
  conditions: string | null;
  medications: string | null;
  allergies: string | null;
  surgeries: string | null;
  jobType: string | null;
  hoursPerWeek: number | null;
  physicalDemand: string | null;
  exposures: string[];
  createdAt: string;
};

type ErrorResponse = {
  error?: unknown;
};

const INTAKE_ENDPOINT = "http://localhost:3001/api/intake";

const responseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as ErrorResponse;
    if (typeof body.error === "string" && body.error.trim().length > 0) {
      return body.error;
    }
  } catch {
    // Fall through to the generic HTTP status message below.
  }

  return `Request failed with status ${response.status}`;
};

export const submitIntake = async (formData: IntakeFormData): Promise<IntakeResponse> => {
  const response = await fetch(INTAKE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error(await responseErrorMessage(response));
  }

  return (await response.json()) as IntakeResponse;
};
