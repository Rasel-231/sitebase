import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import ProjectThumbnail from "./ProjectThumbnail";

const spring = { stiffness: 260, damping: 20, mass: 0.7 };

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = Date.now();
  const diff = now - date.getTime();
  const day = 86400000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) return `${Math.round(diff / day)} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ProjectCard({ project, index, onEdit, onDelete }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), spring);
  const glareOpacity = useTransform(my, [0, 1], [0.5, 0]);
  const glareY = useTransform(my, [0, 1], ["-60%", "140%"]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const resetTilt = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: (index % 3) * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className="group relative h-full overflow-hidden rounded-3xl p-[1px] transition-shadow duration-300 hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.35)]"
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/40 via-transparent to-purple-500/40 opacity-40 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-between rounded-[calc(1.5rem-1px)] bg-[#0c0c1c]/90 p-5 backdrop-blur-xl">
        {/* Glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[calc(1.5rem-1px)]"
          style={{ opacity: glareOpacity }}
        >
          <motion.div
            className="absolute left-0 h-2/5 w-full"
            style={{
              top: glareY,
              background:
                "linear-gradient(180deg, transparent, rgba(160,240,255,0.07), rgba(200,150,255,0.06), transparent)",
            }}
          />
        </motion.div>

        <div className="relative" style={{ transform: "translateZ(25px)" }}>
          <ProjectThumbnail
            image={project.image}
            liveUrl={project.liveUrl}
            title={project.title}
            domain={getDomain(project.liveUrl)}
          />

          <div className="mt-4 flex items-center justify-between text-[11px] font-medium uppercase tracking-widest">
            <span className="text-slate-500">{formatDate(project.createdAt)}</span>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.25)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live
            </span>
          </div>

          <h3
            className="mt-3 font-display text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-400"
          >
            {project.title}
          </h3>

          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {project.description}
          </p>
        </div>

        <div
          className="relative mt-5 flex items-center gap-2 pt-2"
          style={{ transform: "translateZ(20px)" }}
        >
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/45 hover:brightness-110"
          >
            <ExternalLink size={16} />
            Live Preview
          </a>
          <button
            onClick={() => onEdit(project)}
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-all duration-200 hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
            title="Edit project"
            aria-label={`Edit ${project.title}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
            title="Delete project"
            aria-label={`Delete ${project.title}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}