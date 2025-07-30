'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function PresupuestoChart() {
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = document.getElementById('graficoPresupuestos') as HTMLCanvasElement | null;
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar', // acá cambia el tipo a 'bar' para columnas
      data: {
        labels: ['Mayo', 'Junio', 'Julio'],
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
            beginAtZero: true, // siempre empieza en 0 el eje Y
            ticks: {
              stepSize: 5 // para que las marcas suban de a 5, opcional
            }
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
