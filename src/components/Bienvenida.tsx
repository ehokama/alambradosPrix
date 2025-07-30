'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { obtenerDocumentoPorCampo } from '@/app/utils/firestoreUtils';

export default function MensajeBienvenida() {
  const [nombre, setNombre] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (usuario?.email) {
        const doc = await obtenerDocumentoPorCampo('usuarios', 'email', usuario.email);
        if (doc && 'nombre' in doc) {
          setNombre(doc.nombre);
        } else {
          setNombre('');
        }
      } else {
        setNombre('');
      }
    });

    return () => unsubscribe();
  }, []);

  return <h1 className="welcome-text">Bienvenido {nombre ? nombre : 'Cargando...'}</h1>;
}
