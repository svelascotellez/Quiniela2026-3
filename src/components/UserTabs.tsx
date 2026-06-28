"use client";

import { useState } from "react";

export function UserTabs({ 
  bracketComponent, 
  rankingComponent 
}: { 
  bracketComponent: React.ReactNode;
  rankingComponent: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"bracket" | "ranking">("bracket");

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm z-10 sticky top-[72px]">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab("bracket")}
            className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === "bracket"
                ? "border-[#d4af37] text-[#0b132b]"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            Mi Quiniela
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === "ranking"
                ? "border-[#d4af37] text-[#0b132b]"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            Ranking Global
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {activeTab === "bracket" ? (
          <div className="flex-1 overflow-hidden relative">
            {bracketComponent}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-[#f0ebd8]">
            {rankingComponent}
          </div>
        )}
      </div>
    </div>
  );
}
