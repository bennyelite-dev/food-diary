// ===== Charts (Chart.js loaded from CDN) =====

const CHART_CDN = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

let chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function ensureChartJS(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = CHART_CDN;
  s.onload = cb;
  document.head.appendChild(s);
}

function renderCharts(weekData, goals, todayData) {
  ensureChartJS(() => {
    renderWeekChart(weekData, goals);
    renderMacroChart(todayData);
  });
}

function renderWeekChart(weekData, goals) {
  destroyChart('week');
  const canvas = document.getElementById('weekChart');
  if (!canvas) return;

  const labels = weekData.map(d => d.label);
  const values = weekData.map(d => d.calories);
  const goalLine = weekData.map(() => goals.calories);

  chartInstances['week'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'קלוריות',
          data: values,
          backgroundColor: values.map((v, i) => {
            if (i === weekData.length - 1) return 'rgba(255,107,107,0.85)';
            return 'rgba(162,155,254,0.55)';
          }),
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'יעד',
          data: goalLine,
          type: 'line',
          borderColor: 'rgba(253,203,110,0.7)',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: '#8888aa', font: { family: 'Heebo', size: 11 }, boxWidth: 14 },
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} קל׳`,
          },
          rtl: true,
        },
      },
      scales: {
        x: {
          ticks: { color: '#8888aa', font: { family: 'Heebo' } },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          ticks: { color: '#8888aa', font: { family: 'Heebo' } },
          grid: { color: 'rgba(255,255,255,0.06)' },
          beginAtZero: true,
        },
      },
    },
  });
}

function renderMacroChart(today) {
  destroyChart('macro');
  const canvas = document.getElementById('macroChart');
  if (!canvas) return;

  const total = today.protein + today.carbs + today.fat;

  if (total === 0) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8888aa';
    ctx.font = '14px Heebo';
    ctx.textAlign = 'center';
    ctx.fillText('אין נתונים להיום עדיין', canvas.width / 2, canvas.height / 2);
    return;
  }

  chartInstances['macro'] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['חלבון', 'פחמימות', 'שומן'],
      datasets: [{
        data: [today.protein, today.carbs, today.fat],
        backgroundColor: ['#6c5ce7', '#00b894', '#e17055'],
        borderColor: '#1a1a2e',
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#f0f0f5',
            font: { family: 'Heebo', size: 12 },
            boxWidth: 14,
            padding: 14,
          },
          rtl: true,
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed}g (${Math.round(ctx.parsed / total * 100)}%)`,
          },
        },
      },
    },
  });
}
