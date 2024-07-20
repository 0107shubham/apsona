"use client";

import { atom } from "recoil";

const SearchText = atom({
  key: "SearchText",
  default: "",
});

export default SearchText;
