import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileSearch,
    Scale,
    Sparkles,
    FileText,
    AlertCircle,
    PlusCircle,
    User,
    LogOut,
    Users,
    BarChart3,
    Settings,
    ShieldAlert,
    ScrollText,
    X,
} from 'lucide-react';

export function Sidebar({ sidebarOpen, setSidebarOpen, userType = 'user' }) {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ auto detect active route

    const userMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/user-dashboard' },
        { icon: FileSearch, label: 'Browse Policies', path: '/browse-policies' },
        { icon: Scale, label: 'Compare Policies', path: '/compare-policies' },
        { icon: Sparkles, label: 'Recommendations', path: '/recommendations' },
        { icon: FileText, label: 'My Policies', path: '/my-policies' },
        { icon: AlertCircle, label: 'Claims', path: '/claims' },
        { icon: PlusCircle, label: 'Add Policy Manually', path: '/add-policy' },
        { icon: User, label: 'Profile', path: '/settings' },
    ];

    const adminMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
        { icon: Users, label: 'Manage Users', path: '/manage-users' },
        { icon: FileText, label: 'Manage Policies', path: '/manage-policies' },
        { icon: AlertCircle, label: 'Claims Management', path: '/claims-management' },
        { icon: ShieldAlert, label: 'Fraud Detection', path: '/fraud-detection' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: PlusCircle, label: 'Add Policy Manually', path: '/add-policy' },
        { icon: ScrollText, label: 'Admin Logs', path: '/admin-logs' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const menuItems = userType === 'admin' ? adminMenuItems : userMenuItems;

    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        navigate('/login');
        setSidebarOpen(false);
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 transition-transform duration-300
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        >
            <div className="p-6 h-full flex flex-col">

                {/* Mobile Close */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* ================= LOGO ================= */}
                <div className="flex items-center gap-3 mb-10">
                    <img
                        src="/logo.svg"
                        alt="InsureLogic Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        {userType === 'admin' ? 'Admin Panel' : 'InsureLogic'}
                    </h1>
                </div>

                {/* ================= MENU ================= */}
                <nav className="flex-1 space-y-2">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={index}
                                onClick={() => handleNavigation(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'
                                        }`}
                                />
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* ================= LOGOUT ================= */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}