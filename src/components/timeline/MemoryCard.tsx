"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Trash2, X, Calendar, Heart, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MemoryCardProps {
    id: number;
    imageUrl: string;
    remark: string;
    date?: string;
    index: number;
    onDelete: (id: number) => void;
}

const MemoryCard = ({ id, imageUrl, remark, date, index, onDelete }: MemoryCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const supabase = createClient();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to let this memory go?")) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('memories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            onDelete(id);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Could not delete memory. You might not be the owner.");
            setIsDeleting(false);
        }
    };

    const formattedDate = date
        ? new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null;

    const formattedDateLong = date
        ? new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Unknown Date';

    return (
        <>
            <motion.div
                layoutId={`card-${id}`}
                onClick={() => setIsExpanded(true)}
                className="relative flex-shrink-0 w-[300px] md:w-[380px] h-[520px] mx-3 rounded-2xl overflow-hidden glass-card glass-card-hover group cursor-pointer"
                initial={{ opacity: 0, y: 60, rotateY: -5 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
                {/* Top decorative gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-fantasy-gold/50 to-transparent z-10" />

                {/* Image Container */}
                <div className="relative h-[65%] w-full overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={remark}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fantasy-mid/50 to-fantasy-deep text-fantasy-purple/30">
                            <Heart className="w-12 h-12" />
                        </div>
                    )}
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0718] via-[#0a0718]/40 to-transparent" />

                    {/* Hover Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2.5 rounded-xl bg-black/60 backdrop-blur-sm text-white/60 hover:bg-red-500/70 hover:text-white transition-all duration-200 border border-white/10"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Memory number badge */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/5">
                            Memory #{index + 1}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 w-full p-5">
                    <p className="text-base md:text-lg font-medium text-white/90 font-sans mb-3 line-clamp-2 leading-relaxed">
                        "{remark}"
                    </p>
                    {formattedDate && (
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-fantasy-gold/50" />
                            <span className="text-xs text-fantasy-gold/60 font-sans tracking-wide">
                                {formattedDate}
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fantasy-gold/20 to-transparent" />
            </motion.div>

            {/* Expanded View Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 md:p-8"
                        onClick={() => setIsExpanded(false)}
                    >
                        <motion.div
                            layoutId={`card-${id}`}
                            className="relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="absolute top-5 right-5 z-50 p-3 rounded-xl bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10"
                            >
                                <X size={20} />
                            </button>

                            {/* Image Section */}
                            <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-black/50">
                                {imageUrl && (
                                    <Image
                                        src={imageUrl}
                                        alt={remark}
                                        fill
                                        className="object-contain"
                                    />
                                )}
                                {/* Subtle gradient overlay on image side */}
                                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0718] to-transparent hidden md:block" />
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/3 h-1/2 md:h-full p-8 md:p-10 flex flex-col justify-center bg-fantasy-deep relative overflow-hidden">
                                {/* Ambient glow */}
                                <div className="absolute -top-20 -right-20 w-48 h-48 bg-fantasy-gold/5 rounded-full blur-[80px] pointer-events-none" />
                                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-fantasy-purple-deep/10 rounded-full blur-[80px] pointer-events-none" />

                                {/* Memory number */}
                                <span className="text-[10px] uppercase tracking-[0.3em] text-fantasy-gold/40 mb-6 block">
                                    Memory #{index + 1}
                                </span>

                                <h3 className="text-2xl md:text-3xl font-serif text-fantasy-gold leading-relaxed mb-8">
                                    "{remark}"
                                </h3>

                                <div className="flex items-center gap-3 text-fantasy-purple/70 mb-10">
                                    <Calendar size={18} className="text-fantasy-gold/50" />
                                    <span className="text-sm font-sans tracking-wide">
                                        {formattedDateLong}
                                    </span>
                                </div>

                                <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-white/20">
                                        <Heart size={14} className="fill-fantasy-rose/30 text-fantasy-rose/30" />
                                        <span className="text-xs uppercase tracking-widest">Cherished</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            setIsExpanded(false);
                                            handleDelete(e);
                                        }}
                                        className="text-white/30 hover:text-red-400 text-xs flex items-center gap-2 transition-colors duration-300 uppercase tracking-wider"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MemoryCard;
