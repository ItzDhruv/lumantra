'use client';

interface HeaderProps {
  onCreateClick: () => void;
  loggedInUser: string;
  onLogout: () => void;
}

export default function Header({ onCreateClick, loggedInUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-['Pacifico'] text-blue-600">Lumantra</h1>
            <span className="ml-4 text-gray-600 text-lg">Workflow Management</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">{loggedInUser}</span>
            <button
              onClick={onCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Create Workflow
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
