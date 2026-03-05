import type { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { ProjectRecord } from "@/lib/types/project";
import type { NormalizedProjectInput } from "@/lib/validators/project";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const TABLE_CANDIDATES = ["Project", "projects"] as const;

function isMissingRelation(error: PostgrestError | null) {
  if (!error) return false;
  return error.code === "42P01" || /relation .* does not exist/i.test(error.message);
}

async function withProjectsTable<T>(
  runner: (table: (typeof TABLE_CANDIDATES)[number]) => Promise<PostgrestSingleResponse<T>>,
) {
  let lastError: PostgrestError | null = null;

  for (const table of TABLE_CANDIDATES) {
    const result = await runner(table);
    if (!result.error) {
      return { data: result.data, error: null as PostgrestError | null };
    }

    if (isMissingRelation(result.error)) {
      lastError = result.error;
      continue;
    }

    return result;
  }

  return { data: null as T | null, error: lastError };
}

export async function listProjects(order: "public" | "admin" = "public") {
  const supabase = getSupabaseAdmin();
  const orderColumn = order === "admin" ? "updatedAt" : "createdAt";

  const { data, error } = await withProjectsTable<ProjectRecord[]>(async (table) => {
    return supabase
      .from(table)
      .select("*")
      .order("featured", { ascending: false })
      .order(orderColumn, { ascending: false });
  });

  return { data: data ?? [], error };
}

export async function getProjectBySlug(slug: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await withProjectsTable<ProjectRecord | null>(async (table) => {
    return supabase.from(table).select("*").eq("slug", slug).maybeSingle();
  });

  return { data, error };
}

export async function getProjectById(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await withProjectsTable<ProjectRecord | null>(async (table) => {
    return supabase.from(table).select("*").eq("id", id).maybeSingle();
  });

  return { data, error };
}

export async function slugExists(slug: string, excludeId?: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await withProjectsTable<{ id: string } | null>(async (table) => {
    let query = supabase.from(table).select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    return query.limit(1).maybeSingle();
  });

  return { exists: !!data, error };
}

export async function createProject(input: NormalizedProjectInput) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await withProjectsTable<ProjectRecord | null>(async (table) => {
    return supabase.from(table).insert(input).select("*").single();
  });

  return { data, error };
}

export async function updateProject(id: string, input: NormalizedProjectInput) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await withProjectsTable<ProjectRecord | null>(async (table) => {
    return supabase.from(table).update(input).eq("id", id).select("*").maybeSingle();
  });

  return { data, error };
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseAdmin();
  let lastError: PostgrestError | null = null;

  for (const table of TABLE_CANDIDATES) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) return { error: null };
    if (isMissingRelation(error)) {
      lastError = error;
      continue;
    }
    return { error };
  }

  return { error: lastError };
}
