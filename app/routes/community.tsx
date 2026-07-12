import { ArrowUpRight, Clock, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router";
import Navbar from "../../components/Navbar";
import { getProject } from "../../lib/puter.action";

export function meta() {
  return [
    { title: "Community • Visora" },
    { name: "description", content: "Browse the projects that belong to your Visora workspace and jump back into any render." },
  ];
}

export default function CommunityPage() {
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const { userId } = useOutletContext<AuthContext>();

  useEffect(() => {
    const fetchProjects = async () => {
      const items = await getProject();
      const visibleProjects = items.filter((item) => {
        if (!userId) return true;
        return item.ownerId ? item.ownerId === userId : true;
      });
      setProjects(visibleProjects);
    };

    void fetchProjects();
  }, [userId]);

  return (
    <div className="info-page community-page">
      <Navbar />

      <main className="page-shell">
        <section className="page-hero compact">
          <div className="page-badge">Community</div>
          <h1>Everything you have created, gathered in one place.</h1>
          <p className="page-subtitle">
            Revisit your recent renders, share ideas, and pick up existing architectural concepts with a single click.
          </p>
        </section>

        <section className="projects-list">
          {projects.length === 0 ? (
            <div className="empty-state">
              <Layers className="empty-icon" />
              <h2>No projects yet</h2>
              <p>Start a new render and it will appear here instantly.</p>
            </div>
          ) : (
            projects.map((project) => (
              <article key={project.id} className="project-card-inline">
                <div className="project-card-preview">
                  <img src={project.renderedImage || project.sourceImage} alt={project.name || "Project"} />
                </div>
                <div className="project-card-body">
                  <div>
                    <h3>{project.name || `Residence ${project.id}`}</h3>
                    <div className="meta-row">
                      <Clock className="meta-icon" />
                      <span>{new Date(project.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link to={`/visualizer/${project.id}`} className="project-card-link">
                    Open project <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
