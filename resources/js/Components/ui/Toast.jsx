import { useEffect, useState } from "react";
import { X, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function Toast({
    message = "This is a clean & simple message.",
    type = "error",
    duration = 4000,
    onClose,
}) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const step = 100 / (duration / 100);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    queueMicrotask(() => onClose && onClose());
                    return 0;
                }
                return prev - step;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [duration, onClose]);

    const colors = {
        error: {
            bg: "bg-red-100",
            border: "border-red-400",
            text: "text-red-600",
            bar: "bg-red-500",
            icon: <XCircle size={18} className="text-red-600" />,
        },
        success: {
            bg: "bg-green-100",
            border: "border-green-400",
            text: "text-green-600",
            bar: "bg-green-500",
            icon: <CheckCircle size={18} className="text-green-600" />,
        },
        warning: {
            bg: "bg-yellow-100",
            border: "border-yellow-400",
            text: "text-yellow-600",
            bar: "bg-yellow-500",
            icon: <AlertTriangle size={18} className="text-yellow-600" />,
        },
    };

    const style = colors[type] ?? colors.error;

    return (
        <div
            className={`rounded-lg shadow-md border ${style.border} ${style.bg} space-y-2 px-4 py-3 min-w-[300px]`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    {style.icon}
                    <p className={`font-medium text-sm ${style.text}`}>
                        {message}
                    </p>
                </div>

                <button onClick={onClose}>
                    <X size={16} className={style.text} />
                </button>
            </div>

            <div className="w-full h-1 bg-white rounded mt-2 overflow-hidden">
                <div
                    className={`${style.bar} h-full transition-all`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
