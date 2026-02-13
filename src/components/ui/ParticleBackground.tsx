"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    type: 'star' | 'orb' | 'sparkle';
}

const ParticleBackground = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (windowSize.width === 0) return null;

    // Generate diverse particle types
    const particles: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        size: i < 10 ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        type: i < 10 ? 'orb' : i < 25 ? 'star' : 'sparkle',
    }));

    const getParticleStyle = (p: Particle) => {
        switch (p.type) {
            case 'orb':
                return "absolute rounded-full bg-fantasy-gold/30 blur-[2px]";
            case 'star':
                return "absolute rounded-full bg-white/40 blur-[0.5px]";
            case 'sparkle':
                return "absolute rounded-full bg-fantasy-purple/25 blur-[1px]";
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Aurora/Nebula background orbs */}
            <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-fantasy-purple-deep/10 rounded-full blur-[120px] animate-aurora" />
            <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-fantasy-gold/5 rounded-full blur-[100px] animate-aurora" style={{ animationDelay: '-7s' }} />
            <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] bg-fantasy-rose/5 rounded-full blur-[80px] animate-glow-pulse" />

            {/* Floating particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={getParticleStyle(p)}
                    initial={{ x: p.x, y: p.y, opacity: 0 }}
                    animate={{
                        y: [p.y, p.y - (p.type === 'orb' ? 150 : 80), p.y + 30, p.y],
                        x: [p.x, p.x + (p.type === 'sparkle' ? 70 : 40), p.x - 30, p.x],
                        opacity: p.type === 'orb'
                            ? [0.15, 0.4, 0.2, 0.15]
                            : [0.2, 0.6, 0.3, 0.2],
                        scale: p.type === 'sparkle'
                            ? [1, 1.5, 0.8, 1]
                            : [1, 1.2, 1, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                    style={{
                        width: p.size,
                        height: p.size,
                    }}
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
