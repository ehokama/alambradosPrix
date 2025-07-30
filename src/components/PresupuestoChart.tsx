// components/PresupuestoChart.tsx
'use client';

import { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function PresupuestoChart() {
  useEffect(() => {
    const ctx = document.getElementById('graficoPresupuestos') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mayo', 'Junio', 'Julio'],
        datasets: [{
          label: 'Cantidad de Presupuestos',
          data: [12, 19, 23],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3
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
        }
      }
    });
  }, []);

  return (
    <canvas id="graficoPresupuestos" />
  );
}
