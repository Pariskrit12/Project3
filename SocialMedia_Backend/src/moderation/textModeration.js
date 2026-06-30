import OpenAI from "openai";

let client = null;

function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}//first req new client

export async function moderateText(text) {
  if (!text || !text.trim()) return { flagged: false, reason: null };

  try {
    const openai = getClient();
    const response = await openai.moderations.create({ input: text.trim() });
    const result = response.results[0];

    if (!result.flagged) return { flagged: false, reason: null };

    const flaggedCategories = Object.entries(result.categories)
      .filter(([, flagged]) => flagged)
      .map(([category]) => category.replace(/\//g, ", "))
      .join("; ");

    return { flagged: true, reason: flaggedCategories };
  } catch (err) {
    console.error("[textModeration] API call failed, allowing content through:", err.message);
    return { flagged: false, reason: null };
  }
}
