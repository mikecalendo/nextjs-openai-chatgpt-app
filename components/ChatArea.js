import { useState, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

export default function ChatArea({ conversationId }) {
  const [messages, setMessages] = useState([]);

  // Fetch conversation messages when conversationId changes
  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const data = await res.json();
      if (data.conversation && data.conversation.messages) {
        setMessages(data.conversation.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching conversation", error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  // Save conversation to the database
  const saveConversation = async (updatedMessages) => {
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
    } catch (error) {
      console.error("Error saving conversation", error);
    }
  };

  // Send a new message and then get the AI response
  const handleSendMessage = async (content) => {
    const userMessage = { id: Date.now(), role: "user", content, editing: false };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveConversation(updatedMessages);
    await fetchAIResponse(updatedMessages);
  };

  const fetchAIResponse = async (updatedMessages) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (data.error) {
        console.error("Error from API:", data.error);
        return;
      }
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.content,
        editing: false,
      };
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);
      await saveConversation(newMessages);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  // Update or delete messages (similar to previous implementations)
  const handleDeleteMessage = async (id) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id);
    setMessages(updatedMessages);
    await saveConversation(updatedMessages);
  };

  const handleUpdateMessage = async (id, newContent) => {
    const index = messages.findIndex((msg) => msg.id === id);
    if (index === -1) return;
    const updatedMessages = messages.slice(0, index + 1).map((msg) =>
      msg.id === id ? { ...msg, content: newContent, editing: false } : msg
    );
    setMessages(updatedMessages);
    await saveConversation(updatedMessages);
    await fetchAIResponse(updatedMessages);
  };

  const handleEditMessage = async (id, newContent) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, content: newContent, editing: false } : msg
    );
    setMessages(updatedMessages);
    await saveConversation(updatedMessages);
  };

  const toggleEditing = (id) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, editing: !msg.editing } : msg
    );
    setMessages(updatedMessages);
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex-1 overflow-y-auto mb-4 border border-gray-300 p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onDelete={() => handleDeleteMessage(message.id)}
            onToggleEdit={() => toggleEditing(message.id)}
            onSave={(newContent) => handleEditMessage(message.id, newContent)}
            onUpdate={(newContent) => handleUpdateMessage(message.id, newContent)}
          />
        ))}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
