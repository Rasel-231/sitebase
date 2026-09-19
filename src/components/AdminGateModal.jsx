import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Loader2, Lock, ShieldCheck, X, Eye, EyeOff } from "lucide-react";

const spring = { type: "spring", stiffness: 300, damping: 28 };

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-md transition-all duration-200 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/20";

export default function AdminGateModal({ open, mode, projectTitle, onSubmit, onClose }) {
  const [adminId, setAdminId] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setAdminId("");
    setShow(false);
    setError("");
    setSubmitting(false);

    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 250);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(focusTimer);
    };
  }, [open, onClose, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId.trim()) {
      setError("Please enter the admin ID.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await onSubmit(adminId.trim());
    } catch (err) {
      setError(err.message || "Verification failed. Try again.");
      setSubmitting(false);
    }
  };

  const isDelete = mode === "delete";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && onClose()}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Admin verification"
            initial={{ opacity: 0, y: 48, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={spring}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-black/60"
          >
            <div
              className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl ${
                isDelete
                  ? "bg-gradient-to-br from-rose-500/30 to-orange-600/30"
                  : "bg-gradient-to-br from-cyan-500/30 to-purple-600/30"
              }`}
            />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl text-white shadow-lg ${
                      isDelete
                        ? "bg-gradient-to-br from-rose-500 to-orange-600 shadow-rose-500/25"
                        : "bg-gradient-to-br from-cyan-500 to-purple-600 shadow-purple-500/25"
                    }`}
                  >
                    <KeyRound size={18} />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Admin verification</h2>
                    <p className="text-xs text-slate-400">
                      {isDelete
                        ? `Delete "${projectTitle || "this project"}"`
                        : `Edit "${projectTitle || "this project"}"`}{" "}
                      — enter the admin ID to continue.
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

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="adminId" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Admin ID
                  </label>
                  <div className="relative">
                    <input
                      id="adminId"
                      ref={inputRef}
                      type={show ? "text" : "password"}
                      name="adminId"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="Enter your admin ID"
                      className={`${inputClasses} pr-11`}
                      autoComplete="off"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      disabled={submitting}
                      className="absolute right-0 top-0 flex h-full items-center px-3 text-slate-400 transition hover:text-slate-200 disabled:opacity-40"
                      aria-label={show ? "Hide admin ID" : "Show admin ID"}
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-sm text-rose-400"
                  >
                    <Lock size={14} />
                    {error}
                  </motion.p>
                )}

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
                    disabled={submitting || !adminId.trim()}
                    className={`flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${
                      isDelete
                        ? "bg-gradient-to-r from-rose-500 to-orange-600 shadow-rose-500/25 hover:shadow-rose-500/45"
                        : "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-purple-500/25 hover:shadow-purple-500/45"
                    }`}
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={16} />
                    )}
                    {submitting
                      ? "Verifying..."
                      : isDelete
                        ? "Verify & Delete"
                        : "Verify & Edit"}
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