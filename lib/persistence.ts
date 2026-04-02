// Persistence layer — uses Supabase when configured, falls back to localStorage
import { supabase } from "./supabaseClient";
import type { Project, Section, Message } from "./types";

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjects(userId: string): Promise<Project[]> {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Project[];
  }
  // localStorage fallback
  try {
    const v = localStorage.getItem("bp_projects");
    return v ? JSON.parse(v) : [];
  } catch { return []; }
}

export async function saveProject(project: Project, userId: string): Promise<void> {
  if (supabase && userId) {
    const { error } = await supabase
      .from("projects")
      .upsert({ ...project, user_id: userId }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return;
  }
  // localStorage fallback
  try {
    const existing: Project[] = JSON.parse(localStorage.getItem("bp_projects") ?? "[]");
    const idx = existing.findIndex(p => p.id === project.id);
    if (idx >= 0) existing[idx] = project; else existing.unshift(project);
    localStorage.setItem("bp_projects", JSON.stringify(existing));
  } catch {}
}

export async function deleteProject(projectId: string, userId: string): Promise<void> {
  if (supabase && userId) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return;
  }
  try {
    const existing: Project[] = JSON.parse(localStorage.getItem("bp_projects") ?? "[]");
    localStorage.setItem("bp_projects", JSON.stringify(existing.filter(p => p.id !== projectId)));
  } catch {}
}

// ── Sections ──────────────────────────────────────────────────────────────────

export async function getSections(projectId: string): Promise<Section[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as Section[];
  }
  try {
    const v = localStorage.getItem(`bp_sections_${projectId}`);
    return v ? JSON.parse(v) : [];
  } catch { return []; }
}

export async function saveSections(projectId: string, sections: Section[]): Promise<void> {
  if (supabase) {
    const rows = sections.map(s => ({ ...s, project_id: projectId }));
    const { error } = await supabase
      .from("sections")
      .upsert(rows, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return;
  }
  try {
    localStorage.setItem(`bp_sections_${projectId}`, JSON.stringify(sections));
  } catch {}
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function getMessages(projectId: string): Promise<Message[]> {
  try {
    const v = localStorage.getItem(`bp_messages_${projectId}`);
    return v ? JSON.parse(v) : [];
  } catch { return []; }
}

export async function saveMessages(projectId: string, messages: Message[]): Promise<void> {
  try {
    localStorage.setItem(`bp_messages_${projectId}`, JSON.stringify(messages));
  } catch {}
}

// ── Legacy object export (keeps any other import sites working) ───────────────
export const persistence = {
  getProjects,
  saveProject,
  deleteProject,
  getSections,
  saveSections,
  getMessages,
  saveMessages,
  // kept for backward compat — callers that used saveProjects(array) should migrate
  async saveProjects(projects: Project[], userId: string): Promise<void> {
    await Promise.all(projects.map(p => saveProject(p, userId)));
  },
};
