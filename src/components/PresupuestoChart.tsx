'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function PresupuestoChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [cantidades, setCantidades] = useState<number[]>([]);
  const [meses, setMeses] = useState<string[]>([]);

  const getUltimos3Meses = (): string[] => {
    const meses: string[] = [];
    const formatter = new Intl.DateTimeFormat('es-AR', { month: 'long' });
    const fecha = new Date();
    for (let i = 2; i >= 0; i--) {
      const f = new Date(fecha.getFullYear(), fecha.getMonth() - i, 1);
      meses.push(formatter.format(f));
    }
    return meses;
  };

  useEffect(() => {
    async function fetchDatos() {
      const fecha = new Date();
      const año = fecha.getFullYear();
      const mesesCalc = getUltimos3Meses();
      const mesesMinuscula = mesesCalc.map(m => m.toLowerCase());

      const ref = doc(db, "metricas", `cantidadPresupuestos20${año.toString().slice(-2)}`);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        console.log("No existe documento para el año actual.");
        return;
      }

      const data = snap.data();
      const cantidadPorMes = data?.cantidadPorMes || {};
      const cantidadesCalc = mesesMinuscula.map(mes => cantidadPorMes[mes] || 0);

      setMeses(mesesCalc);
      setCantidades(cantidadesCalc);

      console.log("Meses:", mesesCalc);
      console.log("Cantidades reales últimos 3 meses:", cantidadesCalc);
    }

    fetchDatos();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
    if (cantidades.length === 0 || meses.length === 0) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Presupuestos por mes',
          data: cantidades,
          backgroundColor: 'rgba(11, 135, 73, 0.7)',
          borderColor: 'rgba(11, 135, 73, 1)',       
          borderWidth: 1
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Presupuestos por Mes (últimos 3 meses)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });

  }, [cantidades, meses]);

  return (
    <canvas ref={canvasRef} id="graficoPresupuestos"></canvas>
  );
}
