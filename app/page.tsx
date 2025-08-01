'use client';

import { useState, useEffect } from 'react';
import SignIn from './SignIn';
import Header from '../components/Header';
import WorkflowList from '../components/WorkflowList';
import CreateWorkflowModal from '../components/CreateWorkflowModal';
import WorkflowDetail from '../components/WorkflowDetail';
import { workflowAPI, Workflow, Comment } from './api';

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

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) setLoggedInUser(user);
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      fetchWorkflows();
    }
  }, [loggedInUser]);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const workflows = await workflowAPI.getWorkflows();
      const mappedTasks: Task[] = workflows.map(workflow => ({
        id: workflow._id || '',
        title: workflow.title,
        description: workflow.description || '',
        dueDate: workflow.dueDate,
        assignedTo: workflow.assignedTo,
        priority: workflow.priority,
        status: 'Pending' as const, // Default status since backend doesn't have status field
        comments: workflow.comments || [],
        createdAt: workflow.createdAt || new Date().toISOString(),
        createdBy: loggedInUser || 'Unknown'
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError('Failed to load workflows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    setTasks([]);
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'comments' | 'createdAt' | 'createdBy' | 'status'>) => {
    try {
      const newWorkflow = await workflowAPI.createWorkflow({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        assignedTo: taskData.assignedTo,
        priority: taskData.priority
      });

      const newTask: Task = {
        id: newWorkflow._id || '',
        title: newWorkflow.title,
        description: newWorkflow.description || '',
        dueDate: newWorkflow.dueDate,
        assignedTo: newWorkflow.assignedTo,
        priority: newWorkflow.priority,
        status: 'Pending',
        comments: newWorkflow.comments || [],
        createdAt: newWorkflow.createdAt || new Date().toISOString(),
        createdBy: loggedInUser!
      };

      setTasks([...tasks, newTask]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating workflow:', err);
      alert('Failed to create workflow. Please try again.');
    }
  };

  const handleAddComment = async (taskId: string, comment: string) => {
    try {
      const updatedWorkflow = await workflowAPI.addComment(taskId, {
        author: loggedInUser!,
        text: comment
      });

      const newComment: Comment = {
        _id: updatedWorkflow.comments?.[updatedWorkflow.comments.length - 1]?._id,
        author: loggedInUser!,
        text: comment,
        createdAt: new Date().toISOString()
      };

      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      ));

      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, comments: [...selectedTask.comments, newComment] });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    ));
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }
  };

  const handleDeleteWorkflow = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      await workflowAPI.deleteWorkflow(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error deleting workflow:', err);
      alert('Failed to delete workflow. Please try again.');
    }
  };

  if (!loggedInUser) {
    return <SignIn onLogin={setLoggedInUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateClick={() => setShowCreateModal(true)}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {loading && tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading workflows...</p>
          </div>
        ) : selectedTask ? (
          <WorkflowDetail
            task={selectedTask}
            onBack={() => setSelectedTask(null)}
            onAddComment={handleAddComment}
            onUpdateStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteWorkflow}
          />
        ) : (
          <WorkflowList 
            tasks={tasks} 
            onTaskClick={setSelectedTask}
            loading={loading}
            onDelete={handleDeleteWorkflow}
          />
        )}
      </main>
      {showCreateModal && (
        <CreateWorkflowModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateTask} />
      )}
    </div>
  );
}
