"use client";

import { atom } from "recoil";

// Define an atom for the notes

export const notesState = atom({
  key: "notesState",
  default: [],
});
export const tagModelState = atom({
  key: "tagModelState",
  default: "",
});

export const SearchText = atom({
  key: "SearchText",
  default: "",
});
