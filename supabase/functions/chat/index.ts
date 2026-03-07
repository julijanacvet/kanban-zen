import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch current tasks for context
    const { data: tasks } = await supabase.from("tasks").select("*").order("position");
    const taskList = (tasks || []).map((t: any) =>
      `- [${t.status}] "${t.title}" (id: ${t.id}, priority: ${t.priority}, category: ${t.category}, assignee: ${t.assignee_name || "unassigned"}, due: ${t.due_date || "none"})`
    ).join("\n");

    const systemPrompt = `You are a helpful AI project management assistant integrated into a Kanban board app.

CURRENT TASKS:
${taskList || "No tasks yet."}

You can help users by:
1. Answering questions about their tasks and project
2. **Editing existing tasks** - When a user asks to update/edit a task, respond with a JSON action block like this:
   \`\`\`action
   {"type":"update_task","id":"<task-id>","updates":{"title":"...","description":"...","priority":"...","status":"...","category":"...","assignee_name":"...","due_date":"YYYY-MM-DD"}}
   \`\`\`
   Only include the fields that need changing in "updates".
3. **Creating tasks** - respond with:
   \`\`\`action
   {"type":"create_task","task":{"title":"...","description":"...","priority":"medium","status":"todo","category":"General"}}
   \`\`\`
4. **Deleting tasks** - respond with:
   \`\`\`action
   {"type":"delete_task","id":"<task-id>"}
   \`\`\`

Always confirm what you're doing in natural language alongside the action block. Use markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
