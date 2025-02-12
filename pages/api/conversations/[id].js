import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const { query: { id } } = req;

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("conversations");

  if (req.method === "PUT") {
    const { title, messages } = req.body;

    // Build the update document.
    const updateDoc = { $set: { updatedAt: new Date() } };

    // Only update title if it is provided
    if (title !== undefined) {
      updateDoc.$set.title = title;
    }
    // Only update messages if it is provided (even if an empty array)
    if (messages !== undefined) {
      updateDoc.$set.messages = messages;
    }

    try {
      await collection.updateOne({ _id: new ObjectId(id) }, updateDoc);
      const updatedConversation = await collection.findOne({ _id: new ObjectId(id) });
      return res.status(200).json({ conversation: updatedConversation });
    } catch (error) {
      console.error("Error updating conversation:", error);
      return res.status(500).json({ error: "Error updating conversation" });
    }
  } else if (req.method === "GET") {
    try {
      const conversation = await collection.findOne({ _id: new ObjectId(id) });
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      return res.status(200).json({ conversation });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return res.status(500).json({ error: "Error fetching conversation" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
