// Data model types for database and local use
export type Project = {
  id: string;
  name: string;
  type: string;
  description?: string;
  last_summary?: string;
  current_target_section_id?: string;
  created_at: string;
  updated_at: string;
};

export type Section = {
  id: string;
  project_id: string;
  key: string;
  title: string;
  sort_order: number;
  content_json: any;
};

export type Message = {
  id: string;
  project_id: string;
  role: "user" | "assistant";
  message: string;
  actions?: { label: string; type: string }[];
  createdAt: number;
};
