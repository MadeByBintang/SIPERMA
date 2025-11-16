import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    LayoutDashboard,
    User,
    Users,
    GitBranch,
    FileText,
    LogOut,
    ClipboardList,
    TrendingUp,
    CheckSquare,
    FileCheck,
    Menu,
    Settings,
    Shield,
} from "lucide-react";
import { Button } from "../Components/ui/button";
import { Avatar, AvatarFallback } from "../Components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../Components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function MainLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth } = usePage().props; // Dapat data user dari Laravel Inertia
    const url = usePage().url;
    const userRole = auth?.user?.role || "student";
    const userName = auth?.user?.name || "User";
    const userId = auth?.user?.id || "-";

    const currentPage = url.split("/").pop() || "dashboard";

    const studentMenuItems = [
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

    const lecturerMenuItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile", label: "Profile", icon: User },
        { href: "/approval", label: "Approval Center", icon: CheckSquare },
        { href: "/matching", label: "Matching", icon: Users },
        { href: "/timeline", label: "Timeline & Progress", icon: TrendingUp },
        { href: "/relations", label: "Relations", icon: GitBranch },
        { href: "/reports", label: "Reports", icon: FileText },
    ];

    const adminMenuItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "User Management", icon: Users },
        { href: "/projects", label: "Project Overview", icon: GitBranch },
        { href: "/relations", label: "Relations Management", icon: GitBranch },
        { href: "/reports", label: "System Reports", icon: FileText },
        { href: "/settings", label: "System Settings", icon: Settings },
        { href: "/profile", label: "Admin Profile", icon: User },
    ];

    const menuItems =
        userRole === "student"
            ? studentMenuItems
            : userRole === "lecturer"
            ? lecturerMenuItems
            : adminMenuItems;

    const SidebarContent = () => (
        <>
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

            {/* Navigation */}
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
                                <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Info */}
            <div className="p-3 md:p-4 border-t border-border">
                <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="w-9 h-9 md:w-10 md:h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            {userId}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <VisuallyHidden.Root>
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>
                            Access all pages and features
                        </SheetDescription>
                    </VisuallyHidden.Root>
                    <div className="flex flex-col h-full bg-card">
                        <SidebarContent />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-14 md:h-16 bg-card border-b border-border px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden p-2"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-foreground capitalize text-lg md:text-2xl">
                                {currentPage.replace("-", " ")}
                            </h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                                {userRole === "student"
                                    ? "Student Portal"
                                    : userRole === "lecturer"
                                    ? "Lecturer Portal"
                                    : "Admin Portal"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        size="sm"
                        className="gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
