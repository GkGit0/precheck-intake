import en from "./en.json";
import zh from "./zh.json";
import vi from "./vi.json";
import id from "./id.json";

// To add a language: create src/locales/<code>.json (copy en.json as a template),
// then import it here and add it to this object. No other code changes are needed.
export const locales = { en, zh, vi, id };

export type LangCode = keyof typeof locales;
export type Strings = (typeof locales)[LangCode];

export const langCodes = Object.keys(locales) as LangCode[];
