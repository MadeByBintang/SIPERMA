// resources/js/Layouts/Navbar.jsx
import { Button } from "../Components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { usePage, router } from "@inertiajs/react";

export default function Navbar({ setMobileMenuOpen }) {
    const { auth } = usePage().props;
    const url = usePage().url ?? "";

    const currentPage = url.split("/").pop() || "dashboard";
    const role = auth?.user?.role_name;

    const portalName =
        role === "mahasiswa"
            ? "Student Portal"
            : role === "dosen"
            ? "Lecturer Portal"
            : "Admin Portal";

    const logout = () => router.post("/logout");

    return (
        <header className="fixed top-0 left-64 right-0 z-50 h-14 md:h-16 bg-card border-b border-border px-4 md:px-8 flex items-center justify-between">
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
                    <h1 className="text-lg md:text-2xl capitalize">
                        {currentPage.replace("-", " ")}
                    </h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                        {portalName}
                    </p>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
            </Button>
        </header>
    );
}
