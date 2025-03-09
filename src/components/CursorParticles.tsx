
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
  
  // Light blue colors for particles
  const particleColors = [
    "#33C3F0", // Sky Blue
    "#1EAEDB", // Bright Blue
    "#0EA5E9", // Ocean Blue
    "#38BDF8", // Light Blue
    "#7DD3FC", // Lighter Blue
    "#BAE6FD", // Pale Blue
  ];

  // Track mouse position and create particles
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create new particles at a steady rate
      const now = Date.now();
      if (now - lastEmitTimeRef.current > 15) { // Emit particle every 15ms for continuous trail
        lastEmitTimeRef.current = now;
        
        // Create multiple particles per emission for fuller effect
        for (let i = 0; i < 2; i++) {
          const newParticle: Particle = {
            id: particleIdCounter.current++,
            x: e.clientX + (Math.random() * 10 - 5), // Slight position variance
            y: e.clientY + (Math.random() * 10 - 5),
            size: Math.random() * 12 + 3, // Random size between 3-15
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            opacity: Math.random() * 0.5 + 0.5, // Higher base opacity (0.5-1.0)
            lifespan: Math.random() * 1500 + 1000, // Longer lifetime for trailing effect (1000-2500ms)
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
          opacity: (particle.lifespan / 1500) * particle.opacity, // Slower fade based on longer lifespan
          size: particle.size * 0.99, // Slower shrink for longer trail
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
            filter: `blur(${particle.size / 3}px) brightness(1.5)`,
            boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}`,
          }}
          initial={{ scale: 0.3 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

export default CursorParticles;
