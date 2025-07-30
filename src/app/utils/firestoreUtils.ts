import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config"

// Consulta con nombre de la coleccion
export async function obtenerDocumentosDeColeccion(nombreColeccion: string) {
  const coleccionRef = collection(db, nombreColeccion);
  const snapshot = await getDocs(coleccionRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
