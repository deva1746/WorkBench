import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
      fetchTasks();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleToggleComplete = async (taskId) => {
    await api.patch(`/tasks/${taskId}/complete`);
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    toast.success("Task deleted");
    fetchTasks();
  };

  return (
    <>
      <div className="page-header">
        <h1>Tasks</h1>
        <p>Manage all your tasks in one place.</p>
      </div>

      <TaskForm
        onSubmit={handleCreateOrUpdate}
        editingTask={editingTask}
        onCancel={() => setEditingTask(null)}
      />

      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
        onEdit={setEditingTask}
      />
    </>
  );
}