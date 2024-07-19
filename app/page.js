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

      {/* <div className="p-5  h-44">
        <input
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="text"
          placeholder="Search notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        /> */}
      <NoteForm addNote={addNote} />
      <Note />
    </div>
  );
}
