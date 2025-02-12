export default function Editor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={6}
      className="w-full font-mono text-base p-2 border border-gray-300 rounded-md"
      placeholder="Type your message here..."
    />
  );
}
