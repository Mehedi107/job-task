import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const DroppableColumn = ({ category, tasks = [], onEditTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg shadow-md transition-colors ${
        isOver ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'
      }`}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {category}
      </h2>
      <div className="min-h-[150px] border border-dashed border-gray-300 dark:border-gray-600 p-2 rounded-lg">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={task._id} task={task} onEditTask={onEditTask} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
};

export default DroppableColumn;
