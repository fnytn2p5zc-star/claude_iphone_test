import { isRainy, isSnowy, isStormy, isSunny } from './weatherCodes';

export function generateSuggestions(current, daily) {
  const tips = [];
  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const code = current.weather_code;
  const uvMax = daily?.uv_index_max?.[0] || 0;
  const precipProb = daily?.precipitation_probability_max?.[0] || 0;

  // Clothing
  if (temp <= -5) {
    tips.push({ icon: '🧣', text: '极寒天气！穿最厚的羽绒服，戴帽子手套围巾，做好全面防寒', category: 'clothing' });
  } else if (temp <= 5) {
    tips.push({ icon: '🧥', text: '天气寒冷，建议穿厚外套或羽绒服，注意保暖', category: 'clothing' });
  } else if (temp <= 12) {
    tips.push({ icon: '🧶', text: '气温偏低，毛衣加外套是不错的选择', category: 'clothing' });
  } else if (temp <= 20) {
    tips.push({ icon: '👔', text: '温度舒适，长袖衬衫或薄外套即可', category: 'clothing' });
  } else if (temp <= 28) {
    tips.push({ icon: '👕', text: '天气温暖，短袖 T 恤就够了', category: 'clothing' });
  } else if (temp <= 35) {
    tips.push({ icon: '🩳', text: '天气炎热，穿轻薄透气衣物，注意防暑降温', category: 'clothing' });
  } else {
    tips.push({ icon: '🔥', text: '高温预警！尽量待在室内，外出务必做好防暑措施', category: 'clothing' });
  }

  // Weather-specific
  if (isRainy(code)) {
    tips.push({ icon: '☔', text: '记得带伞出门，路面湿滑注意安全', category: 'weather' });
  } else if (precipProb > 60) {
    tips.push({ icon: '🌂', text: `今天降水概率 ${precipProb}%，建议随身带伞`, category: 'weather' });
  }

  if (isSnowy(code)) {
    tips.push({ icon: '⛄', text: '下雪天注意保暖防滑，驾车请减速慢行', category: 'weather' });
  }

  if (isStormy(code)) {
    tips.push({ icon: '⚡', text: '雷暴天气，尽量避免户外活动，远离空旷地带和高大物体', category: 'weather' });
  }

  if ([45, 48].includes(code)) {
    tips.push({ icon: '🚗', text: '大雾天气能见度低，驾车请开雾灯减速，注意安全', category: 'weather' });
  }

  // Wind
  if (windSpeed > 50) {
    tips.push({ icon: '🌪', text: '大风预警！避免户外活动，远离广告牌和大树', category: 'wind' });
  } else if (windSpeed > 30) {
    tips.push({ icon: '💨', text: '风力较大，外出注意防风，骑行需格外小心', category: 'wind' });
  }

  // UV
  if (uvMax >= 8) {
    tips.push({ icon: '🧴', text: `紫外线指数 ${Math.round(uvMax)}（极强），涂 SPF50 防晒霜，戴墨镜帽子`, category: 'uv' });
  } else if (uvMax >= 5) {
    tips.push({ icon: '🕶', text: `紫外线指数 ${Math.round(uvMax)}（较强），建议涂防晒霜`, category: 'uv' });
  }

  // Humidity
  if (humidity > 85) {
    tips.push({ icon: '💦', text: '湿度很高，体感闷热，衣物不易干燥', category: 'humidity' });
  } else if (humidity < 25) {
    tips.push({ icon: '🏜', text: '空气非常干燥，多喝水，注意皮肤保湿', category: 'humidity' });
  }

  // Exercise
  if (isSunny(code) && temp >= 12 && temp <= 28 && windSpeed < 25) {
    tips.push({ icon: '🏃', text: '天气条件很好，适合跑步、骑行等户外运动', category: 'exercise' });
  } else if (isSunny(code) && temp >= 5 && temp <= 12) {
    tips.push({ icon: '🚶', text: '适合散步，运动前注意热身', category: 'exercise' });
  }

  // Health
  const tempDiff = daily?.temperature_2m_max?.[0] - daily?.temperature_2m_min?.[0];
  if (tempDiff > 15) {
    tips.push({ icon: '🤧', text: `今日温差达 ${Math.round(tempDiff)}°C，注意增减衣物预防感冒`, category: 'health' });
  }

  if (tips.length === 0) {
    tips.push({ icon: '😊', text: '今天天气还不错，祝你有美好的一天！', category: 'general' });
  }

  return tips;
}

export function getAqiLevel(aqi) {
  if (aqi <= 50) return { label: '优', color: '#00e400', advice: '空气质量很好，尽情享受户外活动' };
  if (aqi <= 100) return { label: '良', color: '#ffff00', advice: '空气质量可以，敏感人群注意' };
  if (aqi <= 150) return { label: '轻度污染', color: '#ff7e00', advice: '敏感人群应减少户外运动' };
  if (aqi <= 200) return { label: '中度污染', color: '#ff0000', advice: '建议减少户外活动，佩戴口罩' };
  if (aqi <= 300) return { label: '重度污染', color: '#8f3f97', advice: '避免户外活动，必须外出请佩戴 N95 口罩' };
  return { label: '严重污染', color: '#7e0023', advice: '严重污染，请留在室内，关闭门窗' };
}

export function generateDaySuggestion(code, tempMax, tempMin) {
  const suggestions = [];
  if (isRainy(code)) suggestions.push('带伞');
  if (isSnowy(code)) suggestions.push('防滑保暖');
  if (isStormy(code)) suggestions.push('避免户外');
  if (tempMax > 32) suggestions.push('防暑');
  if (tempMin < 3) suggestions.push('注意保暖');
  if (isSunny(code) && tempMax >= 15 && tempMax <= 30) suggestions.push('适合外出');
  return suggestions.join(' | ') || '普通天气';
}
