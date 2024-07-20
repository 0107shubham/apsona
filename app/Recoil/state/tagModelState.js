"use client";

import { atom } from "recoil";

const tagModelState = atom({
  key: "tagModelState",
  default: false,
});

export default tagModelState;
