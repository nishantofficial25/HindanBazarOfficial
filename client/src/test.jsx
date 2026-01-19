import React, { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";

export default function AadhaarAuthScreen() {
  const [showError, setShowError] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white font-sans">
      {/* Header */}
      <div className="flex items-center p-4 pb-6">
        <ChevronLeft className="w-8 h-8 mr-3" />
        <h1 className="text-2xl font-light tracking-wide">
          Application Details
        </h1>
      </div>

      {/* Steps Navigation */}
      <div className="bg-gray-100 px-4 py-3 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-900 text-white flex items-center justify-center font-medium">
            5
          </div>
          <span className="text-gray-900 font-medium">
            Aadhaar Auth Verification
          </span>
          <div className="w-24 h-0.5 bg-red-900 ml-2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-medium">
            6
          </div>
          <span className="text-gray-600">Upload Document</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-gray-100 rounded-lg p-6 text-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Aadhar Authentication</h2>

          <div className="flex items-start gap-4 mb-8">
            <span className="text-gray-700 font-medium">
              Face Authentication Status:
            </span>
            <span className="text-red-600 font-semibold">Pending</span>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-700 text-base">
              I consent to the use of my Aadhar
            </p>
          </div>

          {/* Aadhaar Face Authentication Button */}
          <button className="w-full bg-red-900 text-white py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-medium opacity-90 mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Aadhaar Face Authentication
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex gap-3">
        <button className="flex-1 bg-transparent border-2 border-gray-400 text-gray-600 py-3 rounded-lg text-lg font-medium">
          Previous
        </button>
        <button className="flex-1 bg-red-900 text-white py-3 rounded-lg text-lg font-medium">
          Save & Next
        </button>
      </div>

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center">
                  <Info className="w-8 h-8 text-red-500" strokeWidth={3} />
                </div>
              </div>

              <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                Error
              </h3>
              <p className="text-gray-600 text-lg mb-8 text-center">
                Something went wrong
              </p>

              <button
                onClick={() => setShowError(false)}
                className="w-full bg-red-900 text-white py-4 rounded-lg text-lg font-semibold hover:bg-red-800 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Indicator */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-white"></div>
    </div>
  );
}
