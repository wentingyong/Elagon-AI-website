import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityConfigured = Boolean(projectId);
export const client = sanityConfigured ? createClient({ projectId, dataset, apiVersion, useCdn: true, token: process.env.SANITY_API_READ_TOKEN }) : null;

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!client) return fallback;
  try { return await client.fetch<T>(query, params, { next: { revalidate: 60 } }); }
  catch { return fallback; }
}
