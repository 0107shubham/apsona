"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";

import tagModelState from "../Recoil/state/tagModelState";

const TagAdd = ({ item }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");

  const [modelValueTag, setMOdelValueTag] = useRecoilState(tagModelState);
  const valueTagState = useRecoilValue(tagModelState);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmitAddTag = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
      noteId: item.id,
      name,
    });

    setMOdelValueTag(!valueTagState);
    setModalOpen(false); // Optionally close the modal after submission
  };

  console.log("tagadd");

  return (
    <div>
      <button onClick={toggleModal} className="">
        Add Tag
      </button>

      {modalOpen && (
        <div
          id="default-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center h-screen bg-black bg-opacity-50"
          onClick={() => toggleModal(null)} // Close modal on background click
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
                  onClick={() => toggleModal(null)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Modal body */}
              <form
                onSubmit={handleSubmitAddTag}
                className="bg-white p-4 rounded shadow-md"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Title"
                  className="w-full p-2 mb-2 border rounded"
                />

                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update Note
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagAdd;
