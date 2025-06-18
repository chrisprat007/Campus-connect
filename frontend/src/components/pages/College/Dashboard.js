import React, { useEffect, useState } from "react";
import Analytics from "../Department/Analytics";
import api from "../../../utils/api";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Dashboard() {
  const cityId = sessionStorage.getItem("cityId");

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-600">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage cities, departments, and insights.</p>
        </header>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salary Analytics</h2>
          <Analytics id={cityId} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Features</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Real-time Communication", icon: "💬" },
              { title: "Conflict Resolution", icon: "⚖️" },
              { title: "Project Calendar", icon: "📅" },
              { title: "AI-driven Insights", icon: "🤖" },
              { title: "Video Conferencing", icon: "🎥" },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">{f.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}