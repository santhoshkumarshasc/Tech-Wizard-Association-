import React, { useState, useEffect } from "react";
import {
  Sparkles,
  User,
  Award,
  Link2,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Mail,
  Heart,
  Upload,
  Eye,
  Save,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  useSiteStore,
  CreatorProfile,
  CreatorSocialLink,
  defaultCreatorProfile,
  getCreatorsList,
} from "@/lib/site-store";
import { Link } from "@tanstack/react-router";

export function AdminCreatorManager({
  isPanelLocked,
  onUnlockClick,
  showToast,
}: {
  isPanelLocked: boolean;
  onUnlockClick: () => void;
  showToast: (msg: string) => void;
}) {
  const store = useSiteStore();
  const creatorsList = getCreatorsList(store.site);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeIndex =
    selectedIndex >= creatorsList.length ? Math.max(0, creatorsList.length - 1) : selectedIndex;
  const currentCreator = creatorsList[safeIndex] || defaultCreatorProfile;

  // Local Form State for editing selected creator
  const [formData, setFormData] = useState<CreatorProfile>({
    name: currentCreator.name || "",
    role: currentCreator.role || "",
    bio: currentCreator.bio || "",
    longBio: currentCreator.longBio || "",
    avatarUrl: currentCreator.avatarUrl || "",
    likesCount: currentCreator.likesCount || 0,
    githubUrl: currentCreator.githubUrl || "",
    linkedinUrl: currentCreator.linkedinUrl || "",
    instagramUrl: currentCreator.instagramUrl || "",
    youtubeUrl: currentCreator.youtubeUrl || "",
    twitterUrl: currentCreator.twitterUrl || "",
    websiteUrl: currentCreator.websiteUrl || "",
    emailUrl: currentCreator.emailUrl || "",
    customSocials: currentCreator.customSocials || [],
  });

  // Keep local state in sync when selected creator changes
  useEffect(() => {
    if (currentCreator) {
      setFormData({
        name: currentCreator.name || "",
        role: currentCreator.role || "",
        bio: currentCreator.bio || "",
        longBio: currentCreator.longBio || "",
        avatarUrl: currentCreator.avatarUrl || "",
        likesCount: currentCreator.likesCount || 0,
        githubUrl: currentCreator.githubUrl || "",
        linkedinUrl: currentCreator.linkedinUrl || "",
        instagramUrl: currentCreator.instagramUrl || "",
        youtubeUrl: currentCreator.youtubeUrl || "",
        twitterUrl: currentCreator.twitterUrl || "",
        websiteUrl: currentCreator.websiteUrl || "",
        emailUrl: currentCreator.emailUrl || "",
        customSocials: currentCreator.customSocials || [],
      });
    }
  }, [safeIndex, currentCreator]);

  // Modal / Add Custom Link state
  const [showAddCustomLink, setShowAddCustomLink] = useState(false);
  const [newCustomLink, setNewCustomLink] = useState<CreatorSocialLink>({
    id: "",
    platform: "website",
    label: "",
    url: "",
  });

  // Confirm Reset Modal state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle Image File Upload
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, avatarUrl: result }));
          showToast("📸 Uploaded new avatar image!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit / Update Selected Creator Profile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPanelLocked) {
      onUnlockClick();
      return;
    }

    if (!formData.name.trim()) {
      showToast("⚠️ Creator Name cannot be empty.");
      return;
    }

    store.updateCreatorProfileAtIndex(safeIndex, formData);
    showToast(`✨ Creator profile (${formData.name}) updated and published live!`);
  };

  // Add New Creator Profile
  const handleAddNewCreator = () => {
    if (isPanelLocked) {
      onUnlockClick();
      return;
    }
    const newProfile: CreatorProfile = {
      name: `New Creator ${creatorsList.length + 1}`,
      role: "Platform Creator / Developer",
      bio: "Contributor & Architect for Tech Wizard Association.",
      longBio: "",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      likesCount: 0,
      githubUrl: "",
      linkedinUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      emailUrl: "",
      customSocials: [],
    };
    store.addCreatorProfile(newProfile);
    setSelectedIndex(creatorsList.length);
    showToast("✨ Added new Creator Profile!");
  };

  // Delete Creator Profile
  const handleDeleteCreator = (idxToDelete: number) => {
    if (isPanelLocked) {
      onUnlockClick();
      return;
    }
    if (creatorsList.length <= 1) {
      showToast("⚠️ At least one creator profile is required.");
      return;
    }
    const name = creatorsList[idxToDelete]?.name || "Creator";
    store.deleteCreatorProfileAtIndex(idxToDelete);
    if (safeIndex >= idxToDelete && safeIndex > 0) {
      setSelectedIndex(safeIndex - 1);
    }
    showToast(`🗑️ Removed ${name} from creators.`);
  };

  // Reorder Creators
  const handleMoveCreator = (idx: number, direction: "up" | "down") => {
    if (isPanelLocked) {
      onUnlockClick();
      return;
    }
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= creatorsList.length) return;

    const updated = [...creatorsList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    store.reorderCreators(updated);
    if (safeIndex === idx) setSelectedIndex(targetIdx);
    else if (safeIndex === targetIdx) setSelectedIndex(idx);

    showToast("↕️ Reordered creator profiles.");
  };

  // Add Custom Social Link
  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomLink.label.trim() || !newCustomLink.url.trim()) return;

    const linkToAdd: CreatorSocialLink = {
      ...newCustomLink,
      id: `soc-${Date.now()}`,
    };

    const updatedCustoms = [...(formData.customSocials || []), linkToAdd];
    setFormData((prev) => ({ ...prev, customSocials: updatedCustoms }));

    setNewCustomLink({ id: "", platform: "website", label: "", url: "" });
    setShowAddCustomLink(false);
    showToast(`🔗 Added custom social link "${linkToAdd.label}"!`);
  };

  // Delete Custom Social Link
  const handleDeleteCustomLink = (id: string) => {
    const updated = (formData.customSocials || []).filter((l) => l.id !== id);
    setFormData((prev) => ({ ...prev, customSocials: updated }));
    showToast("🗑️ Removed custom social link.");
  };

  // Reset Creator Profile to Default
  const handleResetToDefault = () => {
    if (isPanelLocked) {
      onUnlockClick();
      return;
    }
    store.resetCreatorProfile();
    setFormData(defaultCreatorProfile);
    setShowResetConfirm(false);
    showToast("🔄 Creator profile reset to default configuration.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-card p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold tracking-tight">
                Creator Page Management
              </h2>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Live Portal
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Edit, update, or reset the Lead Platform Creator profile &amp; showcase on{" "}
              <code className="text-primary font-mono">/creator</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/creator"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-smooth shadow-2xs"
          >
            <Eye className="h-3.5 w-3.5 text-primary" />
            View Live Page
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition-smooth"
            title="Reset to Default Profile"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* MULTIPLE CREATORS SELECTION & MANAGEMENT BAR */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-foreground">
              <User className="h-4.5 w-4.5 text-primary" />
              Platform Creators ({creatorsList.length})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {
                "Add multiple creators, reorder profiles, or click a creator below to edit their profile details."
              }
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNewCreator}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-smooth shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Creator
          </button>
        </div>

        {/* Creator Cards Selection Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {creatorsList.map((c, idx) => {
            const isSelected = idx === safeIndex;
            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`group relative flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                    : "border-border bg-background hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      c.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={c.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-border"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.role}</p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Reorder Controls */}
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCreator(idx, "up")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-25 rounded hover:bg-accent transition-smooth"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === creatorsList.length - 1}
                      onClick={() => handleMoveCreator(idx, "down")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-25 rounded hover:bg-accent transition-smooth"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  {creatorsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCreator(idx)}
                      className="p-1 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded transition-smooth ml-1"
                      title={`Delete ${c.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* EDIT & UPDATE FORM (8 COLS) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-foreground pb-2 border-b border-border">
              <User className="h-4 w-4 text-primary" />
              Creator Information &amp; Bio
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Creator Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Santhosh Kumar S"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Lead Platform Creator & Full-Stack Architect"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                Short Headline Bio
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief summary displayed at the top of the creator showcase card..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                Detailed / Extended Bio
              </label>
              <textarea
                rows={3}
                value={formData.longBio || ""}
                onChange={(e) => setFormData({ ...formData, longBio: e.target.value })}
                placeholder="Detailed background regarding platform engineering, tech stack, and contributions..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              />
            </div>

            {/* Avatar & Photo Upload */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Profile Photo / Avatar Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-border bg-muted/20 p-3">
                <img
                  src={
                    formData.avatarUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  }
                  alt={formData.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/40 shadow-sm shrink-0"
                />
                <div className="space-y-2 w-full">
                  <input
                    type="url"
                    value={formData.avatarUrl || ""}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="Enter Avatar Image URL (https://...)"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent cursor-pointer transition-smooth">
                      <Upload className="h-3.5 w-3.5 text-primary" />
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      PNG, JPG or WebP images
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Likes Count Override */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                Appreciation Likes Count
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-32">
                  <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                  <input
                    type="number"
                    min={0}
                    value={formData.likesCount || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, likesCount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  Student &amp; visitor appreciation likes counter
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Social Media & Official URLs */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-foreground pb-2 border-b border-border">
              <Link2 className="h-4 w-4 text-primary" />
              Social Media &amp; Contact Profiles
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5 text-foreground" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl || ""}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
                  <Linkedin className="h-3.5 w-3.5 text-blue-600" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl || ""}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
                  <Instagram className="h-3.5 w-3.5 text-pink-500" /> Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl || ""}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
                  <Youtube className="h-3.5 w-3.5 text-red-600" /> YouTube Channel
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl || ""}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@channel"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
                  <Twitter className="h-3.5 w-3.5 text-sky-500" /> Twitter / X URL
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl || ""}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/username"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-emerald-600" /> Portfolio Website
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl || ""}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://mywebsite.com"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-purple-600" /> Official Contact Email URL
                </label>
                <input
                  type="text"
                  value={formData.emailUrl || ""}
                  onChange={(e) => setFormData({ ...formData, emailUrl: e.target.value })}
                  placeholder="mailto:creator@shasc.edu.in"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Custom Social Links */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display font-bold text-base flex items-center gap-2 text-foreground">
                <Plus className="h-4 w-4 text-primary" /> Custom External Links &amp; Handles
              </h3>

              <button
                type="button"
                onClick={() => setShowAddCustomLink(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-smooth"
              >
                + Add Custom Link
              </button>
            </div>

            {!formData.customSocials || formData.customSocials.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">
                No custom social links added. Click "+ Add Custom Link" above to add Behance,
                Medium, Discord, or custom URLs.
              </p>
            ) : (
              <div className="space-y-2">
                {formData.customSocials.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Globe className="h-4 w-4 text-primary shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-foreground">{link.label}</span>
                        <span className="text-[11px] text-muted-foreground ml-2 font-mono truncate">
                          ({link.url})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomLink(link.id)}
                      className="p-1 text-muted-foreground hover:text-rose-600 rounded-lg hover:bg-rose-500/10 transition-smooth shrink-0"
                      title="Delete Link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg hover:shadow-glow hover:scale-105 transition-smooth"
            >
              <Save className="h-4 w-4" /> Save &amp; Publish Creator Profile
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW CARD (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Live Card Preview</span>
              <span className="text-primary font-mono text-[11px]">Real-time Render</span>
            </div>

            {/* Simulated Creator Showcase Card */}
            <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-amber-500 to-rose-500 opacity-75 blur-md" />
                  <img
                    src={
                      formData.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={formData.name || "Creator"}
                    className="relative h-24 w-24 rounded-full object-cover ring-4 ring-background shadow-lg"
                  />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Lead Creator
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {formData.name || "Santhosh Kumar S"}
                  </h3>
                  <p className="text-xs font-semibold text-primary/90 mt-0.5">
                    {formData.role || "Lead Platform Creator"}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {formData.bio || "Creator & Architect behind Tech Wizard Association."}
                </p>

                {formData.longBio && (
                  <p className="text-[11px] text-muted-foreground/80 leading-relaxed pt-1">
                    {formData.longBio}
                  </p>
                )}

                {/* Social Badges Preview */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {formData.githubUrl && (
                    <span className="rounded-lg bg-slate-900 text-white px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                      <Github className="h-3 w-3" /> GitHub
                    </span>
                  )}
                  {formData.linkedinUrl && (
                    <span className="rounded-lg bg-blue-600 text-white px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                      <Linkedin className="h-3 w-3" /> LinkedIn
                    </span>
                  )}
                  {formData.instagramUrl && (
                    <span className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                      <Instagram className="h-3 w-3" /> Instagram
                    </span>
                  )}
                  {formData.youtubeUrl && (
                    <span className="rounded-lg bg-red-600 text-white px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                      <Youtube className="h-3 w-3" /> YouTube
                    </span>
                  )}
                  {formData.websiteUrl && (
                    <span className="rounded-lg bg-emerald-600 text-white px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Portfolio
                    </span>
                  )}
                  {formData.customSocials?.map((cs) => (
                    <span
                      key={cs.id}
                      className="rounded-lg bg-primary/20 text-primary px-2 py-1 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" /> {cs.label}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-border/50 w-full flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-500 flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 fill-rose-500" /> {formData.likesCount || 0} Likes
                  </span>
                  <span className="text-[10px] text-muted-foreground">Appreciations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD CUSTOM LINK MODAL */}
      {showAddCustomLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" /> Add Custom Link / Handle
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCustomLink(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomLink} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                  Platform / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Behance Portfolio, Medium Blog, Discord"
                  value={newCustomLink.label}
                  onChange={(e) => setNewCustomLink({ ...newCustomLink, label: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                  Destination URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newCustomLink.url}
                  onChange={(e) => setNewCustomLink({ ...newCustomLink, url: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddCustomLink(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Add Custom Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground">
                  Reset Creator Profile?
                </h3>
                <p className="text-xs text-muted-foreground">
                  This will restore default details for Santhosh Kumar S.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to reset the Creator showcase profile to system defaults? Any
              custom bios, images, or links will be overridden.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700"
              >
                Yes, Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
