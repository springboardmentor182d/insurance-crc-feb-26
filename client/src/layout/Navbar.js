import { User, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Navbar({
    setSidebarOpen,
    onLogout,
    title,
    userName = 'John Doe',
    isAdmin = false,
}) {
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between">

                {/* Left side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div>
                        {title && (
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                {title}
                            </h2>
                        )}

                        {isAdmin && (
                            <p className="text-sm text-gray-600 mt-1">
                                Organization ID: ORG-12345
                            </p>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate(isAdmin ? '/settings' : '/settings')}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 hidden md:inline">
                            {userName}
                        </span>
                    </button>

                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                    >
                        <span className="hidden md:inline">Logout</span>
                        <LogOut className="w-5 h-5 md:hidden" />
                    </button>

                </div>
            </div>
        </header>
    );
}