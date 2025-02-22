import { useState, useContext } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import './App.css';
import LoginModal from './components/modal/LoginModal';
import TaskModal from './components/modal/TaskModal';
import defaultUserIcon from './assets/user.svg';
import AuthContext from './context/AuthContext';
import useAxiosPublic from './hooks/useAxiosPublic';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskCard from './components/TaskCard';
import DroppableColumn from './components/DroppableColumn';

const App = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user, signOutUser } = useContext(AuthContext);

  const fetchTasks = async () => {
    if (!user?.email) return [];
    const res = await axiosPublic.get(`/tasks/${user?.email}`);
    return res.data;
  };

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: !!user?.email,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, category }) => {
      return axiosPublic.patch(`/tasks/${id}`, { category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const task = tasks.find(t => t._id === active.id);
    if (task && task.category !== over.id) {
      updateTaskMutation.mutate({ id: task._id, category: over.id });
    }
  };

  const handleEditTask = task => {
    setSelectedTask(task);
    setIsAddTaskModalOpen(true); // Open the modal to edit
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Manager
        </h1>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL || defaultUserIcon}
                alt="User"
                className="w-10 h-10 rounded-full border"
              />
              <button
                onClick={signOutUser}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsSignInModalOpen(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </header>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['To-Do', 'In Progress', 'Done'].map(category => (
            <DroppableColumn
              key={category}
              category={category}
              tasks={tasks.filter(t => t.category === category)}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </DndContext>
      <button
        onClick={() => setIsAddTaskModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg"
      >
        + Add Task
      </button>
      <LoginModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
      <TaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false);
          setSelectedTask(null);
        }}
        refetch={refetch}
        task={selectedTask}
      />
    </div>
  );
};

export default App;
