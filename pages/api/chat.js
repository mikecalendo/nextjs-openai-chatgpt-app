import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: "No messages provided" });
  }

  // Format messages for the OpenAI API
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await openai.chat.completions.create({
      // // Can use other models if desired
      model: "o1-mini",
      messages: formattedMessages,
    });
    const assistantMessage = response.choices[0].message.content;
    return res.status(200).json({ content: assistantMessage });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return res.status(500).json({ error: "Error calling OpenAI API" });
  }
}
