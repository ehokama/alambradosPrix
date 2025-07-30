'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function PresupuestoChart() {
  const chartInstance = useRef<Chart | null>(null);


  const getUltimos3Meses = (): string[] => {
    const meses: string[] = [];
    const formatter = new Intl.DateTimeFormat('es-AR', { month: 'long' });
    const fecha = new Date();
    for (let i = 2; i >= 0; i--) {
      const f = new Date(fecha.getFullYear(), fecha.getMonth() - i, 1);
      meses.push(formatter.format(f).charAt(0).toUpperCase() + formatter.format(f).slice(1));
    }
    return meses;
  };



  useEffect(() => {
    const ctx = document.getElementById('graficoPresupuestos') as HTMLCanvasElement | null;
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = getUltimos3Meses();

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Cantidad de Presupuestos',
          data: [12, 19, 23],
          backgroundColor: 'rgba(11, 135, 73, 0.7)',
          borderColor: 'rgba(11, 135, 73, 1)',       
          borderWidth: 1
        }]
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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <canvas id="graficoPresupuestos" />
  );
}
