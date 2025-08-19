import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server-client";

export async function POST() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/login", origin));
}
