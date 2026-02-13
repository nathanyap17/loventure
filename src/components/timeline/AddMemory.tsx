"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Camera, X, Upload, Sparkles, CalendarDays } from "lucide-react";

export default function AddMemory() {
    const [isOpen, setIsOpen] = useState(false);
    const [remark, setRemark] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !remark || !date) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('memories')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('memories')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('memories')
                .insert({
                    image_url: publicUrl,
                    remark,
                    date: date,
                });

            if (dbError) throw dbError;

            setIsOpen(false);
            setRemark("");
            setDate(new Date().toISOString().split('T')[0]);
            setFile(null);
            alert("Memory captured in the stars! ✨");

        } catch (error: any) {
            console.error(error);
            alert("Failed to save memory: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90, boxShadow: "0 0 40px rgba(242,208,13,0.4)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-fantasy-gold to-fantasy-amber text-fantasy-deep flex items-center justify-center shadow-[0_0_30px_rgba(242,208,13,0.3)] border border-fantasy-gold/50"
            >
                <Sparkles size={28} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 40, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg glass-card rounded-3xl p-8 relative overflow-hidden"
                        >
                            {/* Decorative background glows */}
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-fantasy-purple-deep/15 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-fantasy-gold/8 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" style={{ animationDelay: '-2s' }} />

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 rounded-2xl bg-fantasy-gold/5 border border-fantasy-gold/10 mb-4">
                                    <Sparkles className="w-6 h-6 text-fantasy-gold/60" />
                                </div>
                                <h2 className="text-2xl font-serif text-gold-shimmer">Capture a Moment</h2>
                                <p className="text-xs text-white/30 mt-2 tracking-wider uppercase">Preserve this memory forever</p>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-5">
                                {/* Image Upload */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-2xl h-44 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${file
                                            ? 'border-fantasy-gold/40 bg-fantasy-gold/5'
                                            : 'border-white/10 hover:border-fantasy-gold/30 hover:bg-white/[0.02]'
                                        }`}
                                >
                                    {file ? (
                                        <div className="relative w-full h-full p-2">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="w-full h-full object-contain rounded-xl"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-1.5 hover:bg-red-500/60 transition-colors border border-white/10"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Camera size={36} className="text-white/15 mb-2" />
                                            <p className="text-white/25 text-sm">Click to select an image</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-fantasy-purple/60 uppercase tracking-widest mb-2 ml-1">
                                        <CalendarDays size={12} />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-fantasy-gold/30 focus:outline-none focus:ring-2 focus:ring-fantasy-gold/10 text-white transition-all duration-300 text-sm"
                                        required
                                    />
                                </div>

                                {/* Remark */}
                                <div>
                                    <label className="block text-xs font-semibold text-fantasy-purple/60 uppercase tracking-widest mb-2 ml-1">
                                        Remarks
                                    </label>
                                    <textarea
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        placeholder="What made this moment special?"
                                        className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-fantasy-gold/30 focus:outline-none focus:ring-2 focus:ring-fantasy-gold/10 text-white placeholder-white/15 transition-all duration-300 h-24 resize-none text-sm"
                                        required
                                    />
                                </div>

                                {/* Submit */}
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-4 rounded-xl relative overflow-hidden font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-fantasy-gold/80 via-fantasy-amber to-fantasy-gold/80 group-hover:from-fantasy-gold group-hover:via-fantasy-amber group-hover:to-fantasy-gold transition-all duration-300" />
                                    <div className="absolute inset-0 border border-white/20 rounded-xl" />
                                    <span className="relative flex items-center justify-center gap-2 text-fantasy-deep font-bold">
                                        {uploading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-fantasy-deep/30 border-t-fantasy-deep rounded-full animate-spin" />
                                                Saving to the stars...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={18} />
                                                Keep Memory
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
