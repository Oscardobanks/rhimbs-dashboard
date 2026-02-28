"use client"
import React, { ReactNode, RefObject } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { FaCircleXmark, FaX } from 'react-icons/fa6';

export type ToastProps = {
    id: number;
    type?: "success" | "info" | "warning" | "error";
    message?: ReactNode;
    position?: ToastPositionType;
    icon?: ReactNode;
};

export type ToastPositionType =
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomRight"
    | "bottomCenter"
    | "bottomLeft";

export type RequiredToastProps = Required<ToastProps>;

export type ToastContextType = {
    showToast: (toast: Omit<ToastProps, "id">) => void;
    remove: (toastId: number, ref: RefObject<HTMLDivElement | null>) => void;
    position: ToastPositionType;
};

// RequiredToastProps prevents Type Error
export const wrapperClasses: Record<RequiredToastProps["type"], string> = {
    info: "bg-blue-100 dark:bg-blue-800 dark:text-blue-100 border border-l-4 border-blue-500",
    success: "bg-green-100 dark:bg-green-800 dark:text-green-100 border border-l-4 border-green-500",
    warning: "bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100 border border-l-4 border-yellow-500",
    error: "bg-red-100 dark:bg-red-700 dark:text-red-100 border border-l-4 border-red-500",
};

export const progressBarClasses: Record<RequiredToastProps["type"], string> = {
    info: "bg-blue-300",
    success: "bg-green-300",
    warning: "bg-orange-300",
    error: "bg-red-300",
};

export const closeButtonClasses: Record<RequiredToastProps["type"], string>  = {
    info: "text-blue-500 hover:text-blue-600",
    success: "text-green-500 hover:text-green-600",
    warning: "text-yellow-500 hover:text-yellow-600",
    error: "text-red-500 hover:text-red-600",
}

export const closeIcon = (
    <FaX />
);

export const getIcon = (type: RequiredToastProps["type"]) => {
    // This code is equivalent to Switch
    return {
      info: (
        <FaInfoCircle fill='blue' size={25} />
      ),
      error: (
        <FaCircleXmark fill='red' size={25} />
      ),
      success: (
        <FaCheckCircle fill='green' size={25} />
      ),
      warning: (
        <FaExclamationCircle fill='yellow' size={25} />
      ),
    }[type];
  };

export const positionClasses: Record<ToastPositionType, string> = {
    topRight: "top-0 right-1",
    topCenter: "top-0 right-1/2 translate-x-1/2",
    topLeft: "top-0 left-1",
    bottomLeft: "bottom-0 left-1",
    bottomCenter: "bottom-0 right-1/2 translate-x-1/2",
    bottomRight: "bottom-0 right-1",
};

export const animationVariables: Record<ToastPositionType, string> = {
    topRight: "translateX(2000px)",
    topCenter: "translateY(-1300px)",
    topLeft: "translateX(-2000px)",
    bottomLeft: "translateX(-2000px)",
    bottomCenter: "translateY(1300px)",
    bottomRight: "translateX(2000px)",
};