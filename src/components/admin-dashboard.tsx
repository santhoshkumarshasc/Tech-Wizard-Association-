import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Users,
  Calendar,
  UserCheck,
  MessageSquare,
  BarChart2,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Mail,
  Send,
  Trash2,
  Edit2,
  ExternalLink,
  Copy,
  RefreshCw,
  Phone,
  Filter,
  Check,
  X,
  Clock,
  UserPlus,
} from "lucide-react";
import { useSiteStore, ContactMessage, StatItem, getWhatsAppUrl } from "@/lib/site-store";

export function AdminDashboard({
  isPanelLocked,
  onUnlockClick,
  showToast,
}: {
  isPanelLocked: boolean;
  onUnlockClick: () => void;
  showToast: (msg: string) => void;
}) {
  const store = useSiteStore();

  // Token Reset & Display State
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  // Filter & Search State for Member Requests
  const [requestFilter, setRequestFilter] = useState<
    "All" | "New" | "In Progress" | "Responded" | "Archived"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Quick Stat Editing State
  const [editingStats, setEditingStats] = useState<StatItem[]>(store.stats || []);
  const [isEditingStatsMode, setIsEditingStatsMode] = useState(false);
  const [newStatLabel, setNewStatLabel] = useState("");
  const [newStatValue, setNewStatValue] = useState("");

  // Respond to Member Request Modal
  const [respondingMessage, setRespondingMessage] = useState<ContactMessage | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replySent, setReplySent] = useState(false);

  // Manual New Request Logging Modal
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({
    name: "",
    email: "",
    year: "II MCA",
    interest: "Web Development",
    subject: "Club Membership Application",
    message: "",
  });

  // Calculate Club Statistics
  const totalEvents = store.events.length;
  const upcomingEvents = store.events.filter((e) => e.status === "Upcoming").length;
  const officeBearersCount = store.office.length;
  const totalTeams = store.teams.length;
  const totalWingMembers = store.teams.reduce((acc, t) => acc + (t.members?.length || 0), 0);
  const totalRequests = store.messages.length;
  const pendingRequests = store.messages.filter((m) => m.status === "New").length;
  const respondedRequests = store.messages.filter((m) => m.status === "Responded").length;
  const totalOutboundMails = store.outboundMails.length;

  // Filtered Member Requests
  const filteredRequests = store.messages.filter((msg) => {
    const matchesFilter =
      requestFilter === "All"
        ? true
        : requestFilter === "New"
          ? msg.status === "New"
          : requestFilter === "Responded"
            ? msg.status === "Responded" || msg.status === "Closed"
            : msg.status === requestFilter;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      (msg.subject && msg.subject.toLowerCase().includes(query)) ||
      (msg.message && msg.message.toLowerCase().includes(query)) ||
      (msg.interest && msg.interest.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  // Handle Token Reset to admin2026
  const handleResetToken = () => {
    store.setAdminPin("admin2026");
    store.setSecretToken("admin2026");
    showToast("🔑 Admin token successfully reset to admin2026!");
  };

  // Handle Save Stats
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPanelLocked) {
      onUnlockClick();
      return;
    }
    store.updateStats(editingStats);
    setIsEditingStatsMode(false);
    showToast("📊 Club statistics updated & published live!");
  };

  // Add new metric
  const handleAddMetric = () => {
    if (!newStatLabel.trim() || !newStatValue.trim()) return;
    const updated = [...editingStats, { label: newStatLabel.trim(), value: newStatValue.trim() }];
    setEditingStats(updated);
    setNewStatLabel("");
    setNewStatValue("");
  };

  // Submit response email/acknowledgment
  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingMessage) return;

    // Send outbound mail via store
    store.sendOutboundMail({
      recipientName: respondingMessage.name,
      recipientEmail: respondingMessage.email,
      senderName: "TWA Admin Desk",
      senderEmail: store.mailSettings.senderEmail || "techwizard@shasc.edu.in",
      subject: replySubject || `Re: ${respondingMessage.subject || "Membership Request"}`,
      body: replyBody,
      type: "Direct Email",
      sentViaApi: false,
      deliveryNote: "Dispatched via TWA Admin Dashboard Response System",
    });

    // Update message status to Responded
    store.updateMessageStatus(respondingMessage.id, "Responded");
    setReplySent(true);
    showToast(`✅ Response sent & recorded for ${respondingMessage.name}!`);

    setTimeout(() => {
      setRespondingMessage(null);
      setReplySent(false);
      setReplySubject("");
      setReplyBody("");
    }, 1200);
  };

  // Handle Add Member Request
  const handleAddMemberRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestForm.name.trim() || !newRequestForm.email.trim()) return;

    store.addContactMessage({
      name: newRequestForm.name.trim(),
      email: newRequestForm.email.trim(),
      year: newRequestForm.year,
      interest: newRequestForm.interest,
      subject: newRequestForm.subject.trim(),
      message:
        newRequestForm.message.trim() ||
        `Manual member request logged for ${newRequestForm.interest} wing.`,
    });

    showToast(`🎉 Logged member request for ${newRequestForm.name}!`);
    setNewRequestForm({
      name: "",
      email: "",
      year: "II MCA",
      interest: "Web Development",
      subject: "Club Membership Application",
      message: "",
    });
    setShowAddRequestModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* SECURE ADMIN TOKEN & LOCK STATUS HEADER */}
      <div className="rounded-3xl border border-primary/20 bg-card p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-2 ring-primary/20 shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold tracking-tight">
                  TWA Secure Club Admin Dashboard
                </h2>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time club performance metrics, statistics, and student membership requests.
              </p>
            </div>
          </div>

          {/* Token Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-3 rounded-2xl border border-border">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <div className="text-xs">
                <span className="text-muted-foreground">Admin Token: </span>
                <span className="font-mono font-bold text-foreground">
                  {showTokenDetails ? store.adminPin : "••••••••"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowTokenDetails(!showTokenDetails)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              {showTokenDetails ? "Hide" : "Show"}
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(store.adminPin);
                setTokenCopied(true);
                showToast("Copied admin token to clipboard!");
                setTimeout(() => setTokenCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border bg-background px-2 py-1 rounded-lg"
            >
              <Copy className="h-3 w-3" />
              {tokenCopied ? "Copied" : "Copy"}
            </button>

            <button
              onClick={handleResetToken}
              className="inline-flex items-center gap-1 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition-smooth"
              title="Reset Admin Token to admin2026"
            >
              <RefreshCw className="h-3 w-3" />
              Reset to admin2026
            </button>

            {!isPanelLocked ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-600">
                <Unlock className="h-3.5 w-3.5" /> Unlocked
              </span>
            ) : (
              <button
                onClick={onUnlockClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-500/20"
              >
                <Lock className="h-3.5 w-3.5" /> Unlock Panel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: CLUB STATISTICS OVERVIEW */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Club Statistics & Key Performance Metrics
            </h3>
            <p className="text-xs text-muted-foreground">
              Overview of association enrollment, events, wings, and activity figures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingStatsMode(!isEditingStatsMode)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold hover:bg-accent transition-smooth"
            >
              <Edit2 className="h-3.5 w-3.5 text-primary" />
              {isEditingStatsMode ? "Close Editor" : "Edit Stat KPIs"}
            </button>
          </div>
        </div>

        {/* Core Stat Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-primary/40 transition-smooth">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Members</span>
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">
              {officeBearersCount + totalWingMembers}+
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>{officeBearersCount} Office Bearers</span>
              <span className="text-primary font-medium">{totalWingMembers} Wing Members</span>
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-indigo-500/40 transition-smooth">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Events & Talk</span>
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{totalEvents}</div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>{upcomingEvents} Upcoming</span>
              <span className="text-indigo-600 font-medium">
                {totalEvents - upcomingEvents} Completed
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-smooth">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Specialized Wings
              </span>
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{totalTeams}</div>
            <p className="text-xs text-muted-foreground">
              Web, Cyber, AI/ML, Design & Mobile Teams
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-smooth">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Member Requests
              </span>
              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{totalRequests}</div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span className="text-amber-600 font-bold">{pendingRequests} Pending</span>
              <span className="text-emerald-600 font-medium">{respondedRequests} Responded</span>
            </p>
          </div>
        </div>

        {/* Dynamic Display of Public Home KPIs from Store */}
        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Published Home Page Highlights</span>
            <span className="text-[11px] font-mono text-primary">Live Public Metrics</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {store.stats.map((st, i) => (
              <div key={i} className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
                <div className="text-xs text-muted-foreground">{st.label}</div>
                <div className="font-display text-xl font-bold text-primary mt-1">{st.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stat Editor Mode */}
        {isEditingStatsMode && (
          <form
            onSubmit={handleSaveStats}
            className="rounded-2xl border border-primary/30 bg-card p-5 shadow-md space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-sm flex items-center gap-2 text-primary">
                <Edit2 className="h-4 w-4" /> Edit Custom Site Statistics & KPIs
              </h4>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow"
              >
                <Check className="h-3.5 w-3.5" /> Save Statistics
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {editingStats.map((st, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-muted/30 p-3 space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStats(editingStats.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-rose-600"
                    title="Remove Metric"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground uppercase">
                      Label
                    </label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const copy = [...editingStats];
                        copy[idx].label = e.target.value;
                        setEditingStats(copy);
                      }}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground uppercase">
                      Value
                    </label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const copy = [...editingStats];
                        copy[idx].value = e.target.value;
                        setEditingStats(copy);
                      }}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Metric Inline */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border">
              <input
                type="text"
                placeholder="New Metric Label (e.g. Hackathon Winners)"
                value={newStatLabel}
                onChange={(e) => setNewStatLabel(e.target.value)}
                className="w-full sm:w-1/2 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Value (e.g. 18 Trophies)"
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
                className="w-full sm:w-1/3 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddMetric}
                className="w-full sm:w-auto rounded-xl bg-accent px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-accent/80 shrink-0"
              >
                + Add Metric
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 2: PENDING MEMBER REQUESTS & STUDENT INQUIRIES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                Pending Member Requests & Inquiries
              </h3>
              {pendingRequests > 0 && (
                <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white animate-pulse">
                  {pendingRequests} New
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Review, approve, and respond to incoming student club membership applications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddRequestModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Log Offline Request
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {(["All", "New", "In Progress", "Responded", "Archived"] as const).map((filter) => {
              const count =
                filter === "All"
                  ? store.messages.length
                  : filter === "New"
                    ? store.messages.filter((m) => m.status === "New").length
                    : filter === "Responded"
                      ? store.messages.filter(
                          (m) => m.status === "Responded" || m.status === "Closed",
                        ).length
                      : store.messages.filter((m) => m.status === filter).length;

              return (
                <button
                  key={filter}
                  onClick={() => setRequestFilter(filter)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-smooth ${
                    requestFilter === filter
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span>{filter}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      requestFilter === filter
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Member Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center space-y-3">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <div className="font-semibold text-sm">No member requests found</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No student requests matching "${searchQuery}".`
                : requestFilter === "New"
                  ? "Great job! All student requests have been reviewed and responded to."
                  : "No requests recorded under this filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRequests.map((msg) => {
              const isNew = msg.status === "New";
              const isResponded = msg.status === "Responded" || msg.status === "Closed";

              return (
                <div
                  key={msg.id}
                  className={`rounded-2xl border bg-card p-5 shadow-sm space-y-3 relative transition-smooth ${
                    isNew
                      ? "border-amber-500/50 ring-1 ring-amber-500/20 bg-amber-500/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          {msg.name}
                          {isNew && (
                            <span className="rounded-full bg-amber-500 px-2 py-0.2 text-[10px] font-bold text-white">
                              NEW
                            </span>
                          )}
                        </h4>
                        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-primary hover:underline font-mono"
                          >
                            {msg.email}
                          </a>
                          {msg.year && (
                            <span className="rounded bg-muted px-1.5 py-0.2 text-[10px]">
                              {msg.year}
                            </span>
                          )}
                          {msg.interest && (
                            <span className="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-semibold">
                              {msg.interest}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${
                        isNew
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                          : isResponded
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-background/80 p-3 space-y-1">
                    {msg.subject && (
                      <div className="font-semibold text-xs text-foreground">
                        Subject: {msg.subject}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    {msg.date && (
                      <div className="text-[10px] text-muted-foreground/70 text-right pt-1 font-mono">
                        Received: {msg.date}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRespondingMessage(msg);
                          setReplySubject(`Re: ${msg.subject || "TWA Club Membership Request"}`);
                          setReplyBody(
                            `Dear ${msg.name},\n\nThank you for reaching out to the Tech Wizard Association regarding ${
                              msg.interest || "club membership"
                            }.\n\nWe have reviewed your application and would like to invite you to our upcoming orientation session.\n\nBest regards,\nTWA Executive Team`,
                          );
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90 transition-smooth"
                      >
                        <Send className="h-3 w-3" />
                        Respond
                      </button>

                      {/* WhatsApp Link */}
                      <a
                        href={getWhatsAppUrl(
                          "+919876543210",
                          `Hello ${msg.name}, regarding your TWA Club request for ${msg.interest}...`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-smooth"
                        title="Chat on WhatsApp"
                      >
                        <Phone className="h-3 w-3" />
                        WhatsApp
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Selector */}
                      <select
                        value={msg.status}
                        onChange={(e) => {
                          store.updateMessageStatus(
                            msg.id,
                            e.target.value as ContactMessage["status"],
                          );
                          showToast(`Updated request status to ${e.target.value}`);
                        }}
                        className="rounded-xl border border-border bg-background px-2 py-1 text-[11px] font-semibold text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="New">Status: New</option>
                        <option value="In Progress">Status: In Progress</option>
                        <option value="Responded">Status: Responded</option>
                        <option value="Closed">Status: Closed</option>
                      </select>

                      <button
                        onClick={() => {
                          store.deleteMessage(msg.id);
                          showToast(`Deleted request from ${msg.name}.`);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-smooth"
                        title="Delete Request"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESPOND / EMAIL COMPOSER MODAL */}
      {respondingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-display font-bold text-base">
                    Respond to {respondingMessage.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Direct Email response to {respondingMessage.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRespondingMessage(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                  Response Message
                </label>
                <textarea
                  rows={6}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
                  required
                />
              </div>

              {replySent && (
                <div className="rounded-xl bg-emerald-500/10 p-2 text-xs font-semibold text-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Response dispatched and logged!
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setRespondingMessage(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  <Send className="h-3.5 w-3.5" /> Send & Mark Responded
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG OFFLINE REQUEST MODAL */}
      {showAddRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-base">Log Student Member Request</h3>
              </div>
              <button
                onClick={() => setShowAddRequestModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddMemberRequestSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M. Mohamed Rilwan"
                  value={newRequestForm.name}
                  onChange={(e) => setNewRequestForm({ ...newRequestForm, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@shasc.edu.in"
                  value={newRequestForm.email}
                  onChange={(e) => setNewRequestForm({ ...newRequestForm, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                    Year / Program
                  </label>
                  <select
                    value={newRequestForm.year}
                    onChange={(e) => setNewRequestForm({ ...newRequestForm, year: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>I MCA</option>
                    <option>II MCA</option>
                    <option>I BCA</option>
                    <option>II BCA</option>
                    <option>III BCA</option>
                    <option>B.Sc CS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                    Wing Interest
                  </label>
                  <select
                    value={newRequestForm.interest}
                    onChange={(e) =>
                      setNewRequestForm({ ...newRequestForm, interest: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>Web Development</option>
                    <option>Cyber Security & CTF</option>
                    <option>AI & Machine Learning</option>
                    <option>Mobile Dev</option>
                    <option>Design & Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                  Notes / Request Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter details of applicant background or request..."
                  value={newRequestForm.message}
                  onChange={(e) =>
                    setNewRequestForm({ ...newRequestForm, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddRequestModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
