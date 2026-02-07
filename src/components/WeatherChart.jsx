import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function WeatherChart({ weather }) {
  if (!weather?.hourly) return null;

  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toISOString().slice(0, 10);

  const times = weather.hourly.time;
  let startIdx = times.findIndex(
    (t) => t.startsWith(todayStr) && parseInt(t.slice(11, 13)) >= currentHour
  );
  if (startIdx === -1) startIdx = 0;

  const sliceEnd = Math.min(startIdx + 24, times.length);

  const chartData = useMemo(() => {
    const labels = [];
    const temps = [];
    const humidity = [];
    const wind = [];

    for (let i = startIdx; i < sliceEnd; i++) {
      const hour = parseInt(times[i].slice(11, 13));
      labels.push(i === startIdx ? '现在' : `${hour}:00`);
      temps.push(Math.round(weather.hourly.temperature_2m[i] * 10) / 10);
      humidity.push(weather.hourly.relative_humidity_2m?.[i] || 0);
      wind.push(weather.hourly.wind_speed_10m?.[i] || 0);
    }

    return {
      labels,
      datasets: [
        {
          label: '温度 (°C)',
          data: temps,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: '湿度 (%)',
          data: humidity,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4,
          fill: true,
          borderDash: [5, 3],
          yAxisID: 'y1',
        },
      ],
    };
  }, [weather, startIdx, sliceEnd, times]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
            font: { size: 11 },
            color: '#94a3b8',
          },
          grid: { display: false },
        },
        y: {
          position: 'left',
          ticks: {
            font: { size: 11 },
            color: '#f59e0b',
            callback: (v) => v + '°',
          },
          grid: { color: 'rgba(0,0,0,0.04)' },
        },
        y1: {
          position: 'right',
          min: 0,
          max: 100,
          ticks: {
            font: { size: 11 },
            color: '#3b82f6',
            callback: (v) => v + '%',
          },
          grid: { display: false },
        },
      },
    }),
    []
  );

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      <div className="card-title">
        <span>📈</span> 温度趋势
      </div>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#f59e0b' }} /> 温度
        </span>
        <span className="legend-item">
          <span className="legend-dot dashed" style={{ background: '#3b82f6' }} /> 湿度
        </span>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}
