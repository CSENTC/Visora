import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";

export function meta() {
  return [
    { title: "Pricing • Visora" },
    { name: "description", content: "Understand Visora's user-pays model, free tier limits, and how Puter powers the experience." },
  ];
}

export default function PricingPage() {
  return (
    <div className="info-page pricing-page">
      <Navbar />

      <main className="page-shell">
        <section className="page-hero">
          <div className="page-badge">Pricing</div>
          <h1>Flexible AI rendering that grows with your ambitions.</h1>
          <p className="page-subtitle">
            Visora uses Puter for image hosting and compute orchestration, so the pricing model follows a user-pays approach: you only spend when you need more rendering capacity.
          </p>
          <div className="page-actions">
            <Link to="/" className="btn btn--primary btn--lg primary-action">
              Start with the free tier <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/enterprise" className="text-link">Talk to enterprise</Link>
          </div>
        </section>

        <section className="page-grid">
          <article className="info-card">
            <div className="info-card-icon">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2>How the model works</h2>
            <p>
              Visora is billed in a user-pays model because the rendering and storage work is routed through Puter. That means you can start small, try a few concepts, and scale up only when a production-grade snapshot or larger rendering batch is needed.
            </p>
            <ul className="info-list">
              <li>Free usage for light experimentation and initial concept renders.</li>
              <li>Pay as you use more hosting, compute time, and larger assets.</li>
              <li>Ideal for architects, freelancers, and studios that want predictable usage.</li>
            </ul>
          </article>

          <article className="info-card">
            <div className="info-card-icon">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2>Free-tier expectations</h2>
            <p>
              The free version is best suited for quick visual studies and smaller design explorations. It can comfortably handle lightweight floor-plan uploads, single-render previews, and a few test iterations without entering a heavy production workflow.
            </p>
            <ul className="info-list">
              <li>JPEG or PNG uploads up to roughly 10 MB.</li>
              <li>Short concept renders and quick comparison previews.</li>
              <li>Smaller project counts and a single render at a time.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
