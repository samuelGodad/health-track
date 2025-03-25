
import React from "react";

const DashboardPreview = () => {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-primary/10 p-4 border-b dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary font-bold text-xl">Your Vita Health</div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/20"></div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900">
            <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Overall Health Score</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">87/100</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Metrics Tracked</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">8/12</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Streak</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">14 days</div>
          </div>
        </div>
        
        {/* Charts and Graphs */}
        <div className="col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-60">
          <div className="text-sm font-medium mb-2">Health Metrics Trend</div>
          <div className="h-44 flex items-end space-x-2">
            <div className="h-1/3 w-8 bg-primary/60 rounded-t"></div>
            <div className="h-1/2 w-8 bg-primary/70 rounded-t"></div>
            <div className="h-1/4 w-8 bg-primary/60 rounded-t"></div>
            <div className="h-3/4 w-8 bg-primary/80 rounded-t"></div>
            <div className="h-2/3 w-8 bg-primary rounded-t"></div>
            <div className="h-1/2 w-8 bg-primary/90 rounded-t"></div>
            <div className="h-4/5 w-8 bg-primary rounded-t"></div>
          </div>
        </div>
        
        {/* Sidebar/Supplements */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium mb-3">Today's Supplements</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <div className="text-sm">Vitamin D (2000 IU)</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <div className="text-sm">Omega-3 (1000mg)</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <div className="text-sm">Magnesium (400mg)</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="text-sm">Zinc (15mg)</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium mb-2">Recent Blood Test Results</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">Vitamin D</div>
                <div className="text-sm font-medium text-yellow-600">32 ng/mL</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Cholesterol (Total)</div>
                <div className="text-sm font-medium text-green-600">185 mg/dL</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">HDL</div>
                <div className="text-sm font-medium text-green-600">58 mg/dL</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium mb-2">Body Progress</div>
            <div className="flex space-x-4 mt-3">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Weight</div>
                <div className="text-sm font-medium">175 lbs</div>
                <div className="text-xs text-green-500">-2 lbs</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Body Fat</div>
                <div className="text-sm font-medium">18%</div>
                <div className="text-xs text-green-500">-0.5%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Muscle</div>
                <div className="text-sm font-medium">42%</div>
                <div className="text-xs text-green-500">+0.3%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">BMI</div>
                <div className="text-sm font-medium">24.2</div>
                <div className="text-xs text-green-500">-0.3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
