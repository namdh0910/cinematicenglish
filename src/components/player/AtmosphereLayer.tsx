"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAdaptive } from "@/context/AdaptiveContext";

interface AtmosphereLayerProps {
  mood: 'the-void' | 'the-pulse' | 'the-calm';
  isFocusMode: boolean;
}

// Pre-compute particle data at module level — deterministic, no Math.random() in render.
// This prevents SSR/CSR hydration mismatch.
const PARTICLE_DATA = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 83 + 17) % 100,
  y: (i * 61 + 29) % 100,
  opacity: 0.05 + ((i * 7) % 25) / 100,
  yMove: -((i * 53 + 40) % 80) - 30,
  duration: 10 + ((i * 31) % 10),
  delay: ((i * 19) % 50) / 10,
}));

export default function AtmosphereLayer({ mood, isFocusMode }: AtmosphereLayerProps) {
  const { atmosphere } = useAdaptive();

  const moodStyles = {
    'the-void': {
      bg: "bg-[#050508]",
      glow: "from-violet-500/20 to-transparent",
      particles: "bg-violet-400/10",
    },
    'the-pulse': {
      bg: "bg-[#0d0d18]",
      glow: "from-amber-500/20 to-transparent",
      particles: "bg-amber-400/10",
    },
    'the-calm': {
      bg: "bg-[#0a0a0f]",
      glow: "from-cyan-500/20 to-transparent",
      particles: "bg-cyan-400/10",
    },
  };

  const current = moodStyles[mood];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ${current.bg}`}>
      {/* Dynamic Glow */}
      <motion.div
        animate={{
          scale: [1, 1.1 + atmosphere.glowIntensity * 0.2, 1],
          opacity: [
            0.3 * atmosphere.glowIntensity,
            0.6 * atmosphere.glowIntensity,
            0.3 * atmosphere.glowIntensity,
          ],
        }}
        transition={{
          duration: 8 / atmosphere.motionPacing,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-radial ${current.glow} blur-[120px] transition-all duration-[2000ms]`}
      />

      {/* Focus Mode Blur Overlay */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 backdrop-blur-${atmosphere.blurStrength} bg-black/20 z-10 transition-all duration-[2000ms]`}
          />
        )}
      </AnimatePresence>

      {/* Subtle Particles — hidden on mobile for GPU performance */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        {PARTICLE_DATA.map((p, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${p.x}%`,
              y: `${p.y}%`,
              opacity: p.opacity,
            }}
            animate={{
              y: [`${p.y}%`, `${p.yMove}px`],
              opacity: [p.opacity, 0],
            }}
            transition={{
              duration: p.duration / atmosphere.motionPacing,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
            className={`absolute w-1 h-1 rounded-full ${current.particles} transition-all duration-[2000ms]`}
          />
        ))}
      </div>

      {/* Cinematic Film Grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-[2000ms]"
        style={{ opacity: atmosphere.grainOpacity }}
      />
    </div>
  );
}
