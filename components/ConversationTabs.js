import { useEffect, useState } from "react";

export default function ConversationTabs({ selectedId, onSelectConversation, onNewConversation }) {
  const [conversations, setConversations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Fetch conversations from the database
  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Toggle edit mode and pre-fill the title
  const handleEdit = (conversation) => {
    // Prevent selecting the conversation when clicking edit
    setEditingId(conversation._id);
    setEditTitle(conversation.title);
  };

  // Save the updated title when the user leaves the input field (onBlur)
  const handleSaveTitle = async (id) => {
    if (!editTitle.trim()) {
      setEditingId(null); // Prevent empty titles
      return;
    }

    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });

      if (res.ok) {
        setConversations(
          conversations.map((conv) =>
            conv._id === id ? { ...conv, title: editTitle } : conv
          )
        );
      }
    } catch (error) {
      console.error("Error updating conversation title", error);
    }

    setEditingId(null);
  };

  return (
    <div className="w-64 border-r border-gray-300 p-4 overflow-y-auto">
      <button
        className="mb-4 w-full px-4 py-2 bg-green-500 text-white rounded"
        onClick={onNewConversation}
      >
        New Conversation
      </button>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv._id}
            className={`flex justify-between items-center p-2 cursor-pointer ${
              conv._id === selectedId ? "bg-blue-200" : ""
            }`}
          >
            {/* Clicking the name loads the conversation */}
            {editingId === conv._id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleSaveTitle(conv._id)}
                autoFocus
                className="flex-1 p-1 border border-gray-400 rounded"
              />
            ) : (
              <span
                className="flex-1"
                onClick={() => onSelectConversation(conv._id)}
              >
                {conv.title}
              </span>
            )}

            {/* Edit button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering conversation selection
                handleEdit(conv);
              }}
              className="ml-2 px-2 py-1 bg-gray-300 text-gray-700 rounded"
            >
              ✏️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
