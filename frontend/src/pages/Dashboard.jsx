import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatisticsCards from "../components/dashboard/StatisticsCards";
import ProgressChart from "../components/dashboard/ProgressChart";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import api from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/tasks/dashboard/stats"),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData);
        toast.success("Task updated");
      } else {
        await api.post("/tasks", formData);
        toast.success("Task created");
      }
      setEditingTask(null);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Operation failed");
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      await fetchData();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Task deleted");
      await fetchData();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => setEditingTask(null);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "50vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Track your productivity and manage tasks efficiently.</p>
      </div>

      <StatisticsCards stats={stats} />

      <div className="dashboard-grid">
        <div>
          <TaskForm
            onSubmit={handleCreateOrUpdate}
            editingTask={editingTask}
            onCancel={handleCancelEdit}
          />
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>

        <ProgressChart stats={stats} tasks={tasks} />
      </div>
    </>
  );
}
