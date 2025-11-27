import { Button } from "../Components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { usePage, router } from "@inertiajs/react";

// Tambahan: fungsi normalizeUrl
function normalizeUrl(url) {
    return url.split("?")[0].replace(/\/$/, "");
}

export default function Navbar({ setMobileMenuOpen }) {
    const { auth } = usePage().props;
    const url = usePage().url ?? "";
    const normalizedUrl = normalizeUrl(url); // gunakan normalizeUrl di sini

    const role = auth?.user?.role_name;

    const portalName =
        role === "mahasiswa"
            ? "Student Portal"
            : role === "dosen"
            ? "Lecturer Portal"
            : "Admin Portal";

    const logout = () => router.post("/logout");

    // Semua menu sama seperti Sidebar
    const studentMenu = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile/student", label: "Profile" },
        { href: "/registration", label: "Registration" },
        { href: "/application-status", label: "Application Status" },
        { href: "/matching", label: "Matching" },
        { href: "/timeline", label: "Timeline" },
        { href: "/relations", label: "Relations" },
    ];

    const lecturerMenu = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile/lecturer", label: "Profile" },
        { href: "/approval", label: "Approval" },
        { href: "/matching", label: "Matching" },
        { href: "/timeline", label: "Timeline" },
        { href: "/relations", label: "Relations" },
    ];

    const adminMenu = [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/projects", label: "Projects" },
        { href: "/admin/relations", label: "Relations" },
        { href: "/admin/reports", label: "Reports" },
        { href: "/admin/settings", label: "Settings" },
        { href: "/profile/admin", label: "Profile" },
    ];

    const menuItems =
        role === "mahasiswa"
            ? studentMenu
            : role === "dosen"
            ? lecturerMenu
            : adminMenu;

    // Cari label berdasarkan URL sekarang
    const currentPageItem =
        menuItems.find((item) => url.startsWith(item.href)) || {};
    const currentPage = currentPageItem.label || "Dashboard";

    return (
        <header className="h-14 md:h-16 bg-card border-b border-border px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
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
                        {currentPage}
                    </h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                        {portalName}
                    </p>
                </div>
            </div>

            <Button
                variant="outline"
                onClick={logout}
                size="sm"
                className="gap-2"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
            </Button>
        </header>
    );
}
