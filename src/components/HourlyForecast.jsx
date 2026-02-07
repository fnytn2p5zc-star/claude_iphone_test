import { motion } from 'framer-motion';
import { getWeatherInfo } from '../utils/weatherCodes';

export default function HourlyForecast({ weather }) {
  if (!weather) return null;

  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toISOString().slice(0, 10);

  const times = weather.hourly.time;
  let startIdx = times.findIndex(
    (t) => t.startsWith(todayStr) && parseInt(t.slice(11, 13)) >= currentHour
  );
  if (startIdx === -1) startIdx = 0;

  const items = [];
  for (let i = startIdx; i < Math.min(startIdx + 24, times.length); i++) {
    const hour = parseInt(times[i].slice(11, 13));
    const isNow = i === startIdx;
    const info = getWeatherInfo(weather.hourly.weather_code[i]);
    const precipProb = weather.hourly.precipitation_probability?.[i];

    items.push({
      time: isNow ? '现在' : `${hour}:00`,
      icon: info.icon,
      temp: Math.round(weather.hourly.temperature_2m[i]),
      isNow,
      precipProb,
    });
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <div className="card-title">
        <span>🕐</span> 逐时预报
      </div>
      <div className="hourly-scroll">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={`hourly-item ${item.isNow ? 'now' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.02 }}
          >
            <span className="hourly-time">{item.time}</span>
            <span className="hourly-icon">{item.icon}</span>
            <span className="hourly-temp">{item.temp}°</span>
            {item.precipProb != null && item.precipProb > 0 && (
              <span className="hourly-precip">💧{item.precipProb}%</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
