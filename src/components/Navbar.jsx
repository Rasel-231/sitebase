import { motion } from "framer-motion";
import { Plus, Layers } from "lucide-react";

export default function Navbar({ onAdd }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6"
    >
      <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 shadow-lg shadow-black/30 sm:px-6">
        <button
          onClick={onScrollTop}
          className="flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-purple-500/30">
            <Layers size={18} className="text-white" />
          </span>
          <span className="hidden font-display text-base font-bold tracking-tight text-white sm:block">
            Showcase<span className="text-cyan-400">.</span>
          </span>
        </button>

        <button
          onClick={onAdd}
          className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/45 hover:brightness-110"
        >
          <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90" />
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </button>
      </nav>
    </motion.header>
  );
}

function onScrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}