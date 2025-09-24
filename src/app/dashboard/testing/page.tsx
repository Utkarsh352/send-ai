"use client";

import { TestingPanel } from "@/components/dashboard/TestingPanel";

export default function TestingPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Nitrolite Testing</h1>
                <p className="text-muted-foreground">
                    Test and debug the Nitrolite protocol integration in the sandbox environment.
                </p>
            </div>

            <TestingPanel />
        </div>
    );
}