import { useState } from "react";
import Editor from "@/components/Editor";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <Editor value={input} onChange={setInput} />
      <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
        Send
      </button>
    </form>
  );
}
