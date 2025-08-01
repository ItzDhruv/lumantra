'use client';

import { Comment } from '../app/api';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  comments: Comment[];
  createdAt: string;
  createdBy: string;
}

interface WorkflowListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  loading?: boolean;
  onDelete?: (taskId: string) => void;
}

export default function WorkflowList({ tasks, onTaskClick, loading = false, onDelete }: WorkflowListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    return `${diffDays} days remaining`;
  };

  const handleDelete = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(taskId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Active Workflows</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Active Workflows</h2>
        <div className="text-sm text-gray-600">
          {tasks.length} total tasks
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-6 relative group"
          >
            {onDelete && (
              <button
                onClick={(e) => handleDelete(e, task.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500"
                title="Delete workflow"
              >
                <i className="ri-delete-bin-line w-4 h-4"></i>
              </button>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {task.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {task.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-user-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
                <span className="text-gray-700">{task.assignedTo}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <i className="ri-calendar-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
                <span className="text-gray-700">{formatDate(task.dueDate)}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  getDaysRemaining(task.dueDate).includes('overdue') 
                    ? 'bg-red-100 text-red-600'
                    : getDaysRemaining(task.dueDate).includes('today')
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {getDaysRemaining(task.dueDate)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <i className="ri-chat-1-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
                  <span className="text-gray-600">{task.comments.length} comments</span>
                </div>
                <span className="text-gray-500">by {task.createdBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <i className="ri-task-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4 text-6xl"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-600">Create your first workflow to get started with task management.</p>
        </div>
      )}
    </div>
  );
}