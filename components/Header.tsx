'use client';

interface HeaderProps {
  onCreateClick: () => void;
}

export default function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-['Pacifico'] text-blue-600">Lumantra</h1>
            <span className="ml-4 text-gray-600 text-lg">Workflow Management</span>
          </div>
          
          <button
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-add-line w-5 h-5 flex items-center justify-center"></i>
            Create Workflow
          </button>
        </div>
      </div>
    </header>
  );
}