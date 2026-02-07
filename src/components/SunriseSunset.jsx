import { motion } from 'framer-motion';

export default function SunriseSunset({ weather }) {
  if (!weather?.daily?.sunrise?.[0]) return null;

  const sunrise = weather.daily.sunrise[0];
  const sunset = weather.daily.sunset[0];
  const sunriseTime = sunrise.slice(11, 16);
  const sunsetTime = sunset.slice(11, 16);

  // Calculate sun position
  const now = new Date();
  const sunriseDate = new Date(sunrise);
  const sunsetDate = new Date(sunset);
  const totalMs = sunsetDate - sunriseDate;
  const elapsedMs = now - sunriseDate;
  const progress = Math.max(0, Math.min(1, elapsedMs / totalMs));
  const isDaylight = progress > 0 && progress < 1;

  // Daylight duration
  const daylightHours = Math.floor(totalMs / 3600000);
  const daylightMins = Math.floor((totalMs % 3600000) / 60000);

  // Sun arc position
  const angle = progress * Math.PI;
  const sunX = 20 + progress * 160;
  const sunY = 90 - Math.sin(angle) * 70;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="card-title">
        <span>🌅</span> 日出日落
      </div>

      <div className="sun-arc-container">
        <svg viewBox="0 0 200 110" className="sun-arc-svg">
          {/* Horizon line */}
          <line x1="15" y1="90" x2="185" y2="90" stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />

          {/* Arc path (background) */}
          <path
            d="M 20 90 Q 100 -10 180 90"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {/* Arc path (active/traversed) */}
          {isDaylight && (
            <path
              d="M 20 90 Q 100 -10 180 90"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray={`${progress * 210} 999`}
              opacity="0.7"
            />
          )}

          {/* Sun */}
          {isDaylight && (
            <g>
              <circle cx={sunX} cy={sunY} r="14" fill="#fbbf24" opacity="0.2" />
              <circle cx={sunX} cy={sunY} r="8" fill="#fbbf24" />
              <circle cx={sunX} cy={sunY} r="5" fill="#fcd34d" />
            </g>
          )}

          {/* Labels */}
          <text x="20" y="108" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">
            {sunriseTime}
          </text>
          <text x="180" y="108" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">
            {sunsetTime}
          </text>
        </svg>
      </div>

      <div className="sun-info">
        <div className="sun-info-item">
          <span className="sun-emoji">🌅</span>
          <div>
            <div className="sun-label">日出</div>
            <div className="sun-time">{sunriseTime}</div>
          </div>
        </div>
        <div className="sun-info-item">
          <span className="sun-emoji">⏱</span>
          <div>
            <div className="sun-label">日照时长</div>
            <div className="sun-time">{daylightHours}h {daylightMins}m</div>
          </div>
        </div>
        <div className="sun-info-item">
          <span className="sun-emoji">🌇</span>
          <div>
            <div className="sun-label">日落</div>
            <div className="sun-time">{sunsetTime}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
