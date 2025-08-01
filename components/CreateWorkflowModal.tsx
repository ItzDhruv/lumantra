'use client';

import { useState } from 'react';

interface Task {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface CreateWorkflowModalProps {
  onClose: () => void;
  onSubmit: (task: Task) => void;
}

export default function CreateWorkflowModal({ onClose, onSubmit }: CreateWorkflowModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamMembers = [
    'Deepali murale',
    'Ojaswi',
    'Dhruv Dobariya'
  ];

  const priorities = ['High', 'Medium', 'Low'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.dueDate && formData.assignedTo) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        onClose();
      } catch (error) {
        console.error('Error creating workflow:', error);
        // Error handling is done in the parent component
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Workflow</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              disabled={isSubmitting}
            >
              <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe the task details..."
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left cursor-pointer disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {formData.assignedTo || 'Select team member'}
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center"></i>
                </button>
                
                {showAssigneeDropdown && !isSubmitting && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {teamMembers.map((member) => (
                      <button
                        key={member}
                        type="button"
                        onClick={() => {
                          handleInputChange('assignedTo', member);
                          setShowAssigneeDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer"
                      >
                        {member}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left cursor-pointer disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {formData.priority}
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center"></i>
                </button>
                
                {showPriorityDropdown && !isSubmitting && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {priorities.map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => {
                          handleInputChange('priority', priority as 'High' | 'Medium' | 'Low');
                          setShowPriorityDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer"
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Workflow'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}