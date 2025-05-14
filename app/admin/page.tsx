import { useEffect, useState } from 'react';

interface TestDiagnostico {
  id: string;
  sector: string;
  ia: string;
  impacto: string;
  formacion: string;
  madurez: string;
  resultado: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  nombre: string;
  correo: string;
  sector: string;
  servicios: string;
  createdAt: string;
  mensajes: { autor: string; texto: string; createdAt?: string }[];
}

export default function AdminPanel() {
  const [tests, setTests] = useState<TestDiagnostico[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [testRes, chatRes] = await Promise.all([
        fetch('/api/test').then(r => r.json()),
        fetch('/api/chat').then(r => r.json()),
      ]);
      setTests(testRes.tests || []);
      setChats(chatRes.chats || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
      <div className="flex flex-col gap-12 w-full max-w-5xl">
        <section>
          <h2 className="text-2xl font-bold mb-4">Resultados del Test de Diagnóstico</h2>
          <div className="bg-gray-100 rounded-lg p-4 shadow-md overflow-x-auto">
            {loading ? <div>Cargando...</div> : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Sector</th>
                    <th className="px-2 py-1">IA</th>
                    <th className="px-2 py-1">Impacto</th>
                    <th className="px-2 py-1">Formación</th>
                    <th className="px-2 py-1">Madurez</th>
                    <th className="px-2 py-1">Recomendación</th>
                    <th className="px-2 py-1">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map(test => (
                    <tr key={test.id} className="border-t">
                      <td className="px-2 py-1">{test.sector}</td>
                      <td className="px-2 py-1">{test.ia}</td>
                      <td className="px-2 py-1">{test.impacto}</td>
                      <td className="px-2 py-1">{test.formacion}</td>
                      <td className="px-2 py-1">{test.madurez}</td>
                      <td className="px-2 py-1">{test.resultado}</td>
                      <td className="px-2 py-1">{new Date(test.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Sesiones de Chat Inteligente</h2>
          <div className="bg-gray-100 rounded-lg p-4 shadow-md overflow-x-auto">
            {loading ? <div>Cargando...</div> : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Nombre</th>
                    <th className="px-2 py-1">Correo</th>
                    <th className="px-2 py-1">Sector</th>
                    <th className="px-2 py-1">Servicios</th>
                    <th className="px-2 py-1">Fecha</th>
                    <th className="px-2 py-1">Mensajes</th>
                  </tr>
                </thead>
                <tbody>
                  {chats.map(chat => (
                    <tr key={chat.id} className="border-t">
                      <td className="px-2 py-1">{chat.nombre}</td>
                      <td className="px-2 py-1">{chat.correo}</td>
                      <td className="px-2 py-1">{chat.sector}</td>
                      <td className="px-2 py-1">{chat.servicios}</td>
                      <td className="px-2 py-1">{new Date(chat.createdAt).toLocaleString()}</td>
                      <td className="px-2 py-1 max-w-xs overflow-x-auto">
                        <ul>
                          {chat.mensajes.map((m, i) => (
                            <li key={i}><b>{m.autor}:</b> {m.texto}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
} 