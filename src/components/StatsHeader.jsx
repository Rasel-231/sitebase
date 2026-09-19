import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FolderKanban, Link2, Feather, ArrowDown, Sparkles } from "lucide-react";

function useCountUp(target, start) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    const duration = 1500;
    const begin = performance.now();
    const tick = (now) => {
      const p = Math.min((now - begin) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);

  return value;
}

function Stat({ icon: Icon, value, label, suffix = "", accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="glass rounded-2xl px-6 py-5 text-center"
    >
      <Icon size={20} className={`mx-auto ${accent}`} />
      <p className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">{label}</p>
    </motion.div>
  );
}

export default function StatsHeader({ projects, onScrollToGrid }) {
  const stats = {
    projects: projects.length,
    words: projects.reduce((sum, p) => sum + (p.description ? p.description.trim().split(/\s+/).length : 0), 0),
  };

  const domains = Array.from(new Set(projects.map((p) => {
    try {
      return new URL(p.liveUrl).hostname.replace(/^www\./, "");
    } catch {
      return p.liveUrl;
    }
  })));

  const marquee = domains.length ? [...domains, ...domains] : ["No projects yet"];

  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className="relative text-center"
      >
        <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
          <Sparkles size={14} className="text-cyan-400" />
          The Showcase
        </span>

        <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
          Projects worth{" "}
          <span className="text-aurora">showing</span>{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(120deg,#fff,#94a3b8)" }}
          >
            off.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          A curated gallery of live links and the work behind them — added as fast as you ship.
        </p>

        <button
          onClick={onScrollToGrid}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-200"
        >
          Explore projects
          <ArrowDown size={15} className="animate-bounce" />
        </button>
      </motion.div>

      {/* Stats */}
      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat icon={FolderKanban} value={stats.projects} label="Projects" accent="text-cyan-400" />
        <Stat icon={Link2} value={stats.projects} label="Live Links" accent="text-purple-400" />
        <Stat icon={Feather} value={stats.words} label="Words Curated" accent="text-pink-400" />
      </div>

      {/* Domain marquee */}
      {domains.length > 0 && (
        <div className="relative mt-14 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
            {marquee.map((domain, i) => (
              <span key={i} className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}