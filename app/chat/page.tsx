import React, { useState } from 'react';

interface Mensaje {
  autor: 'usuario' | 'agente';
  texto: string;
}

export default function ChatPage() {
  const [user, setUser] = useState({ nombre: '', correo: '', sector: '', servicios: '' });
  const [userSet, setUserSet] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState('');

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserSet(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    const nuevosMensajes = [...mensajes, { autor: 'usuario', texto: mensaje }];
    setMensajes(nuevosMensajes);
    setMensaje('');
    // Simular respuesta del agente de IA
    setTimeout(() => {
      setMensajes(msgs => [...msgs, { autor: 'agente', texto: 'Gracias por tu mensaje. Un consultor se pondrá en contacto contigo pronto.' }]);
    }, 800);
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, mensajes })
      });
      if (res.ok) setGuardado(true);
      else setError('No se pudo guardar la sesión.');
    } catch {
      setError('No se pudo guardar la sesión.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="flex flex-col items-center gap-6 p-6 rounded-lg shadow-lg max-w-2xl w-full border border-yellow-400 bg-black">
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="#FFD600" />
          <rect x="35" y="50" width="50" height="20" rx="10" fill="#E53935" />
        </svg>
        <h2 className="text-2xl md:text-4xl font-bold text-center text-yellow-400">Chat Inteligente</h2>
        {!userSet ? (
          <form onSubmit={handleUserSubmit} className="flex flex-col gap-4 w-full">
            <input name="nombre" required placeholder="Nombre" className="p-3 rounded-lg border border-black text-black" value={user.nombre} onChange={handleUserChange} />
            <input name="correo" required type="email" placeholder="Correo electrónico" className="p-3 rounded-lg border border-black text-black" value={user.correo} onChange={handleUserChange} />
            <input name="sector" required placeholder="Sector" className="p-3 rounded-lg border border-black text-black" value={user.sector} onChange={handleUserChange} />
            <input name="servicios" required placeholder="Servicios de interés" className="p-3 rounded-lg border border-black text-black" value={user.servicios} onChange={handleUserChange} />
            <button type="submit" className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full text-lg shadow-lg mt-2 hover:bg-red-600 hover:text-white transition-colors">Entrar al chat</button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <div className="bg-white text-black rounded-lg p-4 h-64 overflow-y-auto flex flex-col gap-2">
              {mensajes.length === 0 && <div className="text-center text-black/50">¡Haz tu primera pregunta!</div>}
              {mensajes.map((msg, idx) => (
                <div key={idx} className={msg.autor === 'usuario' ? 'text-right' : 'text-left'}>
                  <span className={msg.autor === 'usuario' ? 'bg-yellow-400 text-black px-3 py-2 rounded-full inline-block' : 'bg-red-600 text-white px-3 py-2 rounded-full inline-block'}>
                    {msg.texto}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2 mt-2">
              <input
                className="flex-1 p-3 rounded-lg border border-yellow-400 text-black"
                placeholder="Escribe tu mensaje..."
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
              />
              <button type="submit" className="bg-yellow-400 text-black font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:bg-red-600 hover:text-white transition-colors">Enviar</button>
            </form>
            <button onClick={handleGuardar} className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg mt-2 hover:bg-yellow-400 hover:text-black transition-colors">Guardar sesión</button>
            {guardado && <div className="text-green-400 font-bold">¡Sesión guardada correctamente!</div>}
            {error && <div className="text-red-400 font-bold">{error}</div>}
          </div>
        )}
      </div>
    </main>
  );
} 