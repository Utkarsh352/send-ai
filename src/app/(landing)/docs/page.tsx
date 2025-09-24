import HeaderWrapper from '@/components/landing/HeaderWrapper';
import React from 'react';

const Page = () => {
  return (
    <div>
      <HeaderWrapper />
      <div className="container p-6 max-w-3xl mx-auto h-screen">
      <h1 className="text-3xl font-bold mb-4">Documentation</h1>
      <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Send-AI: Smart Payroll Management Platform</h2>

      <section className="mb-6 mt-8">
        <p className="mt-2">An AI-powered payroll management system that automates employee payments, compliance reporting, and compensation management with intelligent workflow optimization.</p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold">Key Features</h3>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li><strong>Automated Payroll Processing:</strong> Streamline employee salary payments with automated tax calculations, deductions, and compliance reporting.</li>
          <li><strong>Employee Self-Service Portal:</strong> Comprehensive portal for employees to access pay stubs, manage benefits, and track compensation history.</li>
          <li><strong>Compliance & Reporting:</strong> Automated tax filings, labor law compliance monitoring, and detailed analytics for informed decision-making.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold">Supported Integrations</h3>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li><strong>Banking & Payment Systems:</strong> Direct integration with major banks and payment processors for seamless salary transfers</li>
          <li><strong>HR Management Systems:</strong> Compatible with popular HRMS platforms like BambooHR, Workday, and ADP</li>
          <li><strong>Accounting Software:</strong> Seamless integration with QuickBooks, Xero, and other accounting platforms</li>
          <li><strong>Government Compliance:</strong> Automated reporting to IRS, state tax agencies, and labor departments</li>
        </ul>
      </section>
      </div>
    </div>
  );
};

export default Page;
