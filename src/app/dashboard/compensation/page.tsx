"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function CompensationPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold">Compensation & Benefits</h1>
        <p className="text-muted-foreground">Manage salary structures and benefits</p>

        <div className="mt-6 p-8 border-2 border-dashed border-muted rounded-lg text-center">
          <p className="text-lg font-medium">Compensation Management</p>
          <p className="text-muted-foreground">Feature under development</p>
        </div>
      </div>
    </DashboardLayout>
  );
}