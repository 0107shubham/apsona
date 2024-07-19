"use client";

import { atom } from "recoil";

// Define an atom for the notes
export const userId = atom({
  key: "userId",
  default: null,
});

export const notesState = atom({
  key: "notesState",
  default: [],
});
export const tagModelState = atom({
  key: "tagModelState",
  default: "",
});

export const ProfileName = atom({
  key: "ProfileName",
  default: "",
});
export const SearchText = atom({
  key: "SearchText",
  default: "",
});
