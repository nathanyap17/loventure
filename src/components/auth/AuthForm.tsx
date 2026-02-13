"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, Sparkles } from "lucide-react";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-md p-10 rounded-3xl glass-card relative overflow-hidden"
        >
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-fantasy-purple-deep/15 rounded-full blur-[120px] pointer-events-none animate-glow-pulse" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fantasy-gold/8 rounded-full blur-[120px] pointer-events-none animate-glow-pulse" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-fantasy-rose/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Decorative sparkle */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="flex justify-center mb-6"
            >
                <div className="relative p-3 rounded-2xl bg-fantasy-gold/5 border border-fantasy-gold/10">
                    <Sparkles className="w-7 h-7 text-fantasy-gold/70" />
                    <div className="absolute inset-0 blur-xl bg-fantasy-gold/10 rounded-2xl" />
                </div>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-serif text-gold-shimmer text-center mb-2">
                {isLogin ? "Welcome Back" : "Begin the Journey"}
            </h2>
            <p className="text-center text-white/40 text-sm mb-10 font-sans tracking-wide">
                {isLogin ? "Resuming our adventure..." : "Start a new chapter together."}
            </p>

            <form onSubmit={handleAuth} className="space-y-5">
                <div className="group/input relative">
                    <label className="block text-xs font-semibold text-fantasy-purple/70 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-fantasy-gold transition-colors duration-300">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-fantasy-gold/60 transition-colors duration-300" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 focus:border-fantasy-gold/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-fantasy-gold/10 text-white placeholder-white/15 transition-all duration-300 text-sm"
                            placeholder="you@loventure.com"
                            required
                        />
                    </div>
                </div>

                <div className="group/input relative">
                    <label className="block text-xs font-semibold text-fantasy-purple/70 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-fantasy-gold transition-colors duration-300">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-fantasy-gold/60 transition-colors duration-300" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 focus:border-fantasy-gold/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-fantasy-gold/10 text-white placeholder-white/15 transition-all duration-300 text-sm"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-fantasy-rose/10 border border-fantasy-rose/20 text-fantasy-rose text-sm text-center"
                    >
                        {message}
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-3 rounded-xl relative overflow-hidden font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {/* Button gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-fantasy-mid via-fantasy-purple-deep to-fantasy-purple opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-fantasy-purple via-fantasy-rose to-fantasy-pink opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-white/20 transition-colors" />

                    <span className="relative flex items-center justify-center gap-3 text-white">
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Casting Spell...
                            </>
                        ) : isLogin ? (
                            <>
                                <LogIn size={18} />
                                Enter Portal
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Create Scroll
                            </>
                        )}
                    </span>
                </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-white/15 text-xs uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-white/40 hover:text-fantasy-gold transition-colors duration-300"
                >
                    {isLogin ? (
                        <>New here? <span className="underline decoration-dotted underline-offset-4 text-fantasy-purple/60 hover:text-fantasy-gold">Create a scroll</span></>
                    ) : (
                        <>Have a scroll? <span className="underline decoration-dotted underline-offset-4 text-fantasy-purple/60 hover:text-fantasy-gold">Enter portal</span></>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
