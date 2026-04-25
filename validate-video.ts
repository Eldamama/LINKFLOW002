import { createClient } from "@supabase/supabase-js";

export default async function handler(req: Request) {
  const { session_id } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data } = await supabase
    .from("video_sessions")
    .select("*")
    .eq("id", session_id)
    .single();

  if (!data) return new Response("invalid", { status: 400 });

  const elapsed = (Date.now() - new Date(data.started_at).getTime()) / 1000;

  if (elapsed < 180) {
    await supabase
      .from("video_sessions")
      .update({ status: "invalid" })
      .eq("id", session_id);

    return new Response("too early", { status: 403 });
  }

  await supabase
    .from("video_sessions")
    .update({ status: "valid" })
    .eq("id", session_id);

  return new Response("ok");
}
