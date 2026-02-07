// ========== Weather Code Mapping ==========
const WEATHER_CODES = {
  0: { desc: '晴天', icon: '☀️' },
  1: { desc: '大部晴朗', icon: '🌤' },
  2: { desc: '局部多云', icon: '⛅' },
  3: { desc: '多云', icon: '☁️' },
  45: { desc: '雾', icon: '🌫' },
  48: { desc: '霜雾', icon: '🌫' },
  51: { desc: '小毛毛雨', icon: '🌦' },
  53: { desc: '毛毛雨', icon: '🌦' },
  55: { desc: '大毛毛雨', icon: '🌧' },
  56: { desc: '冻毛毛雨', icon: '🌧' },
  57: { desc: '冻雨', icon: '🌧' },
  61: { desc: '小雨', icon: '🌧' },
  63: { desc: '中雨', icon: '🌧' },
  65: { desc: '大雨', icon: '🌧' },
  66: { desc: '冻雨', icon: '🌧' },
  67: { desc: '大冻雨', icon: '🌧' },
  71: { desc: '小雪', icon: '🌨' },
  73: { desc: '中雪', icon: '🌨' },
  75: { desc: '大雪', icon: '❄️' },
  77: { desc: '雪粒', icon: '❄️' },
  80: { desc: '小阵雨', icon: '🌦' },
  81: { desc: '中阵雨', icon: '🌧' },
  82: { desc: '大阵雨', icon: '⛈' },
  85: { desc: '小阵雪', icon: '🌨' },
  86: { desc: '大阵雪', icon: '❄️' },
  95: { desc: '雷暴', icon: '⛈' },
  96: { desc: '雷暴伴小冰雹', icon: '⛈' },
  99: { desc: '雷暴伴大冰雹', icon: '⛈' },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { desc: '未知', icon: '❓' };
}

// ========== Suggestion Generator ==========
function generateSuggestions(current, daily) {
  const tips = [];
  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const weatherCode = current.weather_code;
  const uvMax = daily.uv_index_max ? daily.uv_index_max[0] : 0;

  // Temperature tips
  if (temp <= 0) {
    tips.push({ icon: '🧣', text: '气温极低，请穿厚羽绒服，注意防寒保暖，小心路面结冰' });
  } else if (temp <= 5) {
    tips.push({ icon: '🧥', text: '天气寒冷，建议穿厚外套和围巾，注意保暖' });
  } else if (temp <= 12) {
    tips.push({ icon: '🧶', text: '气温偏低，建议穿毛衣加外套，适当添衣' });
  } else if (temp <= 20) {
    tips.push({ icon: '👔', text: '气温舒适，适合穿长袖衬衫或薄外套' });
  } else if (temp <= 28) {
    tips.push({ icon: '👕', text: '天气温暖，穿短袖即可，非常适合户外活动' });
  } else if (temp <= 35) {
    tips.push({ icon: '🥤', text: '天气炎热，注意防暑降温，多喝水，减少户外暴晒' });
  } else {
    tips.push({ icon: '🔥', text: '高温预警！尽量减少外出，注意防中暑，随身携带水' });
  }

  // Rain tips
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    tips.push({ icon: '☔', text: '今天有雨，记得带伞出门，注意道路湿滑' });
  }

  // Snow tips
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    tips.push({ icon: '⛄', text: '今天有雪，注意保暖，路面可能湿滑，出行小心' });
  }

  // Thunderstorm tips
  if ([95, 96, 99].includes(weatherCode)) {
    tips.push({ icon: '⚡', text: '今天有雷暴，尽量避免户外活动，远离空旷地带' });
  }

  // Fog tips
  if ([45, 48].includes(weatherCode)) {
    tips.push({ icon: '🚗', text: '今天有雾，能见度低，驾车请减速慢行，注意安全' });
  }

  // Wind tips
  if (windSpeed > 40) {
    tips.push({ icon: '💨', text: '风力较大，外出注意防风，避免高空作业' });
  } else if (windSpeed > 20) {
    tips.push({ icon: '🍃', text: '有风，外出注意防风，骑车注意安全' });
  }

  // UV tips
  if (uvMax >= 8) {
    tips.push({ icon: '🧴', text: '紫外线很强，务必涂防晒霜，戴墨镜和帽子' });
  } else if (uvMax >= 5) {
    tips.push({ icon: '🕶', text: '紫外线较强，建议涂防晒霜，避免长时间暴晒' });
  }

  // Humidity tips
  if (humidity > 85) {
    tips.push({ icon: '💦', text: '湿度较高，衣物不易干燥，注意防潮' });
  } else if (humidity < 30) {
    tips.push({ icon: '🏜', text: '空气干燥，注意多喝水，可以使用加湿器' });
  }

  // Good weather
  if ([0, 1].includes(weatherCode) && temp >= 15 && temp <= 28 && windSpeed < 20) {
    tips.push({ icon: '🏃', text: '今天天气很好，非常适合户外运动和散步' });
  }

  if (tips.length === 0) {
    tips.push({ icon: '😊', text: '今天天气状况一般，祝你有美好的一天！' });
  }

  return tips;
}

function generateDaySuggestion(weatherCode, tempMax, tempMin) {
  const info = getWeatherInfo(weatherCode);
  const suggestions = [];

  if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    suggestions.push('记得带伞');
  }
  if ([71, 73, 75, 85, 86].includes(weatherCode)) {
    suggestions.push('注意防雪保暖');
  }
  if (tempMax > 30) {
    suggestions.push('注意防暑');
  }
  if (tempMin < 5) {
    suggestions.push('注意保暖');
  }
  if ([0, 1].includes(weatherCode) && tempMax >= 15 && tempMax <= 30) {
    suggestions.push('适合户外活动');
  }

  return suggestions.length > 0
    ? `${info.icon} ${info.desc} | ${suggestions.join('，')}`
    : `${info.icon} ${info.desc}`;
}

// ========== Location ==========
function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持定位'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        // Fallback to Beijing
        resolve({ lat: 39.9042, lon: 116.4074, fallback: true });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh`
    );
    const data = await res.json();
    const addr = data.address;
    return addr.city || addr.town || addr.county || addr.state || '未知位置';
  } catch {
    return '未知位置';
  }
}

// ========== Weather API (Open-Meteo) ==========
async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('天气数据获取失败');
  return res.json();
}

// ========== Render Functions ==========
function renderCurrentWeather(data) {
  const current = data.current;
  const info = getWeatherInfo(current.weather_code);

  document.getElementById('current-weather-icon').textContent = info.icon;
  document.getElementById('current-temp').textContent = `${Math.round(current.temperature_2m)}°`;
  document.getElementById('weather-desc').textContent = info.desc;
  document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
  document.getElementById('wind-speed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.getElementById('feels-like').textContent = `${Math.round(current.apparent_temperature)}°`;

  const uvMax = data.daily.uv_index_max ? data.daily.uv_index_max[0] : 0;
  let uvLabel = '低';
  if (uvMax >= 8) uvLabel = '极强';
  else if (uvMax >= 6) uvLabel = '强';
  else if (uvMax >= 3) uvLabel = '中等';
  document.getElementById('uv-index').textContent = `${Math.round(uvMax)} ${uvLabel}`;
}

function renderSuggestions(data) {
  const tips = generateSuggestions(data.current, data.daily);
  const container = document.getElementById('daily-suggestion');
  container.innerHTML = tips.map(t =>
    `<div class="tip-item"><span class="tip-icon">${t.icon}</span><span>${t.text}</span></div>`
  ).join('');
}

function renderHourlyForecast(data) {
  const container = document.getElementById('hourly-forecast');
  const now = new Date();
  const currentHour = now.getHours();

  const hourlyTimes = data.hourly.time;
  const hourlyTemps = data.hourly.temperature_2m;
  const hourlyCodes = data.hourly.weather_code;

  // Find index of current hour
  const todayStr = now.toISOString().slice(0, 10);
  let startIdx = hourlyTimes.findIndex(t => t.startsWith(todayStr) && parseInt(t.slice(11, 13)) >= currentHour);
  if (startIdx === -1) startIdx = 0;

  let html = '';
  for (let i = startIdx; i < Math.min(startIdx + 24, hourlyTimes.length); i++) {
    const hour = parseInt(hourlyTimes[i].slice(11, 13));
    const isNow = (i === startIdx);
    const info = getWeatherInfo(hourlyCodes[i]);
    html += `
      <div class="hourly-item ${isNow ? 'now' : ''}">
        <span class="hourly-time">${isNow ? '现在' : hour + ':00'}</span>
        <span class="hourly-icon">${info.icon}</span>
        <span class="hourly-temp">${Math.round(hourlyTemps[i])}°</span>
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderWeeklyForecast(data) {
  const container = document.getElementById('weekly-forecast');
  const daily = data.daily;
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const today = new Date().toISOString().slice(0, 10);

  // Find global min/max for bar scaling
  const allMin = Math.min(...daily.temperature_2m_min);
  const allMax = Math.max(...daily.temperature_2m_max);
  const range = allMax - allMin || 1;

  let html = '';
  for (let i = 0; i < daily.time.length; i++) {
    const date = new Date(daily.time[i] + 'T00:00:00');
    const isToday = daily.time[i] === today;
    const dayName = isToday ? '今天' : days[date.getDay()];
    const info = getWeatherInfo(daily.weather_code[i]);
    const low = Math.round(daily.temperature_2m_min[i]);
    const high = Math.round(daily.temperature_2m_max[i]);

    const leftPct = ((daily.temperature_2m_min[i] - allMin) / range) * 100;
    const rightPct = ((daily.temperature_2m_max[i] - allMin) / range) * 100;

    html += `
      <div class="forecast-item">
        <span class="forecast-day ${isToday ? 'today' : ''}">${dayName}</span>
        <span class="forecast-icon">${info.icon}</span>
        <div class="forecast-bar-container">
          <div class="forecast-bar" style="opacity:0.15"></div>
          <div class="forecast-bar-fill" style="left:${leftPct}%;width:${rightPct - leftPct}%;position:absolute;"></div>
        </div>
        <span class="forecast-temps">
          <span class="temp-low">${low}°</span>
          <span class="temp-high">${high}°</span>
        </span>
      </div>
    `;
  }
  container.innerHTML = html;
}

// ========== Calendar ==========
let calendarYear, calendarMonth, selectedDay = null;
let weatherData = null;

function initCalendar() {
  const now = new Date();
  calendarYear = now.getFullYear();
  calendarMonth = now.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const titleEl = document.getElementById('calendar-month-year');
  titleEl.textContent = `${calendarYear}年${calendarMonth + 1}月`;

  const container = document.getElementById('calendar-days');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Previous month days
  const prevMonthLastDay = new Date(calendarYear, calendarMonth, 0).getDate();

  let html = '';

  // Previous month trailing days
  for (let i = startDow - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    html += `<div class="calendar-day other-month"><span>${day}</span></div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    const isSelected = selectedDay === dateStr;

    // Check if we have weather data for this day
    let weatherIcon = '';
    if (weatherData && weatherData.daily) {
      const idx = weatherData.daily.time.indexOf(dateStr);
      if (idx !== -1) {
        const info = getWeatherInfo(weatherData.daily.weather_code[idx]);
        weatherIcon = `<span class="day-weather-icon">${info.icon}</span>`;
      }
    }

    const classes = ['calendar-day'];
    if (isToday) classes.push('today');
    if (isSelected) classes.push('selected');

    html += `<div class="${classes.join(' ')}" data-date="${dateStr}"><span>${d}</span>${weatherIcon}</div>`;
  }

  // Next month leading days
  const totalCells = startDow + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="calendar-day other-month"><span>${i}</span></div>`;
  }

  container.innerHTML = html;

  // Add click listeners
  container.querySelectorAll('.calendar-day:not(.other-month)').forEach(el => {
    el.addEventListener('click', () => {
      const date = el.getAttribute('data-date');
      if (selectedDay === date) {
        selectedDay = null;
        document.getElementById('day-detail').style.display = 'none';
      } else {
        selectedDay = date;
        showDayDetail(date);
      }
      renderCalendar();
    });
  });
}

function showDayDetail(dateStr) {
  const panel = document.getElementById('day-detail');
  const headerEl = document.getElementById('day-detail-header');
  const weatherEl = document.getElementById('day-detail-weather');
  const suggestionEl = document.getElementById('day-detail-suggestion');

  const date = new Date(dateStr + 'T00:00:00');
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  headerEl.textContent = `${date.getMonth() + 1}月${date.getDate()}日 ${days[date.getDay()]}`;

  if (weatherData && weatherData.daily) {
    const idx = weatherData.daily.time.indexOf(dateStr);
    if (idx !== -1) {
      const code = weatherData.daily.weather_code[idx];
      const high = Math.round(weatherData.daily.temperature_2m_max[idx]);
      const low = Math.round(weatherData.daily.temperature_2m_min[idx]);
      const info = getWeatherInfo(code);
      const precip = weatherData.daily.precipitation_probability_max
        ? weatherData.daily.precipitation_probability_max[idx]
        : null;

      weatherEl.innerHTML = `${info.icon} ${info.desc}　|　🌡 ${low}° ~ ${high}°`
        + (precip !== null ? `　|　🌧 降水概率 ${precip}%` : '');

      const suggestion = generateDaySuggestion(code, high, low);
      suggestionEl.textContent = `💡 ${suggestion}`;
      panel.style.display = 'block';
    } else {
      weatherEl.textContent = '暂无天气数据';
      suggestionEl.textContent = '';
      panel.style.display = 'block';
    }
  } else {
    weatherEl.textContent = '暂无天气数据';
    suggestionEl.textContent = '';
    panel.style.display = 'block';
  }
}

// ========== Calendar Navigation ==========
document.getElementById('prev-month').addEventListener('click', () => {
  calendarMonth--;
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear--;
  }
  selectedDay = null;
  document.getElementById('day-detail').style.display = 'none';
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  calendarMonth++;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear++;
  }
  selectedDay = null;
  document.getElementById('day-detail').style.display = 'none';
  renderCalendar();
});

// ========== Error Toast ==========
function showError(msg) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ========== Main Init ==========
async function init() {
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.classList.add('spinning');

  try {
    // Get location
    const loc = await getLocation();

    // Fetch city name and weather in parallel
    const [cityName, data] = await Promise.all([
      reverseGeocode(loc.lat, loc.lon),
      fetchWeather(loc.lat, loc.lon),
    ]);

    document.getElementById('city-name').textContent =
      loc.fallback ? `${cityName}（默认）` : cityName;

    weatherData = data;

    // Render all sections
    renderCurrentWeather(data);
    renderSuggestions(data);
    renderHourlyForecast(data);
    renderWeeklyForecast(data);
    initCalendar();
  } catch (err) {
    console.error(err);
    showError('获取天气失败，请刷新重试');
    initCalendar();
  } finally {
    refreshBtn.classList.remove('spinning');
  }
}

// Refresh button
document.getElementById('refresh-btn').addEventListener('click', () => {
  selectedDay = null;
  document.getElementById('day-detail').style.display = 'none';
  init();
});

// Start
init();
