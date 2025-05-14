import React, { useState } from 'react';
import Link from 'next/link';

const sectores = [
  'Salud', 'Finanzas', 'Educación', 'Retail', 'Tecnología', 'Sector Público', 'Otro'
];

const preguntas = [
  { id: 'sector', label: '¿En qué sector económico opera tu organización?', type: 'select', options: sectores },
  { id: 'ia', label: '¿Tu empresa ya utiliza sistemas de IA en producción?', type: 'select', options: ['Sí', 'No'] },
  { id: 'impacto', label: '¿Te preocupa el impacto social o legal de tus sistemas de IA?', type: 'select', options: ['Sí', 'No', 'No estoy seguro/a'] },
  { id: 'formacion', label: '¿Tu equipo ha recibido formación en ética de IA?', type: 'select', options: ['Sí', 'No', 'Parcialmente'] },
  { id: 'madurez', label: '¿Qué nivel de madurez tiene tu estrategia de IA?', type: 'select', options: ['Inicial', 'Intermedia', 'Avanzada'] },
];

const servicios = [
  {
    id: 'diagnostico',
    nombre: 'Diagnóstico de Riesgos Éticos',
    descripcion: 'Evaluación exhaustiva de los riesgos éticos en su implementación de IA, con recomendaciones específicas.',
    color: '#FFD600',
    icon: (
      <svg width="60" height="60"><circle cx="30" cy="30" r="30" fill="#FFD600" /><rect x="20" y="25" width="20" height="10" rx="5" fill="#E53935" /></svg>
    )
  },
  {
    id: 'estrategias',
    nombre: 'Diseño de Estrategias Éticas',
    descripcion: 'Desarrollo de estrategias personalizadas para integrar principios éticos en todo el ciclo de vida de sus sistemas de IA.',
    color: '#E53935',
    icon: (
      <svg width="60" height="60"><circle cx="30" cy="30" r="30" fill="#E53935" /><rect x="25" y="20" width="10" height="20" rx="5" fill="#FFD600" /></svg>
    )
  },
  {
    id: 'analisis',
    nombre: 'Análisis Ético de la IA',
    descripcion: 'Evaluación integral de sistemas de IA existentes o en desarrollo para identificar y abordar problemas éticos.',
    color: '#212121',
    icon: (
      <svg width="60" height="60"><circle cx="30" cy="30" r="30" fill="#212121" /><rect x="20" y="30" width="20" height="10" rx="5" fill="#FFD600" /></svg>
    )
  },
  {
    id: 'capacitacion',
    nombre: 'Capacitación en Ética para IA',
    descripcion: 'Programas de formación para su equipo sobre principios éticos en IA y su aplicación práctica.',
    color: '#FFD600',
    icon: (
      <svg width="60" height="60"><circle cx="30" cy="30" r="30" fill="#FFD600" /><rect x="25" y="20" width="10" height="20" rx="5" fill="#212121" /></svg>
    )
  },
];

function recomendarServicios(respuestas: any) {
  // Lógica simple de ejemplo para recomendar servicios
  const recomendados = [];
  if (respuestas.ia === 'No' || respuestas.madurez === 'Inicial') recomendados.push(servicios[0]);
  if (respuestas.impacto === 'Sí') recomendados.push(servicios[2]);
  if (respuestas.formacion !== 'Sí') recomendados.push(servicios[3]);
  if (respuestas.ia === 'Sí' && respuestas.madurez === 'Avanzada') recomendados.push(servicios[1]);
  return Array.from(new Set(recomendados));
}

export default function TestDiagnostico() {
  const [respuestas, setRespuestas] = useState<any>({});
  const [finalizado, setFinalizado] = useState(false);
  const [recomendados, setRecomendados] = useState<any[]>([]);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (id: string, value: string) => {
    setRespuestas({ ...respuestas, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rec = recomendarServicios(respuestas);
    setRecomendados(rec);
    setFinalizado(true);
    // Guardar en la base de datos
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...respuestas, resultado: rec.map((r: any) => r.nombre) })
      });
      if (res.ok) setGuardado(true);
      else setError('No se pudo guardar el resultado.');
    } catch {
      setError('No se pudo guardar el resultado.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
      <div className="flex flex-col items-center gap-8 p-8 rounded-lg shadow-lg max-w-xl w-full border border-black">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="#FFD600" />
          <rect x="35" y="50" width="50" height="20" rx="10" fill="#E53935" />
        </svg>
        <h2 className="text-2xl md:text-4xl font-bold text-center">Test de Diagnóstico de Ética en IA</h2>
        <p className="text-lg text-center text-black/80 max-w-md">
          Responde unas breves preguntas para identificar los servicios de ética en IA que tu organización necesita.
        </p>
        {!finalizado ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            {preguntas.map((preg) => (
              <div key={preg.id} className="flex flex-col gap-2">
                <label className="font-semibold">{preg.label}</label>
                <select
                  required
                  className="p-3 rounded-lg border border-black bg-white text-black"
                  value={respuestas[preg.id] || ''}
                  onChange={e => handleChange(preg.id, e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {preg.options.map((op: string) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            ))}
            <button type="submit" className="bg-black text-yellow-400 font-bold py-4 px-8 rounded-full text-xl shadow-lg mt-4 hover:bg-yellow-400 hover:text-black transition-colors">
              Ver recomendación
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6 w-full items-center">
            {guardado && <div className="text-green-600 font-bold">¡Resultado guardado correctamente!</div>}
            {error && <div className="text-red-600 font-bold">{error}</div>}
            <h3 className="text-xl font-bold">Servicios recomendados:</h3>
            <div className="grid grid-cols-1 gap-4 w-full">
              {recomendados.map(serv => (
                <div key={serv.id} className="flex items-center gap-4 p-4 rounded-lg border border-black bg-white shadow-md">
                  {serv.icon}
                  <div>
                    <div className="font-bold text-lg" style={{ color: serv.color }}>{serv.nombre}</div>
                    <div className="text-black/80">{serv.descripcion}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/chat">
              <button className="bg-red-600 hover:bg-yellow-400 hover:text-black transition-colors text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg mt-4">
                Ir al chat inteligente
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 