import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("conversations");

  if (req.method === "GET") {
    try {
      const conversations = await collection.find({}).sort({ updatedAt: -1 }).toArray();
      return res.status(200).json({ conversations });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res.status(500).json({ error: "Error fetching conversations" });
    }
  } else if (req.method === "POST") {
    const { title } = req.body;
    const newConversation = {
      title: title || "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await collection.insertOne(newConversation);
      newConversation._id = result.insertedId;
      return res.status(201).json({ conversation: newConversation });
    } catch (error) {
      console.error("Error creating conversation:", error);
      return res.status(500).json({ error: "Error creating conversation" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
