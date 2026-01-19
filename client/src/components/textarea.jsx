import { useEffect } from "react";
import { useState } from "react";

export default function TextareaList() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log(items)
  }, [items])
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (text.trim()) {
        setItems([...items, text.trim()]);
        setText("");
      }
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter"
      />

      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
