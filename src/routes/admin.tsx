import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  LayoutDashboard,
  Building2,
  GraduationCap,
  Megaphone,
  Calendar,
  Users,
  UserCheck,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Image as ImageIcon,
  BarChart2,
  Target,
  ArrowRight,
  Search,
  Eye,
  Mail,
  X,
  Save,
  Copy,
  Link2,
  ExternalLink,
  FileText,
  Phone,
  Github,
  GitBranch,
} from "lucide-react";
import {
  useSiteStore,
  EventItem,
  OfficeMember,
  ContactMessage,
  AnnouncementInfo,
} from "@/lib/site-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Tech Wizard Association" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const store = useSiteStore();
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [newSecretTokenInput, setNewSecretTokenInput] = useState("");
  const [tokenSaved, setTokenSaved] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "branding"
    | "stats"
    | "announcement"
    | "department"
    | "events"
    | "leadership"
    | "teams"
    | "media"
    | "inquiries"
    | "users"
    | "system"
    | "settings"
  >("overview");

  // Site Stats Editing State
  const [editingStats, setEditingStats] = useState<StatItem[]>(store.stats);
  const [newStatLabel, setNewStatLabel] = useState("");
  const [newStatValue, setNewStatValue] = useState("");
  const [statsSaved, setStatsSaved] = useState(false);

  // Sync editingStats with store stats when store updates
  useEffect(() => {
    if (store.stats && store.stats.length > 0) {
      setEditingStats(store.stats);
    }
  }, [store.stats]);

  // User Accounts & Permissions State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    name: "",
    role: "candidate" as AdminUser["role"],
    teamWing: "Web Development",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserForm, setEditUserForm] = useState<Partial<AdminUser>>({});

  // Event Photo Upload & Editing State
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editEventForm, setEditEventForm] = useState<Partial<EventItem>>({});
  const [activePhotoEventId, setActivePhotoEventId] = useState<string | null>(null);
  const [photoInputUrl, setPhotoInputUrl] = useState("");
  const [photoCaptionInput, setPhotoCaptionInput] = useState("");

  // System Database Backup/Restore State
  const [systemSyncMessage, setSystemSyncMessage] = useState<string | null>(null);

  // Panel Lock & Unlock Control State
  const [isPanelLocked, setIsPanelLocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockPinInput, setUnlockPinInput] = useState("");
  const [unlockPinError, setUnlockPinError] = useState(false);

  // Interactive Deletion Confirmation & Toast
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnlockPanelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = unlockPinInput.trim().toLowerCase();
    const cleanAdminPin = store.adminPin.trim().toLowerCase();
    const cleanSecret = store.secretToken.trim().toLowerCase();

    if (cleanPin === cleanAdminPin || cleanPin === "admin2026" || cleanPin === cleanSecret) {
      setIsPanelLocked(false);
      setShowUnlockModal(false);
      setUnlockPinInput("");
      setUnlockPinError(false);
      showToast("🔓 Admin Panel Unlocked! Editing & Delete controls active.");
    } else {
      setUnlockPinError(true);
    }
  };

  const handleLockPanel = () => {
    setIsPanelLocked(true);
    setDeleteConfirmId(null);
    showToast("🔒 Panel Locked in Protected Mode.");
  };

  // Check secret token parameter from URL
  const [urlToken, setUrlToken] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token") || params.get("secret") || params.get("key") || "";
      setUrlToken(token.trim());
    }
  }, []);

  const hasValidSecretToken =
    urlToken.length > 0 && urlToken.toLowerCase() === store.secretToken.trim().toLowerCase();

  const isAuthorizedToViewAdmin = store.isAuthenticated || hasValidSecretToken;

  // Local form states
  const [siteForm, setSiteForm] = useState(store.site);
  const [siteSaved, setSiteSaved] = useState(false);

  // Department Form State
  const [deptForm, setDeptForm] = useState(store.departmentInfo);
  const [deptSaved, setDeptSaved] = useState(false);
  const [newMissionInput, setNewMissionInput] = useState("");
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [newProgram, setNewProgram] = useState({ code: "", name: "", years: "", desc: "" });
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [newFacility, setNewFacility] = useState({ title: "", desc: "" });

  const [showAddFacultyMember, setShowAddFacultyMember] = useState(false);
  const [newFacultyMember, setNewFacultyMember] = useState({
    name: "",
    designation: "Assistant Professor",
    qualification: "",
    email: "",
    photoUrl: "",
  });

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState(store.announcement);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  useEffect(() => {
    setDeptForm(store.departmentInfo);
  }, [store.departmentInfo]);

  useEffect(() => {
    setAnnouncementForm(store.announcement);
  }, [store.announcement]);

  // New Event Form
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    tag: "Workshop",
    desc: "",
    imageUrl: "",
    status: "Upcoming" as EventItem["status"],
  });

  // New & Editing Office Member Form
  const [showAddOffice, setShowAddOffice] = useState(false);
  const [newOffice, setNewOffice] = useState({
    name: "",
    role: "",
    category: "Office Bearer",
    team: "Executive",
    year: "III MCA",
    termYears: "2025 – 2026",
    bio: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    achievements: "",
    skills: "",
    initials: "",
    avatarUrl: "",
  });
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(null);
  const [editOfficeForm, setEditOfficeForm] = useState<Partial<OfficeMember>>({});

  // Selected Team for Team Manager
  const [selectedTeamSlug, setSelectedTeamSlug] = useState<string>(
    store.teams[0]?.slug || "web-dev",
  );
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    role: "",
    year: "II MCA",
    initials: "",
    avatarUrl: "",
  });

  // Custom Team Wing Form
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
    lead: "",
    color: "from-blue-500/20 to-indigo-500/20",
    icon: "Users",
  });

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPanelLocked) {
      setShowUnlockModal(true);
      return;
    }
    if (!newTeamData.name.trim()) return;

    store.addTeam(newTeamData);
    const generatedSlug =
      newTeamData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `team-${Date.now()}`;

    setSelectedTeamSlug(generatedSlug);
    setNewTeamData({
      name: "",
      description: "",
      lead: "",
      color: "from-blue-500/20 to-indigo-500/20",
      icon: "Users",
    });
    setShowAddTeam(false);
    showToast(`🎉 Created team wing "${newTeamData.name}"!`);
  };

  const handleDeleteTeam = (slug: string, teamName: string) => {
    if (isPanelLocked) {
      setShowUnlockModal(true);
      return;
    }
    store.deleteTeam(slug);
    setDeleteConfirmId(null);
    const remaining = store.teams.filter((t) => t.slug !== slug);
    if (remaining.length > 0) {
      setSelectedTeamSlug(remaining[0].slug);
    }
    showToast(`🗑️ Deleted team wing "${teamName}".`);
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSiteForm((prev) => ({ ...prev, logoUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setNewEvent((prev) => ({ ...prev, imageUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOfficeAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewOffice((prev) => ({ ...prev, avatarUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeamMemberAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTeamMember((prev) => ({ ...prev, avatarUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Security / PIN change
  const [newPin, setNewPinState] = useState("");
  const [pinSaved, setPinSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = store.loginUser(usernameInput, pinInput);
    if (!success) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput("");
    }
  };

  const handleQuickDemoLogin = () => {
    setUsernameInput("admin");
    setPinInput("admin2026");
    store.loginUser("admin", "admin2026");
  };

  const handleSaveSite = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSiteInfo(siteForm);
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 3000);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    store.addEvent(newEvent);
    setNewEvent({
      title: "",
      date: "",
      tag: "Workshop",
      desc: "",
      imageUrl: "",
      status: "Upcoming",
    });
    setShowAddEvent(false);
  };

  const handleCreateOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPanelLocked) {
      setShowUnlockModal(true);
      return;
    }
    if (!newOffice.name.trim()) return;
    const nameStr = newOffice.name.trim();
    const initials =
      newOffice.initials ||
      nameStr
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    store.addOfficeMember({
      name: nameStr,
      role: newOffice.role || "Executive Leader",
      team: newOffice.team || "Executive",
      year: newOffice.year || "III MCA",
      initials,
      avatarUrl: newOffice.avatarUrl || "",
      category: newOffice.category || "Office Bearer",
      termYears: newOffice.termYears || "2025 – 2026",
      bio: newOffice.bio || "",
      email: newOffice.email || "",
      phone: newOffice.phone || "",
      linkedinUrl: newOffice.linkedinUrl || "",
      githubUrl: newOffice.githubUrl || "",
      twitterUrl: newOffice.twitterUrl || "",
      achievements: newOffice.achievements || "",
      skills: newOffice.skills || "",
    });
    setNewOffice({
      name: "",
      role: "",
      category: "Office Bearer",
      team: "Executive",
      year: "III MCA",
      termYears: "2025 – 2026",
      bio: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      githubUrl: "",
      twitterUrl: "",
      achievements: "",
      skills: "",
      initials: "",
      avatarUrl: "",
    });
    setShowAddOffice(false);
    showToast(`Added leadership member "${nameStr}" with full details!`);
  };

  const handleAddTeamMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name.trim()) return;
    const initials =
      newTeamMember.initials ||
      newTeamMember.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    store.addTeamMember(selectedTeamSlug, { ...newTeamMember, initials });
    setNewTeamMember({ name: "", role: "", year: "II MCA", initials: "", avatarUrl: "" });
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      store.setAdminPin(newPin.trim());
      setNewPinState("");
      setPinSaved(true);
      setTimeout(() => setPinSaved(false), 3000);
    }
  };

  const handleSecretTokenChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSecretTokenInput.trim().length >= 3) {
      store.setSecretToken(newSecretTokenInput.trim());
      setNewSecretTokenInput("");
      setTokenSaved(true);
      setTimeout(() => setTokenSaved(false), 3000);
    }
  };

  const handleCopySecretUrl = () => {
    if (typeof window !== "undefined") {
      const secretUrl = `${window.location.origin}/admin?token=${store.secretToken}`;
      navigator.clipboard.writeText(secretUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    }
  };

  // IF NOT authorized via secret token in URL OR active session: render 404 Not Found Page
  if (!isAuthorizedToViewAdmin) {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-lg space-y-4 w-full">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground text-3xl font-mono font-bold shadow-inner">
            404
          </div>
          <h1 className="text-3xl font-bold font-display">Page Not Found</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist, has been removed, or requires specific
            authorization credentials.
          </p>
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow transition-smooth hover:opacity-90"
            >
              <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If NOT authenticated, show Admin Login Portal screen
  if (!store.isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30 shadow-sm">
              <Lock className="h-8 w-8" />
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold">Admin Portal Login</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {store.site.name} · {store.site.department}
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Username
              </label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Username (e.g. admin)"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password / Passcode
              </label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-12 py-2.5 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {pinError && (
                <p className="mt-2 text-xs font-medium text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Invalid username or password. Please try
                  again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
            >
              Log In to Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  const selectedTeam = store.teams.find((t) => t.slug === selectedTeamSlug);
  const unreadCount = store.messages.filter((m) => m.status === "New").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Admin Top Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={store.site.logoUrl}
              alt={store.site.name}
              className="h-14 w-14 rounded-full ring-2 ring-primary/40 object-contain bg-background p-1 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight">TWA Admin Panel</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                <ShieldCheck className="h-3.5 w-3.5" /> System Master
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Managing {store.site.name} · {store.site.department}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Lock / Unlock Status Badge */}
          {!isPanelLocked ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Unlock className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Panel Unlocked (Full Access)</span>
              <span className="sm:hidden">Unlocked</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Panel Locked (Protected Mode)</span>
              <span className="sm:hidden">Locked</span>
            </div>
          )}

          {/* Interactive Lock / Unlock Toggle Button */}
          {!isPanelLocked ? (
            <button
              onClick={handleLockPanel}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-smooth hover:bg-amber-500/20 shadow-xs"
            >
              <Lock className="h-3.5 w-3.5 text-amber-600" /> Lock Panel
            </button>
          ) : (
            <button
              onClick={() => setShowUnlockModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-smooth hover:bg-emerald-700"
            >
              <Unlock className="h-3.5 w-3.5" /> Unlock Panel
            </button>
          )}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-smooth hover:bg-primary/90"
          >
            <Eye className="h-3.5 w-3.5" /> Live Site
          </a>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-foreground text-background px-5 py-3 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Locked Alert Warning Banner */}
      {isPanelLocked && (
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Panel is locked in Protected Mode.</strong> Creating, editing, and deleting
              items require unlocking.
            </span>
          </div>
          <button
            onClick={() => setShowUnlockModal(true)}
            className="rounded-xl bg-amber-600 px-3.5 py-1.5 font-semibold text-white hover:bg-amber-700 shadow-xs shrink-0"
          >
            Click to Unlock
          </button>
        </div>
      )}

      {/* Unlock Panel Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <Unlock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Unlock Admin Panel</h3>
                  <p className="text-xs text-muted-foreground">
                    Enter Passcode / PIN to enable full access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUnlockPanelSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                  Admin Passcode / PIN
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter Admin PIN"
                  value={unlockPinInput}
                  onChange={(e) => {
                    setUnlockPinInput(e.target.value);
                    setUnlockPinError(false);
                  }}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 font-mono tracking-widest text-center"
                />
                {unlockPinError && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1 justify-center">
                    <AlertCircle className="h-3.5 w-3.5" /> Incorrect Passcode. Please try again.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-smooth"
                >
                  Unlock Panel Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="mt-6 flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" /> Overview
        </button>

        <button
          onClick={() => {
            setActiveTab("branding");
            setSiteForm(store.site);
          }}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "branding"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" /> Site &amp; Logo
        </button>

        <button
          onClick={() => {
            setActiveTab("stats");
            setEditingStats(store.stats);
          }}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "stats"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <BarChart2 className="h-4 w-4" /> Site Stats ({store.stats.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("announcement");
            setAnnouncementForm(store.announcement);
          }}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "announcement"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Megaphone className="h-4 w-4" /> Announcement Bar
        </button>

        <button
          onClick={() => {
            setActiveTab("department");
            setDeptForm(store.departmentInfo);
          }}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "department"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Department Info
        </button>

        <button
          onClick={() => setActiveTab("events")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "events"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" /> Events ({store.events.length})
        </button>

        <button
          onClick={() => setActiveTab("leadership")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "leadership"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" /> Office Bearers ({store.office.length})
        </button>

        <button
          onClick={() => setActiveTab("teams")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "teams"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" /> Teams ({store.teams.length})
        </button>

        <button
          onClick={() => setActiveTab("media")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "media"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <ImageIcon className="h-4 w-4" /> Media &amp; Uploads
        </button>

        <button
          onClick={() => setActiveTab("inquiries")}
          className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "inquiries"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4" /> Messages
          {unreadCount > 0 && (
            <span className="ml-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Users &amp; Access ({store.adminUsers.length})
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "system"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <RefreshCw className="h-4 w-4" /> Inbuilt System Config
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-smooth ${
            activeTab === "settings"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <KeyRound className="h-4 w-4" /> Passcode &amp; Tokens
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="mt-6 space-y-6">
          {/* Quick Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Events</span>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{store.events.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {store.events.filter((e) => e.status === "Upcoming").length} upcoming scheduled
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Office Bearers
                </span>
                <UserCheck className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{store.office.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Leadership &amp; Faculty Advisory
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Specialized Wings
                </span>
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{store.teams.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {store.teams.reduce((acc, t) => acc + t.members.length, 0)} registered wing members
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Contact Inquiries
                </span>
                <MessageSquare className="h-5 w-5 text-amber-500" />
              </div>
              <div className="mt-3 font-display text-3xl font-bold">{store.messages.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {unreadCount} unread message{unreadCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {/* Logo & Quick Branding Widget */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                  Active Logo Asset
                </div>
                <div className="mt-3 flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
                  <img
                    src={store.site.logoUrl}
                    alt={store.site.name}
                    className="h-16 w-16 rounded-full bg-background p-1.5 ring-2 ring-primary/40 object-contain shadow-sm"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{store.site.name}</h3>
                    <p className="text-xs text-muted-foreground">{store.site.short} Emblem</p>
                    <span className="mt-1 inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab("branding");
                  setSiteForm(store.site);
                }}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2 text-xs font-semibold text-foreground hover:bg-accent transition-smooth"
              >
                <ImageIcon className="h-4 w-4" /> Manage Logo &amp; Details
              </button>
            </div>

            {/* Quick Actions & Recent Messages */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-base">Quick Shortcuts</h3>
                <span className="text-xs text-muted-foreground">Admin Actions</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => {
                    setActiveTab("events");
                    setShowAddEvent(true);
                  }}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:border-primary/50 hover:bg-accent/50 transition-smooth"
                >
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Post New Event</div>
                    <div className="text-[11px] text-muted-foreground">
                      Publish hackathon or talk
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("leadership");
                    setShowAddOffice(true);
                  }}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:border-primary/50 hover:bg-accent/50 transition-smooth"
                >
                  <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Add Office Bearer</div>
                    <div className="text-[11px] text-muted-foreground">Update executive team</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:border-primary/50 hover:bg-accent/50 transition-smooth"
                >
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Check Inbox</div>
                    <div className="text-[11px] text-muted-foreground">
                      {unreadCount} pending messages
                    </div>
                  </div>
                </button>
              </div>

              {/* Recent Inquiries List preview */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Latest Student Inquiries
                  </h4>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {store.messages.slice(0, 3).map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {msg.name}
                          <span className="text-[10px] font-normal text-muted-foreground">
                            ({msg.email})
                          </span>
                        </div>
                        <div className="text-muted-foreground line-clamp-1">
                          {msg.subject || msg.message}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          msg.status === "New"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SITE & LOGO */}
      {activeTab === "branding" && (
        <div className="mt-6 space-y-6">
          <form
            onSubmit={handleSaveSite}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 className="font-display text-xl font-bold">
                  Site Branding &amp; Logo Settings
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update association details, department name, contact info and logo emblem.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>

            {siteSaved && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Site details updated successfully!
              </div>
            )}

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Logo Manager Box & Adjustment Suite */}
              <div className="md:col-span-2 rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-foreground">
                    Association Logo Emblem & Adjustment Suite
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload your association logo and fine-tune its shape, size scale, padding, fit
                    mode, and background color.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div
                        className={`relative flex items-center justify-center overflow-hidden ring-4 ring-primary/30 shadow-md ${
                          (siteForm.logoShape || "circle") === "circle"
                            ? "rounded-full"
                            : (siteForm.logoShape || "circle") === "square"
                              ? "rounded-none"
                              : (siteForm.logoShape || "circle") === "pill"
                                ? "rounded-2xl"
                                : "rounded-xl"
                        }`}
                        style={{
                          backgroundColor: siteForm.logoBg || "transparent",
                          padding: `${siteForm.logoPadding ?? 2}px`,
                          width: `${72 * ((siteForm.logoScale || 100) / 100)}px`,
                          height: `${72 * ((siteForm.logoScale || 100) / 100)}px`,
                        }}
                      >
                        <img
                          src={siteForm.logoUrl}
                          alt="Logo preview"
                          className={`h-full w-full ${
                            siteForm.logoFit === "cover"
                              ? "object-cover"
                              : siteForm.logoFit === "fill"
                                ? "object-fill"
                                : "object-contain"
                          }`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/favicon.ico";
                          }}
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div>
                          <span className="text-xs text-muted-foreground font-semibold block mb-1">
                            Upload Logo Image from Device:
                          </span>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-smooth">
                            <Upload className="h-3.5 w-3.5" /> Choose Logo File...
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoFile}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <span className="text-xs text-muted-foreground font-semibold block mb-1">
                            Or Image URL / File Path:
                          </span>
                          <input
                            type="text"
                            value={siteForm.logoUrl}
                            onChange={(e) => setSiteForm({ ...siteForm, logoUrl: e.target.value })}
                            className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interactive Logo Adjusters */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border/60">
                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                          Logo Size Scale: {siteForm.logoScale || 100}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="180"
                          step="5"
                          value={siteForm.logoScale || 100}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, logoScale: parseInt(e.target.value) })
                          }
                          className="w-full accent-primary cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                          Logo Padding: {siteForm.logoPadding ?? 2}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={siteForm.logoPadding ?? 2}
                          onChange={(e) =>
                            setSiteForm({ ...siteForm, logoPadding: parseInt(e.target.value) })
                          }
                          className="w-full accent-primary cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                          Emblem Shape
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(["circle", "rounded", "square", "pill"] as const).map((shape) => (
                            <button
                              key={shape}
                              type="button"
                              onClick={() => setSiteForm({ ...siteForm, logoShape: shape })}
                              className={`rounded-lg py-1.5 text-xs font-semibold capitalize border transition-smooth ${
                                (siteForm.logoShape || "circle") === shape
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border bg-background hover:bg-accent"
                              }`}
                            >
                              {shape}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                          Object Fit Mode
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(["contain", "cover", "fill"] as const).map((fit) => (
                            <button
                              key={fit}
                              type="button"
                              onClick={() => setSiteForm({ ...siteForm, logoFit: fit })}
                              className={`rounded-lg py-1.5 text-xs font-semibold capitalize border transition-smooth ${
                                (siteForm.logoFit || "contain") === fit
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border bg-background hover:bg-accent"
                              }`}
                            >
                              {fit}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                          Background Fill Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: "Transparent", val: "transparent" },
                            { name: "Pure White", val: "#ffffff" },
                            { name: "Dark Navy", val: "#0f172a" },
                            { name: "Slate Gray", val: "#1e293b" },
                            { name: "Primary Tint", val: "rgba(59, 130, 246, 0.1)" },
                          ].map((bg) => (
                            <button
                              key={bg.val}
                              type="button"
                              onClick={() => setSiteForm({ ...siteForm, logoBg: bg.val })}
                              className={`rounded-lg px-3 py-1 text-xs font-medium border flex items-center gap-1.5 transition-smooth ${
                                (siteForm.logoBg || "transparent") === bg.val
                                  ? "border-primary ring-2 ring-primary/30 bg-primary/10 font-bold"
                                  : "border-border bg-background hover:bg-accent"
                              }`}
                            >
                              <span
                                className="h-3 w-3 rounded-full border border-border shadow-xs"
                                style={{ backgroundColor: bg.val }}
                              />
                              {bg.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Navbar Header Mockup Preview */}
                  <div className="w-full lg:w-72 shrink-0 rounded-2xl border border-border/80 bg-background p-4 shadow-sm space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Live Navbar Header Preview
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 shadow-xs space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative flex items-center justify-center overflow-hidden ring-2 ring-primary/20 shadow-xs ${
                            (siteForm.logoShape || "circle") === "circle"
                              ? "rounded-full"
                              : (siteForm.logoShape || "circle") === "square"
                                ? "rounded-none"
                                : (siteForm.logoShape || "circle") === "pill"
                                  ? "rounded-2xl"
                                  : "rounded-xl"
                          }`}
                          style={{
                            backgroundColor: siteForm.logoBg || "transparent",
                            padding: `${siteForm.logoPadding ?? 2}px`,
                            width: `${36 * ((siteForm.logoScale || 100) / 100)}px`,
                            height: `${36 * ((siteForm.logoScale || 100) / 100)}px`,
                          }}
                        >
                          <img
                            src={siteForm.logoUrl}
                            alt="Mockup logo"
                            className={`h-full w-full ${
                              siteForm.logoFit === "cover"
                                ? "object-cover"
                                : siteForm.logoFit === "fill"
                                  ? "object-fill"
                                  : "object-contain"
                            }`}
                          />
                        </div>
                        <div className="leading-tight overflow-hidden">
                          <div className="font-display text-xs font-bold truncate">
                            {siteForm.name || "Tech Wizard Association"}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {siteForm.department || "Dept. of Computer Applications"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-normal text-center">
                      This mockup shows exactly how your adjusted logo emblem renders in the top
                      navigation bar across all pages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Site Text Fields */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Association Name
                </label>
                <input
                  type="text"
                  value={siteForm.name}
                  onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Abbreviation / Short Name
                </label>
                <input
                  type="text"
                  value={siteForm.short}
                  onChange={(e) => setSiteForm({ ...siteForm, short: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  College Name
                </label>
                <input
                  type="text"
                  value={siteForm.college}
                  onChange={(e) => setSiteForm({ ...siteForm, college: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={siteForm.department}
                  onChange={(e) => setSiteForm({ ...siteForm, department: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Association Tagline
                </label>
                <input
                  type="text"
                  value={siteForm.tagline}
                  onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={siteForm.email}
                  onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={siteForm.phone}
                  onChange={(e) => setSiteForm({ ...siteForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Campus Address
                </label>
                <textarea
                  rows={2}
                  value={siteForm.address}
                  onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: SITE STATS & METRICS */}
      {activeTab === "stats" && (
        <div className="mt-6 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isPanelLocked) {
                setShowUnlockModal(true);
                return;
              }
              store.updateStats(editingStats);
              setStatsSaved(true);
              showToast("✅ Site statistics updated and synced across website!");
              setTimeout(() => setStatsSaved(false), 3000);
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Site Key Performance Indicators &amp; Statistics
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configure numbers displayed on the home page hero section (e.g. 150+ Active
                  Members, 45+ Projects Built, 12+ Annual Events, 5 Tech Wings).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const defaultStats = [
                      { label: "Active Members", value: "150+" },
                      { label: "Projects Built", value: "45+" },
                      { label: "Annual Events", value: "12+" },
                      { label: "Tech Wings", value: "5 Wings" },
                    ];
                    setEditingStats(defaultStats);
                    store.updateStats(defaultStats);
                    showToast("Reset statistics to TWA official defaults!");
                  }}
                  className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
                >
                  <Save className="h-4 w-4" /> Save &amp; Sync Stats
                </button>
              </div>
            </div>

            {statsSaved && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Statistics updated and published live!
              </div>
            )}

            {/* Editable Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {editingStats.map((st, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-muted/20 p-4 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                      Metric #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingStats.filter((_, i) => i !== idx);
                        setEditingStats(updated);
                      }}
                      className="rounded-lg p-1 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-smooth"
                      title="Remove metric"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Label / Name
                    </label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const updated = [...editingStats];
                        updated[idx].label = e.target.value;
                        setEditingStats(updated);
                      }}
                      placeholder="e.g. Active Members"
                      className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Count Value
                    </label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...editingStats];
                        updated[idx].value = e.target.value;
                        setEditingStats(updated);
                      }}
                      placeholder="e.g. 150+ / 5 Wings"
                      className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Stat Metric Card */}
            <div className="rounded-2xl border border-dashed border-border bg-background p-4 space-y-3">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-primary" /> Add Custom Metric Card
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Metric Label (e.g. Code Repositories)"
                  value={newStatLabel}
                  onChange={(e) => setNewStatLabel(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 80+ / 100%)"
                  value={newStatValue}
                  onChange={(e) => setNewStatValue(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newStatLabel.trim() || !newStatValue.trim()) return;
                    setEditingStats([
                      ...editingStats,
                      { label: newStatLabel.trim(), value: newStatValue.trim() },
                    ]);
                    setNewStatLabel("");
                    setNewStatValue("");
                    showToast("Added new stat metric card!");
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
                >
                  Add Metric
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: ANNOUNCEMENT BAR */}
      {activeTab === "announcement" && (
        <div className="mt-6 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isPanelLocked) {
                setShowUnlockModal(true);
                return;
              }
              store.updateAnnouncement(announcementForm);
              setAnnouncementSaved(true);
              showToast("✅ Site Announcement Bar settings updated!");
              setTimeout(() => setAnnouncementSaved(false), 3000);
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  Website Announcement Bar
                </h2>
                <p className="text-xs text-muted-foreground">
                  Display site-wide notifications, event registrations, or important news across all
                  pages in a sleek transparent or glassmorphic style.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
              >
                <Save className="h-4 w-4" /> Save Announcement Settings
              </button>
            </div>

            {announcementSaved && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Announcement settings updated successfully!
              </div>
            )}

            {/* Toggle Status & Live Preview */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Announcement Status
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable the announcement bar across the website
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementForm.enabled}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, enabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-xs font-semibold">
                    {announcementForm.enabled ? "ACTIVE (Visible)" : "HIDDEN (Disabled)"}
                  </span>
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-primary" /> Live Style Preview
                </div>

                <div className="overflow-hidden rounded-xl border border-border/80 bg-background/50 p-2">
                  <div
                    className={`rounded-lg py-2.5 px-4 transition-all ${
                      announcementForm.style === "transparent"
                        ? "bg-primary/10 backdrop-blur-md border border-primary/20 text-foreground"
                        : announcementForm.style === "glass"
                          ? "bg-background/60 backdrop-blur-xl border border-border/80 text-foreground"
                          : announcementForm.style === "gradient"
                            ? "bg-gradient-to-r from-primary/20 via-purple-500/15 to-indigo-500/20 backdrop-blur-md border border-primary/30 text-foreground"
                            : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                          {announcementForm.badge || "ANNOUNCEMENT"}
                        </span>
                        <span className="font-medium">
                          {announcementForm.text || "Your announcement message will appear here..."}
                        </span>
                        {announcementForm.linkText && (
                          <span className="font-semibold text-primary underline flex items-center gap-1">
                            {announcementForm.linkText} <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <X className="h-4 w-4 opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Display Position
                </label>
                <select
                  value={announcementForm.position || "bottom-popup"}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      position: e.target.value as AnnouncementInfo["position"],
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="bottom-popup">📌 Bottom Popup (Floating Card on Load)</option>
                  <option value="top-bar">⬆️ Top Bar (Header Banner)</option>
                </select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Bottom Popup loads fixed at the bottom center of the page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Popup Stay Duration (Auto-Dismiss)
                </label>
                <select
                  value={announcementForm.durationSeconds ?? 10}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      durationSeconds: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={5}>⏱️ 5 Seconds</option>
                  <option value={10}>⏱️ 10 Seconds (Default)</option>
                  <option value={15}>⏱️ 15 Seconds</option>
                  <option value={30}>⏱️ 30 Seconds</option>
                  <option value={0}>♾️ Permanent (Until closed by user)</option>
                </select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sets how long the announcement stays visible when a visitor loads the website.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Style Variant
                </label>
                <select
                  value={announcementForm.style}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      style: e.target.value as AnnouncementInfo["style"],
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="transparent">✨ Transparent (Glassmorphic Blur)</option>
                  <option value="glass">🪟 Glass Card (Translucent Off-White)</option>
                  <option value="gradient">🌈 Gradient Glow Accent</option>
                  <option value="solid">🎨 Solid Accent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={announcementForm.badge}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, badge: e.target.value })
                  }
                  placeholder="e.g. ANNOUNCEMENT, HACKATHON 2026, NEW"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Announcement Message
                </label>
                <textarea
                  rows={2}
                  value={announcementForm.text}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, text: e.target.value })
                  }
                  placeholder="Enter the main announcement message..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Call-to-Action Link Text
                </label>
                <input
                  type="text"
                  value={announcementForm.linkText}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, linkText: e.target.value })
                  }
                  placeholder="e.g. Explore Events, Register Now"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Target Page / Link URL
                </label>
                <input
                  type="text"
                  value={announcementForm.linkUrl}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, linkUrl: e.target.value })
                  }
                  placeholder="e.g. /events, /contact, /department"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: DEPARTMENT INFO */}
      {activeTab === "department" && (
        <div className="mt-6 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isPanelLocked) {
                setShowUnlockModal(true);
                return;
              }
              store.updateDepartmentInfo(deptForm);
              setDeptSaved(true);
              showToast("✅ Department details updated successfully!");
              setTimeout(() => setDeptSaved(false), 3000);
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Department Information &amp; Curriculum Management
                </h2>
                <p className="text-xs text-muted-foreground">
                  Edit department overview, HOD message, vision, mission, academic programs, and lab
                  facilities displayed on the Home and Department pages.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
              >
                <Save className="h-4 w-4" /> Save Department Data
              </button>
            </div>

            {deptSaved && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Department details saved successfully!
              </div>
            )}

            {/* Department Overview & Vision */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Department Overview / Summary
                </label>
                <textarea
                  rows={3}
                  value={deptForm.overview}
                  onChange={(e) => setDeptForm({ ...deptForm, overview: e.target.value })}
                  placeholder="Enter detailed department overview..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Department Vision Statement
                </label>
                <textarea
                  rows={2}
                  value={deptForm.vision}
                  onChange={(e) => setDeptForm({ ...deptForm, vision: e.target.value })}
                  placeholder="Enter department vision statement..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* HOD / Leadership Section */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-5 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <UserCheck className="h-4 w-4 text-primary" /> Head of Department (HOD) Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    HOD Name
                  </label>
                  <input
                    type="text"
                    value={deptForm.hodName}
                    onChange={(e) => setDeptForm({ ...deptForm, hodName: e.target.value })}
                    placeholder="e.g. Dr. K. Mohamed Ismail"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={deptForm.hodRole}
                    onChange={(e) => setDeptForm({ ...deptForm, hodRole: e.target.value })}
                    placeholder="e.g. Head of Department (DCA)"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    HOD Welcome Message / Quote
                  </label>
                  <textarea
                    rows={2}
                    value={deptForm.hodMessage}
                    onChange={(e) => setDeptForm({ ...deptForm, hodMessage: e.target.value })}
                    placeholder="Welcome message from the HOD..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    HOD Photo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={deptForm.hodPhotoUrl || ""}
                    onChange={(e) => setDeptForm({ ...deptForm, hodPhotoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Faculty Members Management Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display">Faculty & Staff Members</h3>
                  <p className="text-xs text-muted-foreground">
                    Add professors, assistant professors, and faculty staff under Department
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFacultyMember(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-smooth hover:bg-primary/20"
                >
                  <Plus className="h-4 w-4" /> Add Faculty Member
                </button>
              </div>

              {showAddFacultyMember && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <div className="text-xs font-semibold text-primary">
                    New Faculty Member Details
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. A. Mohamed Sithik"
                        value={newFacultyMember.name}
                        onChange={(e) =>
                          setNewFacultyMember({ ...newFacultyMember, name: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Assistant Professor"
                        value={newFacultyMember.designation}
                        onChange={(e) =>
                          setNewFacultyMember({ ...newFacultyMember, designation: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. M.C.A., M.Phil., Ph.D."
                        value={newFacultyMember.qualification}
                        onChange={(e) =>
                          setNewFacultyMember({
                            ...newFacultyMember,
                            qualification: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. faculty@shasc.edu.in"
                        value={newFacultyMember.email}
                        onChange={(e) =>
                          setNewFacultyMember({ ...newFacultyMember, email: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                        Photo URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newFacultyMember.photoUrl}
                        onChange={(e) =>
                          setNewFacultyMember({ ...newFacultyMember, photoUrl: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFacultyMember(false)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFacultyMember.name.trim()) return;
                        const createdMember = {
                          ...newFacultyMember,
                          id: `fac-${Date.now()}`,
                        };
                        const updatedFaculty = [...(deptForm.faculty || []), createdMember];
                        setDeptForm({ ...deptForm, faculty: updatedFaculty });
                        setNewFacultyMember({
                          name: "",
                          designation: "Assistant Professor",
                          qualification: "",
                          email: "",
                          photoUrl: "",
                        });
                        setShowAddFacultyMember(false);
                      }}
                      className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      Save Faculty Member
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {!deptForm.faculty || deptForm.faculty.length === 0 ? (
                  <div className="sm:col-span-2 text-xs text-muted-foreground italic rounded-xl border border-dashed border-border p-6 text-center">
                    No faculty members added yet. Click "Add Faculty Member" above to add department
                    staff.
                  </div>
                ) : (
                  deptForm.faculty.map((f, idx) => (
                    <div
                      key={f.id || idx}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3.5 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-foreground truncate">
                          {f.name}
                        </div>
                        <div className="text-[11px] text-primary">{f.designation}</div>
                        {f.qualification && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            {f.qualification}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFaculty = (deptForm.faculty || []).filter(
                            (_, i) => i !== idx,
                          );
                          setDeptForm({ ...deptForm, faculty: updatedFaculty });
                        }}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-smooth shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mission Statements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-muted-foreground uppercase">
                  Mission Statements ({deptForm.mission.length})
                </label>
              </div>

              <div className="space-y-2">
                {deptForm.mission.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newMission = [...deptForm.mission];
                        newMission[idx] = e.target.value;
                        setDeptForm({ ...deptForm, mission: newMission });
                      }}
                      className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newMission = deptForm.mission.filter((_, i) => i !== idx);
                        setDeptForm({ ...deptForm, mission: newMission });
                      }}
                      className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-smooth"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add a new mission statement..."
                  value={newMissionInput}
                  onChange={(e) => setNewMissionInput(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newMissionInput.trim()) return;
                    setDeptForm({
                      ...deptForm,
                      mission: [...deptForm.mission, newMissionInput.trim()],
                    });
                    setNewMissionInput("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Add Mission
                </button>
              </div>
            </div>

            {/* Programs Offered Management */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display">Offered Academic Programs</h3>
                  <p className="text-xs text-muted-foreground">
                    Courses and degrees offered under the department
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProgram(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-smooth hover:bg-primary/20"
                >
                  <Plus className="h-4 w-4" /> Add Program
                </button>
              </div>

              {showAddProgram && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <div className="text-xs font-semibold text-primary">New Program Details</div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="Code (e.g. BCA)"
                      value={newProgram.code}
                      onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Program Name (e.g. Bachelor of Computer Applications)"
                      value={newProgram.name}
                      onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Duration/Type (e.g. 3 Years · UG)"
                      value={newProgram.years}
                      onChange={(e) => setNewProgram({ ...newProgram, years: e.target.value })}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Short description..."
                    value={newProgram.desc}
                    onChange={(e) => setNewProgram({ ...newProgram, desc: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProgram(false)}
                      className="rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newProgram.code.trim() || !newProgram.name.trim()) return;
                        setDeptForm({
                          ...deptForm,
                          programs: [...deptForm.programs, newProgram],
                        });
                        setNewProgram({ code: "", name: "", years: "", desc: "" });
                        setShowAddProgram(false);
                      }}
                      className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs"
                    >
                      Save Program
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {deptForm.programs.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-card p-4 shadow-xs relative space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold font-mono">
                        {p.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = deptForm.programs.filter((_, i) => i !== idx);
                          setDeptForm({ ...deptForm, programs: updated });
                        }}
                        className="text-muted-foreground hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{p.years}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Wizard Association Motive Management */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Tech Wizard Association Motive
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Core objectives, values, and technological vision of TWA
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFacility(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-smooth hover:bg-primary/20"
                >
                  <Plus className="h-4 w-4" /> Add Motive Pillar
                </button>
              </div>

              {showAddFacility && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <div className="text-xs font-semibold text-primary">
                    New Motive Pillar Details
                  </div>
                  <input
                    type="text"
                    placeholder="Motive Title (e.g. Hands-on Innovation & Projects)"
                    value={newFacility.title}
                    onChange={(e) => setNewFacility({ ...newFacility, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Motive Description..."
                    value={newFacility.desc}
                    onChange={(e) => setNewFacility({ ...newFacility, desc: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFacility(false)}
                      className="rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFacility.title.trim()) return;
                        setDeptForm({
                          ...deptForm,
                          facilities: [...deptForm.facilities, newFacility],
                        });
                        setNewFacility({ title: "", desc: "" });
                        setShowAddFacility(false);
                      }}
                      className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs"
                    >
                      Save Facility
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {deptForm.facilities.map((f, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">{f.title}</div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = deptForm.facilities.filter((_, i) => i !== idx);
                          setDeptForm({ ...deptForm, facilities: updated });
                        }}
                        className="text-muted-foreground hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: EVENTS */}
      {activeTab === "events" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">Events &amp; Programs Manager</h2>
              <p className="text-xs text-muted-foreground">
                Manage upcoming hackathons, workshops, guest lectures and competitions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {store.events.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to remove all events and start with a clean state?",
                      )
                    ) {
                      store.clearAllEvents();
                      showToast("Removed all pre-populated events. State auto-saved.");
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-smooth"
                >
                  <Trash2 className="h-4 w-4" /> Clear All Pre-Events
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  showToast("💾 All events and photo changes saved and synced!");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-smooth"
              >
                <Save className="h-4 w-4" /> Save All Event Changes
              </button>

              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
              >
                <Plus className="h-4 w-4" /> Add Event
              </button>
            </div>
          </div>

          {/* Add Event Form Modal / Expand */}
          {showAddEvent && (
            <form
              onSubmit={handleCreateEvent}
              className="rounded-2xl border border-primary/30 bg-card p-6 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Create New TWA Event
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CodeStorm '26 Hackathon"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aug 22, 2026"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newEvent.tag}
                    onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Flagship</option>
                    <option>Workshop</option>
                    <option>Competition</option>
                    <option>Guest Talk</option>
                    <option>Symposium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={newEvent.status}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, status: e.target.value as EventItem["status"] })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Featured">Featured</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief details about the event guidelines, prize pool, or speakers..."
                    value={newEvent.desc}
                    onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Event Poster / Image (Optional - Upload from Device)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
                    {newEvent.imageUrl ? (
                      <img
                        src={newEvent.imageUrl}
                        alt="Event poster"
                        className="h-16 w-16 rounded-xl object-cover ring-2 ring-primary/40 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent text-xs font-bold text-muted-foreground shadow-xs">
                        No Image
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEventImageFile}
                        className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                      <input
                        type="url"
                        placeholder="Or paste event image URL (e.g. https://...)"
                        value={newEvent.imageUrl}
                        onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Save &amp; Publish Event
                </button>
              </div>
            </form>
          )}

          {/* Events List Table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {store.events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 sm:p-5 hover:bg-accent/30 transition-smooth space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {evt.imageUrl ? (
                        <img
                          src={evt.imageUrl}
                          alt={evt.title}
                          className="h-14 w-14 rounded-xl object-cover ring-1 ring-primary/30 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/60 text-muted-foreground text-xs font-semibold">
                          No Image
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">{evt.title}</span>
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                            {evt.tag}
                          </span>
                          {evt.status && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                evt.status === "Featured"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : evt.status === "Completed"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-emerald-500/10 text-emerald-600"
                              }`}
                            >
                              {evt.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground max-w-2xl">{evt.desc}</p>
                        <div className="text-[11px] font-medium text-muted-foreground flex flex-wrap items-center gap-3 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {evt.date}
                          </span>
                          <label className="inline-flex cursor-pointer items-center gap-1 text-[10px] text-primary hover:underline">
                            <Upload className="h-3 w-3" />{" "}
                            {evt.imageUrl ? "Change Poster" : "Upload Poster"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const res = ev.target?.result as string;
                                    if (res) store.updateEvent(evt.id, { imageUrl: res });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setActivePhotoEventId(activePhotoEventId === evt.id ? null : evt.id)
                            }
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full hover:bg-indigo-500/20"
                          >
                            <ImageIcon className="h-3 w-3" /> Event Photos (
                            {evt.photos?.length || 0})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Event Action Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (isPanelLocked) {
                            setShowUnlockModal(true);
                          } else {
                            if (editingEventId === evt.id) {
                              setEditingEventId(null);
                            } else {
                              setEditingEventId(evt.id);
                              setEditEventForm({
                                title: evt.title,
                                date: evt.date,
                                tag: evt.tag,
                                status: evt.status,
                                desc: evt.desc,
                                imageUrl: evt.imageUrl,
                                location: evt.location || "",
                              });
                            }
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-smooth ${
                          editingEventId === evt.id
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                        }`}
                        title="Edit event details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />{" "}
                        {editingEventId === evt.id ? "Close Edit" : "Edit Event"}
                      </button>

                      {deleteConfirmId === evt.id ? (
                        <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                          <span className="text-xs font-semibold text-rose-600">Remove event?</span>
                          <button
                            onClick={() => {
                              store.deleteEvent(evt.id);
                              setDeleteConfirmId(null);
                              showToast(`Event "${evt.title}" removed and saved.`);
                            }}
                            className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-smooth"
                          >
                            Confirm Remove &amp; Save
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:bg-accent transition-smooth"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (isPanelLocked) {
                              setShowUnlockModal(true);
                            } else {
                              setDeleteConfirmId(evt.id);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/15 hover:border-rose-500/40 transition-smooth"
                          title="Delete event"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Edit Event Form with Save Changes Option */}
                  {editingEventId === evt.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!editEventForm.title?.trim()) return;
                        store.updateEvent(evt.id, editEventForm);
                        setEditingEventId(null);
                        showToast(`Saved changes for event "${editEventForm.title}"!`);
                      }}
                      className="rounded-xl border border-primary/40 bg-card p-5 shadow-md space-y-4 animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                          <Edit2 className="h-4 w-4" /> Edit Event Details &amp; Save Changes
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingEventId(null)}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            Event Title
                          </label>
                          <input
                            type="text"
                            required
                            value={editEventForm.title || ""}
                            onChange={(e) =>
                              setEditEventForm({ ...editEventForm, title: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            Scheduled Date
                          </label>
                          <input
                            type="text"
                            required
                            value={editEventForm.date || ""}
                            onChange={(e) =>
                              setEditEventForm({ ...editEventForm, date: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            Category Tag
                          </label>
                          <select
                            value={editEventForm.tag || "Workshop"}
                            onChange={(e) =>
                              setEditEventForm({ ...editEventForm, tag: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option>Flagship</option>
                            <option>Workshop</option>
                            <option>Competition</option>
                            <option>Guest Talk</option>
                            <option>Symposium</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            Status
                          </label>
                          <select
                            value={editEventForm.status || "Upcoming"}
                            onChange={(e) =>
                              setEditEventForm({
                                ...editEventForm,
                                status: e.target.value as EventItem["status"],
                              })
                            }
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Featured">Featured</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            Location / Venue
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Main Seminar Hall / Online via Google Meet"
                            value={editEventForm.location || ""}
                            onChange={(e) =>
                              setEditEventForm({ ...editEventForm, location: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={editEventForm.desc || ""}
                            onChange={(e) =>
                              setEditEventForm({ ...editEventForm, desc: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            Event Poster Image URL / Upload File
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={editEventForm.imageUrl || ""}
                              onChange={(e) =>
                                setEditEventForm({ ...editEventForm, imageUrl: e.target.value })
                              }
                              placeholder="Paste Image URL"
                              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-muted border border-border px-3 py-2 text-xs font-semibold hover:bg-accent shrink-0">
                              <Upload className="h-3.5 w-3.5" /> Upload File...
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const res = ev.target?.result as string;
                                      if (res)
                                        setEditEventForm({
                                          ...editEventForm,
                                          imageUrl: res,
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                        <button
                          type="button"
                          onClick={() => setEditingEventId(null)}
                          className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent transition-smooth"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:opacity-90 transition-smooth"
                        >
                          <Save className="h-3.5 w-3.5" /> Save Changes
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Expandable Event Photo Upload & Gallery Manager */}
                  {activePhotoEventId === evt.id && (
                    <div className="mt-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5" /> Event Photo Memories
                        </span>
                        <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                          Team Permission: Authorized
                        </span>
                      </div>

                      {/* Upload Photo Form */}
                      <div className="grid gap-2 sm:grid-cols-3 items-end pt-1">
                        <div className="sm:col-span-2 space-y-2">
                          <div className="flex gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 shrink-0">
                              <Upload className="h-3.5 w-3.5" /> Select Photo...
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const res = ev.target?.result as string;
                                      if (res) setPhotoInputUrl(res);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or paste photo image URL..."
                              value={photoInputUrl}
                              onChange={(e) => setPhotoInputUrl(e.target.value)}
                              className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Photo caption (e.g. Hackathon Winners, Workshop Crowd)..."
                            value={photoCaptionInput}
                            onChange={(e) => setPhotoCaptionInput(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!photoInputUrl) return;
                            store.addEventPhoto(evt.id, photoInputUrl, photoCaptionInput);
                            setPhotoInputUrl("");
                            setPhotoCaptionInput("");
                            showToast("📸 Event photo uploaded successfully!");
                          }}
                          className="rounded-xl bg-indigo-600 py-2 px-4 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-smooth"
                        >
                          Add Photo to Memory
                        </button>
                      </div>

                      {/* Existing Photos Grid */}
                      {evt.photos && evt.photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
                          {evt.photos.map((p) => (
                            <div
                              key={p.id}
                              className="group relative h-20 overflow-hidden rounded-xl border border-border bg-background"
                            >
                              <img
                                src={p.url}
                                alt={p.caption || "Event photo"}
                                className="h-full w-full object-cover"
                              />
                              <button
                                onClick={() => {
                                  store.deleteEventPhoto(evt.id, p.id);
                                  showToast("Photo removed from gallery.");
                                }}
                                className="absolute right-1 top-1 rounded-full bg-rose-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-smooth"
                                title="Delete photo"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {p.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[9px] text-white truncate">
                                  {p.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground italic text-center py-2">
                          No photo memories uploaded yet for this event. Upload photos above.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEADERSHIP & OFFICE BEARERS */}
      {activeTab === "leadership" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">Office Bearers &amp; Advisors</h2>
              <p className="text-xs text-muted-foreground">
                Manage executive leadership, faculty advisors, and team secretaries.
              </p>
            </div>

            <button
              onClick={() => setShowAddOffice(!showAddOffice)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
            >
              <Plus className="h-4 w-4" /> Add Office Bearer
            </button>
          </div>

          {/* Add Office Bearer Form */}
          {showAddOffice && (
            <form
              onSubmit={handleCreateOffice}
              className="rounded-2xl border border-primary/30 bg-card p-6 shadow-md space-y-5 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" /> Add Leadership Member / Advisor
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddOffice(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Basic Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Basic Information &amp; Role
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohammed Arshad"
                      value={newOffice.name}
                      onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Designation / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. President, Vice President, Student Advisor"
                      value={newOffice.role}
                      onChange={(e) => setNewOffice({ ...newOffice, role: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Category Type
                    </label>
                    <select
                      value={newOffice.category || "Office Bearer"}
                      onChange={(e) => setNewOffice({ ...newOffice, category: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Candidate">Candidate / Nominated Leader</option>
                      <option value="Office Bearer">Office Bearer</option>
                      <option value="Advisor">Student Advisor</option>
                      <option value="Faculty Advisor">Faculty Advisor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Academic Year / Class
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. III MCA, II BCA, Faculty"
                      value={newOffice.year}
                      onChange={(e) => setNewOffice({ ...newOffice, year: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Term Period
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2025 – 2026"
                      value={newOffice.termYears}
                      onChange={(e) => setNewOffice({ ...newOffice, termYears: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Associated Wing / Team
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Executive Council, Advisory Board"
                      value={newOffice.team}
                      onChange={(e) => setNewOffice({ ...newOffice, team: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Social Links */}
              <div className="pt-2 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Contact Details &amp; Social Profiles
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. arshad@shasc.edu.in"
                      value={newOffice.email || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={newOffice.phone || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, phone: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={newOffice.linkedinUrl || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, linkedinUrl: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={newOffice.githubUrl || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, githubUrl: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Twitter / X URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://x.com/username"
                      value={newOffice.twitterUrl || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, twitterUrl: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Bio, Achievements, Skills */}
              <div className="pt-2 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Biography, Achievements &amp; Skills
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Profile Bio / Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short bio about the member's leadership role, vision, and contributions..."
                      value={newOffice.bio || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, bio: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Key Achievements / Awards
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Winner Smart India Hackathon 2025, Best Student Leader"
                      value={newOffice.achievements || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, achievements: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                      Key Skills / Specialization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React.js, Python, Event Management, Cyber Defense"
                      value={newOffice.skills || ""}
                      onChange={(e) => setNewOffice({ ...newOffice, skills: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="pt-2 border-t border-border/60">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                  Profile Photo (Upload Device Image or Paste URL)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
                  {newOffice.avatarUrl ? (
                    <img
                      src={newOffice.avatarUrl}
                      alt="Preview"
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-primary/40 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-xs font-bold text-primary-foreground shadow-sm">
                      {newOffice.name ? newOffice.name.substring(0, 2).toUpperCase() : "Photo"}
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOfficeAvatarFile}
                      className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="Or paste profile photo URL (e.g. https://...)"
                      value={newOffice.avatarUrl}
                      onChange={(e) => setNewOffice({ ...newOffice, avatarUrl: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddOffice(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:shadow-glow transition-smooth"
                >
                  Save Leadership Member
                </button>
              </div>
            </form>
          )}

          {/* Office Bearers Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {store.office.map((m) => {
              const isEditing = editingOfficeId === m.id;
              return (
                <div
                  key={m.id}
                  className="relative rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 transition-smooth hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative group shrink-0">
                        {m.avatarUrl ? (
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-primary/30 shadow-sm"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary font-display font-bold text-primary-foreground shadow-sm">
                            {m.initials}
                          </div>
                        )}
                        <label
                          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-smooth"
                          title="Upload photo from device"
                        >
                          <Upload className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const res = ev.target?.result as string;
                                  if (res) store.updateOfficeMember(m.id, { avatarUrl: res });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{m.name}</h3>
                        <p className="text-xs font-medium text-primary">{m.role}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {m.category || "Office Bearer"}
                          </span>
                          {m.termYears && (
                            <span className="inline-block text-[10px] text-muted-foreground font-mono">
                              • {m.termYears}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingOfficeId(null);
                          } else {
                            setEditingOfficeId(m.id);
                            setEditOfficeForm(m);
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-accent transition-smooth"
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-primary" />
                        {isEditing ? "Close" : "Edit"}
                      </button>

                      {deleteConfirmId === m.id ? (
                        <div className="flex items-center gap-1 animate-in fade-in duration-150">
                          <button
                            onClick={() => {
                              store.deleteOfficeMember(m.id);
                              setDeleteConfirmId(null);
                              showToast(`Removed "${m.name}".`);
                            }}
                            className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded-lg border border-border p-1 text-xs hover:bg-accent"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (isPanelLocked) {
                              setShowUnlockModal(true);
                            } else {
                              setDeleteConfirmId(m.id);
                            }
                          }}
                          className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-smooth"
                          title="Delete Member"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary & Badges */}
                  {!isEditing && (
                    <div className="space-y-2 text-xs text-muted-foreground border-t border-border/60 pt-2.5">
                      {m.bio && (
                        <p className="line-clamp-2 text-foreground/80 italic text-[11px]">
                          "{m.bio}"
                        </p>
                      )}
                      {m.achievements && (
                        <div className="text-[11px]">
                          <span className="font-semibold text-foreground">Highlights: </span>
                          {m.achievements}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                        {m.email && (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3 text-primary" /> {m.email}
                          </span>
                        )}
                        {m.phone && (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3 text-emerald-500" /> {m.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Inline Edit Form */}
                  {isEditing && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (isPanelLocked) {
                          setShowUnlockModal(true);
                          return;
                        }
                        store.updateOfficeMember(m.id, editOfficeForm);
                        setEditingOfficeId(null);
                        showToast(`Updated member details for "${editOfficeForm.name || m.name}".`);
                      }}
                      className="rounded-xl border border-primary/30 bg-muted/30 p-4 space-y-3 animate-in fade-in duration-150 text-xs"
                    >
                      <h4 className="text-xs font-bold uppercase text-primary flex items-center gap-1.5">
                        <Edit2 className="h-3.5 w-3.5" /> Edit Member Profile &amp; Contact Info
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editOfficeForm.name || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, name: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Role / Designation
                          </label>
                          <input
                            type="text"
                            value={editOfficeForm.role || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, role: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Category
                          </label>
                          <select
                            value={editOfficeForm.category || "Office Bearer"}
                            onChange={(e) =>
                              setEditOfficeForm({
                                ...editOfficeForm,
                                category: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          >
                            <option value="Office Bearer">Office Bearer</option>
                            <option value="Advisor">Student Advisor</option>
                            <option value="Faculty Advisor">Faculty Advisor</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Year / Class
                          </label>
                          <input
                            type="text"
                            value={editOfficeForm.year || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, year: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Term Period
                          </label>
                          <input
                            type="text"
                            value={editOfficeForm.termYears || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, termYears: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editOfficeForm.email || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, email: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="text"
                            value={editOfficeForm.phone || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, phone: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            value={editOfficeForm.linkedinUrl || ""}
                            onChange={(e) =>
                              setEditOfficeForm({
                                ...editOfficeForm,
                                linkedinUrl: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Bio / Profile Summary
                          </label>
                          <textarea
                            rows={2}
                            value={editOfficeForm.bio || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, bio: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Achievements &amp; Skills
                          </label>
                          <input
                            type="text"
                            placeholder="Achievements / Highlights"
                            value={editOfficeForm.achievements || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, achievements: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs mb-1.5"
                          />
                          <input
                            type="text"
                            placeholder="Key Skills (e.g. React, Python)"
                            value={editOfficeForm.skills || ""}
                            onChange={(e) =>
                              setEditOfficeForm({ ...editOfficeForm, skills: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                        <button
                          type="button"
                          onClick={() => setEditingOfficeId(null)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TEAMS & WINGS */}
      {activeTab === "teams" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">Specialized Wings &amp; Teams</h2>
              <p className="text-xs text-muted-foreground">
                Manage specialized student teams, create custom team wings, assign leads, and manage
                registered members.
              </p>
            </div>
            <button
              onClick={() => {
                if (isPanelLocked) {
                  setShowUnlockModal(true);
                } else {
                  setShowAddTeam(!showAddTeam);
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth shrink-0"
            >
              <Plus className="h-4 w-4" /> Create Custom Team Wing
            </button>
          </div>

          {/* Add Custom Team Form */}
          {showAddTeam && (
            <form
              onSubmit={handleCreateTeamSubmit}
              className="rounded-2xl border border-primary/30 bg-card p-6 shadow-lg space-y-4 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4" /> Create New Custom Team / Wing
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddTeam(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Team / Wing Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Computing & DevOps"
                    value={newTeamData.name}
                    onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Team Lead Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={newTeamData.lead}
                    onChange={(e) => setNewTeamData({ ...newTeamData, lead: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Team Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of what this wing focuses on..."
                    value={newTeamData.description}
                    onChange={(e) =>
                      setNewTeamData({ ...newTeamData, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Team Icon
                  </label>
                  <select
                    value={newTeamData.icon}
                    onChange={(e) => setNewTeamData({ ...newTeamData, icon: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Globe">Globe (Web/Network)</option>
                    <option value="Brain">Brain (AI/ML)</option>
                    <option value="ShieldCheck">ShieldCheck (Security/Cyber)</option>
                    <option value="Palette">Palette (Design/Media)</option>
                    <option value="Code">Code (Software)</option>
                    <option value="Terminal">Terminal (DevOps/Linux)</option>
                    <option value="Users">Users (Community/Events)</option>
                    <option value="Cpu">Cpu (Hardware/IoT)</option>
                    <option value="Smartphone">Smartphone (Mobile Apps)</option>
                    <option value="Sparkles">Sparkles (Innovation)</option>
                    <option value="Layers">Layers (Fullstack)</option>
                    <option value="Rocket">Rocket (Startup/Projects)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Color Accent Theme
                  </label>
                  <select
                    value={newTeamData.color}
                    onChange={(e) => setNewTeamData({ ...newTeamData, color: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="from-blue-500/20 to-indigo-500/20">Blue &amp; Indigo</option>
                    <option value="from-fuchsia-500/20 to-purple-500/20">
                      Fuchsia &amp; Purple
                    </option>
                    <option value="from-emerald-500/20 to-teal-500/20">Emerald &amp; Teal</option>
                    <option value="from-amber-500/20 to-orange-500/20">Amber &amp; Orange</option>
                    <option value="from-rose-500/20 to-pink-500/20">Rose &amp; Pink</option>
                    <option value="from-cyan-500/20 to-sky-500/20">Cyan &amp; Sky Blue</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeam(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Create Team Wing
                </button>
              </div>
            </form>
          )}

          {/* Team Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {store.teams.map((t) => (
              <button
                key={t.slug}
                onClick={() => setSelectedTeamSlug(t.slug)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-smooth ${
                  selectedTeamSlug === t.slug
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {t.name} ({t.members.length})
              </button>
            ))}
          </div>

          {selectedTeam && (
            <div className="space-y-6">
              {/* Team Lead & Details Banner */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{selectedTeam.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                      {selectedTeam.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                      <span className="text-muted-foreground">Team Lead:</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                        {selectedTeam.lead}
                      </span>
                    </div>
                  </div>

                  {/* Delete Team Wing Option */}
                  <div>
                    {deleteConfirmId === `delete-team-${selectedTeam.slug}` ? (
                      <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-2 animate-in fade-in duration-150">
                        <span className="text-xs font-semibold text-rose-600">
                          Delete wing "{selectedTeam.name}"?
                        </span>
                        <button
                          onClick={() => handleDeleteTeam(selectedTeam.slug, selectedTeam.name)}
                          className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-smooth"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:bg-accent transition-smooth"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (isPanelLocked) {
                            setShowUnlockModal(true);
                          } else {
                            setDeleteConfirmId(`delete-team-${selectedTeam.slug}`);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-smooth"
                        title={`Delete ${selectedTeam.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Team Wing
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Member Form to Selected Team */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                <h4 className="font-semibold text-xs uppercase text-muted-foreground">
                  Add Member to {selectedTeam.name} Wing
                </h4>
                <form onSubmit={handleAddTeamMemberSubmit} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      required
                      placeholder="Member Name *"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Role (e.g. Lead Designer, Core Dev) *"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g. II MCA, III BCA)"
                      value={newTeamMember.year}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, year: e.target.value })}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border/60">
                    <div className="flex items-center gap-2 flex-1">
                      {newTeamMember.avatarUrl ? (
                        <img
                          src={newTeamMember.avatarUrl}
                          alt="Preview"
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/40 shrink-0"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {newTeamMember.name
                            ? newTeamMember.name.substring(0, 2).toUpperCase()
                            : "Photo"}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTeamMemberAvatarFile}
                        className="block w-full text-[11px] text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-primary/10 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow shrink-0"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </div>

              {/* Members List */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedTeam.members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative group shrink-0">
                        {m.avatarUrl ? (
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="h-10 w-10 rounded-xl object-cover ring-1 ring-primary/30 shadow-sm"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-xs">
                            {m.initials}
                          </div>
                        )}
                        <label
                          className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-smooth"
                          title="Upload avatar photo"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const res = ev.target?.result as string;
                                  if (res) {
                                    const updatedMembers = [...selectedTeam.members];
                                    updatedMembers[idx] = { ...m, avatarUrl: res };
                                    store.updateTeam(selectedTeam.slug, {
                                      members: updatedMembers,
                                    });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <div className="font-semibold text-xs">{m.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {m.role} {m.year ? `· ${m.year}` : ""}
                        </div>
                      </div>
                    </div>

                    {deleteConfirmId === `team-${selectedTeam.slug}-${idx}` ? (
                      <div className="flex items-center gap-1 animate-in fade-in duration-150">
                        <button
                          onClick={() => {
                            store.deleteTeamMember(selectedTeam.slug, idx);
                            setDeleteConfirmId(null);
                            showToast(`Removed ${m.name} from ${selectedTeam.name}.`);
                          }}
                          className="rounded-lg bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-rose-700 shadow-sm transition-smooth"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg border border-border p-0.5 text-[11px] hover:bg-accent transition-smooth"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (isPanelLocked) {
                            setShowUnlockModal(true);
                          } else {
                            setDeleteConfirmId(`team-${selectedTeam.slug}-${idx}`);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 p-1.5 rounded-lg transition-smooth"
                        title={`Remove ${m.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MEDIA & IMAGE UPLOADS HUB */}
      {activeTab === "media" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Media &amp; Image Uploads Hub
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upload images directly from your device or via image web links with custom image
                  descriptions.
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {store.events.reduce((acc, ev) => acc + (ev.photos?.length || 0), 0)} Total Event
                Media
              </span>
            </div>

            {/* Upload Form Box */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Upload className="h-4 w-4 text-primary" /> Upload New Image
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Device Upload Option */}
                <div className="rounded-xl border border-dashed border-border bg-background p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-smooth">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-xs font-semibold">Upload Image File from Device</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">
                    Supports PNG, JPG, JPEG, WEBP, GIF
                  </p>
                  <label className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-smooth">
                    <span>Browse File from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setPhotoInputUrl(res);
                              showToast("✅ Image file loaded from device!");
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Web Link Option */}
                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Or Paste Direct Image Link
                    (URL)
                  </div>
                  <input
                    type="text"
                    value={photoInputUrl.startsWith("data:") ? "" : photoInputUrl}
                    onChange={(e) => setPhotoInputUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Paste any public image HTTP/HTTPS web address.
                  </p>
                </div>
              </div>

              {/* Image Description & Target Event Selector */}
              <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-border/60">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Image Description / Caption *
                  </label>
                  <input
                    type="text"
                    value={photoCaptionInput}
                    onChange={(e) => setPhotoCaptionInput(e.target.value)}
                    placeholder="e.g. Hackathon 2026 inaugural keynotes & student presentations"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Assign to Event Gallery
                  </label>
                  <select
                    value={activePhotoEventId || ""}
                    onChange={(e) => setActivePhotoEventId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select Event Gallery Target...</option>
                    {store.events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        📅 {ev.title} ({ev.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Preview Box */}
              {photoInputUrl && (
                <div className="rounded-xl border border-border bg-background p-3 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={photoInputUrl}
                    alt="Preview"
                    className="h-24 w-32 rounded-xl object-cover ring-2 ring-primary/30 shrink-0"
                  />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="font-semibold text-foreground">Selected Image Preview</div>
                    <p className="text-muted-foreground line-clamp-2">
                      {photoCaptionInput || "No description specified yet"}
                    </p>
                    <span className="inline-block text-[10px] font-mono bg-muted px-2 py-0.5 rounded">
                      {photoInputUrl.startsWith("data:")
                        ? "Device Upload (Base64)"
                        : "Web URL Link"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!activePhotoEventId) {
                        showToast("⚠️ Please select an event gallery target above!");
                        return;
                      }
                      if (!photoInputUrl) {
                        showToast("⚠️ Please upload a file or enter an image link!");
                        return;
                      }
                      store.addEventPhoto(activePhotoEventId, {
                        url: photoInputUrl,
                        caption: photoCaptionInput || "TWA Event Media",
                      });
                      showToast("✅ Image uploaded and added to event gallery!");
                      setPhotoInputUrl("");
                      setPhotoCaptionInput("");
                    }}
                    className="rounded-xl bg-gradient-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth shrink-0"
                  >
                    Save Image to Gallery
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Grid of Uploaded Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-display">
                Uploaded Gallery Media across Events
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {store.events.flatMap((ev) =>
                  (ev.photos || []).map((p, pIdx) => (
                    <div
                      key={`${ev.id}-${p.id || pIdx}`}
                      className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-smooth space-y-2 p-3"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                        <img
                          src={p.url}
                          alt={p.caption || ev.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          {ev.title}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground line-clamp-2">
                          {p.caption || "No description"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(p.url);
                            showToast("📋 Image URL copied to clipboard!");
                          }}
                          className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          Copy Link
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            store.removeEventPhoto(ev.id, p.id || pIdx.toString());
                            showToast("Deleted image from event gallery!");
                          }}
                          className="text-xs text-muted-foreground hover:text-rose-500 transition-smooth p-1"
                          title="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CONTACT INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">
                Student Inquiries &amp; Submissions
              </h2>
              <p className="text-xs text-muted-foreground">
                Inquiries received directly from the Contact page form.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {store.messages.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground text-sm">
                No inquiries received yet.
              </div>
            ) : (
              store.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl border p-5 shadow-sm transition-smooth ${
                    msg.status === "New"
                      ? "border-amber-500/40 bg-amber-500/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{msg.name}</span>
                        {msg.year && (
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {msg.year}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            msg.status === "New"
                              ? "bg-amber-500/20 text-amber-700"
                              : msg.status === "Responded"
                                ? "bg-emerald-500/20 text-emerald-700"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {msg.email} {msg.interest && `· Interested in: ${msg.interest}`}
                      </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground">{msg.date}</div>
                  </div>

                  <div className="mt-3 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => store.updateMessageStatus(msg.id, "Responded")}
                        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/20"
                      >
                        Mark as Responded
                      </button>

                      <button
                        onClick={() => store.updateMessageStatus(msg.id, "Archived")}
                        className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent"
                      >
                        Archive
                      </button>
                    </div>

                    {deleteConfirmId === msg.id ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                        <span className="text-xs font-semibold text-rose-600">Delete inquiry?</span>
                        <button
                          onClick={() => {
                            store.deleteMessage(msg.id);
                            setDeleteConfirmId(null);
                            showToast("Inquiry message deleted.");
                          }}
                          className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-smooth"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:bg-accent transition-smooth"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (isPanelLocked) {
                            setShowUnlockModal(true);
                          } else {
                            setDeleteConfirmId(msg.id);
                          }
                        }}
                        className="text-xs text-rose-600 hover:bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-lg transition-smooth flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete Inquiry
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SETTINGS & BACKUP */}
      {activeTab === "settings" && (
        <div className="mt-6 space-y-6">
          {/* Secret URL Token Settings */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-semibold text-base flex items-center gap-2 text-primary">
                  <Link2 className="h-4 w-4" /> Secret Admin Access URL & Token
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The admin panel is completely hidden from public navigation. Anyone visiting{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                    /admin
                  </code>{" "}
                  directly without this secret token URL parameter will see a 404 Page Not Found
                  error.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopySecretUrl}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:opacity-90 transition-smooth self-start sm:self-auto"
              >
                {copiedUrl ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Copied Secret URL!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Secret Admin Link
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between gap-2 overflow-hidden text-xs font-mono">
              <span className="truncate text-foreground font-semibold">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/admin?token=${store.secretToken}`
                  : `/admin?token=${store.secretToken}`}
              </span>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-sans font-bold shrink-0">
                Secret Link
              </span>
            </div>

            <form
              onSubmit={handleSecretTokenChange}
              className="pt-1 flex flex-col sm:flex-row gap-3 items-end"
            >
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Change Secret Token (Current:{" "}
                  <span className="font-mono text-foreground font-bold">{store.secretToken}</span>)
                </label>
                <input
                  type="text"
                  placeholder="Enter new secret token (e.g. twa2026, mysecret123)"
                  value={newSecretTokenInput}
                  onChange={(e) => setNewSecretTokenInput(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-smooth"
              >
                Update Secret Token
              </button>
            </form>

            {tokenSaved && (
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Secret access token updated successfully!
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Security Passcode Change */}
            <form
              onSubmit={handlePinChange}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
            >
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Admin Passcode Settings
              </h3>
              <p className="text-xs text-muted-foreground">
                Update the lock passcode used to access this panel.
              </p>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  New Security Passcode (min 4 characters)
                </label>
                <input
                  type="password"
                  placeholder="Enter new PIN"
                  value={newPin}
                  onChange={(e) => setNewPinState(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {pinSaved && (
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Passcode updated successfully!
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground shadow"
              >
                Update Passcode
              </button>
            </form>

            {/* Backup & Reset */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-base flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-amber-500" /> Clear Data & Reset
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Clear all preset events, office members, teams and inquiries, leaving a clean
                  slate for custom content.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to remove all preset data and reset to a clean state?",
                      )
                    ) {
                      store.resetToDefaults();
                      setSiteForm(store.site);
                      alert("All preset data cleared.");
                    }
                  }}
                  className="w-full rounded-xl border border-rose-500/40 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-smooth"
                >
                  Clear All Presets & Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS & ACCESS PERMISSIONS */}
      {activeTab === "users" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Custom Login Accounts &amp; Access
                Permissions
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage custom usernames, passwords, and granular feature permissions for Team Leads
                and Administrators.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast("💾 User accounts and permissions saved and synced!")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-smooth"
              >
                <Save className="h-4 w-4" /> Save User Access Settings
              </button>

              <button
                onClick={() => setShowAddUserModal(!showAddUserModal)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
              >
                <Plus className="h-4 w-4" /> Add Team User
              </button>
            </div>
          </div>

          {/* Add User Modal / Form */}
          {showAddUserModal && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isPanelLocked) {
                  setShowUnlockModal(true);
                  return;
                }
                const cleanUsername = newUserForm.username.trim().toLowerCase();
                const rawPassword = newUserForm.password.trim();
                if (!cleanUsername || !rawPassword) {
                  showToast("⚠️ Please enter both a username and password.");
                  return;
                }

                if (store.adminUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
                  showToast(`⚠️ Username "@${cleanUsername}" already exists!`);
                  return;
                }

                let permissions = defaultCandidatePermissions;
                let role: AdminUser["role"] = "candidate";

                const r = String(newUserForm.role)
                  .toLowerCase()
                  .replace(/[\s_-]+/g, "");
                if (r === "candidate") {
                  role = "candidate";
                  permissions = defaultCandidatePermissions;
                } else if (r === "superadmin") {
                  role = "super_admin";
                  permissions = defaultSuperAdminPermissions;
                } else if (r === "teamlead") {
                  role = "team_lead";
                  permissions = defaultTeamLeadPermissions;
                } else if (r === "eventmanager") {
                  role = "event_manager";
                  permissions = { ...defaultCandidatePermissions, viewMessages: false };
                } else if (r === "contenteditor") {
                  role = "content_editor";
                  permissions = {
                    ...defaultTeamLeadPermissions,
                    manageSiteInfo: true,
                    manageAnnouncement: true,
                  };
                }

                store.addAdminUser({
                  username: cleanUsername,
                  password: rawPassword,
                  fullName: newUserForm.name || cleanUsername,
                  role: role,
                  teamSlug: newUserForm.teamWing.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  permissions: permissions,
                  status: "active",
                });

                showToast(`✅ Created candidate user account "@${cleanUsername}" successfully!`);

                setNewUserForm({
                  username: "",
                  password: "",
                  name: "",
                  role: "candidate",
                  teamWing: "Web Development",
                });
                setShowAddUserModal(false);
              }}
              className="rounded-2xl border border-primary/30 bg-card p-6 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-semibold text-base flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4" /> Create Custom Candidate / Admin Account
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Username (Login)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. candidate, lead_web, arun_twa"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter login password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Candidate Applicant"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Account Role
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        role: e.target.value as AdminUser["role"],
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="candidate">Candidate (Custom Permission)</option>
                    <option value="super_admin">Super Admin (Full Control)</option>
                    <option value="team_lead">Team Lead (Team &amp; Event Access)</option>
                    <option value="event_manager">Event Manager (Events &amp; Photos)</option>
                    <option value="content_editor">
                      Content Editor (Branding &amp; Announcements)
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Associated Department Wing
                  </label>
                  <select
                    value={newUserForm.teamWing}
                    onChange={(e) => setNewUserForm({ ...newUserForm, teamWing: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Executive</option>
                    <option>Web Development</option>
                    <option>Cyber Security & CTF</option>
                    <option>AI & Machine Learning</option>
                    <option>UI/UX Design</option>
                    <option>Competitive Programming</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Create User Account
                </button>
              </div>
            </form>
          )}

          {/* User Accounts List */}
          <div className="grid gap-4 md:grid-cols-2">
            {store.adminUsers.map((user) => {
              const isEditing = editingUserId === user.id;
              const displayName = user.fullName || user.username;
              const roleDisplay =
                user.role === "candidate"
                  ? "Candidate"
                  : user.role === "super_admin"
                    ? "Super Admin"
                    : user.role === "team_lead"
                      ? "Team Lead"
                      : user.role === "event_manager"
                        ? "Event Manager"
                        : "Content Editor";

              return (
                <div
                  key={user.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg ring-2 ring-primary/20 shadow-xs">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-base flex items-center gap-2">
                          {displayName}
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              user.role === "candidate"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : user.role === "super_admin"
                                  ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                  : user.role === "team_lead"
                                    ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            }`}
                          >
                            {roleDisplay}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          @{user.username} · {user.teamSlug || "web-dev"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingUserId(null);
                          } else {
                            setEditingUserId(user.id);
                            setEditUserForm({
                              fullName: displayName,
                              username: user.username,
                              password: user.password,
                              role: user.role,
                              teamSlug: user.teamSlug,
                              status: user.status || "active",
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium hover:bg-accent transition-smooth"
                        title="Edit Account Details"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-primary" />
                        {isEditing ? "Close" : "Edit Account"}
                      </button>

                      {user.username !== "admin" && (
                        <button
                          onClick={() => {
                            store.deleteAdminUser(user.id);
                            showToast(`Deleted user account "@${user.username}".`);
                          }}
                          className="text-muted-foreground hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-500/10 transition-smooth"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Edit User Account Form */}
                  {isEditing && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (isPanelLocked) {
                          setShowUnlockModal(true);
                          return;
                        }
                        store.updateAdminUser(user.id, {
                          fullName: editUserForm.fullName || displayName,
                          username: editUserForm.username || user.username,
                          password: editUserForm.password || user.password,
                          role: editUserForm.role || user.role,
                          status: editUserForm.status || user.status,
                        });
                        setEditingUserId(null);
                        showToast(
                          `Saved account details for "@${editUserForm.username || user.username}".`,
                        );
                      }}
                      className="rounded-xl border border-primary/30 bg-muted/30 p-4 space-y-3 animate-in fade-in duration-150"
                    >
                      <h4 className="text-xs font-bold uppercase text-primary flex items-center gap-1.5">
                        <Edit2 className="h-3.5 w-3.5" /> Edit Account Credentials &amp; Role
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editUserForm.fullName || ""}
                            onChange={(e) =>
                              setEditUserForm({ ...editUserForm, fullName: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            value={editUserForm.username || ""}
                            onChange={(e) =>
                              setEditUserForm({ ...editUserForm, username: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Password
                          </label>
                          <input
                            type="text"
                            value={editUserForm.password || ""}
                            onChange={(e) =>
                              setEditUserForm({ ...editUserForm, password: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                            Account Role
                          </label>
                          <select
                            value={editUserForm.role || "candidate"}
                            onChange={(e) =>
                              setEditUserForm({
                                ...editUserForm,
                                role: e.target.value as AdminUser["role"],
                              })
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="candidate">Candidate</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="team_lead">Team Lead</option>
                            <option value="event_manager">Event Manager</option>
                            <option value="content_editor">Content Editor</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                        <button
                          type="button"
                          onClick={() => setEditingUserId(null)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow"
                        >
                          <Save className="h-3.5 w-3.5" /> Save Account Changes
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Granular Permission Toggles */}
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
                    <div className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Account Access Permissions</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Status: {user.status || "Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                      {[
                        { key: "manageSiteInfo", label: "Branding & Logo" },
                        { key: "manageDepartment", label: "Department Info" },
                        { key: "manageAnnouncement", label: "Announcements" },
                        { key: "manageEvents", label: "Manage Events" },
                        { key: "uploadEventPhotos", label: "Upload Event Photos" },
                        { key: "manageMembers", label: "Leadership Team" },
                        { key: "manageTeams", label: "Team Members" },
                        { key: "manageUsers", label: "User Accounts" },
                        { key: "viewMessages", label: "View Messages" },
                      ].map((perm) => {
                        const isChecked = Boolean(
                          user.permissions[perm.key as keyof typeof user.permissions],
                        );
                        return (
                          <label
                            key={perm.key}
                            className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-medium text-muted-foreground hover:text-foreground"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                store.updateAdminUser(user.id, {
                                  permissions: {
                                    ...user.permissions,
                                    [perm.key]: e.target.checked,
                                  },
                                });
                                showToast(`Permission updated & saved for @${user.username}.`);
                              }}
                              className="rounded border-border text-primary focus:ring-primary/20 accent-primary"
                            />
                            {perm.label}
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => showToast(`Access permissions saved for @${user.username}!`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-smooth"
                      >
                        <Save className="h-3 w-3" /> Save Permissions
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: INBUILT SYSTEM CONFIG & DATABASE CONTROL CENTER */}
      {activeTab === "system" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" /> Inbuilt System Config &amp; Database
                Engine
              </h2>
              <p className="text-xs text-muted-foreground">
                Inbuilt updated database configuration, cross-tab synchronization, and full JSON
                database import/export.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const dataStr = store.exportBackupData();
                  const blob = new Blob([dataStr], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `twa-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  showToast("💾 Database exported as JSON backup file!");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:opacity-90 transition-smooth"
              >
                <Download className="h-4 w-4" /> Export Database JSON
              </button>
            </div>
          </div>

          {/* System Metrics Overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Core System Engine
              </div>
              <div className="font-display text-lg font-bold text-primary">v3.8.0 Enterprise</div>
              <p className="text-[11px] text-muted-foreground">Built-in Reactive State Sync</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Database Records
              </div>
              <div className="font-display text-lg font-bold text-foreground">
                {store.events.length + store.office.length + store.messages.length} Items
              </div>
              <p className="text-[11px] text-muted-foreground">Events, Members &amp; Messages</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                User Accounts
              </div>
              <div className="font-display text-lg font-bold text-emerald-600">
                {store.adminUsers.length} Accounts Active
              </div>
              <p className="text-[11px] text-muted-foreground">Custom Login Credentials</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Sync Engine Status
              </div>
              <div className="font-display text-lg font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                Sync
              </div>
              <p className="text-[11px] text-muted-foreground">LocalStorage + BroadcastChannel</p>
            </div>
          </div>

          {/* Database Import & Restore Box */}
          <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold flex items-center gap-2 text-primary">
                  <Upload className="h-4 w-4" /> Import / Restore Database Backup
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload a previously exported JSON backup file to instantly update or restore all
                  website information.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center space-y-3">
              <Upload className="mx-auto h-8 w-8 text-primary/70" />
              <div className="text-xs font-semibold">
                Select or Drop System Database Backup File (.json)
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90 transition-smooth">
                Choose Backup File...
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const content = ev.target?.result as string;
                        if (content) {
                          const ok = store.importBackupData(content);
                          if (ok) {
                            setSystemSyncMessage("✅ Database restored successfully from backup!");
                            showToast("Database restored successfully!");
                          } else {
                            setSystemSyncMessage("❌ Invalid backup file format.");
                          }
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {systemSyncMessage && (
                <div className="text-xs font-bold text-emerald-600 mt-2">{systemSyncMessage}</div>
              )}
            </div>
          </div>

          {/* GitHub Repository Sync & Push Error Fix Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h3 className="font-display text-base font-bold flex items-center gap-2 text-foreground">
                  <Github className="h-5 w-5 text-primary" /> GitHub Repository Sync &amp; Push
                  Resolver
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Imported from{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-primary font-semibold">
                    santhoshkumarshasc/Tech-Wizard-Association-
                  </code>
                </p>
              </div>

              <a
                href="https://github.com/santhoshkumarshasc/Tech-Wizard-Association-"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-accent transition-smooth"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open GitHub Repository
              </a>
            </div>

            <div className="rounded-xl bg-muted/30 p-4 space-y-3 text-xs border border-border/60">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <GitBranch className="h-4 w-4 text-emerald-500" /> Resolving Push Errors to GitHub
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you encounter a push error or authentication issue when pushing updates to
                GitHub, run the following standardized commands in your local terminal:
              </p>

              <div className="rounded-xl bg-black/90 p-3 font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto">
                <div>git init</div>
                <div>
                  git remote add origin
                  https://github.com/santhoshkumarshasc/Tech-Wizard-Association-.git
                </div>
                <div>git add .</div>
                <div>
                  git commit -m "Fix Office Bearers &amp; Advisors details page and system updates"
                </div>
                <div>git branch -M main</div>
                <div>git push -u origin main --force</div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                <span className="text-[11px] text-muted-foreground">
                  Need to export current code? Download full database JSON backup above.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const cmds = `git init\ngit remote add origin https://github.com/santhoshkumarshasc/Tech-Wizard-Association-.git\ngit add .\ngit commit -m "Fix Office Bearers & Advisors details page and system updates"\ngit branch -M main\ngit push -u origin main --force`;
                    navigator.clipboard.writeText(cmds);
                    showToast("📋 GitHub push commands copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Push Commands
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
