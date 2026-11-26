"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, FileText, Users, Clipboard, Layout, Briefcase, Edit,
  Settings, Database, LogOut, Activity, Newspaper, ChevronRight
} from "lucide-react";
import axios from "@/app/utils/axiosAPI";

export default function Sidebar({ sidebarOpen, toggleSidebar }: { sidebarOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const [openMitra, setOpenMitra] = useState(false);
  const [openUmum, setOpenUmum] = useState(false);
  const [openSurat, setOpenSurat] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false); // ✅ tambahan untuk Data Template

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get("/users/profile", {
          withCredentials: true,
        });
        setRole(response.data.role || "");
      } catch (error) {
        console.error("Gagal mengambil role:", error);
        setRole("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    setOpenMitra(false);
    setOpenUmum(false);
    setOpenSurat(false);
    setOpenTemplate(false); // ✅ reset ketika pindah halaman
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const adminLinks = [
    { name: "Beranda", path: "/admin/dashboard", icon: Home },
    { name: "Data User", path: "/admin/Kelola_User", icon: Users },
    { name: "Data Pejabat & DIPA", path: "/admin/pejabat_dan_DIPA", icon: Clipboard },
    { name: "Data Kegiatan", path: "/admin/Data_Kegiatan", icon: Activity },
    // ❌ dihapus Data Template tunggal
  ];

  const userLinks = [
    { name: "Beranda", path: "/user/dashboard", icon: Home },
    { name: "Buat Surat Kontrak", path: "/user/data_kontrak", icon: Newspaper },
    { name: "Buat Surat BAST", path: "/user/data_bast", icon: Newspaper },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    toggleSidebar();
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const renderLink = (name: string, path: string, Icon: any) => (
    <button
      onClick={() => handleNavigation(path)}
      className={`group flex items-center gap-x-3 px-2 py-2 rounded-lg w-full text-left transition ${
        isActive(path) ? "bg-white/20 font-semibold" : "hover:bg-white/10"
      }`}
    >
      <Icon className="w-5 h-5 text-white" />
      <span className="text-base">{name}</span>
    </button>
  );

  if (isLoading) return null;

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30" onClick={toggleSidebar} />}
      <aside
        className={`fixed top-[80px] left-0 h-[calc(100%-80px)] w-64 bg-[#30387B] text-white z-30 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col space-y-1 overflow-y-auto h-full px-3 py-4 hide-scrollbar">
          {(role === "admin" ? adminLinks : userLinks).map((item) => (
            <div key={item.path}>{renderLink(item.name, item.path, item.icon)}</div>
          ))}

          {/* Hanya untuk Admin */}
          {role === "admin" && (
            <>
              <CollapsibleSection
                title="Data Template"
                icon={Layout}
                open={openTemplate}
                setOpen={setOpenTemplate}
                links={[
                  { name: "Template Kontrak", path: "/admin/Template_Kontrak", icon: FileText },
                  { name: "Template BAST", path: "/admin/Template_BAST", icon: FileText },
                ]}
                isActive={isActive}
                handleNavigation={handleNavigation}
              />

              <CollapsibleSection
                title="Data Daftar Surat"
                icon={FileText}
                open={openSurat}
                setOpen={setOpenSurat}
                links={[
                  { name: "kontrak", path: "/admin/Daftar_Surat/kontrak", icon: FileText },
                  { name: "bast", path: "/admin/Daftar_Surat/bast", icon: FileText }
                ]}
                isActive={isActive}
                handleNavigation={handleNavigation}
              />

              <CollapsibleSection
                title="Data Mitra"
                icon={Briefcase}
                open={openMitra}
                setOpen={setOpenMitra}
                links={[
                  { name: "Mitra Sobat", path: "/admin/Mitra_Sobat", icon: Edit },
                  { name: "Mitra Lainnya", path: "/admin/Mitra_Lainnya", icon: Edit },
                ]}
                isActive={isActive}
                handleNavigation={handleNavigation}
              />

              <CollapsibleSection
                title="Data Umum"
                icon={Database}
                open={openUmum}
                setOpen={setOpenUmum}
                links={[
                  { name: "Data Teknis", path: "/admin/Data_Teknis", icon: Settings },
                  { name: "Data Pegawai", path: "/admin/Data_Pegawai", icon: Settings },
                  { name: "Data Survei", path: "/admin/Data_Survei", icon: Settings },
                  { name: "Aktivitas", path: "/admin/Aktivitas", icon: Settings },
                  { name: "Jabatan Petugas", path: "/admin/Jabatan_Petugas", icon: Settings },
                  { name: "Data Satuan", path: "/admin/Data_Satuan", icon: Settings },
                ]}
                isActive={isActive}
                handleNavigation={handleNavigation}
              />
            </>
          )}

          {/* Logout */}
          <div className="mt-auto border-t border-white/20 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-x-3 px-2 py-2 text-white hover:bg-red-500/20 hover:text-red-300 transition rounded-lg w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base">Keluar</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

// Komponen CollapsibleSection tetap sama
function CollapsibleSection({
  title,
  icon: Icon,
  open,
  setOpen,
  links,
  isActive,
  handleNavigation,
}: {
  title: string;
  icon: any;
  open: boolean;
  setOpen: (val: boolean) => void;
  links: { name: string; path: string; icon: any }[];
  isActive: (path: string) => boolean;
  handleNavigation: (path: string) => void;
}) {
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-x-3 px-2 py-2 w-full rounded-lg hover:bg-white/10"
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1 text-left text-base">{title}</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="ml-5 mt-1 space-y-1 border-l border-white/20 pl-2">
          {links.map((link) => (
            <div key={link.path}>
              <button
                onClick={() => handleNavigation(link.path)}
                className={`flex items-center gap-x-3 px-2 py-2 rounded-lg w-full text-left transition ${
                  isActive(link.path) ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-base">{link.name}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
