// resources/js/Layouts/MainLayout.jsx
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from "../Components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Toast from "../Components/ui/Toast";

export default function MainLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { flash } = usePage().props;
    const [localFlash, setLocalFlash] = useState(flash);

    useEffect(() => {
        setLocalFlash(flash);
    }, [flash]);



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

            {/* FLASH TOASTS */}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {localFlash?.error && (
                    <Toast
                        type="error"
                        message={localFlash.error}
                        onClose={() =>
                            setLocalFlash({ ...localFlash, error: null })
                        }
                    />
                )}

                {localFlash?.success && (
                    <Toast
                        type="success"
                        message={localFlash.success}
                        onClose={() =>
                            setLocalFlash({ ...localFlash, success: null })
                        }
                    />
                )}

                {localFlash?.warning && (
                    <Toast
                        type="warning"
                        message={localFlash.warning}
                        onClose={() =>
                            setLocalFlash({ ...localFlash, warning: null })
                        }
                    />
                )}
            </div>
        </div>
    );
}
