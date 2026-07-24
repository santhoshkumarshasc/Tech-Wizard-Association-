import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Instagram, Github, Linkedin, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useSiteStore } from "@/lib/site-store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Join TWA — Department of Computer Applications | SHASC" },
      {
        name: "description",
        content:
          "Get in touch with Tech Wizard Association, Department of Computer Applications at Syed Hameedha Arts and Science College, Kilakarai. Apply for membership, propose hackathon collaborations, or send inquiries.",
      },
      {
        name: "keywords",
        content:
          "Contact Tech Wizard Association, join TWA, Syed Hameedha Arts and Science College contact, Department of Computer Applications Kilakarai, TWA membership application",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Tech Wizard Association — SHASC" },
      {
        property: "og:title",
        content: "Contact Us & Join TWA — Department of Computer Applications | SHASC",
      },
      {
        property: "og:description",
        content:
          "Reach out to Tech Wizard Association — join as a student member, collaborate, or sponsor events.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shasc.edu.in/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shasc.edu.in/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://shasc.edu.in/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Contact & Membership",
                  item: "https://shasc.edu.in/contact",
                },
              ],
            },
            {
              "@type": "ContactPage",
              name: "Contact Tech Wizard Association",
              description:
                "Contact and membership application page for Department of Computer Applications at SHASC.",
              url: "https://shasc.edu.in/contact",
            },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { site, addContactMessage } = useSiteStore();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    year: "I MCA",
    interest: "General Inquiry",
    subject: "Inquiry from website",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    addContactMessage({
      name: formData.name,
      email: formData.email,
      year: formData.year,
      interest: formData.interest,
      subject: `${formData.interest}: ${formData.subject}`,
      message: formData.message,
    });

    setSent(true);
    setFormData({
      name: "",
      email: "",
      year: "I MCA",
      interest: "General Inquiry",
      subject: "Inquiry from website",
      message: "",
    });
  };

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</div>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Say hello to {site.short}.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Whether you want to join, collaborate on a project, or invite us to speak — drop a note.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft">
            <Mail className="h-6 w-6 text-primary" />
            <div className="mt-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Official Email
            </div>
            <div className="mt-1 font-display text-lg font-semibold">{site.email}</div>
          </div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft">
            <MapPin className="h-6 w-6 text-primary" />
            <div className="mt-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Campus Location
            </div>
            <div className="mt-1 font-display text-lg font-semibold">{site.department}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {site.college} · {site.address}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Social Links
            </div>
            <div className="mt-3 flex gap-2">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-smooth hover:bg-gradient-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface-elevated p-8 shadow-soft"
        >
          <h2 className="font-display text-2xl font-bold">Send a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages are routed directly to {site.short} student executives &amp; advisors.
          </p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <h3 className="font-display text-lg font-bold text-emerald-800">Message Received!</h3>
              <p className="text-xs text-muted-foreground">
                Thank you for reaching out. Your message has been received and our team will get
                back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 inline-block rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Full Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Mohamed Rilwan"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Class / Year
                  </label>
                  <input
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. III MCA / II BCA"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    I'm interested in
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>General Inquiry</option>
                    <option>Joining TWA</option>
                    <option>Collaborating on a project</option>
                    <option>Sponsoring an event</option>
                    <option>Guest Speaker</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tell us a bit more..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow"
              >
                Send Message
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
