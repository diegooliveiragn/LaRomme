'use client';

import React from 'react';

export default function SENADOPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">SENADO</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Módulo em construção</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center shadow-sm">
        <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
          A interface para o módulo <span className="font-bold text-zinc-900">SENADO</span> está sendo estruturada.
        </p>
      </div>
    </div>
  );
}