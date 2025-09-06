'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Login Box */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">BADAN PUSAT STATISTIK</h1>
          <p className="font-bold text-sm text-gray-800">KOTA SUKABUMI</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-800">SIKOBA</h2>
          <p className="text-gray-600 mt-2">Aplikasi Pembuatan Surat Kontrak dan BAST</p>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-200" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Link href="#" className="text-xs text-blue-600 hover:underline float-right mt-1">
              Lupa password?
            </Link>
          </div>

          {/* Divider */}
          <hr className="my-4 border-gray-200" />

          <button
            type="submit"
            className="w-full bg-[#30387B] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            MASUK
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>Masuk sebagai User <Link href="#" className="text-blue-600 font-semibold">Klik disini</Link></p>
        </div>
      </div>
    </div>
  );
}