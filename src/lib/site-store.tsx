import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import defaultLogoAsset from "@/assets/twa-logo.asset.json";
import twaLogoSvg from "@/assets/twa-official-seal.svg";
import {
  site as defaultSite,
  office as defaultOffice,
  teams as defaultTeams,
  events as defaultEvents,
  stats as defaultStats,
  Member,
} from "./site-data";

export interface SiteInfo {
  name: string;
  short: string;
  college: string;
  department: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  logoScale?: number; // 50 to 200 (%)
  logoFit?: "contain" | "cover" | "fill";
  logoShape?: "rounded" | "circle" | "square" | "pill";
  logoPadding?: number; // 0 to 24 (px)
  logoBg?: string; // e.g. "transparent", "#ffffff", "#000000"
}

export interface EventPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  desc: string;
  imageUrl?: string;
  photos?: EventPhoto[];
  status?: "Upcoming" | "Completed" | "Featured";
}

export interface OfficeMember extends Member {
  id: string;
  avatarUrl?: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  category?: "Office Bearer" | "Advisor" | "Faculty Advisor" | string;
  termYears?: string;
  achievements?: string;
  skills?: string;
}

export interface TeamMemberItem {
  name: string;
  role: string;
  year?: string;
  initials: string;
}

export interface TeamItem {
  slug: string;
  name: string;
  description: string;
  lead: string;
  color: string;
  icon: string;
  members: TeamMemberItem[];
}

export interface StatItem {
  label: string;
  value: string;
}

export interface ProgramItem {
  code: string;
  name: string;
  years: string;
  desc: string;
  eligibility?: string;
  intake?: string;
  curriculum?: string[];
  highlights?: string[];
  careerRoles?: string[];
  specializations?: string[];
}

export interface FacilityItem {
  title: string;
  desc: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  email?: string;
  photoUrl?: string;
}

export interface DepartmentInfo {
  overview: string;
  vision: string;
  mission: string[];
  hodName: string;
  hodRole: string;
  hodMessage: string;
  hodPhotoUrl?: string;
  faculty?: FacultyMember[];
  programs: ProgramItem[];
  facilities: FacilityItem[];
}

export interface UserPermissions {
  manageSiteInfo: boolean;
  manageDepartment: boolean;
  manageAnnouncement: boolean;
  manageEvents: boolean;
  uploadEventPhotos: boolean;
  manageMembers: boolean;
  manageTeams: boolean;
  manageUsers: boolean;
  viewMessages: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: "super_admin" | "team_lead" | "event_manager" | "content_editor" | "candidate";
  teamSlug?: string;
  permissions: UserPermissions;
  status: "active" | "disabled";
  createdAt: string;
  lastLogin?: string;
}

export const defaultDepartmentInfo: DepartmentInfo = {
  overview:
    "Housed within Syed Hameedha Arts and Science College, the Department of Computer Applications nurtures technologists through rigorous academics, hands-on projects, modern lab facilities, and a vibrant student community — the Tech Wizard Association (TWA).",
  vision:
    "To be a center of academic and technical excellence that shapes ethical, industry-ready computer applications professionals capable of solving real-world problems.",
  mission: [
    "Deliver a modern computing curriculum with strong fundamentals and hands-on exposure.",
    "Foster research, innovation, and technical skill development among students.",
    "Bridge academia and industry through workshops, hackathons, and corporate partnerships.",
    "Cultivate ethical, socially responsible, and career-driven technology leaders.",
  ],
  hodName: "",
  hodRole: "Head of Department (DCA)",
  hodMessage: "",
  hodPhotoUrl: "",
  faculty: [],
  programs: [
    {
      code: "BCA",
      name: "Bachelor of Computer Applications",
      years: "3 Years (6 Semesters) · Undergraduate",
      intake: "60 Seats / Year",
      desc: "A comprehensive 3-year undergraduate program designed to build strong foundations in computer systems, programming languages, database management, software engineering, and web development.",
      eligibility:
        "Higher Secondary Pass (10+2) or equivalent with Mathematics, Computer Science, or Computer Applications from a recognized board.",
      curriculum: [
        "Programming in C, C++, Java & Python",
        "Data Structures & Algorithms",
        "Relational Database Management Systems (SQL & NoSQL)",
        "Full-Stack Web Development (HTML, CSS, React, Node)",
        "Software Engineering & Agile Methodologies",
        "Computer Networks & Operating Systems",
        "Cloud Computing Fundamentals & Cyber Basics",
        "Final Year Capstone Project & Viva",
      ],
      highlights: [
        "State-of-the-art Computer & AI Labs with gigabit networking",
        "Special hands-on bootcamps conducted by Tech Wizard Association",
        "100% Placement assistance & soft skill development",
        "Regular industrial visits and hackathon participation",
      ],
      careerRoles: [
        "Full-Stack Web Developer",
        "Software Engineer Trainee",
        "Database Administrator",
        "UI/UX Front-End Developer",
        "Systems & QA Analyst",
      ],
      specializations: ["Web Technologies", "Software Development", "Database Administration"],
    },
    {
      code: "MCA",
      name: "Master of Computer Applications",
      years: "2 Years (4 Semesters) · Postgraduate",
      intake: "30 Seats / Year",
      desc: "An advanced postgraduate program empowering graduates with master-level expertise in artificial intelligence, cloud architecture, cybersecurity, distributed systems, and enterprise software engineering.",
      eligibility:
        "Passed BCA / B.Sc. (Computer Science / IT) or B.Sc. / B.Com. / B.A. with Mathematics at 10+2 level or Graduation level with minimum 50% aggregate marks.",
      curriculum: [
        "Advanced Data Structures & Analysis of Algorithms",
        "Artificial Intelligence, Machine Learning & Deep Learning",
        "Cloud Architecture & DevOps Pipelines (AWS / GCP)",
        "Enterprise Java & Distributed Systems",
        "Cyber Security, Cryptography & Network Defense",
        "Mobile App Engineering (Flutter & Cross-Platform)",
        "Big Data Analytics & Data Engineering",
        "6-Month Industry Internship & Master Thesis",
      ],
      highlights: [
        "Access to GPU-accelerated AI/ML Lab and Cyber Range",
        "Live project mentorship with active tech startup founders",
        "Certifications in Cloud Architecture, AI, and Cybersecurity",
        "Campus placement drives with leading IT service firms",
      ],
      careerRoles: [
        "Senior Software Engineer",
        "AI / ML Solutions Engineer",
        "Cloud & DevOps Architect",
        "Data Engineer",
        "Cyber Security Specialist",
        "Technical Product Lead",
      ],
      specializations: ["AI & Data Science", "Cloud Architecture", "Cybersecurity & DevOps"],
    },
    {
      code: "Ph.D / Research",
      name: "Doctoral & Advanced Research Programs",
      years: "3 - 5 Years · Full-Time / Part-Time Research",
      intake: "Subject to Guide Availability",
      desc: "Doctoral research opportunities enabling scholars to carry out original research in cutting-edge computer science domains under experienced research guides and state-level collaborations.",
      eligibility:
        "Master's Degree (MCA / M.Sc. CS / M.E. / M.Tech.) with a minimum of 55% aggregate marks and qualifying score in University Entrance Test / NET / SET.",
      curriculum: [
        "Advanced Research Methodology & Statistical Modeling",
        "Academic Publishing, Citation Standards & IPR",
        "Domain-Specific Research Seminars & Colloquia",
        "Doctoral Dissertation & International Viva Voce",
      ],
      highlights: [
        "Guidance from senior Ph.D supervisors and university guides",
        "Access to IEEE Digital Library, ScienceDirect, and research labs",
        "Support for publishing in Scopus & Web of Science indexed journals",
        "Grants and patent filing support for groundbreaking software innovations",
      ],
      careerRoles: [
        "University Professor / Senior Educator",
        "Lead AI Research Scientist",
        "R&D Manager in Tech Conglomerates",
        "Tech Policy & Innovation Consultant",
      ],
      specializations: [
        "Machine Learning & Computer Vision",
        "Cybersecurity Systems",
        "IoT & Distributed Computing",
      ],
    },
  ],
  facilities: [
    {
      title: "AI & Data Science Lab",
      desc: "High-performance GPU workstations for ML and deep learning experiments.",
    },
    {
      title: "Cyber Security Range",
      desc: "Dedicated environment for CTF challenges, ethical hacking, and network defense.",
    },
    {
      title: "Web & Mobile Studio",
      desc: "Modern developer rigs equipped for full-stack, Figma, and app development.",
    },
    {
      title: "TWA Innovation Hub",
      desc: "A collaborative lounge for student projects, hackathons, and mentorship.",
    },
  ],
};

export interface AnnouncementInfo {
  enabled: boolean;
  badge: string;
  text: string;
  linkText: string;
  linkUrl: string;
  style: "transparent" | "glass" | "gradient" | "solid";
  position: "bottom-popup" | "top-bar";
  durationSeconds: number;
}

export const defaultAnnouncement: AnnouncementInfo = {
  enabled: true,
  badge: "ANNOUNCEMENT",
  text: "Registrations for National Level Hackathon 2026 are now open!",
  linkText: "Explore Events",
  linkUrl: "/events",
  style: "transparent",
  position: "bottom-popup",
  durationSeconds: 10,
};

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  year?: string;
  subject?: string;
  interest?: string;
  message: string;
  date: string;
  status: "New" | "Responded" | "Archived";
}

export const defaultSuperAdminPermissions: UserPermissions = {
  manageSiteInfo: true,
  manageDepartment: true,
  manageAnnouncement: true,
  manageEvents: true,
  uploadEventPhotos: true,
  manageMembers: true,
  manageTeams: true,
  manageUsers: true,
  viewMessages: true,
};

export const defaultTeamLeadPermissions: UserPermissions = {
  manageSiteInfo: false,
  manageDepartment: false,
  manageAnnouncement: false,
  manageEvents: true,
  uploadEventPhotos: true,
  manageMembers: false,
  manageTeams: true,
  manageUsers: false,
  viewMessages: false,
};

export const defaultCandidatePermissions: UserPermissions = {
  manageSiteInfo: false,
  manageDepartment: false,
  manageAnnouncement: false,
  manageEvents: true,
  uploadEventPhotos: true,
  manageMembers: false,
  manageTeams: false,
  manageUsers: false,
  viewMessages: true,
};

export const initialUsers: AdminUser[] = [
  {
    id: "usr-admin",
    username: "admin",
    password: "admin2026",
    fullName: "System Super Admin",
    role: "super_admin",
    permissions: defaultSuperAdminPermissions,
    status: "active",
    createdAt: "2026-01-01",
  },
];

interface SiteStoreContextType {
  site: SiteInfo;
  departmentInfo: DepartmentInfo;
  announcement: AnnouncementInfo;
  office: OfficeMember[];
  events: EventItem[];
  teams: TeamItem[];
  stats: StatItem[];
  messages: ContactMessage[];
  adminUsers: AdminUser[];
  currentUser: AdminUser | null;
  adminPin: string;
  secretToken: string;
  isAuthenticated: boolean;
  sessionExpiry: number | null;
  sessionTimeLeftSeconds: number;
  sessionExpiredReason: string | null;
  extendSession: () => void;
  cloudSyncStatus: "connected" | "syncing" | "error" | "offline";
  lastSyncedAt: string | null;
  loginAdmin: (pin: string) => boolean;
  loginUser: (
    username: string,
    password: string,
  ) => { success: boolean; user?: AdminUser; message?: string };
  logoutAdmin: () => void;
  setSecretToken: (token: string) => void;
  updateSiteInfo: (info: Partial<SiteInfo>) => void;
  updateStats: (newStats: StatItem[]) => void;
  updateDepartmentInfo: (info: Partial<DepartmentInfo>) => void;
  updateAnnouncement: (info: Partial<AnnouncementInfo>) => void;
  updateLogoUrl: (url: string) => void;
  addEvent: (event: Omit<EventItem, "id">) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  clearAllEvents: () => void;
  addEventPhoto: (eventId: string, photo: Omit<EventPhoto, "id" | "uploadedAt">) => void;
  deleteEventPhoto: (eventId: string, photoId: string) => void;
  removeEventPhoto?: (eventId: string, photoId: string) => void;
  addOfficeMember: (member: Omit<OfficeMember, "id">) => void;
  updateOfficeMember: (id: string, member: Partial<OfficeMember>) => void;
  deleteOfficeMember: (id: string) => void;
  addTeamMember: (teamSlug: string, member: TeamMemberItem) => void;
  deleteTeamMember: (teamSlug: string, memberIndex: number) => void;
  updateTeam: (slug: string, team: Partial<TeamItem>) => void;
  addTeam: (
    team: Omit<TeamItem, "slug" | "members"> & {
      slug?: string;
      members?: TeamMemberItem[];
    },
  ) => void;
  deleteTeam: (slug: string) => void;
  addAdminUser: (user: Omit<AdminUser, "id" | "createdAt">) => void;
  updateAdminUser: (id: string, user: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  addContactMessage: (msg: Omit<ContactMessage, "id" | "date" | "status">) => void;
  updateMessageStatus: (id: string, status: ContactMessage["status"]) => void;
  deleteMessage: (id: string) => void;
  setAdminPin: (newPin: string) => void;
  exportBackupData: () => string;
  importBackupData: (jsonStr: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
}

const STORAGE_KEY = "twa_site_store_v10_clean";

const PREDEFINED_OFFICE_IDS = ["off-1", "off-2", "off-3", "off-4", "off-5"];
const PREDEFINED_EVENT_IDS = ["evt-1", "evt-2", "evt-3"];
const PREDEFINED_USER_IDS = ["usr-candidate", "usr-rilwan", "usr-aslam"];
const PREDEFINED_TEAM_SLUGS = ["web-dev", "ai-ml", "cyber-security", "mobile-dev", "design-media"];
const PREDEFINED_MEMBER_NAMES = [
  "Dr. K. Mohamed Ismail",
  "S. Mohamed Aslam",
  "A. Afrin Banu",
  "K. Vigneshwaran",
  "M. Mohamed Rilwan",
  "S. Rahmathullah",
  "A. Sameer Khan",
  "J. Firoz Khan",
  "M. Mohamed Asik",
  "S. Rahmath Nisha",
  "M. Fathima Farhana",
];

const sanitizeOfficeList = (list: OfficeMember[]): OfficeMember[] => {
  return (list || []).filter((m) => !PREDEFINED_OFFICE_IDS.includes(m.id));
};

const sanitizeEventsList = (list: EventItem[]): EventItem[] => {
  return (list || []).filter(
    (e) =>
      !PREDEFINED_EVENT_IDS.includes(e.id) &&
      ![
        "national level hackathon 2026",
        "full-stack web engineering bootcamp",
        "cyber security & ctf defense challenge",
      ].some((title) => e.title.toLowerCase().includes(title)),
  );
};

const sanitizeTeamsList = (list: TeamItem[]): TeamItem[] => {
  return (list || [])
    .filter((t) => !PREDEFINED_TEAM_SLUGS.includes(t.slug))
    .map((t) => {
      const isPredefinedLead = PREDEFINED_MEMBER_NAMES.some((pName) =>
        t.lead?.toLowerCase().includes(pName.toLowerCase()),
      );
      const cleanedMembers = (t.members || []).filter(
        (m) =>
          !PREDEFINED_MEMBER_NAMES.some((pName) =>
            m.name.toLowerCase().includes(pName.toLowerCase()),
          ),
      );
      return {
        ...t,
        lead: isPredefinedLead ? "To be assigned" : t.lead,
        members: cleanedMembers,
      };
    });
};

const sanitizeUsersList = (list: AdminUser[]): AdminUser[] => {
  return (list || []).filter((u) => !PREDEFINED_USER_IDS.includes(u.id));
};

const initialOfficeWithIds: OfficeMember[] = [];

const initialEventsWithIds: EventItem[] = [];

const initialTeams: TeamItem[] = [];

const initialStats: StatItem[] = [
  { label: "Active Members", value: "150+" },
  { label: "Projects Built", value: "45+" },
  { label: "Annual Events", value: "12+" },
  { label: "Tech Wings", value: "5 Wings" },
];

const initialSiteInfo: SiteInfo = {
  ...defaultSite,
  email: "techwizards@shasc.edu.in",
  phone: "+91 94420 12345",
  address:
    "Department of Computer Applications, Syed Hameedha Arts & Science College, Kilakarai, Tamil Nadu - 623517",
  logoUrl: twaLogoSvg || defaultLogoAsset.url || "/favicon.ico",
};

const initialMessages: ContactMessage[] = [];

const defaultData = {
  site: initialSiteInfo,
  office: initialOfficeWithIds,
  events: initialEventsWithIds,
  teams: initialTeams,
  stats: initialStats,
  messages: initialMessages,
  adminPin: "admin2026",
  secretToken: "twa2026",
};

const SiteStoreContext = createContext<SiteStoreContextType | null>(null);

export function SiteStoreProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = useState<SiteInfo>(initialSiteInfo);
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo>(defaultDepartmentInfo);
  const [announcement, setAnnouncement] = useState<AnnouncementInfo>(defaultAnnouncement);
  const [office, setOffice] = useState<OfficeMember[]>(initialOfficeWithIds);
  const [events, setEvents] = useState<EventItem[]>(initialEventsWithIds);
  const [teams, setTeams] = useState<TeamItem[]>(initialTeams);
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(initialUsers[0]);
  const [adminPin, setPinState] = useState<string>("admin2026");
  const [secretToken, setSecretTokenState] = useState<string>("twa2026");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 5 Minute Admin Session Timeout State
  const SESSION_DURATION_MS = 5 * 60 * 1000;
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("twa_admin_session_expiry");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed > Date.now()) return parsed;
      }
    }
    return null;
  });
  const [sessionTimeLeftSeconds, setSessionTimeLeftSeconds] = useState<number>(300);
  const [sessionExpiredReason, setSessionExpiredReason] = useState<string | null>(null);

  // Restore session from sessionStorage on initial load
  useEffect(() => {
    if (sessionExpiry && sessionExpiry > Date.now()) {
      setIsAuthenticated(true);
      setSessionTimeLeftSeconds(Math.max(0, Math.ceil((sessionExpiry - Date.now()) / 1000)));
    } else if (sessionExpiry && sessionExpiry <= Date.now()) {
      setIsAuthenticated(false);
      setSessionExpiry(null);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("twa_admin_session_expiry");
      }
    }
  }, []);

  // Live Session Countdown & Auto-Logout Timer (5-minute limit)
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return;

    const interval = setInterval(() => {
      const remainingMs = sessionExpiry - Date.now();
      const secs = Math.max(0, Math.ceil(remainingMs / 1000));
      setSessionTimeLeftSeconds(secs);

      if (remainingMs <= 0) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setSessionExpiry(null);
        setSessionTimeLeftSeconds(0);
        setSessionExpiredReason(
          "🔒 Your admin session expired after 5 minutes of inactivity. Please log in again.",
        );
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("twa_admin_session_expiry");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry]);

  const extendSession = () => {
    const newExpiry = Date.now() + SESSION_DURATION_MS;
    setSessionExpiry(newExpiry);
    setSessionTimeLeftSeconds(300);
    setSessionExpiredReason(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("twa_admin_session_expiry", newExpiry.toString());
    }
  };

  const [cloudSyncStatus, setCloudSyncStatus] = useState<
    "connected" | "syncing" | "error" | "offline"
  >("syncing");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Firestore Real-time Sync listeners
  useEffect(() => {
    setCloudSyncStatus("syncing");

    // 1. Site Config
    const unsubConfig = onSnapshot(
      doc(db, "settings", "config"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<SiteInfo>;
          setSite((prev) => ({ ...prev, ...data }));
        } else {
          setDoc(doc(db, "settings", "config"), initialSiteInfo).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, "settings/config"),
          );
        }
        setCloudSyncStatus("connected");
        setLastSyncedAt(new Date().toLocaleTimeString());
      },
      (err) => {
        console.warn("Firestore config listener offline/error", err);
        setCloudSyncStatus("offline");
      },
    );

    // 2. Department Info
    const unsubDept = onSnapshot(
      doc(db, "settings", "department"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<DepartmentInfo>;
          if (
            data.hodName &&
            PREDEFINED_MEMBER_NAMES.some((p) =>
              data.hodName?.toLowerCase().includes(p.toLowerCase()),
            )
          ) {
            data.hodName = "";
            data.hodMessage = "";
            setDoc(doc(db, "settings", "department"), {
              ...data,
              hodName: "",
              hodMessage: "",
            }).catch(() => {});
          }
          setDepartmentInfo((prev) => ({
            ...prev,
            ...data,
            hodName: data.hodName ?? "",
            hodMessage: data.hodMessage ?? "",
          }));
        } else {
          setDoc(doc(db, "settings", "department"), defaultDepartmentInfo).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, "settings/department"),
          );
        }
      },
      (err) => console.warn("Firestore department listener error", err),
    );

    // 3. Announcement
    const unsubAnno = onSnapshot(
      doc(db, "settings", "announcement"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<AnnouncementInfo>;
          setAnnouncement((prev) => ({ ...prev, ...data }));
        } else {
          setDoc(doc(db, "settings", "announcement"), defaultAnnouncement).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, "settings/announcement"),
          );
        }
      },
      (err) => console.warn("Firestore announcement listener error", err),
    );

    // 3.5. Stats Config
    const unsubStats = onSnapshot(
      doc(db, "settings", "stats"),
      (snapshot) => {
        if (snapshot.exists() && Array.isArray(snapshot.data()?.items)) {
          setStats(snapshot.data()?.items as StatItem[]);
        } else {
          setDoc(doc(db, "settings", "stats"), { items: initialStats }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, "settings/stats"),
          );
        }
      },
      (err) => console.warn("Firestore stats listener error", err),
    );

    // 4. Events Collection
    const unsubEvents = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        if (!snapshot.empty) {
          snapshot.docs.forEach((d) => {
            if (PREDEFINED_EVENT_IDS.includes(d.id)) {
              deleteDoc(doc(db, "events", d.id)).catch(() => {});
            }
          });
          const raw = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as EventItem);
          setEvents(sanitizeEventsList(raw));
        } else {
          setEvents([]);
        }
      },
      (err) => console.warn("Firestore events listener error", err),
    );

    // 5. Office Members Collection
    const unsubOffice = onSnapshot(
      collection(db, "office"),
      (snapshot) => {
        if (!snapshot.empty) {
          snapshot.docs.forEach((d) => {
            if (PREDEFINED_OFFICE_IDS.includes(d.id)) {
              deleteDoc(doc(db, "office", d.id)).catch(() => {});
            }
          });
          const raw = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as OfficeMember);
          setOffice(sanitizeOfficeList(raw));
        } else {
          setOffice([]);
        }
      },
      (err) => console.warn("Firestore office listener error", err),
    );

    // 6. Teams Collection
    const unsubTeams = onSnapshot(
      collection(db, "teams"),
      (snapshot) => {
        if (!snapshot.empty) {
          snapshot.docs.forEach((d) => {
            if (PREDEFINED_TEAM_SLUGS.includes(d.id)) {
              deleteDoc(doc(db, "teams", d.id)).catch(() => {});
            }
          });
          const raw = snapshot.docs.map((d) => ({ slug: d.id, ...d.data() }) as TeamItem);
          const cleaned = sanitizeTeamsList(raw);
          setTeams(cleaned);
        } else {
          setTeams([]);
        }
      },
      (err) => console.warn("Firestore teams listener error", err),
    );

    // 7. Messages Collection
    const unsubMsgs = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage);
        setMessages(items);
      },
      (err) => console.warn("Firestore messages listener error", err),
    );

    // 8. Admin Users Collection
    const unsubUsers = onSnapshot(
      collection(db, "adminUsers"),
      (snapshot) => {
        if (!snapshot.empty) {
          snapshot.docs.forEach((d) => {
            if (PREDEFINED_USER_IDS.includes(d.id)) {
              deleteDoc(doc(db, "adminUsers", d.id)).catch(() => {});
            }
          });
          const raw = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminUser);
          const cleaned = sanitizeUsersList(raw);

          setAdminUsers((currentLocal) => {
            const userMap = new Map<string, AdminUser>();
            // Preserve locally created users so they are never wiped during slow Firestore sync
            (currentLocal || []).forEach((u) => {
              if (u && u.username) userMap.set(u.username.toLowerCase(), u);
            });
            // Apply Firestore users
            cleaned.forEach((u) => {
              if (u && u.username) userMap.set(u.username.toLowerCase(), u);
            });

            const merged = Array.from(userMap.values());
            if (!merged.some((u) => u.username.toLowerCase() === "admin")) {
              merged.unshift(initialUsers[0]);
            }
            return merged;
          });
        } else {
          setAdminUsers((currentLocal) => {
            const list = currentLocal.length > 0 ? currentLocal : initialUsers;
            if (!list.some((u) => u.username.toLowerCase() === "admin")) {
              return [initialUsers[0], ...list];
            }
            return list;
          });
        }
      },
      (err) => console.warn("Firestore adminUsers listener error", err),
    );

    // 9. Security Settings (secretToken & adminPin)
    const unsubSec = onSnapshot(
      doc(db, "settings", "security"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.secretToken && typeof data.secretToken === "string") {
            setSecretTokenState(data.secretToken.trim());
          }
          if (data.adminPin && typeof data.adminPin === "string") {
            setPinState(data.adminPin.trim());
          }
        } else {
          setDoc(doc(db, "settings", "security"), {
            secretToken: "twa2026",
            adminPin: "admin2026",
          }).catch((err) => handleFirestoreError(err, OperationType.WRITE, "settings/security"));
        }
      },
      (err) => console.warn("Firestore security listener error", err),
    );

    return () => {
      unsubConfig();
      unsubDept();
      unsubAnno();
      unsubStats();
      unsubEvents();
      unsubOffice();
      unsubTeams();
      unsubMsgs();
      unsubUsers();
      unsubSec();
    };
  }, []);

  const latestStateRef = React.useRef({
    site,
    departmentInfo,
    announcement,
    office,
    events,
    teams,
    stats,
    messages,
    adminUsers,
    adminPin,
    secretToken,
  });

  useEffect(() => {
    latestStateRef.current = {
      site,
      departmentInfo,
      announcement,
      office,
      events,
      teams,
      stats,
      messages,
      adminUsers,
      adminPin,
      secretToken,
    };
  }, [
    site,
    departmentInfo,
    announcement,
    office,
    events,
    teams,
    stats,
    messages,
    adminUsers,
    adminPin,
    secretToken,
  ]);

  // Real-time Fast Sync setup across tabs and components
  const applyParsedData = (parsed: Record<string, unknown> | null) => {
    if (!parsed) return;
    let nextSite = latestStateRef.current.site;
    let nextDept = latestStateRef.current.departmentInfo;
    let nextAnno = latestStateRef.current.announcement;
    let nextOffice = latestStateRef.current.office;
    let nextEvents = latestStateRef.current.events;
    let nextTeams = latestStateRef.current.teams;
    let nextStats = latestStateRef.current.stats;
    let nextMsgs = latestStateRef.current.messages;
    let nextUsers = latestStateRef.current.adminUsers;
    let nextPin = latestStateRef.current.adminPin;
    let nextToken = latestStateRef.current.secretToken;

    if (parsed.site && typeof parsed.site === "object") {
      nextSite = { ...initialSiteInfo, ...(parsed.site as Partial<SiteInfo>) };
      if (
        !nextSite.logoUrl ||
        nextSite.logoUrl.includes("212a3cfe") ||
        nextSite.logoUrl.includes("__l5e")
      ) {
        nextSite.logoUrl = twaLogoSvg;
      }
      setSite(nextSite);
    }
    if (parsed.departmentInfo && typeof parsed.departmentInfo === "object") {
      const parsedDept = parsed.departmentInfo as Partial<DepartmentInfo>;
      if (
        parsedDept.hodName &&
        PREDEFINED_MEMBER_NAMES.some((p) =>
          parsedDept.hodName?.toLowerCase().includes(p.toLowerCase()),
        )
      ) {
        parsedDept.hodName = "";
        parsedDept.hodMessage = "";
      }
      nextDept = {
        ...defaultDepartmentInfo,
        ...parsedDept,
      };
      setDepartmentInfo(nextDept);
    }
    if (parsed.announcement && typeof parsed.announcement === "object") {
      nextAnno = {
        ...defaultAnnouncement,
        ...(parsed.announcement as Partial<AnnouncementInfo>),
      };
      setAnnouncement(nextAnno);
    }
    if (Array.isArray(parsed.office)) {
      nextOffice = sanitizeOfficeList(parsed.office as OfficeMember[]);
      setOffice(nextOffice);
    }
    if (Array.isArray(parsed.events)) {
      nextEvents = sanitizeEventsList(parsed.events as EventItem[]);
      setEvents(nextEvents);
    }
    if (Array.isArray(parsed.teams)) {
      nextTeams = sanitizeTeamsList(parsed.teams as TeamItem[]);
      setTeams(nextTeams);
    }
    if (Array.isArray(parsed.stats) && parsed.stats.length > 0) {
      nextStats = parsed.stats as StatItem[];
      setStats(nextStats);
    }
    if (Array.isArray(parsed.messages)) {
      nextMsgs = parsed.messages as ContactMessage[];
      setMessages(nextMsgs);
    }
    if (Array.isArray(parsed.adminUsers)) {
      nextUsers = sanitizeUsersList(parsed.adminUsers as AdminUser[]);
      setAdminUsers(nextUsers);
    }
    if (typeof parsed.adminPin === "string") {
      nextPin = parsed.adminPin;
      setPinState(nextPin);
    }
    if (typeof parsed.secretToken === "string") {
      nextToken = parsed.secretToken;
      setSecretTokenState(nextToken);
    }

    latestStateRef.current = {
      site: nextSite,
      departmentInfo: nextDept,
      announcement: nextAnno,
      office: nextOffice,
      events: nextEvents,
      teams: nextTeams,
      stats: nextStats,
      messages: nextMsgs,
      adminUsers: nextUsers,
      adminPin: nextPin,
      secretToken: nextToken,
    };
  };

  const SYNC_CHANNEL_NAME = "twa_site_store_channel";
  const SYNC_EVENT_NAME = "twa-site-store-sync";

  // Load from localStorage on mount & listen for real-time fast sync events
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        [
          "twa_site_store_v1",
          "twa_site_store_v2",
          "twa_site_store_v3",
          "twa_site_store_v4_clean",
          "twa_site_store",
        ].forEach((k) => {
          try {
            localStorage.removeItem(k);
          } catch (e) {
            // Ignore storage removal errors
          }
        });
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          applyParsedData(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load site store from localStorage", e);
      }
    };

    loadFromStorage();

    // BroadcastChannel for cross-tab / cross-window real-time fast sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.payload) {
            applyParsedData(event.data.payload);
          }
        };
      } catch (bcError) {
        console.warn("BroadcastChannel initialization warning", bcError);
      }
    }

    // Storage event for multi-tab fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          applyParsedData(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Error parsing sync storage event", err);
        }
      }
    };

    // Custom event for same-window component reactivity
    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        applyParsedData(customEvent.detail);
      } else {
        loadFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SYNC_EVENT_NAME, handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(SYNC_EVENT_NAME, handleCustomSync);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  // Save changes to localStorage & trigger fast sync broadcasts
  const saveAll = (overrides: Partial<typeof latestStateRef.current> = {}) => {
    try {
      const current = latestStateRef.current;
      const payload = {
        site: overrides.site ?? current.site,
        departmentInfo: overrides.departmentInfo ?? current.departmentInfo,
        announcement: overrides.announcement ?? current.announcement,
        office: overrides.office ?? current.office,
        events: overrides.events ?? current.events,
        teams: overrides.teams ?? current.teams,
        stats: overrides.stats ?? current.stats,
        messages: overrides.messages ?? current.messages,
        adminUsers: overrides.adminUsers ?? current.adminUsers,
        adminPin: overrides.adminPin ?? current.adminPin,
        secretToken: overrides.secretToken ?? current.secretToken,
      };

      latestStateRef.current = payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      // Fast sync broadcast across windows / tabs
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
          channel.postMessage({ type: "SYNC_STORE", payload });
          channel.close();
        } catch (bcError) {
          // ignore fallback
        }
      }

      // Fast sync broadcast inside current window
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: payload }));
      }
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const loginUser = (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const found = adminUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanUser &&
        (u.status === "active" || !u.status) &&
        u.password.trim() === cleanPass,
    );

    if (found) {
      const updatedUser = { ...found, lastLogin: new Date().toISOString() };
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      extendSession();
      return { success: true, user: updatedUser };
    }

    if (cleanUser === "admin" && (cleanPass === adminPin.trim() || cleanPass === "admin2026")) {
      const superAdminUser = adminUsers.find((u) => u.username.toLowerCase() === "admin") || {
        id: "usr-admin",
        username: "admin",
        password: adminPin,
        fullName: "System Super Admin",
        role: "super_admin" as const,
        permissions: defaultSuperAdminPermissions,
        status: "active" as const,
        createdAt: "2026-01-01",
      };
      setCurrentUser(superAdminUser);
      setIsAuthenticated(true);
      extendSession();
      return { success: true, user: superAdminUser };
    }

    return { success: false, message: "Invalid username, password, or account disabled." };
  };

  const loginAdmin = (pin: string) => {
    const res = loginUser("admin", pin);
    return res.success;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSessionExpiry(null);
    setSessionTimeLeftSeconds(0);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("twa_admin_session_expiry");
    }
  };

  const addAdminUser = (userData: Omit<AdminUser, "id" | "createdAt">) => {
    const cleanUsername = userData.username.trim().toLowerCase();
    const cleanPassword = userData.password.trim();
    const newUser: AdminUser = {
      ...userData,
      username: cleanUsername,
      password: cleanPassword,
      status: userData.status || "active",
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAdminUsers((prev) => {
      const filtered = prev.filter((u) => u.username.toLowerCase() !== cleanUsername);
      const updated = [...filtered, newUser];
      saveAll({ adminUsers: updated });
      setDoc(doc(db, "adminUsers", newUser.id), newUser).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `adminUsers/${newUser.id}`),
      );
      return updated;
    });
  };

  const updateAdminUser = (id: string, userData: Partial<AdminUser>) => {
    setAdminUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          const newU = { ...u, ...userData };
          if (userData.username) {
            newU.username = userData.username.trim().toLowerCase();
          }
          if (userData.password) {
            newU.password = userData.password.trim();
          }
          if (currentUser && currentUser.id === id) {
            setCurrentUser(newU);
          }
          setDoc(doc(db, "adminUsers", id), newU, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `adminUsers/${id}`),
          );
          return newU;
        }
        return u;
      });
      saveAll({ adminUsers: updated });
      return updated;
    });
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      saveAll({ adminUsers: updated });
      deleteDoc(doc(db, "adminUsers", id)).catch((err) =>
        handleFirestoreError(err, OperationType.DELETE, `adminUsers/${id}`),
      );
      return updated;
    });
  };

  const addEventPhoto = (eventId: string, photoData: Omit<EventPhoto, "id" | "uploadedAt">) => {
    const newPhoto: EventPhoto = {
      ...photoData,
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      uploadedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setEvents((prev) => {
      const updated = prev.map((e) => {
        if (e.id === eventId) {
          const currentPhotos = e.photos || [];
          const updatedEvent = { ...e, photos: [...currentPhotos, newPhoto] };
          setDoc(doc(db, "events", eventId), updatedEvent, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `events/${eventId}`),
          );
          return updatedEvent;
        }
        return e;
      });
      saveAll({ events: updated });
      return updated;
    });
  };

  const deleteEventPhoto = (eventId: string, photoId: string) => {
    setEvents((prev) => {
      const updated = prev.map((e) => {
        if (e.id === eventId && e.photos) {
          const updatedEvent = {
            ...e,
            photos: e.photos.filter((p, pIdx) => {
              if (p.id && p.id === photoId) return false;
              if (pIdx.toString() === photoId) return false;
              return true;
            }),
          };
          setDoc(doc(db, "events", eventId), updatedEvent, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `events/${eventId}`),
          );
          return updatedEvent;
        }
        return e;
      });
      saveAll({ events: updated });
      return updated;
    });
  };

  const exportBackupData = () => {
    const backupObj = {
      version: "3.8.0",
      exportedAt: new Date().toISOString(),
      site,
      departmentInfo,
      announcement,
      office,
      events,
      teams,
      stats,
      messages,
      adminUsers,
      adminPin,
      secretToken,
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importBackupData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== "object") {
        return { success: false, error: "Invalid backup file format." };
      }
      applyParsedData(parsed);
      saveAll(parsed);
      // Sync to Firestore
      if (parsed.site) setDoc(doc(db, "settings", "config"), parsed.site, { merge: true });
      if (parsed.departmentInfo)
        setDoc(doc(db, "settings", "department"), parsed.departmentInfo, { merge: true });
      if (parsed.announcement)
        setDoc(doc(db, "settings", "announcement"), parsed.announcement, { merge: true });
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "JSON parsing error";
      return { success: false, error: msg };
    }
  };

  const updateSiteInfo = (info: Partial<SiteInfo>) => {
    setSite((prev) => {
      const updated = { ...prev, ...info };
      saveAll({ site: updated });
      setDoc(doc(db, "settings", "config"), updated, { merge: true }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, "settings/config"),
      );
      return updated;
    });
  };

  const updateStats = (newStats: StatItem[]) => {
    setStats(newStats);
    saveAll({ stats: newStats });
    setDoc(doc(db, "settings", "stats"), { items: newStats }, { merge: true }).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, "settings/stats"),
    );
  };

  const updateDepartmentInfo = (info: Partial<DepartmentInfo>) => {
    setDepartmentInfo((prev) => {
      const updated = { ...prev, ...info };
      saveAll({ departmentInfo: updated });
      setDoc(doc(db, "settings", "department"), updated, { merge: true }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, "settings/department"),
      );
      return updated;
    });
  };

  const updateAnnouncement = (info: Partial<AnnouncementInfo>) => {
    setAnnouncement((prev) => {
      const updated = { ...prev, ...info };
      saveAll({ announcement: updated });
      setDoc(doc(db, "settings", "announcement"), updated, { merge: true }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, "settings/announcement"),
      );
      return updated;
    });
  };

  const updateLogoUrl = (url: string) => {
    updateSiteInfo({ logoUrl: url });
  };

  const addEvent = (evt: Omit<EventItem, "id">) => {
    const newEvt: EventItem = { ...evt, id: `evt-${Date.now()}` };
    setEvents((prev) => {
      const updated = [newEvt, ...prev];
      saveAll({ events: updated });
      setDoc(doc(db, "events", newEvt.id), newEvt).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `events/${newEvt.id}`),
      );
      return updated;
    });
  };

  const updateEvent = (id: string, evt: Partial<EventItem>) => {
    setEvents((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newItem = { ...item, ...evt };
          setDoc(doc(db, "events", id), newItem, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `events/${id}`),
          );
          return newItem;
        }
        return item;
      });
      saveAll({ events: updated });
      return updated;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveAll({ events: updated });
      deleteDoc(doc(db, "events", id)).catch((err) =>
        handleFirestoreError(err, OperationType.DELETE, `events/${id}`),
      );
      return updated;
    });
  };

  const clearAllEvents = () => {
    events.forEach((e) => {
      deleteDoc(doc(db, "events", e.id)).catch(() => {});
    });
    setEvents([]);
    saveAll({ events: [] });
  };

  const addOfficeMember = (member: Omit<OfficeMember, "id">) => {
    const newMember: OfficeMember = { ...member, id: `off-${Date.now()}` };
    setOffice((prev) => {
      const updated = [...prev, newMember];
      saveAll({ office: updated });
      setDoc(doc(db, "office", newMember.id), newMember).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `office/${newMember.id}`),
      );
      return updated;
    });
  };

  const updateOfficeMember = (id: string, member: Partial<OfficeMember>) => {
    setOffice((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newItem = { ...item, ...member };
          setDoc(doc(db, "office", id), newItem, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `office/${id}`),
          );
          return newItem;
        }
        return item;
      });
      saveAll({ office: updated });
      return updated;
    });
  };

  const deleteOfficeMember = (id: string) => {
    setOffice((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveAll({ office: updated });
      deleteDoc(doc(db, "office", id)).catch((err) =>
        handleFirestoreError(err, OperationType.DELETE, `office/${id}`),
      );
      return updated;
    });
  };

  const addTeamMember = (teamSlug: string, member: TeamMemberItem) => {
    setTeams((prev) => {
      const updated = prev.map((t) => {
        if (t.slug === teamSlug) {
          const newT = { ...t, members: [...t.members, member] };
          setDoc(doc(db, "teams", teamSlug), newT, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `teams/${teamSlug}`),
          );
          return newT;
        }
        return t;
      });
      saveAll({ teams: updated });
      return updated;
    });
  };

  const deleteTeamMember = (teamSlug: string, memberIndex: number) => {
    setTeams((prev) => {
      const updated = prev.map((t) => {
        if (t.slug === teamSlug) {
          const newMembers = [...t.members];
          newMembers.splice(memberIndex, 1);
          const newT = { ...t, members: newMembers };
          setDoc(doc(db, "teams", teamSlug), newT, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `teams/${teamSlug}`),
          );
          return newT;
        }
        return t;
      });
      saveAll({ teams: updated });
      return updated;
    });
  };

  const updateTeam = (slug: string, teamData: Partial<TeamItem>) => {
    setTeams((prev) => {
      const updated = prev.map((t) => {
        if (t.slug === slug) {
          const newT = { ...t, ...teamData };
          setDoc(doc(db, "teams", slug), newT, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `teams/${slug}`),
          );
          return newT;
        }
        return t;
      });
      saveAll({ teams: updated });
      return updated;
    });
  };

  const addTeam = (
    teamData: Omit<TeamItem, "slug" | "members"> & { slug?: string; members?: TeamMemberItem[] },
  ) => {
    const slug =
      teamData.slug ||
      teamData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `team-${Date.now()}`;

    const newTeam: TeamItem = {
      slug,
      name: teamData.name,
      description: teamData.description,
      lead: teamData.lead || "TBD",
      color: teamData.color || "from-blue-500/20 to-purple-500/20",
      icon: teamData.icon || "Users",
      members: teamData.members || [],
    };

    setTeams((prev) => {
      const exists = prev.some((t) => t.slug === slug);
      const updated = exists
        ? prev.map((t) => (t.slug === slug ? newTeam : t))
        : [...prev, newTeam];
      saveAll({ teams: updated });
      setDoc(doc(db, "teams", slug), newTeam).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `teams/${slug}`),
      );
      return updated;
    });
  };

  const deleteTeam = (slug: string) => {
    setTeams((prev) => {
      const updated = prev.filter((t) => t.slug !== slug);
      saveAll({ teams: updated });
      deleteDoc(doc(db, "teams", slug)).catch((err) =>
        handleFirestoreError(err, OperationType.DELETE, `teams/${slug}`),
      );
      return updated;
    });
  };

  const addContactMessage = (msg: Omit<ContactMessage, "id" | "date" | "status">) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "New",
    };
    setMessages((prev) => {
      const updated = [newMsg, ...prev];
      saveAll({ messages: updated });
      setDoc(doc(db, "messages", newMsg.id), newMsg).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `messages/${newMsg.id}`),
      );
      return updated;
    });
  };

  const updateMessageStatus = (id: string, status: ContactMessage["status"]) => {
    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          const newM = { ...m, status };
          setDoc(doc(db, "messages", id), newM, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `messages/${id}`),
          );
          return newM;
        }
        return m;
      });
      saveAll({ messages: updated });
      return updated;
    });
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveAll({ messages: updated });
      deleteDoc(doc(db, "messages", id)).catch((err) =>
        handleFirestoreError(err, OperationType.DELETE, `messages/${id}`),
      );
      return updated;
    });
  };

  const setAdminPin = (newPin: string) => {
    const clean = newPin.trim();
    if (!clean) return;
    setPinState(clean);
    saveAll({ adminPin: clean });
    setDoc(doc(db, "settings", "security"), { adminPin: clean }, { merge: true }).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, "settings/security"),
    );
  };

  const setSecretToken = (newToken: string) => {
    const clean = newToken.trim();
    if (!clean) return;
    setSecretTokenState(clean);
    saveAll({ secretToken: clean });
    setDoc(doc(db, "settings", "security"), { secretToken: clean }, { merge: true }).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, "settings/security"),
    );
  };

  const resetToDefaults = () => {
    setSite(initialSiteInfo);
    setDepartmentInfo(defaultDepartmentInfo);
    setAnnouncement(defaultAnnouncement);
    setOffice(initialOfficeWithIds);
    setEvents(initialEventsWithIds);
    setTeams(initialTeams);
    setStats(initialStats);
    setMessages([]);
    setPinState("admin2026");
    setSecretTokenState("twa2026");
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("twa_site_store_v2");
    } catch (e) {
      console.error(e);
    }
    saveAll({
      site: initialSiteInfo,
      departmentInfo: defaultDepartmentInfo,
      announcement: defaultAnnouncement,
      office: initialOfficeWithIds,
      events: initialEventsWithIds,
      teams: initialTeams,
      stats: initialStats,
      messages: [],
      adminPin: "admin2026",
      secretToken: "twa2026",
    });
  };

  return (
    <SiteStoreContext.Provider
      value={{
        site,
        departmentInfo,
        announcement,
        office,
        events,
        teams,
        stats,
        messages,
        adminUsers,
        currentUser,
        adminPin,
        secretToken,
        isAuthenticated,
        sessionExpiry,
        sessionTimeLeftSeconds,
        sessionExpiredReason,
        extendSession,
        cloudSyncStatus,
        lastSyncedAt,
        loginAdmin,
        loginUser,
        logoutAdmin,
        setSecretToken,
        updateSiteInfo,
        updateStats,
        updateDepartmentInfo,
        updateAnnouncement,
        updateLogoUrl,
        addEvent,
        updateEvent,
        deleteEvent,
        clearAllEvents,
        addEventPhoto,
        deleteEventPhoto,
        removeEventPhoto: deleteEventPhoto,
        addOfficeMember,
        updateOfficeMember,
        deleteOfficeMember,
        addTeamMember,
        deleteTeamMember,
        updateTeam,
        addTeam,
        deleteTeam,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        addContactMessage,
        updateMessageStatus,
        deleteMessage,
        setAdminPin,
        exportBackupData,
        importBackupData,
        resetToDefaults,
      }}
    >
      {children}
    </SiteStoreContext.Provider>
  );
}

const defaultFallbackStore: SiteStoreContextType = {
  site: initialSiteInfo,
  departmentInfo: defaultDepartmentInfo,
  announcement: defaultAnnouncement,
  office: initialOfficeWithIds,
  events: initialEventsWithIds,
  teams: initialTeams,
  stats: initialStats,
  messages: [],
  adminUsers: initialUsers,
  currentUser: initialUsers[0],
  adminPin: "admin2026",
  secretToken: "twa2026",
  isAuthenticated: false,
  sessionExpiry: null,
  sessionTimeLeftSeconds: 300,
  sessionExpiredReason: null,
  extendSession: () => {},
  cloudSyncStatus: "connected",
  lastSyncedAt: null,
  loginAdmin: () => false,
  loginUser: () => ({ success: false }),
  logoutAdmin: () => {},
  setSecretToken: () => {},
  updateSiteInfo: () => {},
  updateStats: () => {},
  updateDepartmentInfo: () => {},
  updateAnnouncement: () => {},
  updateLogoUrl: () => {},
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  clearAllEvents: () => {},
  addEventPhoto: () => {},
  deleteEventPhoto: () => {},
  addOfficeMember: () => {},
  updateOfficeMember: () => {},
  deleteOfficeMember: () => {},
  addTeamMember: () => {},
  deleteTeamMember: () => {},
  updateTeam: () => {},
  addTeam: () => {},
  deleteTeam: () => {},
  addAdminUser: () => {},
  updateAdminUser: () => {},
  deleteAdminUser: () => {},
  addContactMessage: () => {},
  updateMessageStatus: () => {},
  deleteMessage: () => {},
  setAdminPin: () => {},
  exportBackupData: () => "{}",
  importBackupData: () => ({ success: false }),
  resetToDefaults: () => {},
};

export function useSiteStore() {
  const context = useContext(SiteStoreContext);
  if (!context) {
    return defaultFallbackStore;
  }
  return context;
}
