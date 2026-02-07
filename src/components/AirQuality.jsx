import { motion } from 'framer-motion';
import { getAqiLevel } from '../utils/suggestions';

export default function AirQuality({ airQuality }) {
  if (!airQuality?.current) return null;

  const aq = airQuality.current;
  const aqi = aq.us_aqi || 0;
  const level = getAqiLevel(aqi);

  // AQI gauge percentage (max 500)
  const pct = Math.min(aqi / 500, 1);
  const angle = pct * 180; // semi-circle

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <div className="card-title">
        <span>🌬</span> 空气质量
      </div>

      <div className="aqi-content">
        <div className="aqi-gauge">
          <svg viewBox="0 0 200 110" className="aqi-svg">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={level.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${angle * 1.4} 999`}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
            <text x="100" y="80" textAnchor="middle" fontSize="32" fontWeight="700" fill="currentColor">
              {aqi}
            </text>
            <text x="100" y="100" textAnchor="middle" fontSize="14" fill={level.color} fontWeight="600">
              {level.label}
            </text>
          </svg>
        </div>

        <div className="aqi-advice">{level.advice}</div>

        <div className="aqi-details">
          {aq.pm2_5 != null && (
            <AqiDetail label="PM2.5" value={`${Math.round(aq.pm2_5)} μg/m³`} />
          )}
          {aq.pm10 != null && (
            <AqiDetail label="PM10" value={`${Math.round(aq.pm10)} μg/m³`} />
          )}
          {aq.ozone != null && (
            <AqiDetail label="O₃" value={`${Math.round(aq.ozone)} μg/m³`} />
          )}
          {aq.nitrogen_dioxide != null && (
            <AqiDetail label="NO₂" value={`${Math.round(aq.nitrogen_dioxide)} μg/m³`} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AqiDetail({ label, value }) {
  return (
    <div className="aqi-detail-item">
      <span className="aqi-detail-label">{label}</span>
      <span className="aqi-detail-value">{value}</span>
    </div>
  );
}
