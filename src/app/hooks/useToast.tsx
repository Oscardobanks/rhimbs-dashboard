"use client"
import clsx from "clsx";
import {
  createContext,
  FC,
  ReactNode,
  RefObject,
  useContext,
  useState,
} from "react";
import { Toast } from "../components/Toast";
import { ToastContextType, ToastPositionType, ToastProps, positionClasses } from "../utils/toastUtils";

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  remove: () => {},
  position: "topRight",
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [position, setPosition] = useState<ToastPositionType>("topRight");

  const showToast = (toast: Omit<ToastProps, "id">) => {
    //first check for position
    if (toast.position && toast.position !== position) {
      setPosition(toast.position);
    }

    // add it to the list
    setToasts((toasts) => [...toasts, { ...toast, id: Math.random() * 10000 }]);
  };

  const remove = (toastId: number, ref: RefObject<HTMLDivElement | null>) => {
    ref?.current?.classList.add("animate-toastOut");

    //remove element after animation is done
    ref?.current?.addEventListener("animationend", () => {
      // lets remove it
      setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId));
    });
  };

  return (
    <div className="">
      <ToastContext.Provider value={{ showToast, remove, position }}>
        {children}
        {/* toast list */}
        <div
          className={clsx(
            positionClasses[position],
            "fixed w-screen max-w-xs z-50"
          )}
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      </ToastContext.Provider>
    </div>
  );
};