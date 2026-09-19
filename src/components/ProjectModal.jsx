import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle, X, Loader2, Pencil } from "lucide-react";

const spring = { type: "spring", stiffness: 300, damping: 28 };

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-md transition-all duration-200 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/20";

const labelClasses =
  "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400";

export default function ProjectModal({ open, editing, form, submitting, onChange, onSubmit, onClose }) {
  const formRef = useRef(null);
  const submittingRef = useRef(submitting);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Keyboard + scroll lock + initial focus — runs only when the modal opens
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !submittingRef.current) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => formRef.current?.focus(), 250);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(focusTimer);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && onClose()}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={editing ? "Edit project" : "Add new project"}
            initial={{ opacity: 0, y: 48, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={spring}
            className="glass-strong relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl shadow-black/60"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-600/30 blur-3xl" />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/25">
                    {editing ? <Pencil size={18} /> : <PlusCircle size={20} />}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      {editing ? "Edit Project" : "Add New Project"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {editing ? "Update the details below" : "Showcase your latest work"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={onSubmit} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="title" className={labelClasses}>
                    Project Title
                  </label>
                  <input
                    id="title"
                    ref={formRef}
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="e.g. Aurora Portfolio"
                    className={inputClasses}
                    maxLength={120}
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="description" className={labelClasses}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="What makes this project special?"
                    rows={3}
                    maxLength={2000}
                    className={`${inputClasses} resize-none`}
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="liveUrl" className={labelClasses}>
                    Live URL
                  </label>
                  <input
                    id="liveUrl"
                    type="url"
                    name="liveUrl"
                    value={form.liveUrl}
                    onChange={onChange}
                    placeholder="https://your-project.com"
                    className={inputClasses}
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="image" className={labelClasses}>
                    Preview Image URL <span className="normal-case text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="image"
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={onChange}
                    placeholder="https://your-project.com/thumbnail.png"
                    className={inputClasses}
                    maxLength={500}
                    disabled={submitting}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Leave empty to auto-capture a live screenshot of your site.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/45 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {submitting
                      ? "Saving..."
                      : editing
                        ? "Update Project"
                        : "Add Project"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}