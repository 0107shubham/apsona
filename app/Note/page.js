"use client";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  userId,
  notesState,
  tagModelState,
  SearchText,
} from "../Recoil/state/page";
import Tag from "../tag/page";
import TagAdd from "../tagAdd/page";
import { IoMdMore } from "react-icons/io";
import { IoArchiveOutline } from "react-icons/io5";
import { BiArchiveOut } from "react-icons/bi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { SketchPicker } from "react-color";
import Cookies from "js-cookie";

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
  const [currentId, setCurrntId] = useState(null);
  const userId = Cookies.get("userId");
  const userid = userId;

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
  console.log("fada", data);

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
    setColor(color.hex);
    console.log("collor testing for the latest data", id);
    await axios.put(`http://localhost:3000/api/notes`, {
      id: id,
      backgroundColor: color.hex,
    });

    setData(
      data.map((item) =>
        item.id === id ? { ...item, backgroundColor: color.hex } : item
      )
    );
  };

  console.log(color);

  const handleDelete = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/notesdelete`, { id });
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/api/notes`, {
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
  };

  const handleArchived = async (id) => {
    const newArchivedStatus = !archived;
    setArchived(newArchivedStatus);
    await axios.put(`http://localhost:3000/api/notes`, {
      id: id,
      archived: newArchivedStatus,
    });

    setData(
      data.map((item) => (item.id === id ? { ...item, archived } : item))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        "http://localhost:3000/api/notesfetch",
        { userId }
      );
      setData(response.data.data[0].notes);
      console.log("realdata", response.data.data[0].notes);
    };
    fetchData();
  }, [modalOpen, notes, modelTagValue, userid, archived, color]);

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
    console.log("filted ss data", data);
    const result = [];
    const search = (item) => {
      if (
        item.archived === false &&
        item !== null &&
        typeof item === "object"
      ) {
        console.log("inside filtered item", item);
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
  console.log("testing filtered", filteredData);

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
                <TagAdd item={item} />
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

export default Note;
