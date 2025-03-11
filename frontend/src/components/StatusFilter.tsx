import React from "react";
import { Status } from "../types";

interface StatusFilterProps {
  selectedStatus: Status | "ALL";
  onChange: (status: Status | "ALL") => void;
}

export const StatusFilter = ({
  selectedStatus,
  onChange,
}: StatusFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {[
        { value: "ALL", label: "All" },
        { value: "WAITING", label: "Waiting" },
        { value: "INTERVIEW", label: "Interview" },
        { value: "REJECTED", label: "Rejected" },
      ].map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value as Status | "ALL")}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 ease-in-out
            ${
              selectedStatus === value
                ? `${
                    value === "ALL"
                      ? "bg-gray-900 text-white"
                      : value === "WAITING"
                      ? "bg-status-waiting text-white"
                      : value === "INTERVIEW"
                      ? "bg-status-interview text-white"
                      : "bg-status-rejected text-white"
                  }`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
