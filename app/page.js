"use client";
import { useState } from "react";

import NoteForm from "./NoteForm/page";
import Note from "./Note/page";
import Common from "./common/page";
import withAuth from "./withAuth/page";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Common />

      <NoteForm />
      <Note />
    </div>
  );
};

export default withAuth(Home);
