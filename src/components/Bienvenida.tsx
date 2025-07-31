'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { obtenerDocumentoPorCampo } from '@/app/utils/firestoreUtils';
import { Usuario } from '@/types/productos';

export default function MensajeBienvenida() {
  const [nombre, setNombre] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuarioFirebase) => {
      if (usuarioFirebase?.email) {
        // Poner el tipo genérico <Usuario> para que retorne ese tipo
        const doc = await obtenerDocumentoPorCampo<Usuario>(
          'usuarios',
          'email',
          usuarioFirebase.email
        );

        // Validación segura
        if (doc && typeof doc.nombre === 'string') {
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
