"use client";

import { useEffect, useState } from "react";
import { obtenerDocumentosDeColeccion } from "@/app/utils/firestoreUtils";

export default function ActualizacionesList() {
  const [actualizaciones, setActualizaciones] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const datos = await obtenerDocumentosDeColeccion("actualizaciones");
      setActualizaciones(datos);
    };
    fetchData();
  }, []);

  return (
    <div className="actualizaciones-list">
      {actualizaciones.map((item) => (
        <div key={item.id} className="actualizacion-item">
            <p className="actualizacion-fecha">{item.fecha}</p>
            <p className="actualizacion-texto"><strong>{item.usuario} {item.descripcion}</strong></p>
        </div>
      ))}
    </div>
  );
}
 