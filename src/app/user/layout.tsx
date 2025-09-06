"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import Topbar from "../components/shared/Topbar";
import PageLoader from "../components/shared/loadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthCheck from "@/app/hooks/useAuthCheck";
import useToastQuery from "@/app/hooks/useToastQuery";


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useAuthCheck();
  useToastQuery();

  useEffect(() => {
    (async () => {
      await checkAuth();
      setIsLoading(false);
    })();
  }, [checkAuth]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (isLoading) {
    return (
      <>
        <ToastContainer />
        <PageLoader />
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col h-screen">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-0">{children}</main>
        </div>
      </div>
    </>
  );
}
