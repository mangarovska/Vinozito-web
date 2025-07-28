class AnalyticsService {
  constructor() {
    this.currentSessionId = null;
    this.currentActivityType = null;
  }

  async trackCardUsage(cardId, cardName, category, cardType) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
      const response = await fetch('http://localhost:5100/api/analytics/track-card-usage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          cardId,
          cardName,
          category,
          cardType,
          sessionId: this.currentSessionId
        })
      });

      if (!response.ok) {
        console.warn('Failed to track card usage:', response.status);
      }
    } catch (error) {
      console.warn('Error tracking card usage:', error);
    }
  }

  async startSession(activityType = 'Communication') {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
      const response = await fetch('http://localhost:5100/api/analytics/start-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          activityType
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.currentSessionId = data.sessionId;
        this.currentActivityType = activityType;
        console.log(`Started ${activityType} session:`, this.currentSessionId);
      }
    } catch (error) {
      console.warn('Error starting session:', error);
    }
  }

  async endSession() {
    if (!this.currentSessionId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5100/api/analytics/end-session/${this.currentSessionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log(`Ended ${this.currentActivityType} session:`, this.currentSessionId);
        this.currentSessionId = null;
        this.currentActivityType = null;
      }
    } catch (error) {
      console.warn('Error ending session:', error);
    }
  }

  async getAnalytics(timeframe = 'Month') {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return null;

    try {
      const response = await fetch(`http://localhost:5100/api/analytics/${userId}?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }

    return null;
  }

  // Auto-start session when user enters communication page
  initializeSession(activityType = 'Communication') {
    this.startSession(activityType);
    
    // Auto-end session when user leaves the page
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;