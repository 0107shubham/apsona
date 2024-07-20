"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";

import tagModelState from "../Recoil/state/tagModelState";

import { RxCross2 } from "react-icons/rx";

const Tag = ({ item }) => {
  const [tagId, setTagId] = useState("");
  const [name, setName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modelValueTag, setMOdelValueTag] = useRecoilState(tagModelState);
  const valueTagState = useRecoilValue(tagModelState);
  const tags = item?.tags || [];
  // Handle tag update
  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tag`, { tagId, name });
    // Update state and close the modal
    setMOdelValueTag(!valueTagState);
    setModalOpen(false);
  };

  // Handle tag deletion
  const handleDedate = async (tagId) => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tagdelete`, { tagId });
    // Update state after deletion
    setMOdelValueTag(!valueTagState);
  };

  // Toggle modal and set tag details
  const toggleModal = (tagItem) => {
    if (tagItem) {
      setName(tagItem.tag?.name || "");
      setTagId(tagItem.tagId || "");
    } else {
      setName("");
      setTagId("");
    }
    setModalOpen(!modalOpen);
  };

  return (
    <div className="flex mb-16">
      {tags.map((tagItem) => (
        <div key={tagItem.id} className="my-2  text-[14px] ">
          <div className="bg-gray-300 group cursor-pointer flex justify-center items-center px-2 py-1 w-fit rounded-full">
            <p className="text-black">{tagItem.tag.name}</p>
            <div
              onClick={() => handleDedate(tagItem.tagId)}
              className="mx-1 p-[2px] hidden group-hover:block bg-gray-400 rounded-r-full"
            >
              <RxCross2 />
            </div>
          </div>

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
                    onSubmit={handleUpdate}
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
                      Update Tag
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tag;
