import { motion } from "framer-motion";

const cardConfig = [
  { key: "total_tasks", label: "Total Tasks", icon: "📋", className: "total" },
  { key: "completed_tasks", label: "Completed", icon: "✅", className: "completed" },
  { key: "pending_tasks", label: "Pending", icon: "⏳", className: "pending" },
  { key: "overdue_tasks", label: "Overdue", icon: "🔴", className: "overdue" },
];

export default function StatisticsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      {cardConfig.map((card, index) => (
        <motion.div
          key={card.key}
          className="stat-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="stat-card-header">
            <span className="stat-card-label">{card.label}</span>
            <div className={`stat-card-icon ${card.className}`}>{card.icon}</div>
          </div>
          <div className="stat-card-value">{stats[card.key]}</div>
          {card.key === "completed_tasks" && (
            <div className="stat-card-sub">{stats.completion_percentage}% complete</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
