import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Enterprise • Visora" },
    { name: "description", content: "Learn about Visora for teams, design studios, and enterprise architecture workflows." },
  ];
}

export default function EnterprisePage() {
  return (
    <div className="info-page enterprise-page">
      <Navbar />

      <main className="page-shell">
        <section className="page-hero">
          <div className="page-badge">Enterprise</div>
          <h1>Built for teams that want their ideas to become spatial stories faster.</h1>
          <p className="page-subtitle">
            Visora brings architecture, creative teams, and product stakeholders together around a single visual workflow that accelerates ideation and review.
          </p>
          <div className="page-actions">
            <Link to="/" className="btn btn--primary btn--lg primary-action">
              Start building <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/pricing" className="text-link">See the pricing model</Link>
          </div>
        </section>

        <section className="page-grid enterprise-grid">
          <article className="info-card">
            <div className="info-card-icon">
              <Building2 className="w-5 h-5" />
            </div>
            <h2>About Visora</h2>
            <p>
              We are building a lightweight creative operating system for architectural storytelling. Visora turns simple images into rich spatial concepts that can be reviewed, shared, and refined without juggling multiple tools.
            </p>
          </article>

          <article className="info-card">
            <div className="info-card-icon">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2>Why teams use it</h2>
            <ul className="info-list">
              <li>Rapid iteration from rough concepts to polished previews.</li>
              <li>Shared review flows that keep stakeholders aligned.</li>
              <li>Flexible rendering and cloud-backed hosting with Puter.</li>
            </ul>
          </article>

          <article className="info-card wide-card">
            <div className="info-card-icon">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2>Ready for bigger teams</h2>
            <p>
              Whether you are a boutique studio or a larger organization with multiple review cycles, Visora helps you move from planning to presentation without losing momentum.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
