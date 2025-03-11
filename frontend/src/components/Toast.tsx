import React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

interface ToastProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  type?: "success" | "error";
}

export const Toast = ({
  open,
  setOpen,
  title,
  description,
  type = "success",
}: ToastProps) => {
  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root
        className={`${
          type === "error" ? "bg-red-100" : "bg-green-100"
        } rounded-md shadow-lg p-4 flex items-start gap-4`}
        open={open}
        onOpenChange={setOpen}
      >
        <div>
          <ToastPrimitive.Title
            className={`font-medium ${
              type === "error" ? "text-red-900" : "text-green-900"
            }`}
          >
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description className="mt-1 text-sm text-gray-600">
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-sm z-50" />
    </ToastPrimitive.Provider>
  );
};
