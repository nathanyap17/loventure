"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MemoryCard from "./MemoryCard";
import { createClient } from "@/lib/supabase/client";
import { Heart, Sparkles } from "lucide-react";

const TimelineContainer = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });
    const [memories, setMemories] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchMemories = async () => {
            const { data } = await supabase
                .from('memories')
                .select('*')
                .order('date', { ascending: true });

            if (data) setMemories(data);
        };

        fetchMemories();

        // Subscribe to new memories
        const channel = supabase
            .channel('realtime memories')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'memories' }, (payload) => {
                setMemories((current) => [...current, payload.new as any]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const containerHeight = memories.length > 5 ? `${memories.length * 50}vh` : "300vh";
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-90%"]);

    const handleDelete = (id: number) => {
        setMemories(prev => prev.filter(m => m.id !== id));
    };

    return (
        <section ref={targetRef} style={{ height: containerHeight }} className="relative">
            {/* Section header */}
            <div className="sticky top-0 z-20 pt-6 pb-2 px-12 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className="w-8 h-[1px] bg-gradient-to-r from-fantasy-gold/50 to-transparent" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-fantasy-gold/40 font-sans">
                        Our Story
                    </span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-fantasy-gold/10 to-transparent" />
                </motion.div>
            </div>

            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-2 md:gap-4 px-8 md:px-12 relative">
                    {/* Fantasy Path - Enhanced golden thread with nodes */}
                    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none">
                        {/* Main line */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-fantasy-gold/5 via-fantasy-gold/30 to-fantasy-gold/5" />
                        {/* Glow */}
                        <div className="absolute top-0 h-[2px] w-full bg-gradient-to-r from-fantasy-gold/5 via-fantasy-gold/20 to-fantasy-gold/5 blur-[4px]" />
                        {/* Wider ambient glow */}
                        <div className="absolute -top-2 h-[6px] w-full bg-gradient-to-r from-transparent via-fantasy-gold/8 to-transparent blur-[8px]" />
                    </div>

                    {/* Path nodes at each card */}
                    {memories.map((_, index) => (
                        <div
                            key={`node-${index}`}
                            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ left: `${index * (380 + 16) + 190}px` }}
                        >
                            <div className="w-3 h-3 rounded-full bg-fantasy-gold/40 border border-fantasy-gold/60 shadow-[0_0_12px_rgba(242,208,13,0.3)]" />
                        </div>
                    ))}

                    {memories.map((memory, index) => (
                        <MemoryCard
                            key={memory.id}
                            id={memory.id}
                            index={index}
                            imageUrl={memory.image_url}
                            remark={memory.remark}
                            date={memory.date}
                            onDelete={handleDelete}
                        />
                    ))}

                    {/* End card */}
                    <div className="flex-shrink-0 flex flex-col h-[520px] w-[300px] md:w-[380px] items-center justify-center rounded-2xl glass-card mx-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-fantasy-gold/5 via-transparent to-fantasy-purple-deep/5" />
                        <Sparkles className="w-8 h-8 text-fantasy-gold/30 mb-4" />
                        <p className="text-lg text-fantasy-gold/60 font-serif mb-2">To be continued...</p>
                        <p className="text-xs text-white/20 tracking-widest uppercase">The adventure goes on</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TimelineContainer;
