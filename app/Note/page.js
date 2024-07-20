"use client";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import notesState from "../Recoil/state/notesState";
import tagModelState from "../Recoil/state/tagModelState";
import SearchText from "../Recoil/state/SearchText";

import Tag from "../tag/page";
import TagAdd from "../tagAdd/page";
import { IoMdMore } from "react-icons/io";
import { IoArchiveOutline } from "react-icons/io5";
import { BiArchiveOut } from "react-icons/bi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { SketchPicker } from "react-color";
import Cookies from "js-cookie";
import withAuth from "../withAuth/page";

const Note = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [more, setMore] = useState({});
  const [colorOpen, setColorOpen] = useState({});
  const notes = useRecoilValue(notesState);
  const modelTagValue = useRecoilValue(tagModelState);
  const [archived, setArchived] = useState(false);
  const [color, setColor] = useState("#8f8f3b");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);

  const searchText = useRecoilValue(SearchText);
  const [editItemId, setEditItemId] = useState(null);
  const userId = Cookies.get("userId") || null;
  console.log("notes");
  const toggleModal = (itemId, e) => {
    setModalOpen(!modalOpen);
    if (itemId) {
      const itemToEdit = data.find((item) => item.id === itemId);
      if (itemToEdit) {
        setTitle(itemToEdit.title);
        setContent(itemToEdit.content);
        setEditItemId(itemId);
      }
    } else {
      setTitle("");
      setContent("");
      setEditItemId(null);
    }
  };

  const handleMore = (itemId) => {
    setMore((prevMore) => ({ ...prevMore, [itemId]: !prevMore[itemId] }));
  };

  const handleColorModel = (itemId) => {
    setColorOpen((prevColorOpen) => ({
      ...prevColorOpen,
      [itemId]: !prevColorOpen[itemId],
    }));
  };

  const handleChangeComplete = async (color, id) => {
    try {
      setColor(color.hex);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
        id: id,
        backgroundColor: color.hex,
      });

      setData(
        data.map((item) =>
          item.id === id ? { ...item, backgroundColor: color.hex } : item
        )
      );
    } catch (error) {
      console.error("Error updating note color:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/notesdelete`, {
        id,
      });
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/notesfetch`, {
        id: editItemId,
        title,
        content,
        archived: archived,
      });

      setData(
        data.map((item) =>
          item.id === editItemId ? { ...item, title, content } : item
        )
      );
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleArchived = async (id) => {
    const newArchivedStatus = !archived;
    setArchived(newArchivedStatus);
    try {
      await axios.put(` ${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
        id: id,
        archived: newArchivedStatus,
      });

      setData(
        data.map((item) =>
          item.id === id ? { ...item, archived: newArchivedStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating note archive status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notesfetch`,
          { userId }
        );

        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0 &&
          response.data.data[0].notes
        ) {
          setData(response.data.data[0].notes);
        } else {
          console.error("Unexpected data structure:", response.data);
          setData([]); // Or handle it in a way that makes sense for your application
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Handle error case
      }
    };

    if (typeof window !== "undefined" && userId) {
      fetchData();
    }
  }, [modalOpen, notes, modelTagValue, archived, color, userId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setContent(content + "\n");
    }
  };

  const getLinesAsList = (text) => {
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => <li key={index}>{line}</li>);
  };

  const searchInNestedData = (data, searchText) => {
    const result = [];
    const search = (item) => {
      if (
        item.archived === false &&
        item !== null &&
        typeof item === "object"
      ) {
        if (
          (item.title &&
            item.title.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.content &&
            item.content.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.tags &&
            item.tags.some((tag) =>
              tag.tag.name.toLowerCase().includes(searchText.toLowerCase())
            ))
        ) {
          result.push(item);
        }
        Object.values(item).forEach((value) => {
          if (Array.isArray(value)) {
            value.forEach(search);
          } else {
            search(value);
          }
        });
      }
    };
    data.forEach(search);
    return result;
  };

  const filteredData = searchInNestedData(data, searchText);
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  return (
    <div className="bg-white p-4  rounded shadow-md my-6 flex  justify-around flex-wrap">
      {filteredData.map((item) => (
        <div
          key={item.id}
          className="my-4 w-[300px] h-fit group shadow-md flex p-2 flex-col relative"
          style={{ backgroundColor: item.backgroundColor }}
        >
          <div onClick={(e) => toggleModal(item.id, e)} className="">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <ul className="mt-2">{getLinesAsList(item.content)}</ul>
          </div>
          {item.tags && <Tag item={item} />}

          <div className=" justify-around cursor-pointer absolute bottom-0 hidden group-hover:flex w-full">
            {item.archived ? (
              <BiArchiveOut
                onClick={() => handleArchived(item.id)}
                className="text-[40px]"
              />
            ) : (
              <IoArchiveOutline
                onClick={() => handleArchived(item.id)}
                className="text-[40px]"
              />
            )}

            <IoColorPaletteOutline
              onClick={() => handleColorModel(item.id)}
              className="text-[40px]"
            />
            <IoMdMore
              onClick={() => handleMore(item.id)}
              className="text-[40px]"
            />
            {more[item.id] && (
              <div className="absolute z-40 bg-white shadow-md right-1 top-full">
                <button onClick={() => handleDelete(item.id)}>delete</button>
                <TagAdd key={item.id} item={item} />
              </div>
            )}
            {colorOpen[item.id] && (
              <div className="absolute z-50 bg-white shadow-md right-1 top-full">
                <SketchPicker
                  color={color}
                  onChangeComplete={(color) =>
                    handleChangeComplete(color, item.id)
                  }
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {modalOpen && (
        <div
          id="default-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center h-screen bg-black bg-opacity-50"
          onClick={() => toggleModal(null)}
        >
          <div
            className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow dark:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <button
                  onClick={() => toggleModal(null)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded shadow-md"
              >
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
                  rows="9"
                  onKeyDown={handleKeyDown}
                ></textarea>
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

export default withAuth(Note);
