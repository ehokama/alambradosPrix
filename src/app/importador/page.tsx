'use client';

import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCFI4IPgrIAvweDKwsBM94Jf1RVaZCu-58",
  authDomain: "alambradosprix-f4131.firebaseapp.com",
  projectId: "alambradosprix-f4131",
  storageBucket: "alambradosprix-f4131.firebasestorage.app",
  messagingSenderId: "744670866786",
  appId: "1:744670866786:web:28a5373a275af0c735903b",
  measurementId: "G-4FN6L0N0HX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ImportadorJSON() {
  const [jsonInput, setJsonInput] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleImport = async () => {
    try {
      const data = JSON.parse(jsonInput);

      if (Array.isArray(data)) {
        // Si es un array, agregar cada objeto como documento
        for (const item of data) {
          await addDoc(collection(db, 'productos'), item);
        }
      } else {
        // Si es un solo objeto, agregarlo directamente
        await addDoc(collection(db, 'productos'), data);
      }

      setMensaje('✅ Datos importados correctamente.');
    } catch (error) {
      setMensaje('❌ Error al importar: ' + (error as Error).message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Importar JSON a Firestore</h1>
      <textarea
        placeholder="Pegá tu JSON acá"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={15}
        cols={80}
        style={{ fontFamily: 'monospace', fontSize: '14px', width: '100%' }}
      />
      <br />
      <button onClick={handleImport} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Subir a Firestore
      </button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
