// resources/js/Layouts/MainLayout.jsx
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Sheet, SheetContent } from "../Components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r bg-card">
                <Sidebar setMobileMenuOpen={setMobileMenuOpen} />
            </aside>

            {/* Mobile Sidebar */}
            <div className="lg:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetContent side="left" className="p-0 w-64">
                        <VisuallyHidden.Root>
                            <span>Menu</span>
                        </VisuallyHidden.Root>
                        <Sidebar setMobileMenuOpen={setMobileMenuOpen} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col ml-64">
                <Navbar setMobileMenuOpen={setMobileMenuOpen} />

                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 mt-14 md:mt-16">
                    {children}
                </main>
            </div>
        </div>
    );
}
