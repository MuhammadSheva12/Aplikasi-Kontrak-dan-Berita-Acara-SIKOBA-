import { toast, Slide } from "react-toastify";

export const showSuccess = (message: string) =>
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Slide,
    className: '!bg-white !text-[#30387B] font-medium rounded shadow',
    icon: <span>✅</span>,
  });

export const showError = (message: string) =>
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Slide,
    className: '!bg-white !text-[#30387B] font-medium rounded shadow',
    icon: <span>❌</span>,
  });