import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeatherInfo } from '../utils/weatherCodes';
import { generateDaySuggestion } from '../utils/suggestions';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function Calendar({ weather }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [direction, setDirection] = useState(0);

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Build weather map
  const weatherMap = useMemo(() => {
    const map = {};
    if (weather?.daily) {
      weather.daily.time.forEach((t, i) => {
        map[t] = {
          code: weather.daily.weather_code[i],
          max: weather.daily.temperature_2m_max[i],
          min: weather.daily.temperature_2m_min[i],
          precip: weather.daily.precipitation_probability_max?.[i],
          precipSum: weather.daily.precipitation_sum?.[i],
          wind: weather.daily.wind_speed_10m_max?.[i],
          sunrise: weather.daily.sunrise?.[i]?.slice(11, 16),
          sunset: weather.daily.sunset?.[i]?.slice(11, 16),
        };
      });
    }
    return map;
  }, [weather]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month
    for (let i = startDow - 1; i >= 0; i--) {
      days.push({ day: prevLastDay - i, current: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        current: true,
        dateStr,
        isToday: dateStr === todayStr,
        weather: weatherMap[dateStr] || null,
      });
    }

    // Next month
    const remaining = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false });
    }

    return days;
  }, [year, month, todayStr, weatherMap]);

  const handlePrev = () => {
    setDirection(-1);
    setSelectedDate(null);
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const handleNext = () => {
    setDirection(1);
    setSelectedDate(null);
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const handleDayClick = (day) => {
    if (!day.current) return;
    setSelectedDate(selectedDate === day.dateStr ? null : day.dateStr);
  };

  const selectedWeather = selectedDate ? weatherMap[selectedDate] : null;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="card-title">
        <span>🗓</span> 日历
      </div>

      {/* Navigation */}
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={handlePrev}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="cal-nav-title">{year}年{month + 1}月</span>
        <button className="cal-nav-btn" onClick={handleNext}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="cal-weekdays">
        {WEEKDAYS.map((d) => (
          <span key={d} className="cal-weekday">{d}</span>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${year}-${month}`}
          className="cal-days"
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -50 }}
          transition={{ duration: 0.2 }}
        >
          {calendarDays.map((day, i) => {
            const isSelected = day.dateStr === selectedDate;
            const weatherInfo = day.weather ? getWeatherInfo(day.weather.code) : null;

            return (
              <div
                key={i}
                className={[
                  'cal-day',
                  !day.current && 'other',
                  day.isToday && 'today',
                  isSelected && 'selected',
                  day.weather && 'has-weather',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleDayClick(day)}
              >
                <span className="cal-day-num">{day.day}</span>
                {weatherInfo && (
                  <span className="cal-day-icon">{weatherInfo.icon}</span>
                )}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            className="cal-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="cal-detail-inner">
              <div className="cal-detail-header">
                {parseInt(selectedDate.slice(5, 7))}月{parseInt(selectedDate.slice(8, 10))}日
                {' '}
                {WEEKDAYS[new Date(selectedDate + 'T00:00:00').getDay()]}
              </div>

              {selectedWeather ? (
                <>
                  <div className="cal-detail-weather">
                    <span className="cal-detail-big-icon">
                      {getWeatherInfo(selectedWeather.code).icon}
                    </span>
                    <div className="cal-detail-info">
                      <div className="cal-detail-desc">
                        {getWeatherInfo(selectedWeather.code).desc}
                      </div>
                      <div className="cal-detail-temps">
                        🌡 {Math.round(selectedWeather.min)}° ~ {Math.round(selectedWeather.max)}°
                      </div>
                      {selectedWeather.precip != null && (
                        <div className="cal-detail-meta">
                          💧 降水概率 {selectedWeather.precip}%
                          {selectedWeather.precipSum > 0 && ` | 降水量 ${selectedWeather.precipSum}mm`}
                        </div>
                      )}
                      {selectedWeather.wind != null && (
                        <div className="cal-detail-meta">
                          🌬 最大风速 {Math.round(selectedWeather.wind)} km/h
                        </div>
                      )}
                      {selectedWeather.sunrise && (
                        <div className="cal-detail-meta">
                          🌅 {selectedWeather.sunrise} ~ 🌇 {selectedWeather.sunset}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="cal-detail-suggestion">
                    💡 {generateDaySuggestion(
                      selectedWeather.code,
                      selectedWeather.max,
                      selectedWeather.min
                    )}
                  </div>
                </>
              ) : (
                <div className="cal-detail-empty">暂无天气数据</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
