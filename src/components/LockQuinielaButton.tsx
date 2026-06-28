"use client";

import { useState } from "react";
import { lockQuiniela } from "@/app/actions";

export function LockQuinielaButton({ isLocked }: { isLocked: boolean }) {
  const [loading, setLoading] = useState(false);

  if (isLocked) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg text-center font-bold mb-6 flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Quiniela enviada. Ya no se pueden realizar modificaciones.
      </div>
    );
  }

  const handleLock = async () => {
    if (confirm("¿Estás seguro que deseas enviar tu quiniela? Una vez enviada, ya no podrás modificar ninguno de tus pronósticos.")) {
      setLoading(true);
      const res = await lockQuiniela();
      if (res.error) {
        alert(res.error);
        setLoading(false);
      }
      // If success, the page will revalidate and the component will get isLocked = true
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-yellow-800">
        <h3 className="font-bold text-lg mb-1">¿Terminaste tus pronósticos?</h3>
        <p className="text-sm">Revisa bien tus resultados. Cuando estés listo, presiona Enviar para registrar tu quiniela definitivamente.</p>
      </div>
      <button 
        onClick={handleLock}
        disabled={loading}
        className="bg-[#0b132b] hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? "Enviando..." : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Finalizar y Enviar Quiniela
          </>
        )}
      </button>
    </div>
  );
}
