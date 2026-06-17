import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProgressChart({ stats, tasks }) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  if (!stats) return null;

  const priorityCounts = { low: 0, medium: 0, high: 0 };
  tasks.forEach((task) => {
    if (!task.is_completed) {
      priorityCounts[task.priority]++;
    }
  });

  const completionData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [stats.completed_tasks, stats.pending_tasks],
        backgroundColor: ["#10b981", "rgba(99, 102, 241, 0.3)"],
        borderColor: ["#10b981", "#6366f1"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const priorityData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textColor, padding: 16, usePointStyle: true },
      },
    },
  };

  return (
    <motion.div
      className="chart-card glass"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3>Completion Progress</h3>
      <div className="chart-container">
        <Doughnut data={completionData} options={chartOptions} />
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>Pending by Priority</h3>
      <div className="chart-container" style={{ height: "200px" }}>
        <Doughnut
          data={priorityData}
          options={{
            ...chartOptions,
            cutout: "60%",
          }}
        />
      </div>
    </motion.div>
  );
}
