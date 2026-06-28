"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-transparent hover:bg-white/10 text-white border border-gray-500 font-bold py-2 px-3 md:px-4 rounded-md transition-colors shadow-lg text-xs md:text-sm flex items-center gap-2"
      title="Cerrar sesión"
    >
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="hidden md:inline">Salir</span>
    </button>
  );
}
