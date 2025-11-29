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

// Tambahan: fungsi normalizeUrl
function normalizeUrl(url) {
    return url.split("?")[0].replace(/\/$/, "");
}

function removeAcademicTitles(name) {
    if (!name) return "";
    // Regex penjelasan:
    // (^(\w+\.\s+)*) -> Menghapus gelar depan (misal: Dr. Ir. )
    // | -> ATAU
    // (,\s*([a-zA-Z\.]+))+$ -> Menghapus gelar belakang setelah koma (misal: , S.Kom, M.T)
    return name.replace(/(^(\w+\.\s+)*)|(,\s*([a-zA-Z\.]+))+$/g, "").trim();
}

export default function Sidebar({ setMobileMenuOpen }) {
    const { auth } = usePage().props;
    const url = usePage().url ?? "";
    const normalizedUrl = normalizeUrl(url); // gunakan normalizeUrl di sini

    const userRole = auth?.user?.role_name || "student";
    const full_name = auth?.user?.profile?.full_name || "fulan";
    const id_number = auth?.user?.profile?.id_number || "67";

    const initial_name =  removeAcademicTitles(full_name)

    const studentMenu = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile/student", label: "Profile", icon: User },
        { href: "/registration", label: "Registration", icon: ClipboardList },
        {
            href: "/application-status",
            label: "Application Status",
            icon: FileCheck,
        },
        { href: "/matching", label: "Matching", icon: Users },
        { href: "/timeline", label: "Timeline & Progress", icon: TrendingUp },
        { href: "/relations", label: "Relations", icon: GitBranch },
    ];

    const lecturerMenu = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile/lecturer", label: "Profile", icon: User },
        { href: "/approval", label: "Approval Center", icon: CheckSquare },
        { href: "/matching", label: "Matching", icon: Users },
        { href: "/timeline", label: "Timeline & Progress", icon: TrendingUp },
        { href: "/relations", label: "Relations", icon: GitBranch },
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
        { href: "/profile/admin", label: "Admin Profile", icon: User },
    ];

    const menuItems =
        userRole === "mahasiswa"
            ? studentMenu
            : userRole === "dosen"
            ? lecturerMenu
            : adminMenu;

    return (
        <div className="flex flex-col h-full bg-card border-r border-border w-64">
            {/* Logo Section */}
            <div className="p-4 md:p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white">S</span>
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
            <nav className="flex-1 p-3 md:p-4 overflow-y-auto">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User */}
            <div className="p-3 md:p-4 border-t border-border">
                <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="w-9 h-9 md:w-10 md:h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {initial_name
                                .split(" ")
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            {id_number}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
