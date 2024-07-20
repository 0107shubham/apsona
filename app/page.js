"use client";
import { useState } from "react";

import NoteForm from "./NoteForm/page";
import Note from "./Note/page";
import Common from "./common/page";

export default function Home() {
  const [notes, setNotes] = useState([]);

  const addNote = (note) => {
    if (typeof note === "object" && note !== null) {
      setNotes((prev) => [...prev, note]);
    } else {
      console.error("Note must be an object");
    }
  };

  console.log(notes);

  return (
    <div className="min-h-screen bg-gray-100">
      <Common />

      <NoteForm addNote={addNote} />
      <Note />
    </div>
  );
}
