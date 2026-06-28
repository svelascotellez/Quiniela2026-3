"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciales inválidas");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800 w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Iniciar Sesión</h2>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Usuario</label>
          <input name="username" required className="p-3 rounded bg-gray-950 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Contraseña</label>
          <input name="password" type="password" required className="p-3 rounded bg-gray-950 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg transition-transform hover:scale-[1.02]">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
