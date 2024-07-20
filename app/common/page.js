"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue, useRecoilState } from "recoil";
import { ProfileName } from "../Recoil/state/page";
import { SearchText } from "../Recoil/state/SearchText";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Common() {
  const router = useRouter();

  const [searchText, setSearchText] = useRecoilState(SearchText);
  const [name, setName] = useState("");
  const handleLogOut = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("userName");
    router.push("/signin");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const userName = Cookies.get("userName");
    setName(userName);

    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="h-fit bg-gray-100">
      <div className="bg-purple-500 w-full h-[10vh] flex items-center justify-between px-5 shadow-md">
        <p className="text-white text-xl font-semibold">{name}</p>
        <Link className="text-xl text-white" href={"/"}>
          Notes
        </Link>
        <Link className="text-xl text-white" href={"/archived"}>
          Archived
        </Link>
        <button
          onClick={handleLogOut}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>

      <div className="p-5  h-fit">
        <input
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="text"
          placeholder="Search notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  );
}
