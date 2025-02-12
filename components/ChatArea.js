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
    const userMessage = {
      id: Date.now(),
      role: "user",
      content,
      editing: false,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveConversation(updatedMessages);

    // Now fetch the AI response as a stream
    await fetchAIResponse(updatedMessages);
  };

  const fetchAIResponse = async (updatedMessages) => {
    try {
      // Start fetch with the user’s latest messages
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      // Create a new "assistant" message in state with empty content initially
      const assistantMessageId = Date.now() + 1;
      let newMessages = [
        ...updatedMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          editing: false,
        },
      ];
      setMessages(newMessages);

      if (!response.body) {
        console.error("No response body");
        return;
      }

      // Use a reader to read the streamed chunks
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          // Decode the chunk into text
          const chunk = decoder.decode(value);
          assistantContent += chunk;

          // Update the assistant message content in state
          setMessages((prevMessages) => {
            return prevMessages.map((msg) => {
              if (msg.id === assistantMessageId) {
                return { ...msg, content: assistantContent };
              }
              return msg;
            });
          });
        }
      }

      // Once the stream is complete, we have the full assistant message
      newMessages = newMessages.map((m) =>
        m.id === assistantMessageId ? { ...m, content: assistantContent } : m
      );
      await saveConversation(newMessages);

    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  // Edit, update, or delete messages
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
