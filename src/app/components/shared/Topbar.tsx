"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/app/utils/axiosAPI";

export default function Topbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/users/profile", {
          withCredentials: true,
        });
        const { username, role, nama_pegawai, nama_teknis } = response.data;
        setUsername(nama_pegawai || nama_teknis || username || "");
        setRole(role || "");
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-[#30387B] text-white fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-white hover:text-gray-200 cursor-pointer"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo_bps.png" alt="Logo BPS" width={50} height={50} />
          <div>
            <p className="text-sm font-bold">BADAN PUSAT STATISTIK</p>
            <p className="text-sm font-bold">KOTA SUKABUMI</p>
            <p className="text-xs">SIKOBA</p>
          </div>
        </div>
      </div>

      <Link href="/profil">
        <div className="flex flex-col items-end text-sm text-white hover:text-gray-300 cursor-pointer">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="font-semibold">
              {isLoading ? "Loading..." : username || "Account"}
            </span>
            {role === "admin" && (
              <span className="text-xs capitalize text-gray-200">({role})</span>
            )}
          </div>
        </div>
      </Link>
    </header>
  );
}
