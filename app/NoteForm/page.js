"use client";

import { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import { notesState } from "../Recoil/state/page";
import { userId } from "../Recoil/state/page";
import axios from "axios";
const NoteForm = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useRecoilState(notesState);
  const [tagdata, setTagData] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = (e) => {
    e.preventDefault();
    setModalOpen(!modalOpen);
  };

  const [content, setContent] = useState("");
  const userid = useRecoilValue(userId);

  const handleInputChange = (event) => {
    setInputTag(event.target.value);
  };

  const handleAddData = (e) => {
    e.preventDefault();
    if (inputTag.trim()) {
      setTagData([...tagdata, inputTag]);
      setInputTag("");
    }
    setModalOpen(!modalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:3000/api/notes", {
      title,
      userId: userid,
      content,
      tags: tagdata,
      backgroundColor: "white",
      archived: false,
    });
    setNotes([...notes, response.data]);
    setTagData([]);
    setTitle("");
    setContent("");
    setInputTag("");
    console.log("tttttttt");
  };
  console.log("recoil testing", userid);
  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full p-2 mb-2 border rounded"
        ></textarea>

        <ul className="flex gap-2 my-3">
          {tagdata.map((item, index) => (
            <li key={index} className="bg-gray-300 px-2 rounded-md">
              {item}
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Note
        </button>

        <button
          onClick={toggleModal}
          className="bg-blue-500 ml-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Tags
        </button>
      </form>

      {modalOpen && (
        <div
          id="default-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center h-screen bg-black bg-opacity-50"
          onClick={toggleModal} // Close modal on background click
        >
          <div
            className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow dark:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content */}
            <div className="relative">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Modal body */}
              <form
                // onSubmit={handleSubmit}
                className="bg-white p-4 rounded shadow-md"
              >
                <input
                  type="text"
                  value={inputTag}
                  onChange={handleInputChange}
                  placeholder="Type and add to list"
                  className="w-full p-2 mb-2 border rounded"
                />

                <button
                  onClick={handleAddData}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteForm;
