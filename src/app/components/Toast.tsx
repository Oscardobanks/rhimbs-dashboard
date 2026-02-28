"use client"
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
    animationVariables,
    closeButtonClasses,
    closeIcon,
    getIcon,
    wrapperClasses,
    progressBarClasses,
    ToastProps,
} from "../utils/toastUtils";
import { useToast } from "../hooks/useToast";

export const Toast = (props: ToastProps) => {
    let {
        type = "success",
        icon = getIcon(type),
        message,
        id,
    } = props;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const { remove, position } = useToast();

    //auto dismiss
    const dismissRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    useEffect(() => {
        dismissRef.current = setTimeout(() => {
            remove(id, wrapperRef);
        }, 4000);

        return () => {
            clearTimeout(dismissRef.current);
        };
    }, []);

    // progressBar
    const progressBarRef = useRef<ReturnType<typeof setInterval>>(undefined);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const complete = 100;

        progressBarRef.current = setInterval(() => {
            if (progress < complete) {
                setProgress((prev) => prev + 1);
            } else {
                return;
            }
        }, 4000 / complete);

        return () => {
            clearInterval(progressBarRef.current);
        };
    }, []);
    return (
        <div
            style={{ ["--elm-translate" as any]: animationVariables[position] }}
            className={clsx(
                wrapperClasses[type],
                "animate-toastIn",
                "flex justify-between gap-2 overflow-hidden rounded-md shadow-lg my-3 relative ps-4 pe-2 py-2 pb-3"
            )}
            ref={wrapperRef}
            role={"alert"}
        >
            <div className="flex gap-4">
                <div className="flex">
                    <div className="inline-flex justify-center items-center size-full">
                        <span className="sr-only">{type} Icon</span>
                        {icon}
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold capitalize">{type}</h3>
                    <span className="text-sm font-semibold text-gray-500 flex-grow">{message}</span>
                </div>
            </div>
            <button
                aria-label="Close"
                onClick={() => {
                    remove(id, wrapperRef);
                }}
                className={`${closeButtonClasses[type]} size-5 mt-2`}
            >
                <span className="sr-only">Close</span>
                {closeIcon}
            </button>
            <div className={clsx(progressBarClasses[type], "absolute bottom-0 right-0 left-0 w-full h-1")}>
                <span
                    className="absolute bg-neutral-100 left-0 top-0 bottom-0 h-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};