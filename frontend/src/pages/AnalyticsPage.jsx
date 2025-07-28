import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('Month');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const mockData = {
    dailyUsage: [
      { date: 'Jan', cards: 1200, activities: 8 },
      { date: 'Feb', cards: 800, activities: 6 },
      { date: 'Mar', cards: 600, activities: 5 },
      { date: 'Apr', cards: 900, activities: 7 },
      { date: 'May', cards: 700, activities: 6 },
      { date: 'Jun', cards: 1100, activities: 9 },
      { date: 'Jul', cards: 1800, activities: 12 },
      { date: 'Sep', cards: 1400, activities: 10 },
      { date: 'Aug', cards: 1200, activities: 8 },
      { date: 'Oct', cards: 900, activities: 7 },
      { date: 'Nov', cards: 1000, activities: 8 },
      { date: 'Dec', cards: 1100, activities: 9 }
    ],
    totalStats: {
      totalCards: 2,
      totalCategories: 2,
      totalCustomCards: 2,
      totalActivities: 2
    },
    mostUsedCard: {
      name: "Здраво",
      count: 156,
      category: "Communication"
    },
    mostUsedCategory: {
      name: "Communication", 
      count: 89,
      percentage: 45
    },
    categoryDistribution: [
      { name: 'Communication', value: 45, color: '#4CAF50' },
      { name: 'Activities', value: 30, color: '#2196F3' },
      { name: 'Food', value: 15, color: '#FF9800' },
      { name: 'Animals', value: 10, color: '#9C27B0' }
    ],
    activityTime: [
      { name: 'Communication', time: 120 }, // minutes
      { name: 'Learning', time: 89 },
      { name: 'Play', time: 156 }
    ]
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, userId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      setTimeout(() => {
        setAnalytics(mockData);
        setLoading(false);
      }, 500);
      
      /* 
      // Future API implementation:
      const response = await fetch(`/api/analytics/${userId}?timeframe=${timeframe}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAnalytics(data);
      */
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading">Вчитување статистики...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-page">
        <div className="error">Грешка при вчитување на статистиките</div>
      </div>
    );
  }

  return (
    <div className="analytics-page mt-15">
      <div className="analytics-header">
        <h1></h1>
        <div className="timeframe-selector">
          {['Day', 'Week', 'Month'].map((period) => (
            <button
              key={period}
              className={`timeframe-btn ${timeframe === period ? 'active' : ''}`}
              onClick={() => setTimeframe(period)}
            >
              {period === 'Day' ? 'Ден' : period === 'Week' ? 'Недела' : 'Месец'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{analytics.totalStats.totalCards.toString().padStart(2, '0')}</div>
          <div className="stat-label">Искористени картички</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.totalStats.totalCategories.toString().padStart(2, '0')}</div>
          <div className="stat-label">Искористени категории</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.totalStats.totalCustomCards.toString().padStart(2, '0')}</div>
          <div className="stat-label">Кастом картички</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.totalStats.totalActivities.toString().padStart(2, '0')}</div>
          <div className="stat-label">Изминати часови</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Daily Usage Chart */}
        <div className="chart-container large">
          <h2>Број искористени картички</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="cards" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="chart-container">
          <h2>Распределба по категории</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {analytics.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {analytics.categoryDistribution.map((item, index) => (
              <div key={index} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Time */}
        <div className="chart-container">
          <h2>Време по активност</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.activityTime} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" width={80} />
              <Tooltip 
                formatter={(value) => formatTime(value)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="time" fill="#2196F3" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        {/* <h2>Увиди</h2> */}
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🏆</div>
            <div className="insight-content">
              <h3>Најкористена картичка</h3>
              <p><strong>{analytics.mostUsedCard.name}</strong></p>
              <span>{analytics.mostUsedCard.count} пати користена</span>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h3>Најкористена категорија</h3>
              <p><strong>{analytics.mostUsedCategory.name}</strong></p>
              <span>{analytics.mostUsedCategory.percentage}% од вкупното користење</span>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">⏰</div>
            <div className="insight-content">
              <h3>Најактивна сесија</h3>
              <p><strong>Learning</strong></p>
              <span>{formatTime(Math.max(...analytics.activityTime.map(a => a.time)))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;