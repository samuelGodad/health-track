
import React from "react";

const DashboardPreview = () => {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Dashboard Layout */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-44 border-r border-gray-200 p-6 flex flex-col">
          <div className="mb-6">
            <div className="text-lg font-semibold">Your Enhanced Health</div>
          </div>
          
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2">Discover</p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 py-2 text-blue-600 font-medium">
                <div className="w-4 h-4 rounded-full bg-blue-100"></div>
                Dashboard
              </div>
              <div className="flex items-center gap-3 py-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                Daily
              </div>
              <div className="flex items-center gap-3 py-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                Weekly
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Library</p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 py-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                Bloods
              </div>
              <div className="flex items-center gap-3 py-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                Progress Photos
              </div>
              <div className="flex items-center gap-3 py-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                Measurements
              </div>
              <div className="flex items-center gap-3 py-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                Supplements
              </div>
              <div className="flex items-center gap-3 py-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                Goals
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Dashboard</h1>
              <p className="text-gray-500 text-sm">Track your progress and meet your daily targets</p>
            </div>
            <div className="bg-black text-white rounded-full px-3 py-1 text-sm">
              March 13th
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <div className="px-4 py-1 bg-black text-white rounded-full text-sm">Food</div>
            <div className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Activity</div>
            <div className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Health</div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 font-medium">Calories</div>
              <div className="text-3xl font-bold mt-1">3,250</div>
              <div className="text-xs text-gray-500 mt-1">+8% over the last 30 days</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 font-medium">Protein</div>
              <div className="text-3xl font-bold mt-1">200g</div>
              <div className="text-xs text-gray-500 mt-1">+8% over the last 30 days</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 font-medium">Carbs</div>
              <div className="text-3xl font-bold mt-1">500g</div>
              <div className="text-xs text-gray-500 mt-1">-5% over the last 30 days</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 font-medium">Fat</div>
              <div className="text-3xl font-bold mt-1">50g</div>
              <div className="text-xs text-gray-500 mt-1">-6% over the last 30 days</div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add March 13th's Data</h2>
              
              <div className="grid grid-cols-2 mb-2">
                <div className="text-sm text-gray-500 font-medium">Source</div>
                <div className="text-sm text-gray-500 font-medium">Input Your Data</div>
              </div>
              
              <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 items-center">
                    <div className="text-sm text-gray-700">test name</div>
                    <div className="h-9 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
              
              <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">Supplements</h2>
              
              <div className="grid grid-cols-2 mb-2">
                <div className="text-sm text-gray-500 font-medium">Source</div>
                <div className="text-sm text-gray-500 font-medium">Timing & Dosage</div>
              </div>
              
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 items-center">
                    <div className="text-sm text-gray-700">supplement name</div>
                    <div className="text-sm text-gray-700">Timing & dose</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Weight</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">82.5</p>
                    <p className="text-sm text-gray-500">kg</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Sleep</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">7.5</p>
                    <p className="text-sm text-gray-500">hours</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Steps</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">8,547</p>
                    <p className="text-sm text-gray-500">steps</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Water</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">2.5</p>
                    <p className="text-sm text-gray-500">liters</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Meal Quality</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">8/10</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Recovery</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">7/10</p>
                  </div>
                </div>
                
                <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-4">
                  Save Today's Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
