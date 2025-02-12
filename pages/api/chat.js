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
    // Make sure we use stream: true
    const response = await openai.chat.completions.create({
      model: "o1-mini",
      messages: formattedMessages,
      stream: true,
    });

    // Set streaming-friendly headers
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Connection", "keep-alive");

    // Stream chunks as they arrive
    for await (const part of response) {
      const chunk = part.choices[0]?.delta?.content || "";
      if (chunk) {
        res.write(chunk);
      }
    }
    res.end();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    // If an error occurs mid-stream, you may not be able to JSON-encode a response
    // because you've already started sending chunks. You can do:
    if (!res.headersSent) {
      return res.status(500).json({ error: "Error calling OpenAI API" });
    }
    res.end();
  }
}
