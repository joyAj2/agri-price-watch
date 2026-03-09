import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const AT_API_KEY = Deno.env.get("AT_API_KEY");
  const AT_USERNAME = Deno.env.get("AT_USERNAME");
  const AT_SENDER_ID = Deno.env.get("AT_SENDER_ID") ?? "AgriPrice";

  if (!AT_API_KEY || !AT_USERNAME) {
    return new Response(
      JSON.stringify({ error: "Africa's Talking credentials not configured. Please set AT_API_KEY and AT_USERNAME secrets." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: { cropName: string; marketName: string; price: number; unit: string; to?: string[] };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { cropName, marketName, price, unit, to } = body;

  if (!cropName || !marketName || !price) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: cropName, marketName, price" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const message = `🌾 AgriPrice Update: ${cropName} is now GHS ${price}/${unit} at ${marketName}. Check more prices at AgriPriceGH or dial *384#.`;

  // If no recipients provided, return preview only (sandbox mode)
  if (!to || to.length === 0) {
    return new Response(
      JSON.stringify({ success: true, mode: "preview", message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Send via Africa's Talking SMS API
  const atBody = new URLSearchParams({
    username: AT_USERNAME,
    to: to.join(","),
    message,
    from: AT_SENDER_ID,
  });

  const atResponse = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      "apiKey": AT_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: atBody.toString(),
  });

  const atData = await atResponse.json();

  if (!atResponse.ok) {
    console.error("Africa's Talking error:", atData);
    return new Response(
      JSON.stringify({ error: `SMS API failed [${atResponse.status}]`, details: atData }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: atData }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
