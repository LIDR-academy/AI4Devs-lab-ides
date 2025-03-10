import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-2 py-1"
          aria-label="Back to home page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-700">
          <section aria-labelledby="introduction-heading">
            <h2
              id="introduction-heading"
              className="text-xl font-semibold mb-2"
            >
              1. Introduction
            </h2>
            <p>
              This Privacy Policy explains how LTI Applicant Tracking System
              collects, uses, and protects your personal information when you
              use our service. We are committed to ensuring the privacy and
              security of your data in compliance with applicable data
              protection laws, including the General Data Protection Regulation
              (GDPR).
            </p>
          </section>

          <section aria-labelledby="information-heading">
            <h2 id="information-heading" className="text-xl font-semibold mb-2">
              2. Information We Collect
            </h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                Personal identification information (name, email address, phone
                number)
              </li>
              <li>Professional information (education, work experience)</li>
              <li>Documents you provide (CV/resume)</li>
              <li>Usage data and system logs</li>
            </ul>
          </section>

          <section aria-labelledby="usage-heading">
            <h2 id="usage-heading" className="text-xl font-semibold mb-2">
              3. How We Use Your Information
            </h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>To process your job application</li>
              <li>To communicate with you regarding your application</li>
              <li>To improve our recruitment processes</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section aria-labelledby="security-heading">
            <h2 id="security-heading" className="text-xl font-semibold mb-2">
              4. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Encryption of sensitive data</li>
              <li>Secure file storage for uploaded documents</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments</li>
            </ul>
          </section>

          <section aria-labelledby="retention-heading">
            <h2 id="retention-heading" className="text-xl font-semibold mb-2">
              5. Data Retention
            </h2>
            <p>
              We retain your personal data for as long as necessary to fulfill
              the purposes for which it was collected, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements. Typically, we retain application data for up to 2
              years after the conclusion of the recruitment process.
            </p>
          </section>

          <section aria-labelledby="rights-heading">
            <h2 id="rights-heading" className="text-xl font-semibold mb-2">
              6. Your Rights
            </h2>
            <p>
              Under the GDPR and other applicable data protection laws, you have
              the following rights:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:privacy@lti-ats.com"
                className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
              >
                privacy@lti-ats.com
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="changes-heading">
            <h2 id="changes-heading" className="text-xl font-semibold mb-2">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date.
            </p>
          </section>

          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-xl font-semibold mb-2">
              8. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
              <a
                href="mailto:privacy@lti-ats.com"
                className="text-blue-600 hover:text-blue-800 underline ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
              >
                privacy@lti-ats.com
              </a>
            </p>
          </section>

          <div className="text-sm text-gray-500 mt-8">
            Last Updated: March 8, 2025
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
