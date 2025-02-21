import { useState, useEffect, useContext } from 'react';
import './App.css';
import LoginModal from './components/modal/LoginModal';
// import RegisterModal from './components/modal/RegisterModal';
import TaskModal from './components/modal/TaskModal';
import defaultUserIcon from './assets/user.svg';
import AuthContext from './context/AuthContext';
import useAxiosPublic from './hooks/useAxiosPublic';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import deleteIcon from './assets/delete.png';

const App = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  // const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user, signOutUser } = useContext(AuthContext);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchTasks = async () => {
    if (!user?.email) return [];
    const res = await axiosPublic.get(`/tasks/${user.email}`);
    return res.data;
  };

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: !!user?.email,
  });

  // Mutation for adding/updating a task
  const saveTaskMutation = useMutation({
    mutationFn: async taskData => {
      if (selectedTask) {
        // Update existing task
        return axiosPublic.patch(`/tasks/${selectedTask._id}`, {
          ...taskData,
          email: user.email, // Ensure email is included
        });
      } else {
        // Add new task
        return axiosPublic.post('/tasks', {
          ...taskData,
          email: user.email,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', user?.email]);
      setIsAddTaskModalOpen(false);
      setSelectedTask(null);
    },
    onError: error => {
      console.error('Task save error:', error);
    },
  });

  const handleSaveTask = newTask => {
    saveTaskMutation.mutate(newTask);
  };

  const handleEditTask = task => {
    setSelectedTask(task);
    console.log(task);
    setIsAddTaskModalOpen(true);
  };

  // const handleDelete = id => {
  //   alert(`Are you sure you want to delete this task? ${id}`);
  // };

  const categories = ['To-Do', 'In Progress', 'Done'];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Navbar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Manager
        </h1>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-full cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL || defaultUserIcon}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
              />
              <button
                onClick={signOutUser}
                className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setIsSignInModalOpen(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {category}
            </h2>
            <div className="min-h-[150px] border border-dashed border-gray-300 dark:border-gray-600 p-2 rounded-lg">
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
                </div>
              ) : (
                tasks
                  .filter(task => task.category === category)
                  .map(task => (
                    <div
                      key={task._id}
                      className="bg-gray-200 dark:bg-gray-700 p-3 px-4 rounded-lg mb-2 cursor-pointer"
                      onClick={() => handleEditTask(task)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {task.title}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {task.description}
                          </p>
                        </div>
                        {/* Delete Button */}
                        {/* <div className="flex gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            // onClick={() => handleDelete(task._id)}
                          >
                            <img
                              src={deleteIcon}
                              alt="delete"
                              className="w-4"
                            />
                          </button>
                        </div> */}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => {
          setSelectedTask(null);
          setIsAddTaskModalOpen(true);
        }}
        className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 cursor-pointer"
      >
        + Add Task
      </button>

      {/* Sign In Modal */}
      <LoginModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
      {/* Register Modal */}
      {/* <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setIsSignInModalOpen(true);
        }}
      /> */}
      {/* Task Modal */}
      <TaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        task={selectedTask}
        refetch={refetch}
      />
    </div>
  );
};

export default App;
