import { motion } from 'framer-motion';
import { generateSuggestions } from '../utils/suggestions';

export default function Suggestions({ weather }) {
  if (!weather) return null;

  const tips = generateSuggestions(weather.current, weather.daily);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="card-title">
        <span>💡</span> 今日建议
      </div>
      <div className="suggestions-list">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            className={`suggestion-item suggestion-${tip.category}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <span className="suggestion-icon">{tip.icon}</span>
            <span className="suggestion-text">{tip.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
