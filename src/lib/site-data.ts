export const site = {
  name: "Tech Wizard Association",
  short: "TWA",
  college: "Syed Hameedha Arts and Science College",
  department: "Department of Computer Applications",
  tagline: "Building tomorrow's technologists, today.",
};

export const nav = [
  { to: "/", label: "Home" },
  { to: "/department", label: "Department" },
  { to: "/teams", label: "Teams" },
  { to: "/members", label: "Members" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export type Member = {
  name: string;
  role: string;
  team?: string;
  year?: string;
  initials: string;
};

export interface PresetTeamMember {
  name: string;
  role: string;
  year?: string;
  initials: string;
}

export interface PresetTeam {
  slug: string;
  name: string;
  description: string;
  lead: string;
  color: string;
  icon: string;
  members: PresetTeamMember[];
}

export interface PresetEvent {
  id?: string;
  title: string;
  date: string;
  tag: string;
  desc: string;
  status?: "Upcoming" | "Completed" | "Featured";
}

export interface PresetStat {
  label: string;
  value: string;
}

export const office: Member[] = [];

export const teams: PresetTeam[] = [];

export const events: PresetEvent[] = [];

export const stats: PresetStat[] = [];
