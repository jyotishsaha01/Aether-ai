import React, { useEffect, useRef } from "react";
import { AnimatedTheme } from "../types";

interface Theme3DBackgroundProps {
  theme: AnimatedTheme;
}

export const Theme3DBackground: React.FC<Theme3DBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking for 3D parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
    }

    // ==========================================
    // 1. SPACE THEME: 3D Warp Starfield & Meteors
    // ==========================================
    interface Star3D {
      x: number;
      y: number;
      z: number;
      prevZ: number;
      color: string;
      size: number;
    }

    const starCount = 380;
    const stars: Star3D[] = [];
    const starColors = ["#ffffff", "#e0e7ff", "#c7d2fe", "#93c5fd", "#fbcfe8"];
    const maxDepth = 1500;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 3,
        y: (Math.random() - 0.5) * height * 3,
        z: Math.random() * maxDepth,
        prevZ: maxDepth,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        size: Math.random() * 1.5 + 0.6,
      });
    }

    // Shooting Stars / Meteors
    interface Meteor {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      alpha: number;
      active: boolean;
    }
    const meteors: Meteor[] = [];
    let nextMeteorTime = Date.now() + 2000;

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.3,
        vx: (Math.random() * 8 + 8) * (Math.random() > 0.5 ? 1 : 1),
        vy: Math.random() * 5 + 4,
        length: Math.random() * 90 + 70,
        alpha: 1.0,
        active: true,
      });
      nextMeteorTime = Date.now() + Math.random() * 4000 + 2500;
    };

    // ==========================================
    // 2. MOON THEME: 3D Moon Surface & Orbiting Dust
    // ==========================================
    let moonAngle = 0;
    interface MoonDust {
      angle: number;
      distance: number;
      speed: number;
      yOffset: number;
      size: number;
      alpha: number;
    }
    const dustParticles: MoonDust[] = [];
    for (let i = 0; i < 70; i++) {
      dustParticles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 160 + 80,
        speed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        yOffset: (Math.random() - 0.5) * 60,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // ==========================================
    // 3. SKY THEME: Stratospheric 3D Clouds & Sunbeams
    // ==========================================
    interface CloudPuff {
      x: number;
      y: number;
      radius: number;
      vx: number;
      alpha: number;
      color: string;
    }
    const clouds: CloudPuff[] = [];
    for (let i = 0; i < 18; i++) {
      clouds.push({
        x: Math.random() * (width + 300) - 150,
        y: Math.random() * height * 0.6 + height * 0.2,
        radius: Math.random() * 140 + 80,
        vx: Math.random() * 0.15 + 0.05,
        alpha: Math.random() * 0.12 + 0.05,
        color: i % 2 === 0 ? "rgba(99, 102, 241, 0.08)" : "rgba(56, 189, 248, 0.06)",
      });
    }

    // ==========================================
    // 4. AURORA THEME: Undulating Harmonic Ribbons
    // ==========================================
    let auroraTime = 0;

    // Main 60FPS Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation towards mouse
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      const offsetX = (mouseX - width / 2) * 0.25;
      const offsetY = (mouseY - height / 2) * 0.25;

      if (theme === "space") {
        // --- SPACE THEME RENDER ---
        // Deep Nebula Glows
        const nebulaGrad1 = ctx.createRadialGradient(
          width * 0.2 + offsetX * 0.5,
          height * 0.3 + offsetY * 0.5,
          10,
          width * 0.2,
          height * 0.3,
          width * 0.6
        );
        nebulaGrad1.addColorStop(0, "rgba(99, 102, 241, 0.14)");
        nebulaGrad1.addColorStop(0.5, "rgba(147, 51, 234, 0.08)");
        nebulaGrad1.addColorStop(1, "rgba(5, 5, 12, 0)");
        ctx.fillStyle = nebulaGrad1;
        ctx.fillRect(0, 0, width, height);

        const nebulaGrad2 = ctx.createRadialGradient(
          width * 0.8 - offsetX * 0.4,
          height * 0.7 - offsetY * 0.4,
          10,
          width * 0.8,
          height * 0.7,
          width * 0.5
        );
        nebulaGrad2.addColorStop(0, "rgba(14, 165, 233, 0.12)");
        nebulaGrad2.addColorStop(0.6, "rgba(79, 70, 229, 0.06)");
        nebulaGrad2.addColorStop(1, "rgba(5, 5, 12, 0)");
        ctx.fillStyle = nebulaGrad2;
        ctx.fillRect(0, 0, width, height);

        // Render 3D Star Warp
        const fov = 350;
        const centerX = width / 2 + offsetX;
        const centerY = height / 2 + offsetY;
        const speed = 2.4;

        for (const star of stars) {
          star.prevZ = star.z;
          star.z -= speed;

          if (star.z <= 0) {
            star.z = maxDepth;
            star.prevZ = maxDepth;
            star.x = (Math.random() - 0.5) * width * 3;
            star.y = (Math.random() - 0.5) * height * 3;
          }

          // 3D Perspective Projection
          const k = fov / star.z;
          const px = star.x * k + centerX;
          const py = star.y * k + centerY;

          const prevK = fov / star.prevZ;
          const prevPx = star.x * prevK + centerX;
          const prevPy = star.y * prevK + centerY;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const depthRatio = 1 - star.z / maxDepth;
            const size = Math.max(star.size * depthRatio * 1.8, 0.6);
            const alpha = Math.min(depthRatio * 1.2, 0.95);

            // Draw streak tail when moving fast in foreground
            if (depthRatio > 0.4) {
              ctx.beginPath();
              ctx.moveTo(prevPx, prevPy);
              ctx.lineTo(px, py);
              ctx.strokeStyle = star.color;
              ctx.lineWidth = size * 0.8;
              ctx.globalAlpha = alpha * 0.7;
              ctx.stroke();
            }

            // Draw star head
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.shadowBlur = depthRatio > 0.6 ? 8 : 0;
            ctx.shadowColor = star.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
          }
        }

        // Spawn and render Shooting Stars
        if (Date.now() > nextMeteorTime) {
          spawnMeteor();
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;
          m.alpha -= 0.015;

          if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
            meteors.splice(i, 1);
            continue;
          }

          const grad = ctx.createLinearGradient(
            m.x,
            m.y,
            m.x - m.vx * (m.length / 10),
            m.y - m.vy * (m.length / 10)
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
          grad.addColorStop(0.3, `rgba(147, 197, 253, ${m.alpha * 0.8})`);
          grad.addColorStop(1, "rgba(99, 102, 241, 0)");

          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * 3.5, m.y - m.vy * 3.5);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.stroke();
        }
      } else if (theme === "moon") {
        // --- MOON THEME RENDER ---
        // Cosmic ambient starfield
        for (let i = 0; i < 90; i++) {
          const sx = (Math.sin(i * 123.4) * 0.5 + 0.5) * width;
          const sy = (Math.cos(i * 87.1) * 0.5 + 0.5) * height;
          const blink = (Math.sin(Date.now() * 0.002 + i) * 0.4 + 0.6) * 0.8;
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 3 === 0 ? 1.5 : 1), 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = blink;
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Position 3D Moon in the top-right / hero region with parallax
        const moonRadius = Math.min(width * 0.16, 120);
        const moonX = width * 0.82 - offsetX * 0.3;
        const moonY = Math.max(height * 0.22, 130) - offsetY * 0.3;
        moonAngle += 0.003;

        // Lunar Corona & Atmospheric Soft Glow
        const corona = ctx.createRadialGradient(
          moonX,
          moonY,
          moonRadius * 0.8,
          moonX,
          moonY,
          moonRadius * 2.8
        );
        corona.addColorStop(0, "rgba(224, 231, 255, 0.22)");
        corona.addColorStop(0.4, "rgba(165, 180, 252, 0.08)");
        corona.addColorStop(1, "rgba(10, 10, 16, 0)");
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // 3D Spherical Moon Body with Shading
        ctx.save();
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.clip();

        // Base Moon Surface
        const moonBase = ctx.createRadialGradient(
          moonX - moonRadius * 0.35,
          moonY - moonRadius * 0.35,
          moonRadius * 0.1,
          moonX,
          moonY,
          moonRadius
        );
        moonBase.addColorStop(0, "#f8fafc");
        moonBase.addColorStop(0.5, "#cbd5e1");
        moonBase.addColorStop(0.85, "#64748b");
        moonBase.addColorStop(1, "#1e293b");
        ctx.fillStyle = moonBase;
        ctx.fill();

        // Lunar Craters with 3D Offset Rotation
        const craters = [
          { r: 24, ox: -25, oy: -20, depth: 0.6 },
          { r: 18, ox: 20, oy: -15, depth: 0.5 },
          { r: 32, ox: 5, oy: 25, depth: 0.7 },
          { r: 14, ox: -40, oy: 15, depth: 0.4 },
          { r: 12, ox: 35, oy: 28, depth: 0.5 },
          { r: 8, ox: -10, oy: -45, depth: 0.3 },
          { r: 10, ox: 25, oy: -40, depth: 0.4 },
        ];

        for (const c of craters) {
          const cx = moonX + c.ox * Math.cos(moonAngle) - c.oy * Math.sin(moonAngle) * 0.3;
          const cy = moonY + c.ox * Math.sin(moonAngle) * 0.3 + c.oy;

          const craterGrad = ctx.createRadialGradient(
            cx - c.r * 0.3,
            cy - c.r * 0.3,
            c.r * 0.2,
            cx,
            cy,
            c.r
          );
          craterGrad.addColorStop(0, "rgba(71, 85, 105, 0.45)");
          craterGrad.addColorStop(0.7, "rgba(51, 65, 85, 0.65)");
          craterGrad.addColorStop(1, "rgba(148, 163, 184, 0.3)");

          ctx.beginPath();
          ctx.arc(cx, cy, c.r, 0, Math.PI * 2);
          ctx.fillStyle = craterGrad;
          ctx.fill();
        }

        // 3D Terminator Shadow (Day/Night Crescent curvature)
        const shadowGrad = ctx.createLinearGradient(
          moonX - moonRadius,
          moonY,
          moonX + moonRadius,
          moonY
        );
        shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        shadowGrad.addColorStop(0.65, "rgba(0, 0, 0, 0.4)");
        shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.95)");
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius * 2, moonRadius * 2);
        ctx.restore();

        // Orbiting Cosmic Dust Rings
        for (const dust of dustParticles) {
          dust.angle += dust.speed;
          const dx = moonX + Math.cos(dust.angle) * dust.distance;
          const dy = moonY + Math.sin(dust.angle) * (dust.distance * 0.38) + dust.yOffset;

          const front = Math.sin(dust.angle) > 0;
          ctx.beginPath();
          ctx.arc(dx, dy, dust.size * (front ? 1.2 : 0.8), 0, Math.PI * 2);
          ctx.fillStyle = front ? "#e0e7ff" : "#818cf8";
          ctx.globalAlpha = dust.alpha * (front ? 0.9 : 0.4);
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#818cf8";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1.0;
      } else if (theme === "sky") {
        // --- SKY THEME RENDER: Twilight Stratosphere & Light Orbs ---
        // Atmospheric Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, "rgba(15, 23, 42, 0.6)");
        skyGrad.addColorStop(0.5, "rgba(30, 41, 59, 0.4)");
        skyGrad.addColorStop(1, "rgba(14, 116, 144, 0.15)");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Sunbeam / Ethereal Radiant Caustics
        const beamX = width * 0.5 + offsetX;
        const beamGrad = ctx.createRadialGradient(beamX, -100, 50, beamX, height * 0.5, width * 0.8);
        beamGrad.addColorStop(0, "rgba(56, 189, 248, 0.18)");
        beamGrad.addColorStop(0.4, "rgba(99, 102, 241, 0.08)");
        beamGrad.addColorStop(1, "rgba(5, 10, 20, 0)");
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, 0, width, height);

        // Drifting Volumetric Cloud Banks
        for (const cloud of clouds) {
          cloud.x += cloud.vx;
          if (cloud.x > width + cloud.radius * 2) {
            cloud.x = -cloud.radius * 2;
          }

          const cg = ctx.createRadialGradient(
            cloud.x + offsetX * 0.2,
            cloud.y + offsetY * 0.2,
            cloud.radius * 0.1,
            cloud.x + offsetX * 0.2,
            cloud.y + offsetY * 0.2,
            cloud.radius
          );
          cg.addColorStop(0, cloud.color);
          cg.addColorStop(1, "rgba(15, 23, 42, 0)");
          ctx.fillStyle = cg;
          ctx.beginPath();
          ctx.arc(cloud.x + offsetX * 0.2, cloud.y + offsetY * 0.2, cloud.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Floating Stratospheric Light Motes
        for (let i = 0; i < 45; i++) {
          const t = Date.now() * 0.001 + i * 3.1;
          const mx = ((Math.sin(t * 0.5 + i) * 0.5 + 0.5) * width) + offsetX * 0.3;
          const my = ((Math.cos(t * 0.4 + i) * 0.5 + 0.5) * height) + offsetY * 0.3;
          ctx.beginPath();
          ctx.arc(mx, my, (i % 2 === 0 ? 1.8 : 1.2), 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? "#38bdf8" : "#a5b4fc";
          ctx.globalAlpha = Math.sin(t + i) * 0.3 + 0.5;
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      } else if (theme === "aurora") {
        // --- AURORA THEME RENDER: 3D Harmonic Northern Lights Ribbons ---
        auroraTime += 0.015;

        // Background Starfield
        for (let i = 0; i < 110; i++) {
          const sx = (Math.sin(i * 92.1) * 0.5 + 0.5) * width;
          const sy = (Math.cos(i * 43.7) * 0.5 + 0.5) * height;
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 4 === 0 ? 1.6 : 0.9), 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = (Math.sin(auroraTime * 1.5 + i) * 0.35 + 0.65) * 0.7;
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Undulating Harmonic Curtains
        const ribbons = [
          { color: "rgba(16, 185, 129, 0.16)", amp: 75, freq: 0.003, y: height * 0.22, speed: 1.0 },
          { color: "rgba(6, 182, 212, 0.18)", amp: 95, freq: 0.0025, y: height * 0.28, speed: 0.7 },
          { color: "rgba(168, 85, 247, 0.15)", amp: 60, freq: 0.0035, y: height * 0.35, speed: 1.2 },
        ];

        for (const r of ribbons) {
          ctx.beginPath();
          ctx.moveTo(0, height);

          for (let x = 0; x <= width; x += 15) {
            const wave1 = Math.sin(x * r.freq + auroraTime * r.speed) * r.amp;
            const wave2 = Math.cos(x * r.freq * 1.7 - auroraTime * r.speed * 0.6) * (r.amp * 0.4);
            const py = r.y + wave1 + wave2 + offsetY * 0.4;
            if (x === 0) {
              ctx.lineTo(x, py);
            } else {
              ctx.lineTo(x, py);
            }
          }

          ctx.lineTo(width, height);
          ctx.closePath();

          const ribbonGrad = ctx.createLinearGradient(0, r.y - r.amp, 0, height * 0.8);
          ribbonGrad.addColorStop(0, r.color);
          ribbonGrad.addColorStop(0.5, r.color);
          ribbonGrad.addColorStop(1, "rgba(5, 5, 12, 0)");
          ctx.fillStyle = ribbonGrad;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [theme]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 3D Hardware-Accelerated Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-opacity duration-700"
      />

      {/* Subtle vignette scrim to guarantee 100% WCAG AAA text contrast across any monitor */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/40 to-zinc-950/60 pointer-events-none" />
    </div>
  );
};
