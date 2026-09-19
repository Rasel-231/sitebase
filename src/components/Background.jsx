const blobs = [
  { color: "rgba(34, 211, 238, 0.22)", size: 560, top: "-12%", left: "-10%", duration: "22s", delay: "0s" },
  { color: "rgba(168, 85, 247, 0.24)", size: 620, top: "8%", right: "-14%", duration: "26s", delay: "-6s" },
  { color: "rgba(244, 114, 182, 0.16)", size: 480, bottom: "-14%", left: "18%", duration: "30s", delay: "-12s" },
  { color: "rgba(99, 102, 241, 0.2)", size: 520, bottom: "-10%", right: "12%", duration: "24s", delay: "-4s" },
];

export default function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05050f]">
        {blobs.map((blob, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl animate-floatBlob"
            style={{
              width: blob.size,
              height: blob.size,
              top: blob.top,
              left: blob.left,
              right: blob.right,
              bottom: blob.bottom,
              background: `radial-gradient(circle at 50% 50%, ${blob.color}, transparent 70%)`,
              animationDuration: blob.duration,
              animationDelay: blob.delay,
            }}
          />
        ))}
        <div className="grid-pattern" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(34,211,238,0.12), transparent 55%), radial-gradient(ellipse 65% 55% at 90% 110%, rgba(168,85,247,0.12), transparent 55%)",
          }}
        />
      </div>
      <div className="noise-overlay" />
    </>
  );
}