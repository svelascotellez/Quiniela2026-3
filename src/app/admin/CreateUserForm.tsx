"use client";

import { createUser } from "./actions";
import { useState } from "react";

export function CreateUserForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createUser(formData);
    if (res.error) setMsg(res.error);
    else {
      setMsg("Usuario creado");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg flex flex-col gap-3">
      <h3 className="text-white font-semibold">Crear Nuevo Usuario</h3>
      <input name="username" placeholder="Usuario" required className="p-2 rounded bg-gray-900 text-white border border-gray-700" />
      <input name="password" type="password" placeholder="Contraseña" required className="p-2 rounded bg-gray-900 text-white border border-gray-700" />
      <select name="role" className="p-2 rounded bg-gray-900 text-white border border-gray-700">
        <option value="USER">Participante (USER)</option>
        <option value="ADMIN">Administrador (ADMIN)</option>
      </select>
      <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-500 text-white p-2 rounded font-bold">
        {loading ? "Creando..." : "Crear Usuario"}
      </button>
      {msg && <p className="text-sm text-yellow-400 mt-2">{msg}</p>}
    </form>
  );
}
