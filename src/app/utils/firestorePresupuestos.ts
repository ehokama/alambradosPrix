import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { Presupuesto } from "@/types/productos";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";

export async function guardarPresupuesto(presupuesto: Presupuesto) {
  const docRef = await addDoc(collection(db, "presupuestos"), presupuesto);
  return docRef.id;
}


export async function obtenerNuevoNumeroPresupuesto(): Promise<string> {
  const fecha = new Date();
  const año = fecha.getFullYear().toString().slice(-2); // "25"
  const refAnual = doc(db, "metricas", "cantidadPresupuestos20" + año);
  const refTotal = doc(db, "metricas", "cantidadTotal");

  // Actualizo contador global total (independiente de año/mes)
  const snapTotal = await getDoc(refTotal);
  if (!snapTotal.exists()) {
    await setDoc(refTotal, { totalPresupuestos: 1 });
  } else {
    await updateDoc(refTotal, { totalPresupuestos: increment(1) });
  }

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const mesActual = meses[fecha.getMonth()]; // nombre del mes actual

  const snapAnual = await getDoc(refAnual);

  if (!snapAnual.exists()) {
    const contadorMensual: Record<string, number> = {};
    meses.forEach((mes) => {
      contadorMensual[mes] = 0;
    });
    contadorMensual[mesActual] = 1;

    await setDoc(refAnual, {
      cantidadAnual: 1,
      cantidadPorMes: contadorMensual
    });

    return `${año}-0001`;
  }

  const data = snapAnual.data();
  const numeroActual = data.cantidadAnual;
  const nuevoNumero = numeroActual + 1;

  await updateDoc(refAnual, {
    cantidadAnual: increment(1),
    [`cantidadPorMes.${mesActual}`]: increment(1)
  });

  const numeroFormateado = nuevoNumero.toString().padStart(4, "0");
  return `${año}-${numeroFormateado}`;
}


