"use client";

import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import App from "@/src/App";

export default function HomePage() {
  useEffect(() => {
    const test = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.from("events").select("*");
        console.log("Supabase test events:", data, error);
      } catch (error) {
        console.error("Supabase test failed:", error);
      }
    };

    void test();
  }, []);

  return <App />;
}
