import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasksRedux } from '../../../hooks/useTaskRedux';
import { TASK_STATUS } from '../../../constants/taskConstants';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import { getStatusColorClass } from '../../../utils/taskUtils';

const TaskStatCard = ({ title, count, color, icon, linkTo }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className={`rounded-full p-2 ${color}`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-4">{count}</div>
      <Link 
        to={linkTo} 
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View All →
      </Link>
    </div>
  );
};

const Home = () => {
  const { getTasks, tasks, isLoading } = useTasksRedux();
  const [taskStats, setTaskStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });
  
  useEffect(() => {
    // Get all tasks without pagination for statistics
    getTasks({ per_page: 100 });
  }, [getTasks]);
  
  useEffect(() => {
    if (tasks.length > 0) {
      // Calculate task statistics
      const stats = tasks.reduce((acc, task) => {
        acc.total++;
        
        // Count by status
        if (task.status === TASK_STATUS.TODO) acc.todo++;
        if (task.status === TASK_STATUS.IN_PROGRESS) acc.inProgress++;
        if (task.status === TASK_STATUS.DONE) acc.done++;
        
        // Count overdue tasks
        const dueDate = new Date(task.due_date);
        const today = new Date();
        if (
          task.due_date && 
          dueDate < today && 
          task.status !== TASK_STATUS.DONE
        ) {
          acc.overdue++;
        }
        
        return acc;
      }, { total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });
      
      setTaskStats(stats);
    }
  }, [tasks]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/tasks">
          <Button variant="primary">Manage Tasks</Button>
        </Link>
      </div>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <TaskStatCard
          title="Total Tasks"
          count={taskStats.total}
          color="bg-gray-100"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          linkTo="/tasks"
        />
        
        <TaskStatCard
          title="To Do"
          count={taskStats.todo}
          color="bg-yellow-100"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          linkTo="/tasks?status=To%20Do"
        />
        
        <TaskStatCard
          title="In Progress"
          count={taskStats.inProgress}
          color="bg-blue-100"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
          linkTo="/tasks?status=In%20Progress"
        />
        
        <TaskStatCard
          title="Completed"
          count={taskStats.done}
          color="bg-green-100"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          linkTo="/tasks?status=Done"
        />
      </div>
      
      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No tasks found. Create your first task to get started!</p>
              <Link to="/tasks">
                <Button variant="primary">Create Task</Button>
              </Link>
            </div>
          ) : (
            tasks.slice(0, 5).map(task => (
              <div key={task.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium text-gray-900">{task.name}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{task.description}</p>
                  )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(task.status)}`}>
                  {task.status}
                </span>
              </div>
            ))
          )}
        </div>
        
        {tasks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Link 
              to="/tasks" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Tasks →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;