import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Username validation (NIM/NIP)
        if (!data.username) {
            newErrors.username = "Username is required";
        } else if (data.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        // Password validation
        if (!data.password) {
            newErrors.password = "Password is required";
        } else if (data.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (data.password.length > 15) {
            newErrors.password = "Password must not exceed 15 characters";
        }

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate before submit
        if (!validateForm()) {
            return;
        }

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login | SIPERMA" />

            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
                            <span className="text-white text-2xl">S</span>
                        </div>
                        <CardTitle>SIPERMA</CardTitle>
                        <CardDescription>
                            Sistem Pemetaan Relasi Mahasiswa dan Dosen
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">NIM / NIP</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    placeholder="Enter your NIM or NIP"
                                    onChange={(e) => {
                                        setData("username", e.target.value);
                                        // Clear local error when user types
                                        if (localErrors.username) {
                                            setLocalErrors((prev) => ({
                                                ...prev,
                                                username: null,
                                            }));
                                        }
                                    }}
                                    className={
                                        localErrors.username || errors.username
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {localErrors.username && (
                                    <div className="flex items-center gap-1 text-xs text-red-600">
                                        <AlertCircle className="w-3 h-3" />
                                        {localErrors.username}
                                    </div>
                                )}
                                {!localErrors.username && errors.username && (
                                    <div className="flex items-center gap-1 text-xs text-red-600">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.username}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        placeholder="Enter your password"
                                        onChange={(e) => {
                                            setData("password", e.target.value);
                                            // Clear local error when user types
                                            if (localErrors.password) {
                                                setLocalErrors((prev) => ({
                                                    ...prev,
                                                    password: null,
                                                }));
                                            }
                                        }}
                                        className={
                                            localErrors.password ||
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {localErrors.password && (
                                    <div className="flex items-center gap-1 text-xs text-red-600">
                                        <AlertCircle className="w-3 h-3" />
                                        {localErrors.password}
                                    </div>
                                )}
                                {!localErrors.password && errors.password && (
                                    <div className="flex items-center gap-1 text-xs text-red-600">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.password}
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Password must be 8-15 characters
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
