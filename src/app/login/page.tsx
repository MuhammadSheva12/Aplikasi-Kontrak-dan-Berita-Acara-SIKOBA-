// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
  };

  return (
    <div className="relative w-screen h-screen flex">
      {/* Background Image & Blue Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/bg.png"
          alt="Login Background"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-blue-900/60" />
      </div>

      {/* Centered Login Box */}
      <div className="m-auto w-full max-w-md px-6">
        <div className="bg-blue-800/80 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20 text-white">

          {/* Header with Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo-bps.png"
              alt="Logo BPS"
              width={64}
              height={64}
              className="mb-2"
            />
            <h2 className="text-xl font-semibold">BADAN PUSAT STATISTIK</h2>
            <p className="text-sm text-gray-200">Kota Sukabumi</p>
            <h1 className="mt-4 text-3xl font-bold">SIKOBA</h1>
            <p className="text-xs text-gray-200">Aplikasi Pembuatan Surat Kontrak dan BAST</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-white/20 placeholder-gray-200 text-white border border-white/40 focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-white/20 placeholder-gray-200 text-white border border-white/40 focus:outline-none focus:border-white"
              />
              <div className="flex justify-end mt-1">
                <Link href="/lupa-password" className="text-xs underline hover:text-gray-300">
                  Lupa password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-white text-blue-900 font-bold hover:bg-gray-100 transition"
            >
              MASUK
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-xs text-gray-200">
            Masuk sebagai User?{' '}
            <Link href="/guest" className="underline hover:text-white">
              Klik disini
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
