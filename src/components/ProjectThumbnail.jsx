import { useMemo, useState } from "react";
import { Globe, ExternalLink, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../api";

function screenshotSources(liveUrl) {
  const encoded = encodeURIComponent(liveUrl);
  return [
    `${API_BASE_URL}/screenshot?url=${encoded}`,
    `https://s0.wp.com/mshots/v1/${encoded}?w=640&h=420`,
  ];
}

function Placeholder({ domain }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/15 via-[#0d0d1f] to-purple-600/15 ring-1 ring-white/10">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-2.5 text-slate-400">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <Globe size={22} className="text-slate-300" />
        </span>
        <p className="max-w-[80%] truncate text-xs font-medium text-slate-500">{domain}</p>
      </div>
    </div>
  );
}

export default function ProjectThumbnail({ image, liveUrl, title, domain }) {
  const sources = useMemo(() => {
    const list = image && image.trim() ? [image.trim()] : [];
    return [...list, ...screenshotSources(liveUrl)];
  }, [image, liveUrl]);

  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  if (idx >= sources.length) {
    return <Placeholder domain={domain} />;
  }

  const src = sources[idx];

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-900 to-purple-950/60 ring-1 ring-white/10">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="skeleton absolute inset-0" />
          <span className="relative flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-slate-300 backdrop-blur-md">
            <Loader2 size={12} className="animate-spin text-cyan-300" />
            Loading preview
          </span>
        </div>
      )}

      <img
        src={src}
        alt={`Preview of ${title}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setIdx((i) => i + 1)}
        className={`h-full w-full object-cover object-top transition-all duration-700 ${
          loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
        }`}
      />

      {/* Domain chip */}
      <span className="absolute left-3 top-3 z-10 flex max-w-[70%] items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
        <Globe size={11} className="shrink-0 text-cyan-300" />
        <span className="truncate">{domain}</span>
      </span>

      {/* Open link overlay */}
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title} in a new tab`}
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 hover:bg-black/50 hover:opacity-100"
      >
        <span className="flex translate-y-2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-xl transition-transform duration-300 hover:translate-y-0">
          <ExternalLink size={15} />
          Open live site
        </span>
      </a>
    </div>
  );
}