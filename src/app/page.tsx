import HomeClient from "./HomeClient";

// Prevent static prerendering — Supabase client needs runtime env vars
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomeClient />;
}
