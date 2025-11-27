"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "./Utils";
import { buttonVariants } from "./Button";

// ROOT
function AlertDialog(props) {
    return <AlertDialogPrimitive.Root {...props} />;
}

// TRIGGER (needs forwardRef)
const AlertDialogTrigger = React.forwardRef(function AlertDialogTrigger(
    { className, ...props },
    ref
) {
    return (
        <AlertDialogPrimitive.Trigger
            ref={ref}
            className={className}
            {...props}
        />
    );
});

// PORTAL
function AlertDialogPortal(props) {
    return <AlertDialogPrimitive.Portal {...props} />;
}

// OVERLAY (needs forwardRef)
const AlertDialogOverlay = React.forwardRef(function AlertDialogOverlay(
    { className, ...props },
    ref
) {
    return (
        <AlertDialogPrimitive.Overlay
            ref={ref}
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-50 bg-black/50",
                className
            )}
            {...props}
        />
    );
});

// CONTENT (needs forwardRef)
const AlertDialogContent = React.forwardRef(function AlertDialogContent(
    { className, ...props },
    ref
) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                ref={ref}
                className={cn(
                    "bg-background data-[state=open]:animate-in fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg",
                    className
                )}
                {...props}
            />
        </AlertDialogPortal>
    );
});

// HEADER
function AlertDialogHeader({ className, ...props }) {
    return (
        <div
            className={cn("flex flex-col gap-2 text-center", className)}
            {...props}
        />
    );
}

// FOOTER
function AlertDialogFooter({ className, ...props }) {
    return (
        <div
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className
            )}
            {...props}
        />
    );
}

// TITLE (needs forwardRef)
const AlertDialogTitle = React.forwardRef(function AlertDialogTitle(
    { className, ...props },
    ref
) {
    return (
        <AlertDialogPrimitive.Title
            ref={ref}
            className={cn("text-lg font-semibold", className)}
            {...props}
        />
    );
});

// DESCRIPTION (needs forwardRef)
const AlertDialogDescription = React.forwardRef(function AlertDialogDescription(
    { className, ...props },
    ref
) {
    return (
        <AlertDialogPrimitive.Description
            ref={ref}
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
});

// ACTION (needs forwardRef)
const AlertDialogAction = React.forwardRef(function AlertDialogAction(
    { className, ...props },
    ref
) {
    return (
        <AlertDialogPrimitive.Action
            ref={ref}
            className={cn(buttonVariants(), className)}
            {...props}
        />
    );
});

// CANCEL (needs forwardRef)
const AlertDialogCancel = React.forwardRef(function AlertDialogCancel(
    { className, ...props },
    ref
) {
    return (
        <AlertDialogPrimitive.Cancel
            ref={ref}
            className={cn(buttonVariants({ variant: "outline" }), className)}
            {...props}
        />
    );
});

export {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
    