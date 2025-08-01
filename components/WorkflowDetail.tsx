'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

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

interface WorkflowDetailProps {
  task: Task;
  onBack: () => void;
  onAddComment: (taskId: string, comment: string) => void;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
}

export default function WorkflowDetail({ task, onBack, onAddComment, onUpdateStatus }: WorkflowDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(task.id, newComment.trim());
      setNewComment('');
    }
  };

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
          Back to Workflows
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority} Priority
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer flex items-center gap-1 ${getStatusColor(task.status)}`}
                >
                  {task.status}
                  <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center"></i>
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateStatus(task.id, status as Task['status']);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500">Created by {task.createdBy}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>
          
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">{task.description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <i className="ri-user-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
                <div>
                  <span className="text-sm text-gray-500">Assigned to</span>
                  <p className="font-medium text-gray-900">{task.assignedTo}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <i className="ri-calendar-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
                <div>
                  <span className="text-sm text-gray-500">Due Date</span>
                  <p className="font-medium text-gray-900">{formatDate(task.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Comments ({task.comments.length})</h3>
            
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line w-5 h-5 flex items-center justify-center text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{newComment.length}/500 characters</span>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {task.comments.length === 0 ? (
                <div className="text-center py-8">
                  <i className="ri-chat-1-line w-12 h-12 flex items-center justify-center text-gray-300 mx-auto mb-3 text-4xl"></i>
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                task.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-user-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}