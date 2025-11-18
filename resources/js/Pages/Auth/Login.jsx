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

export default function LoginPage({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

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
                                    placeholder="Masukkan NIM atau NIP"
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    required
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-600">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    placeholder="Masukkan password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
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
