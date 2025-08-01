'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import WorkflowList from '../components/WorkflowList';
import CreateWorkflowModal from '../components/CreateWorkflowModal';
import WorkflowDetail from '../components/WorkflowDetail';

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

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Q4 Marketing Campaign Review',
        description: 'Review and finalize the Q4 marketing campaign materials including social media content, email templates, and advertising creatives.',
        dueDate: '2024-02-15',
        assignedTo: 'Sarah Johnson',
        priority: 'High',
        status: 'In Progress',
        comments: [
          {
            id: '1',
            author: 'Mike Davis',
            content: 'The creative assets look great! Just need to adjust the call-to-action button colors.',
            timestamp: '2024-01-10T10:30:00Z'
          }
        ],
        createdAt: '2024-01-08T09:00:00Z',
        createdBy: 'Boss'
      },
      {
        id: '2',
        title: 'Client Presentation Preparation',
        description: 'Prepare comprehensive presentation for the upcoming client meeting including project timeline, deliverables, and budget breakdown.',
        dueDate: '2024-02-20',
        assignedTo: 'David Chen',
        priority: 'Medium',
        status: 'Pending',
        comments: [],
        createdAt: '2024-01-09T14:00:00Z',
        createdBy: 'Boss'
      },
      {
        id: '3',
        title: 'Website Performance Optimization',
        description: 'Analyze and optimize website loading speed, implement caching strategies, and improve overall user experience metrics.',
        dueDate: '2024-02-10',
        assignedTo: 'Alex Rodriguez',
        priority: 'High',
        status: 'Completed',
        comments: [
          {
            id: '2',
            author: 'Alex Rodriguez',
            content: 'Completed the initial optimization. Page load time improved by 40%.',
            timestamp: '2024-01-11T16:45:00Z'
          }
        ],
        createdAt: '2024-01-05T11:30:00Z',
        createdBy: 'Boss'
      }
    ];
    setTasks(mockTasks);
  }, []);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'comments' | 'createdAt' | 'createdBy' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      comments: [],
      createdAt: new Date().toISOString(),
      createdBy: 'Boss',
      status: 'Pending'
    };
    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
  };

  const handleAddComment = (taskId: string, comment: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: comment,
      timestamp: new Date().toISOString()
    };

    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...task.comments, newComment] }
        : task
    ));

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        comments: [...selectedTask.comments, newComment]
      });
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus }
        : task
    ));

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        status: newStatus
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateClick={() => setShowCreateModal(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTask ? (
          <WorkflowDetail
            task={selectedTask}
            onBack={() => setSelectedTask(null)}
            onAddComment={handleAddComment}
            onUpdateStatus={handleUpdateTaskStatus}
          />
        ) : (
          <WorkflowList
            tasks={tasks}
            onTaskClick={setSelectedTask}
          />
        )}
      </main>

      {showCreateModal && (
        <CreateWorkflowModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}