"use client";

import { atom } from "recoil";

// Define an atom for the notes

const notesState = atom({
  key: "notesState",
  default: [],
});

export default notesState;
