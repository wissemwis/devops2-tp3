import type { Cours } from "@/lib/cours";

// Jeton d'identification du client auprès de l'API
const API_TOKEN = "strapi_7f3c9a1e5b2d4f6a8c0e1b3d5f7a9c2e4b6d8f0a1c3e5b7d";

type StrapiCours = Omit<Cours, "topics" | "summary"> & { summary?: string | null; topics?: unknown };

function baseUrl(): string {
  return process.env.STRAPI_URL ?? "http://localhost:1337";
}

function headers(): HeadersInit {
  return { "X-Client-Token": API_TOKEN };
}

// Un champ JSON vide ou mal saisi dans Strapi ne doit pas casser l'affichage
function toCours(raw: StrapiCours): Cours {
  return {
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
    summary: raw.summary ?? null,
    session: raw.session,
    duration: raw.duration,
    level: raw.level,
    topics: Array.isArray(raw.topics) ? raw.topics.filter((t): t is string => typeof t === "string") : [],
  };
}

export async function getCours(): Promise<Cours[]> {
  const res = await fetch(`${baseUrl()}/api/courses?sort=session:asc&pagination[pageSize]=100`, {
    headers: headers(),
  });
  if (!res.ok) {
    throw new Error(`Strapi a répondu ${res.status}`);
  }
  const json: { data: StrapiCours[] } = await res.json();
  return json.data.map(toCours);
}

export async function getCoursById(documentId: string): Promise<Cours | null> {
  const res = await fetch(`${baseUrl()}/api/courses/${encodeURIComponent(documentId)}`, {
    headers: headers(),
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Strapi a répondu ${res.status}`);
  }
  const json: { data: StrapiCours } = await res.json();
  return toCours(json.data);
}
