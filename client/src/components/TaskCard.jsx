import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const TaskCard = ({ task, onEditTask }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: { task },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-gray-200 dark:bg-gray-700 p-3 px-4 rounded-lg mb-2 cursor-pointer shadow-md"
      onClick={() => onEditTask(task)}
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
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onEditTask: PropTypes.func.isRequired,
};

export default TaskCard;
