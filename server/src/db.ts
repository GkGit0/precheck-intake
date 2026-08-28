import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDbPath = join(__dirname, "..", "data", "intake.sqlite");
const dbPath = process.env.DATABASE_URL ?? defaultDbPath;

mkdirSync(dirname(dbPath), { recursive: true });

let dbPromise: Promise<Database> | null = null;

const getDatabase = async (): Promise<Database> => {
  dbPromise ??= open({
    filename: dbPath,
    driver: sqlite3.Database
  }).then(async (database) => {
    await database.exec(`
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

const toResponse = (row: IntakeRow): IntakeResponse => ({
  id: row.id,
  fullName: row.full_name,
  dob: row.dob,
  nationality: row.nationality,
  phone: row.phone,
  company: row.company,
  symptoms: parseArray(row.symptoms),
  symptomNotes: row.symptom_notes,
  conditions: row.conditions,
  medications: row.medications,
  allergies: row.allergies,
  surgeries: row.surgeries,
  jobType: row.job_type,
  hoursPerWeek: row.hours_per_week,
  physicalDemand: row.physical_demand,
  exposures: parseArray(row.exposures),
  createdAt: row.created_at
});

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
  const row = await db.get<IntakeRow>(
    `
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
  );

  return row ? toResponse(row) : null;
};

export const getIntakeResponse = async (id: number): Promise<IntakeResponse | null> => {
  const db = await getDatabase();
  const row = await db.get<IntakeRow>(
    `
    SELECT ${selectColumns}
    FROM intake_responses
    WHERE id = ?
  `,
    id
  );

  return row ? toResponse(row) : null;
};
