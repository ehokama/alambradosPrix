import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "@/firebase/config"

export async function obtenerDocumentosDeColeccion(nombreColeccion: string) {
  const coleccionRef = collection(db, nombreColeccion);
  const snapshot = await getDocs(coleccionRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function obtenerDocumentoPorCampo<T = any>(
  coleccion: string,
  campo: string,
  valor: string
): Promise<(T & { id: string }) | null> {
  const q = query(collection(db, coleccion), where(campo, "==", valor));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...(doc.data() as T),
    };
  }

  return null;
}
