import { useRef, useEffect } from 'react';
import { isRainy, isSnowy, isSunny, isStormy } from '../utils/weatherCodes';

export default function WeatherAnimation({ weatherCode, isDay }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    const particles = [];
    particlesRef.current = particles;

    if (isRainy(weatherCode) || isStormy(weatherCode)) {
      const count = isStormy(weatherCode) ? 150 : 80;
      for (let i = 0; i < count; i++) {
        particles.push({
          type: 'rain',
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 4 + Math.random() * 8,
          length: 10 + Math.random() * 15,
          opacity: 0.2 + Math.random() * 0.4,
        });
      }
    } else if (isSnowy(weatherCode)) {
      for (let i = 0; i < 60; i++) {
        particles.push({
          type: 'snow',
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 0.5 + Math.random() * 1.5,
          radius: 1.5 + Math.random() * 3,
          opacity: 0.4 + Math.random() * 0.5,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    } else if (isSunny(weatherCode) && isDay) {
      for (let i = 0; i < 25; i++) {
        particles.push({
          type: 'sparkle',
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 0.2 + Math.random() * 0.4,
          radius: 1 + Math.random() * 2,
          opacity: 0,
          maxOpacity: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    } else {
      // Floating cloud particles for cloudy
      for (let i = 0; i < 15; i++) {
        particles.push({
          type: 'cloud',
          x: Math.random() * width,
          y: Math.random() * height * 0.6,
          speed: 0.1 + Math.random() * 0.3,
          radius: 20 + Math.random() * 40,
          opacity: 0.03 + Math.random() * 0.06,
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (p.type === 'rain') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 1, p.y + p.length);
          ctx.strokeStyle = `rgba(200, 220, 255, ${p.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          p.y += p.speed;
          p.x += 0.5;
          if (p.y > height) { p.y = -p.length; p.x = Math.random() * width; }
        } else if (p.type === 'snow') {
          p.wobble += p.wobbleSpeed;
          ctx.beginPath();
          ctx.arc(p.x + Math.sin(p.wobble) * 20, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
          p.y += p.speed;
          if (p.y > height + p.radius) { p.y = -p.radius; p.x = Math.random() * width; }
        } else if (p.type === 'sparkle') {
          p.phase += p.phaseSpeed;
          p.opacity = Math.abs(Math.sin(p.phase)) * p.maxOpacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 200, ${p.opacity})`;
          ctx.fill();
          // Add a glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 200, ${p.opacity * 0.2})`;
          ctx.fill();
          p.y -= p.speed * 0.3;
          if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        } else if (p.type === 'cloud') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
          p.x += p.speed;
          if (p.x > width + p.radius) { p.x = -p.radius; }
        }
      }

      // Lightning flash for storms
      if (isStormy(weatherCode) && Math.random() < 0.003) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, 0, width, height);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [weatherCode, isDay]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
