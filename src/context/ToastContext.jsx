import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

const styles = {
  success: { icon: CheckCircle2, accent: "text-emerald-300", ring: "ring-emerald-400/30" },
  error: { icon: AlertTriangle, accent: "text-rose-300", ring: "ring-rose-400/30" },
  info: { icon: Info, accent: "text-cyan-300", ring: "ring-cyan-400/30" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    ({ type = "info", title, message, duration = 4200, action }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, title, message, action }]);
      if (duration) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = {
    success: (title, message, options) => push({ type: "success", title, message, ...options }),
    error: (title, message, options) => push({ type: "error", title, message, ...options }),
    info: (title, message, options) => push({ type: "info", title, message, ...options }),
    dismiss,
    push,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = styles[toast.type].icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className={`pointer-events-auto glass-strong rounded-2xl px-4 py-3 shadow-2xl shadow-black/50 ring-1 ${styles[toast.type].ring}`}
              >
                <div className="flex items-start gap-3">
                  <Icon size={20} className={`mt-0.5 shrink-0 ${styles[toast.type].accent}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-white">{toast.title}</p>
                    {toast.message && (
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{toast.message}</p>
                    )}
                    {toast.action && (
                      <button
                        onClick={() => {
                          toast.action.onClick();
                          dismiss(toast.id);
                        }}
                        className="mt-2 flex items-center gap-1 rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                      >
                        {toast.action.label}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Dismiss notification"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};