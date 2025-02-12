import { useState } from "react";
import ConversationTabs from "@/components/ConversationTabs";
import ChatArea from "@/components/ChatArea";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Create a new conversation
  const handleNewConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      const data = await res.json();
      if (data.conversation) {
        setSelectedConversationId(data.conversation._id);
      }
    } catch (error) {
      console.error("Error creating new conversation", error);
    }
  };

  return (
    <div className="flex h-screen">
      <ConversationTabs
        selectedId={selectedConversationId}
        onSelectConversation={(id) => setSelectedConversationId(id)}
        onNewConversation={handleNewConversation}
      />
      <div className="flex-1">
        {selectedConversationId ? (
          <ChatArea conversationId={selectedConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Select or create a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
