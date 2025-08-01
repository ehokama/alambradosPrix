import { useEffect, useState } from "react";
import { obtenerDocumentosDeColeccionCantidad } from "@/app/utils/firestoreUtils";
import { Actualizacion } from "@/types/productos";

export default function ActualizacionesList() {
  const [actualizaciones, setActualizaciones] = useState<Actualizacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const datos = await obtenerDocumentosDeColeccionCantidad<Actualizacion>("actualizaciones",5);
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
