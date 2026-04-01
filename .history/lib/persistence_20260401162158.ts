// Async persistence abstraction for localStorage (database-ready)
import { Project, Section, Message } from "./types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms)); // for simulating async

export const persistence = {
  async getProjects(): Promise<Project[]> {
    await delay(0);
    try {
      const v = localStorage.getItem("bp_projects");
      return v ? JSON.parse(v) : [];
    } catch { return []; }
  },
  async saveProjects(projects: Project[]): Promise<void> {
    await delay(0);
    try { localStorage.setItem("bp_projects", JSON.stringify(projects)); } catch {}
  },
  async getSections(projectId: string): Promise<Section[]> {
    await delay(0);
    try {
      const v = localStorage.getItem(`bp_sections_${projectId}`);
      return v ? JSON.parse(v) : [];
    } catch { return []; }
  },
  async saveSections(projectId: string, sections: Section[]): Promise<void> {
    await delay(0);
    try { localStorage.setItem(`bp_sections_${projectId}`, JSON.stringify(sections)); } catch {}
  },
  async getMessages(projectId: string): Promise<Message[]> {
    await delay(0);
    try {
      const v = localStorage.getItem(`bp_messages_${projectId}`);
      return v ? JSON.parse(v) : [];
    } catch { return []; }
  },
  async saveMessages(projectId: string, messages: Message[]): Promise<void> {
    await delay(0);
    try { localStorage.setItem(`bp_messages_${projectId}`, JSON.stringify(messages)); } catch {}
  },
};