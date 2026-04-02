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

export async function createProject(project: Project, userId: string): Promise<void> {
  if (supabase && userId) {
    const { error } = await supabase
      .from("projects")
      .insert({ ...project, user_id: userId });
    if (error) throw new Error(`projects insert failed: ${error.message} (code: ${error.code})`);
    return;
  }
  // localStorage fallback
  try {
    const existing: Project[] = JSON.parse(localStorage.getItem("bp_projects") ?? "[]");
    existing.unshift(project);
    localStorage.setItem("bp_projects", JSON.stringify(existing));
  } catch {}
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
      .insert(rows);
    if (error) throw new Error(`sections insert failed: ${error.message} (code: ${error.code})`);
    return;
  }
  try {
    localStorage.setItem(`bp_sections_${projectId}`, JSON.stringify(sections));
  } catch {}
}

export async function saveSection(section: Section): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from("sections")
      .upsert(section, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return;
  }
  try {
    const v = localStorage.getItem(`bp_sections_${section.project_id}`);
    const existing: Section[] = v ? JSON.parse(v) : [];
    const idx = existing.findIndex(s => s.id === section.id);
    if (idx >= 0) existing[idx] = section; else existing.push(section);
    localStorage.setItem(`bp_sections_${section.project_id}`, JSON.stringify(existing));
  } catch {}
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function getMessages(projectId: string): Promise<Message[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (error) {
      console.warn("getMessages error:", error.message);
      return [];
    }
    return (data ?? []).map((row: any) => ({
      id: row.id,
      project_id: row.project_id,
      role: row.role,
      message: row.message,
      actions: row.actions ?? [],
      createdAt: row.created_at,
    })) as Message[];
  }
  try {
    const v = localStorage.getItem(`bp_messages_${projectId}`);
    return v ? JSON.parse(v) : [];
  } catch { return []; }
}

export async function insertMessage(message: Message): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from("messages")
      .insert({
        id: message.id,
        project_id: message.project_id,
        role: message.role,
        message: message.message,
        actions: message.actions ?? [],
        created_at: message.createdAt,
      });
    if (error) throw new Error(error.message);
    return;
  }
  try {
    const v = localStorage.getItem(`bp_messages_${message.project_id}`);
    const existing: Message[] = v ? JSON.parse(v) : [];
    existing.push(message);
    localStorage.setItem(`bp_messages_${message.project_id}`, JSON.stringify(existing));
  } catch {}
}

export async function saveMessages(projectId: string, messages: Message[]): Promise<void> {
  try {
    localStorage.setItem(`bp_messages_${projectId}`, JSON.stringify(messages));
  } catch {}
}

// ── Legacy object export (keeps any other import sites working) ───────────────
export const persistence = {
  getProjects,
  createProject,
  saveProject,
  deleteProject,
  getSections,
  saveSections,
  saveSection,
  getMessages,
  insertMessage,
  saveMessages,
  // kept for backward compat — callers that used saveProjects(array) should migrate
  async saveProjects(projects: Project[], userId: string): Promise<void> {
    await Promise.all(projects.map(p => saveProject(p, userId)));
  },
};
