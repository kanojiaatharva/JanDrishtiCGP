import React from 'react';

export default function OfficerDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">
            JD
          </div>
          <span className="text-xl font-semibold tracking-tight">JanDrishti</span>
          <span className="ml-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Officer Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Indore District</div>
          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">District Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Review AI-prioritized demand hotspots and community issues.</p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Hotspots</div>
            <div className="mt-2 text-3xl font-bold text-red-600">12</div>
            <div className="mt-1 flex items-center text-sm text-zinc-500">
              <span className="text-red-500 mr-1">↑ 2</span> from last week
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Reports (30d)</div>
            <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">8,439</div>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Reviews</div>
            <div className="mt-2 text-3xl font-bold text-amber-500">5</div>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Resolution Rate</div>
            <div className="mt-2 text-3xl font-bold text-green-600">68%</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Hotspot List / Map Placeholder */}
          <div className="col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Priority Hotspots</h2>
            
            {/* Map Placeholder */}
            <div className="h-64 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
              {/* Fake Map Grid Background */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-2xl mb-2">🗺️</span>
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Geographic Demand Map</span>
                <span className="text-xs text-zinc-400 mt-1">Map integration placeholder</span>
              </div>
            </div>

            {/* Hotspot List */}
            <div className="flex flex-col gap-3">
              {/* Active Hotspot Item */}
              <div className="group flex cursor-pointer items-start justify-between rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20 p-4 transition-all hover:border-red-300 dark:hover:border-red-800">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/50 dark:text-red-300">PRIORITY 92</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Ward 14</span>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Drinking Water Access</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">1,284 reports • +38% this month</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-black border border-red-100 dark:border-red-900/50 shadow-sm transition-transform group-hover:scale-105">
                  <span className="text-red-600">→</span>
                </div>
              </div>
              
              <div className="group flex cursor-pointer items-start justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">PRIORITY 75</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Ward 7</span>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Road Condition (Potholes)</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">421 reports • +12% this month</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm transition-transform group-hover:scale-105">
                  <span className="text-zinc-600 dark:text-zinc-400">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation Panel */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Review Recommendation</h2>
            
            <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
              <div className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                    ✨ AI Recommended
                  </span>
                  <span className="text-xs text-zinc-500">Ward 14</span>
                </div>
                <h3 className="text-lg font-bold">Upgrade drinking-water infrastructure</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  The area shows critical need for safe drinking water intervention. Recommend repairing existing handpumps and assessing pipeline extension.
                </p>
              </div>
              
              <div className="p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">Evidence Base</h4>
                <ul className="flex flex-col gap-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">●</span>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">High recurring demand:</span>
                      <span className="text-zinc-600 dark:text-zinc-400"> 1,284 reports (Priority 92/100)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">●</span>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">Low service coverage:</span>
                      <span className="text-zinc-600 dark:text-zinc-400"> 42% infrastructure penetration</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">●</span>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">High population need:</span>
                      <span className="text-zinc-600 dark:text-zinc-400"> 18,430 residents impacted</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">●</span>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">Plan gap:</span>
                      <span className="text-zinc-600 dark:text-zinc-400"> No matching active projects in Ward 14</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Human Decision Required</h4>
                <div className="flex flex-col gap-2">
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700">
                    Approve Action Plan
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700">
                    Request Field Verification
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                    Reject Recommendation
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
