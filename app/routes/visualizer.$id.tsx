import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router"
import { generate3DView } from "../../lib/ai.action";
import { Box, Check, Copy, Download, RefreshCcw, Share2, X } from "lucide-react";
import Button from "../../components/ui/Button";
import { createProject, getProjectById } from "../../lib/puter.action";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

const VisualizerId = () => {

  const { id } = useParams();
  const hasInitialGenerated = useRef(false);
  const navigate = useNavigate();
  const { userId } = useOutletContext<AuthContext>();

  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareSaving, setIsShareSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleBack = () => navigate('/');

  const persistProjectVisibility = async (visibility: "private" | "public") => {
    if (!project?.id) return null;

    const nextItem: DesignItem = {
      ...project,
      renderedImage: currentImage || project.renderedImage || null,
      renderedPath: project.renderedPath || null,
      timestamp: project.timestamp || Date.now(),
      ownerId: project.ownerId ?? userId ?? null,
      sharedBy: visibility === "public" ? (userId ?? project.sharedBy ?? null) : (project.sharedBy ?? null),
      sharedAt: visibility === "public" ? new Date().toISOString() : (project.sharedAt ?? null),
      isPublic: visibility === "public",
    };

    const saved = await createProject({ item: nextItem, visibility });

    if (saved) {
      setProject(saved);
      setCurrentImage(saved.renderedImage || currentImage || project.renderedImage || null);

      if (visibility === "public") {
        const publicUrl = `${window.location.origin}/visualizer/${saved.id}`;
        setShareLink(publicUrl);
      }
    }

    return saved;
  };

  const handleShare = async () => {
    if (!project?.id || !currentImage) return;

    try {
      setIsShareSaving(true);
      setCopied(false);
      const saved = await persistProjectVisibility("public");

      if (saved) {
        setIsShareModalOpen(true);
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsShareSaving(false);
    }
  };

  const handleShareClose = async () => {
    try {
      setIsShareSaving(true);
      await persistProjectVisibility("private");
    } catch (error) {
      console.error("Failed to restore visibility:", error);
    } finally {
      setIsShareSaving(false);
      setCopied(false);
      setIsShareModalOpen(false);
    }
  };

  const handleCopyLink = async () => {
    const urlToCopy = shareLink || (typeof window !== "undefined" ? `${window.location.origin}/visualizer/${id}` : null);

    if (!urlToCopy) return;

    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleExport = () => {
    if (!currentImage) return;

    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `visora-render-${id || 'project'}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runGeneration = async (item: DesignItem) => {
    if (!id || !item.sourceImage) return;

    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: item.sourceImage });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        const updatedItem = {
          ...item,
          renderedImage: result.renderedImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: item.ownerId ?? userId ?? null,
          isPublic: item.isPublic ?? false,
        }

        const saved = await createProject({ item: updatedItem, visibility: "private" })

        if(saved) {
          setProject(saved);
          setCurrentImage(saved.renderedImage || result.renderedImage);
        }
      }
    } catch (error) {
      console.error('Generation failed: ', error);
    } finally {
      setIsProcessing(false);
    }
  }

    useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
      hasInitialGenerated.current = false;
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenerated.current ||
      !project?.sourceImage
    )
      return;

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    void runGeneration(project);
  }, [project, isProjectLoading]);

  const compareAfterImage = currentImage ?? project?.renderedImage ?? project?.sourceImage;

  return (
    <div className="visualizer">
      <nav className="topbar">
        <div className="brand">
          <Box className="logo" />
          <span className="name">
            Visora
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" /> Exit Editor
        </Button>
      </nav>
      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className="note">
                Created by You
              </p>
            </div>
            <div className="panel-actions">
              <Button
                size="sm"
                onClick={handleExport}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button
                size="sm"
                onClick={handleShare}
                className="share"
                disabled={!currentImage || isShareSaving}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {isShareSaving ? "Sharing..." : "Share"}
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
            {currentImage ? (
              <img src={currentImage} alt="AI Render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img src={project?.sourceImage} alt="Original" className="render-fallback" />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">Generating your 3D visualization...</span>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="panel compare">
            <div className="panel-header">
              <div className="panel-meta">
                <p>Comparison</p>
                <h3>Before and After</h3>
              </div>
              <div className="hint">
                Drag to Compare
              </div>
            </div>
            <div className="compare-stage">
              {project?.sourceImage && compareAfterImage ? (
                <ReactCompareSlider
                  defaultValue={50}
                  style={{width: '100%', height: 'auto'}}
                  itemOne={
                    <ReactCompareSliderImage src={project?.sourceImage} alt="before" className="compare-img" />
                  }
                  itemTwo={
                    <ReactCompareSliderImage src={compareAfterImage} alt="after" className="compare-img" />
                  }
                 />
              ) : (
                <div className="compare-fallback">
                  {project?.sourceImage && (
                    <img src={project?.sourceImage} alt="Before" className="compare-img" />
                  )}
                </div>
              )}
            </div>
        </div>
      </section>

      {isShareModalOpen && (
        <div className="share-modal-backdrop" onClick={handleShareClose}>
          <div className="share-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="share-modal-header">
              <div>
                <p className="share-badge">Shared preview</p>
                <h3>Ready to share this visualization</h3>
              </div>
              <button type="button" className="share-modal-close" onClick={handleShareClose} aria-label="Close share dialog">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="share-modal-body">
              {currentImage ? (
                <div className="share-modal-preview">
                  <img src={currentImage} alt="Shared render" />
                </div>
              ) : null}
              <div className="share-modal-info">
                <div className="share-meta-row">
                  <span className="share-meta-label">Shared by</span>
                  <span className="share-meta-value">{project?.sharedBy ?? userId ?? "You"}</span>
                </div>
                <div className="share-meta-row">
                  <span className="share-meta-label">Published</span>
                  <span className="share-meta-value">
                    {project?.sharedAt ? new Date(project.sharedAt).toLocaleString() : "Just now"}
                  </span>
                </div>
                <div className="share-link-block">
                  <span className="share-meta-label">Project link</span>
                  <div className="share-link-row">
                    <a href={shareLink || `${window.location.origin}/visualizer/${id}`} target="_blank" rel="noreferrer">
                      {shareLink || `${window.location.origin}/visualizer/${id}`}
                    </a>
                    <button type="button" className="share-copy-btn" onClick={handleCopyLink}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="share-link-block">
                  <span className="share-meta-label">Rendered image</span>
                  <div className="share-link-row">
                    <a href={currentImage || project?.renderedImage || "#"} target="_blank" rel="noreferrer">
                      {currentImage || project?.renderedImage || "Render is still being prepared"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisualizerId