'use client';

import { useEffect, useState } from 'react';

export default function FechaActual() {
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' } as const;
    const fechaFormateada = new Date().toLocaleDateString('es-ES', opciones);
    setFecha(fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1) + '.');
  }, []);

  return <p className="welcome-date">{fecha}</p>;
}
