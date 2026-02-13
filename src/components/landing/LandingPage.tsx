"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles, Heart } from "lucide-react";

interface LandingPageProps {
    onEnter: () => void;
}

const LandingPage = ({ onEnter }: LandingPageProps) => {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center text-center z-10 px-4 overflow-hidden">
            {/* Decorative rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border border-fantasy-gold/5 animate-[spin_60s_linear_infinite] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full border border-fantasy-purple/10 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-fantasy-pink/5 animate-[spin_25s_linear_infinite] pointer-events-none" />

            {/* Central content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="max-w-4xl relative"
            >
                {/* Small decorative icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <Heart className="w-8 h-8 text-fantasy-rose/60 fill-fantasy-rose/20" />
                        <div className="absolute inset-0 blur-xl bg-fantasy-rose/20 rounded-full" />
                    </div>
                </motion.div>

                {/* Main title with shimmer */}
                <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-serif text-gold-shimmer leading-none mb-6 tracking-tight">
                    Loventure
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.2 }}
                    className="text-lg md:text-xl lg:text-2xl text-fantasy-purple/80 font-sans font-light tracking-widest uppercase max-w-2xl mx-auto mb-4"
                >
                    The Chronicles of Us
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="text-base md:text-lg text-white/40 font-sans font-light max-w-xl mx-auto mb-14 italic"
                >
                    "Two souls wandering through the constellations of time, weaving a tapestry of light."
                </motion.p>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 50px rgba(242,208,13,0.25), 0 0 100px rgba(242,208,13,0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
                    onClick={onEnter}
                    className="group relative px-10 py-5 rounded-full overflow-hidden"
                >
                    {/* Button background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-fantasy-gold/15 via-fantasy-gold/25 to-fantasy-gold/15 group-hover:from-fantasy-gold/25 group-hover:via-fantasy-gold/35 group-hover:to-fantasy-gold/25 transition-all duration-500" />
                    <div className="absolute inset-0 border border-fantasy-gold/30 rounded-full group-hover:border-fantasy-gold/50 transition-colors" />

                    <span className="relative text-fantasy-gold font-serif text-base md:text-lg tracking-[0.3em] uppercase flex items-center gap-4">
                        <Sparkles className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        Enter the Journey
                        <ChevronDown className="w-5 h-5 animate-bounce" />
                    </span>
                </motion.button>
            </motion.div>

            {/* Bottom scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-8 flex flex-col items-center gap-3"
            >
                <span className="text-white/20 text-xs tracking-[0.4em] uppercase font-sans">
                    Scroll to begin
                </span>
                <div className="w-px h-10 bg-gradient-to-b from-fantasy-gold/30 to-transparent" />
            </motion.div>
        </section>
    );
};

export default LandingPage;
