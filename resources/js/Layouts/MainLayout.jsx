// resources/js/Layouts/MainLayout.jsx
import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from "../Components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col">
                <Sidebar setMobileMenuOpen={setMobileMenuOpen} />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <VisuallyHidden.Root>
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>
                            Access all pages and features
                        </SheetDescription>{" "}
                    </VisuallyHidden.Root>
                    <div className="flex flex-col h-full bg-card">
                        <Sidebar setMobileMenuOpen={setMobileMenuOpen} />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar setMobileMenuOpen={setMobileMenuOpen} />

                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
