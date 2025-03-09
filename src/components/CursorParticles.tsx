
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
  
  // Colors for particles
  const particleColors = [
    "#9b87f5", // Primary Purple
    "#D6BCFA", // Light Purple
    "#8B5CF6", // Vivid Purple
    "#D946EF", // Magenta Pink
    "#0EA5E9", // Ocean Blue
    "#33C3F0", // Sky Blue
  ];

  // Track mouse position
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create new particles
      if (Math.random() > 0.5) { // Only create particles sometimes for performance
        const newParticle: Particle = {
          id: particleIdCounter.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 15 + 5, // Random size between 5-20
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          opacity: Math.random() * 0.7 + 0.3, // Random opacity between 0.3-1
          lifespan: Math.random() * 1000 + 500, // Lifetime between 500-1500ms
        };
        
        setParticles(prevParticles => [...prevParticles, newParticle]);
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
          opacity: (particle.lifespan / 1000) * particle.opacity, // Fade based on remaining life
          size: particle.size * 0.98, // Slightly shrink
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
            filter: `blur(${particle.size / 5}px) brightness(1.2)`,
            boxShadow: `0 0 ${particle.size / 2}px ${particle.color}`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  );
};

export default CursorParticles;
