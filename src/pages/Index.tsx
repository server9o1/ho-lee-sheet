import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import bgGif from "@/assets/bg.gif";

const BOOT_LINES = [
  "> initializing secure channel...",
  "> handshake complete",
  "> decrypting payload...",
  "> [OK] transmission verified",
];

const HEADLINE = "We're putting the finishing touches on something special.";
const SUBLINE = "Stay tuned.";

function useTypewriter(text: string, speed = 35, startDelay = 0) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    let raf: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const tick = () => {
        i++;
        setOut(text.slice(0, i));
        if (i < text.length) raf = setTimeout(tick, speed);
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(raf!);
    };
  }, [text, speed, startDelay]);
  return out;
}

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-[1em] w-[0.55ch] -mb-[0.1em] animate-pulse bg-emerald-300 align-middle" />
  );
}

function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + Math.random() * 12));
    }, 120);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex w-full items-center gap-3 text-xs">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-emerald-500/15">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-[width] duration-150"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="w-10 text-right tabular-nums text-emerald-400/70">
        {Math.min(Math.round(pct), 100)}%
      </span>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{now.toISOString().slice(11, 19)} UTC</div>;
}

function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const fontSize = 14;
    let cols = Math.floor(w / fontSize);
    const drops: number[] = Array(cols)
      .fill(1)
      .map(() => Math.random() * -50);
    const chars = "アァカサタナハマヤラワ0123456789ABCDEF<>/{}#$@*".split("");

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle =
          y < 30 ? "rgba(220,255,235,0.9)" : "rgba(16,185,129,0.55)";
        ctx.fillText(text, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.floor(w / fontSize);
      drops.length = cols;
      for (let i = 0; i < cols; i++)
        if (drops[i] === undefined) drops[i] = Math.random() * -50;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-screen"
      aria-hidden
    />
  );
}

const Index = () => {
  const [bootDone, setBootDone] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [glitch, setGlitch] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setBootLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => setBootDone(true), 400);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!bootDone) return;
    setGlitch(true);
    const t1 = setTimeout(() => setGlitch(false), 700);
    const t2 = setTimeout(() => setShowFinal(true), 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [bootDone]);

  const headline = useTypewriter(showFinal ? HEADLINE : "", 28, 200);
  const subline = useTypewriter(
    showFinal && headline === HEADLINE ? SUBLINE : "",
    55,
    250
  );
  const showIcon = subline === SUBLINE;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-emerald-300">
      {/* Blurred GIF */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgGif})`,
          filter: "blur(18px) brightness(0.4) saturate(1.2)",
        }}
        aria-hidden
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden
      />
      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,255,140,0.35) 0px, rgba(0,255,140,0.35) 1px, transparent 1px, transparent 3px)",
        }}
        aria-hidden
      />
      {/* CRT flicker */}
      <div
        className="pointer-events-none absolute inset-0 bg-emerald-500/[0.03]"
        style={{ animation: "crt 3s ease-in-out infinite" }}
        aria-hidden
      />

      {/* Matrix rain */}
      <MatrixRain />

      {/* Top corner HUD */}
      <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 sm:text-xs">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          sys.online
        </div>
        <div className="mt-1 text-emerald-400/40">node // 0xAA-XSAN</div>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/70 sm:text-xs">
        <Clock />
        <div className="mt-1 text-emerald-400/40">enc: aes-256</div>
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <div
          className={`w-full max-w-2xl rounded-md border border-emerald-500/40 bg-black/60 p-5 font-mono shadow-[0_0_60px_-10px_rgba(16,185,129,0.5)] backdrop-blur-sm transition-all duration-300 sm:p-7 ${
            glitch ? "animate-glitch" : ""
          }`}
        >
          {/* Window chrome */}
          <div className="mb-4 flex items-center justify-between border-b border-emerald-500/30 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/70">
              terminal — root@anon
            </span>
            <span className="text-[10px] text-emerald-400/40">v1.0.4</span>
          </div>

          {/* Boot phase */}
          {!showFinal && (
            <div className="space-y-1 text-sm leading-relaxed text-emerald-300/90 sm:text-base">
              {bootLines.map((line, i) => (
                <div
                  key={i}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 30}ms`,
                    animationFillMode: "forwards",
                    opacity: 0,
                  }}
                >
                  {line}
                </div>
              ))}
              {!bootDone && (
                <div className="mt-2 flex items-center gap-2 text-emerald-400/80">
                  <ProgressBar />
                </div>
              )}
            </div>
          )}

          {/* Final reveal */}
          {showFinal && (
            <div className="py-2">
              <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-emerald-400/60">
                // incoming transmission
              </div>
              <h1
                data-text={headline}
                className="glitch-text bg-gradient-to-r from-emerald-200 via-emerald-100 to-emerald-300 bg-clip-text text-2xl font-semibold leading-tight tracking-tight text-transparent sm:text-3xl md:text-4xl"
              >
                {headline}
                {headline.length < HEADLINE.length && <Caret />}
              </h1>
              <div className="mt-4 text-lg text-emerald-200/90 sm:text-xl">
                {subline}
                {subline.length > 0 && subline.length < SUBLINE.length && (
                  <Caret />
                )}
                {subline === SUBLINE && <Caret />}
              </div>

              {showIcon && (
                <div
                  className="mt-10 flex flex-col items-center gap-3"
                  style={{
                    opacity: 0,
                    animation: "rise-in 0.6s cubic-bezier(0.2,0.8,0.2,1) 200ms forwards",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400/70">
                    follow the signal
                  </p>
                  <a
                    href="https://www.instagram.com/aa_xsan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Instagram @aa_xsan"
                    className="group relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_40px_rgba(236,72,153,0.55)] transition-transform duration-300 hover:scale-110 hover:rotate-3"
                  >
                    <Instagram
                      className="h-10 w-10 text-white drop-shadow"
                      strokeWidth={2}
                    />
                    <span className="absolute inset-0 rounded-2xl ring-2 ring-pink-400/60" />
                    <span className="absolute inset-0 rounded-2xl ring-2 ring-pink-400/60 animate-ping" />
                  </a>
                  <span className="font-mono text-sm text-emerald-200/90">
                    @aa_xsan
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-400/40">
          press · stay · connected
        </div>
      </main>

      <style>{`
        @keyframes crt {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.07; }
        }

        @keyframes glitch-anim {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          20% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
          40% { transform: translate(3px, -2px); filter: hue-rotate(180deg); }
          60% { transform: translate(-2px, -1px); filter: hue-rotate(270deg); }
          80% { transform: translate(2px, 1px); filter: hue-rotate(45deg); }
          100% { transform: translate(0); filter: hue-rotate(0deg); }
        }
        .animate-glitch { animation: glitch-anim 0.18s steps(2) infinite; }

        .glitch-text { position: relative; }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          pointer-events: none;
        }
        .glitch-text::before {
          color: rgba(236, 72, 153, 0.55);
          transform: translate(2px, 0);
          mix-blend-mode: screen;
          animation: g1 2.4s infinite steps(2);
        }
        .glitch-text::after {
          color: rgba(34, 211, 238, 0.45);
          transform: translate(-2px, 0);
          mix-blend-mode: screen;
          animation: g2 3.1s infinite steps(2);
        }
        @keyframes g1 {
          0%, 92%, 100% { transform: translate(0,0); opacity: 0; }
          93% { transform: translate(2px,-1px); opacity: 0.9; }
          96% { transform: translate(-2px,1px); opacity: 0.9; }
        }
        @keyframes g2 {
          0%, 88%, 100% { transform: translate(0,0); opacity: 0; }
          90% { transform: translate(-2px,1px); opacity: 0.8; }
          94% { transform: translate(2px,-1px); opacity: 0.8; }
        }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(14px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Index;
