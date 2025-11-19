// resources/js/Layouts/Sidebar.jsx
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    User,
    Users,
    GitBranch,
    FileText,
    ClipboardList,
    TrendingUp,
    CheckSquare,
    FileCheck,
    Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../Components/ui/avatar";

export default function Sidebar({ setMobileMenuOpen }) {
    const { auth } = usePage().props;
    const url = usePage().url ?? "";

    const userRole = auth?.user?.role_name || "student";
    const userName = auth?.user?.name || "User";
    const userId = auth?.user?.id || "-";

    const studentMenu = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile", label: "Profile", icon: User },
        { href: "/registration", label: "Registration", icon: ClipboardList },
        {
            href: "/application-status",
            label: "Application Status",
            icon: FileCheck,
        },
        { href: "/matching", label: "Matching", icon: Users },
        { href: "/timeline", label: "Timeline & Progress", icon: TrendingUp },
        { href: "/relations", label: "Relations", icon: GitBranch },
        { href: "/reports", label: "Reports", icon: FileText },
    ];

    const lecturerMenu = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile", label: "Profile", icon: User },
        { href: "/approval", label: "Approval Center", icon: CheckSquare },
        { href: "/matching", label: "Matching", icon: Users },
        { href: "/timeline", label: "Timeline & Progress", icon: TrendingUp },
        { href: "/relations", label: "Relations", icon: GitBranch },
        { href: "/reports", label: "Reports", icon: FileText },
    ];

    const adminMenu = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/users", label: "User Management", icon: Users },
        { href: "/admin/projects", label: "Project Overview", icon: GitBranch },
        {
            href: "/admin/relations",
            label: "Relations Management",
            icon: GitBranch,
        },
        { href: "/admin/reports", label: "System Reports", icon: FileText },
        { href: "/admin/settings", label: "System Settings", icon: Settings },
        { href: "/profile", label: "Admin Profile", icon: User },
    ];

    const menuItems =
        userRole === "mahasiswa"
            ? studentMenu
            : userRole === "dosen"
            ? lecturerMenu
            : adminMenu;

    return (
        <div className="flex flex-col h-full bg-card border-r border-border w-64">
            {/* Logo */}
            <div className="p-5 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">S</span>
                    </div>
                    <div>
                        <h2 className="text-foreground">SIPERMA</h2>
                        <p className="text-xs text-muted-foreground">
                            Academic System
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-3 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = url.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm">{userName}</p>
                        <p className="text-xs text-muted-foreground">
                            {userId}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
