"use client";

import { useState } from "react";
import { changeUserPassword } from "./actions";

export function UserListItem({ user, index }: { user: any, index: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData();
    formData.append("password", newPassword);
    
    const res = await changeUserPassword(user.id, formData);
    
    if (res?.error) {
      setMessage(`❌ ${res.error}`);
    } else {
      setMessage("✅ Contraseña actualizada");
      setNewPassword("");
      setTimeout(() => setIsEditing(false), 2000);
    }
    setLoading(false);
  }

  return (
    <li className="flex flex-col bg-gray-50 p-3 rounded shadow-sm border border-gray-100">
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-gray-700">
          <span className="text-gray-400 mr-2 w-4 inline-block">{index + 1}.</span> 
          {user.username} 
          {user.role === "ADMIN" && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">ADMIN</span>}
        </span>
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#0b132b]">{user.totalPoints} pts</span>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors"
          >
            {isEditing ? "Cancelar" : "🔑 Cambiar Pass"}
          </button>
        </div>
      </div>
      
      {isEditing && (
        <form onSubmit={handlePasswordChange} className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-2">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nueva contraseña" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#0b132b] hover:bg-[#1a2c5b] text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
          {message && <p className="text-xs font-medium">{message}</p>}
        </form>
      )}
    </li>
  );
}
