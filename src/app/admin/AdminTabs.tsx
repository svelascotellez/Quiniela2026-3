"use client";

import { useState } from "react";

export function AdminTabs({ 
  bracketComponent, 
  usersComponent 
}: { 
  bracketComponent: React.ReactNode;
  usersComponent: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"results" | "users">("results");

  return (
    <div className="flex flex-col flex-1">
      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm z-10 sticky top-[72px]">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === "results"
                ? "border-[#d4af37] text-[#0b132b]"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            Resultados Oficiales
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === "users"
                ? "border-[#d4af37] text-[#0b132b]"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            Gestión de Usuarios
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {activeTab === "results" ? (
          <div className="flex-1 overflow-hidden relative">
            {bracketComponent}
          </div>
        ) : (
          <div className="flex-1 bg-[#f8f9fa] overflow-y-auto p-8">
            {usersComponent}
          </div>
        )}
      </div>
    </div>
  );
}
