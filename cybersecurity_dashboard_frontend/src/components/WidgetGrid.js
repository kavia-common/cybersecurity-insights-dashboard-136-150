import React, { useEffect, useState } from "react";
import { fetchAnalytics, fetchWidgetData, fetchThreats } from "../api";
import WidgetCard from "./WidgetCard";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Sample widgets definition. In a real customizable dashboard this could be dynamic.
const widgetConfigs = [
  { id: "anomaly_trends", title: "Anomaly Trends", type: "analytics_trend", chart: "line" },
  { id: "top_threats", title: "Top Threats", type: "threats_top", chart: "bar" },
  { id: "system_health", title: "System Health", type: "widget_health", chart: "bar" },
];

function WidgetGrid() {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWidgets() {
      setLoading(true);
      try {
        // Fetch and format demo analytics/trends
        // Widget 1: Anomaly Trends Line Chart
        const analytics = await fetchAnalytics({ timeframe: "24h" });
        const threatData = await fetchThreats({ timeframe: "24h" });
        // Widget 2: Top Threats by Severity (bar)
        // Widget 3: System health can be demo data from backend
        const health = await fetchWidgetData("system_health");
        setWidgets([
          {
            id: "anomaly_trends",
            title: "Anomaly Trends",
            widget: (
              <Line
                data={{
                  labels: analytics.data.map((d) => d.timestamp.slice(11, 16)),
                  datasets: [
                    {
                      label: "Anomalies",
                      data: analytics.data.map((d) => d.value),
                      backgroundColor: "#ffab00",
                      borderColor: "#ffab00",
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            ),
          },
          {
            id: "top_threats",
            title: "Top Threats",
            widget: (
              <Bar
                data={{
                  labels: (threatData.events || []).map((t) => t.type),
                  datasets: [
                    {
                      label: "Detected",
                      data: (threatData.events || []).map((t) => t.ai_score || 0),
                      backgroundColor: "#1a237e",
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            ),
          },
          {
            id: "system_health",
            title: "System Health",
            widget: (
              <WidgetCard
                title="Health"
                content={
                  <ul>
                    {Object.entries(health.data || {}).map(([k, v]) => (
                      <li key={k}>{k}: {v.toString()}</li>
                    ))}
                  </ul>
                }
              />
            ),
          },
        ]);
      } catch (err) {
        setWidgets([]);
      }
      setLoading(false);
    }
    loadWidgets();
  }, []);

  if (loading) return <div>Loading analytics and widgets...</div>;
  return (
    <div className="widget-grid">
      {widgets.map((w) => (
        <WidgetCard key={w.id} title={w.title} content={w.widget} />
      ))}
    </div>
  );
}

export default WidgetGrid;
