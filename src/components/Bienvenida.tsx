'use client';

import { useEffect, useState } from 'react';
import { obtenerDocumentoPorCampo } from '@/app/utils/firestoreUtils';

export default function TestFirestore() {
  const [nombre, setNombre] = useState<string>('');

  useEffect(() => {
    const probar = async () => {
        type Usuario = {
            nombre: string;
            correo: string;
        };
      const doc = await obtenerDocumentoPorCampo('usuarios', 'email', 'ehokamas@gmail.com');
      if (doc && doc.nombre) {
        setNombre(doc.nombre); 
      }
    };

    probar();
  }, []);

  return <h1 className="welcome-text">Bienvenido {nombre ? ` ${nombre}` : 'Cargando...'}</h1>

}
