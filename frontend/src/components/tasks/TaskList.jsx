import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const filters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isOverdue(task) {
  if (task.is_completed || !task.due_date) return false;
  return new Date(task.due_date) < new Date();
}

export default function TaskList({ tasks, onToggleComplete, onDelete, onEdit }) {
  const [filter, setFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "pending":
        return tasks.filter((t) => !t.is_completed);
      case "completed":
        return tasks.filter((t) => t.is_completed);
      case "overdue":
        return tasks.filter((t) => isOverdue(t));
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <div className="task-list-card glass">
      <div className="task-list-header">
        <h3>Your Tasks ({filteredTasks.length})</h3>
        <div className="task-filters">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>No tasks found. Create your first task above!</p>
        </div>
      ) : (
        <div className="task-list">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                className={`task-item glass ${task.is_completed ? "completed" : ""}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className={`task-checkbox ${task.is_completed ? "checked" : ""}`}
                  onClick={() => onToggleComplete(task.id)}
                  aria-label={task.is_completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.is_completed && "✓"}
                </button>

                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  {task.description && (
                    <div className="task-description">{task.description}</div>
                  )}
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className={`due-date ${isOverdue(task) ? "overdue" : ""}`}>
                        📅 {formatDueDate(task.due_date)}
                        {isOverdue(task) && " (Overdue)"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => onEdit(task)}
                    aria-label="Edit task"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => onDelete(task.id)}
                    aria-label="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
