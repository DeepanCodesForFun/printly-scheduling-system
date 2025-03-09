
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  lifespan: number;
}

const CursorParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const particleIdCounter = useRef(0);
  const lastEmitTimeRef = useRef(0);
  
  // Dark mode blues for particles
  const particleColors = [
    "#0EA5E9", // Ocean Blue - from dark mode palette
    "#38BDF8", // Light Blue 
    "#7DD3FC", // Lighter Blue
    "#0284C7", // Deeper Blue
    "#0369A1", // Dark Blue
  ];

  // Track mouse position and create particles
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create new particles at a reduced rate
      const now = Date.now();
      if (now - lastEmitTimeRef.current > 35) { // Lower frequency (35ms vs 15ms)
        lastEmitTimeRef.current = now;
        
        // Create fewer particles per emission for subtlety
        if (Math.random() > 0.3) { // Only create particles 70% of the time
          const newParticle: Particle = {
            id: particleIdCounter.current++,
            x: e.clientX + (Math.random() * 8 - 4), // Slight position variance
            y: e.clientY + (Math.random() * 8 - 4),
            size: Math.random() * 8 + 2, // Smaller size between 2-10px
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            opacity: Math.random() * 0.4 + 0.3, // Lower opacity (0.3-0.7)
            lifespan: Math.random() * 1200 + 800, // Slightly shorter lifetime
          };
          
          setParticles(prevParticles => [...prevParticles, newParticle]);
        }
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Animation loop for particle movement and fading
  const animate = (time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    previousTimeRef.current = time;
    
    // Update particles (reduce lifespan, fade out)
    setParticles(prevParticles => 
      prevParticles
        .map(particle => ({
          ...particle,
          lifespan: particle.lifespan - deltaTime,
          opacity: (particle.lifespan / 1000) * particle.opacity, // Faster fade for subtlety
          size: particle.size * 0.98, // Faster shrink for a more ethereal feel
        }))
        .filter(particle => particle.lifespan > 0) // Remove dead particles
    );
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            x: particle.x - particle.size / 2,
            y: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: `blur(${particle.size / 2}px) brightness(1.3)`,
            boxShadow: `0 0 ${particle.size * 1.2}px ${particle.color}`,
          }}
          initial={{ scale: 0.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

export default CursorParticles;
