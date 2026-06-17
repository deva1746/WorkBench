import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  due_date: "",
};

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
        due_date: editingTask.due_date
          ? new Date(editingTask.due_date).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
    };
    onSubmit(payload);
    if (!editingTask) {
      setForm(emptyForm);
    }
  };

  return (
    <motion.div
      className="task-form-card glass"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      key={editingTask?.id || "new"}
    >
      <h3>{editingTask ? "Edit Task" : "Create New Task"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional details..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Due Date</label>
            <input
              id="due_date"
              name="due_date"
              type="datetime-local"
              className="form-input"
              value={form.due_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          {editingTask && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
