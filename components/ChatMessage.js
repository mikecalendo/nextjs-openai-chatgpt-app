import { useState } from "react";

export default function ChatMessage({ message, onDelete, onToggleEdit, onSave, onUpdate }) {
  const [editContent, setEditContent] = useState(message.content);
  const bgColor = message.role === "assistant" ? "bg-gray-100" : "bg-blue-100";

  return (
    <div className={`mb-4 p-2 border border-gray-200 rounded-md ${bgColor}`}>
      <div className="mb-2 font-bold">
        {message.role === "assistant" ? "AI Assistant" : "User"}
      </div>
      {message.editing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onSave(editContent)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => onUpdate(editContent)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Update
            </button>
            <button
              onClick={onToggleEdit}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className="mt-2 flex gap-2">
            {/* Enable updating old user messages */}
            {message.role !== "assistant" ? (
              <>
                <button onClick={onToggleEdit} className="px-3 py-1 bg-blue-500 text-white rounded">
                  Edit
                </button>
              </>
            ) :
              <button
                onClick={() => onUpdate(editContent)}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Regenerate
              </button>
            }
            <button onClick={onDelete} className="px-3 py-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
