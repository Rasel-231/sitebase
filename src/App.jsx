import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox, ArrowUpRight } from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "./api";
import { useToast } from "./context/ToastContext";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import StatsHeader from "./components/StatsHeader";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";
import SkeletonCard from "./components/SkeletonCard";

const initialForm = { title: "", description: "", liveUrl: "", image: "" };

export default function App() {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const lastDeleted = useRef(null);
  const gridRef = useRef(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      toast.error("Connection failed", err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl,
      image: project.image || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      liveUrl: form.liveUrl.trim(),
      image: form.image.trim(),
    };
    if (!payload.title || !payload.description || !payload.liveUrl) {
      toast.error("Missing fields", "Please fill in all the fields.");
      return;
    }
    try {
      setSubmitting(true);
      if (editing) {
        const res = await updateProject(editing._id, payload);
        setProjects((prev) => prev.map((p) => (p._id === editing._id ? res.data : p)));
        toast.success("Project updated", `${res.data.title} was updated.`);
      } else {
        const res = await createProject(payload);
        setProjects((prev) => [res.data, ...prev]);
        toast.success("Project added", `${res.data.title} is now live in your showcase.`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Save failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (project) => {
    try {
      await deleteProject(project._id);
      lastDeleted.current = project;
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
      toast.success("Project deleted", `${project.title} was removed.`, {
        action: {
          label: "Undo",
          onClick: async () => {
            if (!lastDeleted.current) return;
            try {
              const res = await createProject({
                title: lastDeleted.current.title,
                description: lastDeleted.current.description,
                liveUrl: lastDeleted.current.liveUrl,
                image: lastDeleted.current.image || "",
              });
              setProjects((prev) => [res.data, ...prev]);
              toast.success("Restored", `${res.data.title} is back.`);
            } catch (err) {
              toast.error("Restore failed", err.message);
            } finally {
              lastDeleted.current = null;
            }
          },
        },
      });
    } catch (err) {
      toast.error("Delete failed", err.message);
    }
  };

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen font-body text-slate-100">
      <Background />

      <Navbar onAdd={openAdd} />

      <main className="relative z-10 pb-24">
        <StatsHeader projects={projects} onScrollToGrid={scrollToGrid} />

        {/* Grid section */}
        <section ref={gridRef} className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                The collection
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Live links, shipped and ready to explore.
              </p>
            </div>
            {projects.length > 0 && (
              <span className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-300">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </span>
            )}
          </motion.div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass mx-auto max-w-md rounded-3xl px-8 py-16 text-center"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20">
                <Inbox size={26} className="text-cyan-300" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-white">Nothing here yet</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Your gallery is waiting for its first masterpiece. Add a project to get started.
              </p>
              <button
                onClick={openAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
              >
                <ArrowUpRight size={16} />
                Add your first project
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  >
                    <ProjectCard
                      project={project}
                      index={i}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-600">
        Built with <span className="text-cyan-400">React</span>,{" "}
        <span className="text-purple-400">Tailwind</span> &{" "}
        <span className="text-pink-400">Framer Motion</span> — crafted for the internet.
      </footer>

      <ProjectModal
        open={modalOpen}
        editing={editing}
        form={form}
        submitting={submitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => !submitting && setModalOpen(false)}
      />
    </div>
  );
}