"use client";

import { useEffect, useState, useRef } from "react";
import ParticleBackground from "@/components/ui/ParticleBackground";
import TimelineContainer from "@/components/timeline/TimelineContainer";
import AddMemory from "@/components/timeline/AddMemory";
import AuthForm from "@/components/auth/AuthForm";
import LandingPage from "@/components/landing/LandingPage";
import { createClient } from "@/lib/supabase/client";
import { Heart, LogOut } from "lucide-react";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEnterJourney = () => {
    timelineRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-fantasy-deep">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-fantasy-gold/30 border-t-fantasy-gold rounded-full animate-spin" />
          <span className="text-xs text-white/30 uppercase tracking-[0.3em]">Loading...</span>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-fantasy-deep overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 w-full max-w-md px-4">
          <AuthForm />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <ParticleBackground />

      {/* Landing Page Section */}
      <LandingPage onEnter={handleEnterJourney} />

      {/* Anchor for scrolling */}
      <div ref={timelineRef} />

      {/* Horizontal Timeline Section */}
      <TimelineContainer />
      <AddMemory />

      {/* Footer */}
      <section className="min-h-[60vh] flex items-center justify-center relative z-10 px-4">
        <div className="text-center">
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-fantasy-gold/20" />
            <Heart className="w-4 h-4 text-fantasy-rose/30 fill-fantasy-rose/15" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-fantasy-gold/20" />
          </div>

          <p className="text-sm text-white/20 font-sans tracking-widest uppercase mb-2">
            Made with love
          </p>
          <p className="text-xs text-white/10 font-sans mb-8 italic">
            "The stars are waiting for your next move."
          </p>

          <button
            onClick={() => supabase.auth.signOut()}
            className="group inline-flex items-center gap-2 text-xs text-white/15 hover:text-white/50 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/5"
          >
            <LogOut size={14} />
            <span className="uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </section>
    </main>
  );
}
