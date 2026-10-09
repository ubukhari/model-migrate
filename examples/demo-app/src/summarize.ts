// Synthetic example for model-migrate's tests and README. Not real code.
import OpenAI from "openai";

const client = new OpenAI();

export async function summarize(text: string): Promise<string> {
  const res = await client.responses.create({
    model: "gpt-5-mini",
    input: `Summarize in two sentences:\n\n${text}`,
  });
  return res.output_text;
}

// Not retiring, and not matched: gpt-4o, gpt-4.1, and a variable named like a model.
export const CURRENT = ["gpt-4o", "gpt-4.1"];
const o3 = 3;
export const notAModel = o3 * 2;
