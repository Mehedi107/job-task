import { useState, useEffect } from 'react';
import axios from 'axios';

const useTasks = userId => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTasks(userId);
    }
  }, [userId]);

  const fetchTasks = async userId => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/tasks/${userId}`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const addTask = async task => {
    try {
      const res = await axios.post(`http://localhost:3000/api/tasks`, task);
      setTasks(prev => [res.data, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/${taskId}`,
        updatedData
      );
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, ...updatedData } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async taskId => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return { tasks, loading, fetchTasks, addTask, updateTask, deleteTask };
};

export default useTasks;
