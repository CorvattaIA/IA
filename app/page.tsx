'use client'

import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-8 p-8 rounded-lg shadow-lg max-w-xl w-full">
        {/* Ilustración conceptual minimalista */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="#FFD600" />
          <rect x="35" y="50" width="50" height="20" rx="10" fill="#E53935" />
          <rect x="50" y="35" width="20" height="50" rx="10" fill="#212121" />
        </svg>
        <h1 className="text-3xl md:text-5xl font-bold text-center">Consultoría en Ética para Inteligencia Artificial</h1>
        <p className="text-lg md:text-xl text-center text-white/80 max-w-md">
          Ofrecemos soluciones integrales para la implementación ética de la IA, adaptadas a las necesidades de cada sector económico. Descubre cómo podemos ayudarte a garantizar el uso responsable y seguro de la inteligencia artificial en tu organización.
        </p>
        <Link href="/test">
          <button className="bg-red-600 hover:bg-yellow-400 hover:text-black transition-colors text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg mt-4">
            Realiza tu diagnóstico
          </button>
        </Link>
      </div>
    </main>
  )
} 