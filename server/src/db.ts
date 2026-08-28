import { createClient, type Client, type Row } from "@libsql/client";

const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoDatabaseUrl || !tursoAuthToken) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required");
}

let dbPromise: Promise<Client> | null = null;

const getDatabase = async (): Promise<Client> => {
  dbPromise ??= Promise.resolve(
    createClient({
      url: tursoDatabaseUrl,
      authToken: tursoAuthToken,
      intMode: "number"
    })
  ).then(async (database) => {
    await database.executeMultiple(`
      CREATE TABLE IF NOT EXISTS intake_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        dob TEXT,
        nationality TEXT,
        phone TEXT,
        company TEXT,
        symptoms TEXT NOT NULL DEFAULT '[]',
        symptom_notes TEXT,
        conditions TEXT,
        medications TEXT,
        allergies TEXT,
        surgeries TEXT,
        job_type TEXT,
        hours_per_week INTEGER,
        physical_demand TEXT,
        exposures TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    return database;
  });

  return dbPromise;
};

export type IntakePayload = {
  fullName?: unknown;
  dob?: unknown;
  nationality?: unknown;
  phone?: unknown;
  company?: unknown;
  symptoms?: unknown;
  symptomNotes?: unknown;
  conditions?: unknown;
  medications?: unknown;
  allergies?: unknown;
  surgeries?: unknown;
  jobType?: unknown;
  hoursPerWeek?: unknown;
  physicalDemand?: unknown;
  exposures?: unknown;
};

type IntakeRow = {
  id: number;
  full_name: string;
  dob: string | null;
  nationality: string | null;
  phone: string | null;
  company: string | null;
  symptoms: string;
  symptom_notes: string | null;
  conditions: string | null;
  medications: string | null;
  allergies: string | null;
  surgeries: string | null;
  job_type: string | null;
  hours_per_week: number | null;
  physical_demand: string | null;
  exposures: string;
  created_at: string;
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

const textOrNull = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const requiredText = (value: unknown): string | null => {
  const text = textOrNull(value);
  return text && text.length <= 255 ? text : null;
};

const stringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
};

const integerOrNull = (value: unknown): number | null => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isInteger(numberValue) ? numberValue : null;
};

const parseArray = (value: string): string[] => {
  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
};

const intakeRow = (row: Row): IntakeRow => ({
  id: Number(row.id),
  full_name: String(row.full_name),
  dob: row.dob === null ? null : String(row.dob),
  nationality: row.nationality === null ? null : String(row.nationality),
  phone: row.phone === null ? null : String(row.phone),
  company: row.company === null ? null : String(row.company),
  symptoms: String(row.symptoms),
  symptom_notes: row.symptom_notes === null ? null : String(row.symptom_notes),
  conditions: row.conditions === null ? null : String(row.conditions),
  medications: row.medications === null ? null : String(row.medications),
  allergies: row.allergies === null ? null : String(row.allergies),
  surgeries: row.surgeries === null ? null : String(row.surgeries),
  job_type: row.job_type === null ? null : String(row.job_type),
  hours_per_week: row.hours_per_week === null ? null : Number(row.hours_per_week),
  physical_demand: row.physical_demand === null ? null : String(row.physical_demand),
  exposures: String(row.exposures),
  created_at: String(row.created_at)
});

const toResponse = (row: Row): IntakeResponse => {
  const intake = intakeRow(row);

  return {
    id: intake.id,
    fullName: intake.full_name,
    dob: intake.dob,
    nationality: intake.nationality,
    phone: intake.phone,
    company: intake.company,
    symptoms: parseArray(intake.symptoms),
    symptomNotes: intake.symptom_notes,
    conditions: intake.conditions,
    medications: intake.medications,
    allergies: intake.allergies,
    surgeries: intake.surgeries,
    jobType: intake.job_type,
    hoursPerWeek: intake.hours_per_week,
    physicalDemand: intake.physical_demand,
    exposures: parseArray(intake.exposures),
    createdAt: intake.created_at
  };
};

const selectColumns = `
  id,
  full_name,
  dob,
  nationality,
  phone,
  company,
  symptoms,
  symptom_notes,
  conditions,
  medications,
  allergies,
  surgeries,
  job_type,
  hours_per_week,
  physical_demand,
  exposures,
  created_at
`;

export const createIntakeResponse = async (payload: IntakePayload): Promise<IntakeResponse | null> => {
  const fullName = requiredText(payload.fullName);
  if (!fullName) {
    return null;
  }

  const db = await getDatabase();
  const result = await db.execute({
    sql: `
      INSERT INTO intake_responses (
        full_name,
        dob,
        nationality,
        phone,
        company,
        symptoms,
        symptom_notes,
        conditions,
        medications,
        allergies,
        surgeries,
        job_type,
        hours_per_week,
        physical_demand,
        exposures
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING ${selectColumns}
    `,
    args: [
      fullName,
      textOrNull(payload.dob),
      textOrNull(payload.nationality),
      textOrNull(payload.phone),
      textOrNull(payload.company),
      JSON.stringify(stringArray(payload.symptoms)),
      textOrNull(payload.symptomNotes),
      textOrNull(payload.conditions),
      textOrNull(payload.medications),
      textOrNull(payload.allergies),
      textOrNull(payload.surgeries),
      textOrNull(payload.jobType),
      integerOrNull(payload.hoursPerWeek),
      textOrNull(payload.physicalDemand),
      JSON.stringify(stringArray(payload.exposures))
    ]
  });
  const row = result.rows[0];

  return row ? toResponse(row) : null;
};

export const getIntakeResponse = async (id: number): Promise<IntakeResponse | null> => {
  const db = await getDatabase();
  const result = await db.execute({
    sql: `
      SELECT ${selectColumns}
      FROM intake_responses
      WHERE id = ?
    `,
    args: [id]
  });
  const row = result.rows[0];

  return row ? toResponse(row) : null;
};
