import { motion } from 'framer-motion';
import { getWeatherInfo, getWeatherBg } from '../utils/weatherCodes';
import WeatherAnimation from './WeatherAnimation';

export default function WeatherHero({ weather }) {
  if (!weather) return <HeroSkeleton />;

  const current = weather.current;
  const daily = weather.daily;
  const info = getWeatherInfo(current.weather_code);
  const bg = getWeatherBg(current.weather_code);
  const isDay = current.is_day === 1;

  const nightBg = 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';

  const uvMax = daily?.uv_index_max?.[0] || 0;
  let uvLabel = '低';
  if (uvMax >= 8) uvLabel = '极强';
  else if (uvMax >= 6) uvLabel = '强';
  else if (uvMax >= 3) uvLabel = '中等';

  return (
    <motion.div
      className="hero"
      style={{ background: isDay ? bg : nightBg }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WeatherAnimation weatherCode={current.weather_code} isDay={isDay} />

      <div className="hero-content">
        <motion.div
          className="hero-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          {info.icon}
        </motion.div>

        <motion.div
          className="hero-temp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(current.temperature_2m)}°
        </motion.div>

        <div className="hero-desc">{info.desc}</div>

        <div className="hero-range">
          {daily && `${Math.round(daily.temperature_2m_min[0])}° / ${Math.round(daily.temperature_2m_max[0])}°`}
        </div>

        <div className="hero-details">
          <DetailItem icon="💧" label="湿度" value={`${current.relative_humidity_2m}%`} />
          <DetailItem icon="🌬" label="风速" value={`${Math.round(current.wind_speed_10m)} km/h`} />
          <DetailItem icon="🌡" label="体感" value={`${Math.round(current.apparent_temperature)}°`} />
          <DetailItem icon="☀️" label="紫外线" value={`${Math.round(uvMax)} ${uvLabel}`} />
          <DetailItem icon="🌥" label="云量" value={`${current.cloud_cover}%`} />
          <DetailItem icon="📊" label="气压" value={`${Math.round(current.pressure_msl)} hPa`} />
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="hero-detail-item">
      <span className="hero-detail-icon">{icon}</span>
      <span className="hero-detail-label">{label}</span>
      <span className="hero-detail-value">{value}</span>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="hero hero-skeleton">
      <div className="skeleton-circle" />
      <div className="skeleton-line lg" />
      <div className="skeleton-line md" />
    </div>
  );
}
