import { motion } from 'framer-motion';
import { getWeatherInfo } from '../utils/weatherCodes';

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function WeeklyForecast({ weather }) {
  if (!weather?.daily) return null;

  const daily = weather.daily;
  const today = new Date().toISOString().slice(0, 10);

  const allMin = Math.min(...daily.temperature_2m_min);
  const allMax = Math.max(...daily.temperature_2m_max);
  const range = allMax - allMin || 1;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="card-title">
        <span>📅</span> {daily.time.length} 天预报
      </div>
      <div className="forecast-list">
        {daily.time.map((time, i) => {
          const date = new Date(time + 'T00:00:00');
          const isToday = time === today;
          const info = getWeatherInfo(daily.weather_code[i]);
          const low = Math.round(daily.temperature_2m_min[i]);
          const high = Math.round(daily.temperature_2m_max[i]);
          const leftPct = ((daily.temperature_2m_min[i] - allMin) / range) * 100;
          const widthPct = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / range) * 100;
          const precip = daily.precipitation_probability_max?.[i];

          return (
            <motion.div
              key={time}
              className="forecast-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <span className={`forecast-day ${isToday ? 'today' : ''}`}>
                {isToday ? '今天' : DAY_NAMES[date.getDay()]}
              </span>

              <div className="forecast-icon-wrap">
                <span className="forecast-icon">{info.icon}</span>
                {precip != null && precip > 30 && (
                  <span className="forecast-precip">💧{precip}%</span>
                )}
              </div>

              <div className="forecast-bar-container">
                <span className="temp-low">{low}°</span>
                <div className="forecast-bar-track">
                  <div
                    className="forecast-bar-fill"
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 5)}%`,
                    }}
                  />
                </div>
                <span className="temp-high">{high}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
