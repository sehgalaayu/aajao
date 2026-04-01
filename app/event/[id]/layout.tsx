import { Metadata } from "next";
import { getSupabaseClient } from "@/lib/supabase";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = getSupabaseClient();

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let query = supabase.from("events").select("*");

  if (uuidRegex.test(id)) {
    query = query.eq("id", id);
  } else {
    query = query.eq("slug", id);
  }

  const { data } = await query.single();

  if (!data) {
    return {
      title: "Aajao | Event Not Found",
      description: "This scene doesn't exist.",
    };
  }

  return {
    title: `🔥 Aajao | ${data.title}`,
    description: `Hosted by ${data.host_name} • Live list dekh 👀`,
    openGraph: {
      title: `🔥 ${data.title}`,
      description: `Hosted by ${data.host_name} • Live list dekh 👀`,
      siteName: "Aajao",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `🔥 ${data.title}`,
      description: `Hosted by ${data.host_name} • Live list dekh 👀`,
    },
  };
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
