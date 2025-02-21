import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const TaskModal = ({ isOpen, onClose, refetch, task }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('To-Do');
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
    } else {
      setTitle('');
      setDescription('');
      setCategory('To-Do');
    }
  }, [task]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const taskData = {
      title,
      description,
      category,
      email: user?.email,
    };

    try {
      let response;

      if (task?._id) {
        // Update existing task (PUT request)
        response = await axiosPublic.patch(`/tasks/${task._id}`, taskData);
      } else {
        // Create new task (POST request)
        response = await axiosPublic.post('/tasks', taskData);
      }

      if (response?.data?.insertedId || response?.data.modifiedCount) {
        refetch();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setTitle('');
      setDescription('');
      setCategory('To-Do');
    }
  };

  const handleDelete = async taskId => {
    setLoading(true);

    try {
      setLoading(true);
      const response = await axiosPublic.delete(`/tasks/${taskId}`);
      if (response?.data?.deletedCount > 0) {
        refetch();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center transition-opacity">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg transition-transform transform scale-95 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'Add Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition duration-200 cursor-pointer ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white flex justify-center items-center gap-2`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : task ? (
              'Update'
            ) : (
              'Add'
            )}
          </button>
          {task && (
            <button
              onClick={() => handleDelete(task?._id)}
              className="w-full py-2 rounded-md transition duration-200 cursor-pointer bg-red-500 hover:bg-red-600 text-white flex justify-center items-center gap-2"
            >
              Delete
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  task: PropTypes.object,
};

export default TaskModal;
