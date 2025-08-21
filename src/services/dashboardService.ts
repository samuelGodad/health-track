import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from 'date-fns';

type BloodTestResult = Database['public']['Tables']['blood_test_results']['Row'];
type DailyMetric = Database['public']['Tables']['daily_metrics']['Row'];

export interface DashboardMetrics {
  totalBloodTests: number;
  recentBloodTests: number; // Last 30 days
  activeCycles: number;
  healthScore: number;
  improvementPercentage: number;
  abnormalTests: number;
  testsThisMonth: number;
  averageTestsPerMonth: number;
}

export interface DashboardTrends {
  bloodTestTrend: {
    date: string;
    count: number;
  }[];
  healthScoreTrend: {
    date: string;
    score: number;
  }[];
  abnormalTestsTrend: {
    date: string;
    count: number;
  }[];
}

export interface RecentActivity {
  type: 'blood_test' | 'daily_metric' | 'cycle_update';
  date: string;
  title: string;
  description: string;
  value?: string;
}

interface HealthScoreBreakdown {
  bloodTestScore: number;
  bodyMetricsScore: number;
  lifestyleScore: number;
  trendScore: number;
  monitoringScore: number;
  totalScore: number;
}

class DashboardService {
  private static instance: DashboardService;

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  private async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  /**
   * Calculate active cycles based on current date and cycle periods
   */
  private calculateActiveCycles(cyclePeriods: any[]): number {
    if (!cyclePeriods || cyclePeriods.length === 0) return 0;

    const now = new Date();
    let activeCount = 0;

    cyclePeriods.forEach(period => {
      // Check if current date falls within this cycle period
      if (period.startDate && period.endDate) {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        
        if (isWithinInterval(now, { start: startDate, end: endDate })) {
          activeCount++;
        }
      }
    });

    return activeCount;
  }

  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics(cyclePeriods?: any[]): Promise<DashboardMetrics> {
    try {
      const user = await this.getCurrentUser();
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);
      const startOfCurrentMonth = startOfMonth(now);
      const endOfCurrentMonth = endOfMonth(now);

      // Get blood test data
      const { data: bloodTests, error: bloodTestsError } = await supabase
        .from('blood_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (bloodTestsError) {
        console.error('Error fetching blood tests:', bloodTestsError);
        throw bloodTestsError;
      }

      const bloodTestsData = bloodTests || [];

      // Calculate metrics
      const totalBloodTests = bloodTestsData.length;
      
      const recentBloodTests = bloodTestsData.filter(test => 
        new Date(test.created_at) >= thirtyDaysAgo
      ).length;

      const testsThisMonth = bloodTestsData.filter(test => {
        const testDate = new Date(test.created_at);
        return testDate >= startOfCurrentMonth && testDate <= endOfCurrentMonth;
      }).length;

      // Calculate comprehensive health score
      const healthScoreBreakdown = await this.calculateComprehensiveHealthScore(bloodTestsData, user.id);

      // Calculate abnormal tests
      const abnormalTests = bloodTestsData.filter(test => 
        test.status === 'high' || test.status === 'low'
      ).length;

      // Calculate improvement (placeholder - will be enhanced)
      const improvementPercentage = this.calculateImprovementPercentage(bloodTestsData);

      // Calculate average tests per month
      const averageTestsPerMonth = this.calculateAverageTestsPerMonth(bloodTestsData);

      // Calculate active cycles from real data or fallback to 0
      const activeCycles = cyclePeriods ? this.calculateActiveCycles(cyclePeriods) : 0;

      return {
        totalBloodTests,
        recentBloodTests,
        activeCycles,
        healthScore: healthScoreBreakdown.totalScore,
        improvementPercentage,
        abnormalTests,
        testsThisMonth,
        averageTestsPerMonth
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive health score considering all available data
   */
  private async calculateComprehensiveHealthScore(bloodTests: BloodTestResult[], userId: string): Promise<HealthScoreBreakdown> {
    const breakdown: HealthScoreBreakdown = {
      bloodTestScore: 0,
      bodyMetricsScore: 0,
      lifestyleScore: 0,
      trendScore: 0,
      monitoringScore: 0,
      totalScore: 0
    };

    // 1. Blood Test Score (40% weight)
    breakdown.bloodTestScore = this.calculateBloodTestScore(bloodTests);

    // 2. Body Metrics Score (25% weight)
    breakdown.bodyMetricsScore = await this.calculateBodyMetricsScore(userId);

    // 3. Lifestyle Score (20% weight)
    breakdown.lifestyleScore = await this.calculateLifestyleScore(userId);

    // 4. Trend Score (10% weight)
    breakdown.trendScore = this.calculateTrendScore(bloodTests);

    // 5. Monitoring Score (5% weight)
    breakdown.monitoringScore = this.calculateMonitoringScore(bloodTests);

    // Calculate weighted total
    breakdown.totalScore = Math.round(
      (breakdown.bloodTestScore * 0.40) +
      (breakdown.bodyMetricsScore * 0.25) +
      (breakdown.lifestyleScore * 0.20) +
      (breakdown.trendScore * 0.10) +
      (breakdown.monitoringScore * 0.05)
    );

    return breakdown;
  }

  /**
   * Calculate blood test score based on all test results
   */
  private calculateBloodTestScore(bloodTests: BloodTestResult[]): number {
    if (bloodTests.length === 0) return 0;

    // Consider all tests, not just recent ones
    const normalTests = bloodTests.filter(test => test.status === 'normal').length;
    const totalTests = bloodTests.length;
    
    // Base score on percentage of normal tests
    let score = (normalTests / totalTests) * 100;

    // Bonus for having comprehensive testing (different categories)
    const categories = new Set(bloodTests.map(test => test.category));
    if (categories.size >= 5) score += 10; // Bonus for diverse testing
    if (categories.size >= 8) score += 5;  // Extra bonus for comprehensive testing

    // Penalty for critical abnormal tests
    const criticalTests = bloodTests.filter(test => 
      test.status === 'high' || test.status === 'low'
    );
    
    if (criticalTests.length > 0) {
      score -= (criticalTests.length * 3); // 3 points penalty per abnormal test
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate body metrics score (BMI, blood pressure, etc.)
   */
  private async calculateBodyMetricsScore(userId: string): Promise<number> {
    try {
      // Get recent daily metrics (last 30 days)
      const thirtyDaysAgo = subDays(new Date(), 30);
      const { data: dailyMetrics } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', format(thirtyDaysAgo, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (!dailyMetrics || dailyMetrics.length === 0) return 50; // Neutral score if no data

      let score = 0;
      let metricsCount = 0;

      // Group metrics by date
      const metricsByDate = dailyMetrics.reduce((acc, metric) => {
        if (!acc[metric.date]) acc[metric.date] = {};
        acc[metric.date][metric.metric_name] = metric.value;
        return acc;
      }, {} as Record<string, any>);

      // Calculate scores for each day
      Object.values(metricsByDate).forEach((dayMetrics: any) => {
        let dayScore = 0;
        let dayMetricsCount = 0;

        // Weight score (BMI calculation if height is available)
        if (dayMetrics.weight) {
          // Assume average height of 175cm if not available
          const height = 175; // cm
          const bmi = dayMetrics.weight / Math.pow(height / 100, 2);
          
          if (bmi >= 18.5 && bmi <= 24.9) {
            dayScore += 25; // Normal BMI
          } else if (bmi >= 17 && bmi <= 29.9) {
            dayScore += 15; // Acceptable range
          } else {
            dayScore += 5; // Outside healthy range
          }
          dayMetricsCount++;
        }

        // Blood pressure score
        if (dayMetrics.systolicBP && dayMetrics.diastolicBP) {
          const systolic = dayMetrics.systolicBP;
          const diastolic = dayMetrics.diastolicBP;
          
          if (systolic < 120 && diastolic < 80) {
            dayScore += 25; // Normal
          } else if (systolic < 130 && diastolic < 85) {
            dayScore += 15; // Elevated
          } else if (systolic < 140 && diastolic < 90) {
            dayScore += 10; // Stage 1
          } else {
            dayScore += 5; // Stage 2 or higher
          }
          dayMetricsCount++;
        }

        // Resting heart rate score
        if (dayMetrics.restingHeartRate) {
          const hr = dayMetrics.restingHeartRate;
          if (hr >= 60 && hr <= 100) {
            dayScore += 25; // Normal
          } else if (hr >= 50 && hr <= 110) {
            dayScore += 15; // Acceptable
          } else {
            dayScore += 5; // Outside normal range
          }
          dayMetricsCount++;
        }

        // Sleep score
        if (dayMetrics.totalSleep) {
          const sleep = dayMetrics.totalSleep;
          if (sleep >= 7 && sleep <= 9) {
            dayScore += 25; // Optimal
          } else if (sleep >= 6 && sleep <= 10) {
            dayScore += 15; // Acceptable
          } else {
            dayScore += 5; // Poor sleep
          }
          dayMetricsCount++;
        }

        if (dayMetricsCount > 0) {
          score += dayScore / dayMetricsCount;
          metricsCount++;
        }
      });

      return metricsCount > 0 ? Math.round(score / metricsCount) : 50;
    } catch (error) {
      console.error('Error calculating body metrics score:', error);
      return 50; // Neutral score on error
    }
  }

  /**
   * Calculate lifestyle score (steps, nutrition, etc.)
   */
  private async calculateLifestyleScore(userId: string): Promise<number> {
    try {
      // Get recent daily metrics
      const thirtyDaysAgo = subDays(new Date(), 30);
      const { data: dailyMetrics } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', format(thirtyDaysAgo, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (!dailyMetrics || dailyMetrics.length === 0) return 50;

      let score = 0;
      let metricsCount = 0;

      // Group metrics by date
      const metricsByDate = dailyMetrics.reduce((acc, metric) => {
        if (!acc[metric.date]) acc[metric.date] = {};
        acc[metric.date][metric.metric_name] = metric.value;
        return acc;
      }, {} as Record<string, any>);

      Object.values(metricsByDate).forEach((dayMetrics: any) => {
        let dayScore = 0;
        let dayMetricsCount = 0;

        // Steps score
        if (dayMetrics.steps) {
          const steps = dayMetrics.steps;
          if (steps >= 10000) {
            dayScore += 25; // Excellent
          } else if (steps >= 7500) {
            dayScore += 20; // Good
          } else if (steps >= 5000) {
            dayScore += 15; // Moderate
          } else if (steps >= 3000) {
            dayScore += 10; // Low
          } else {
            dayScore += 5; // Very low
          }
          dayMetricsCount++;
        }

        // Nutrition score (calories and macros)
        if (dayMetrics.calories && dayMetrics.protein && dayMetrics.carbs && dayMetrics.fats) {
          const calories = dayMetrics.calories;
          const protein = dayMetrics.protein;
          const carbs = dayMetrics.carbs;
          const fats = dayMetrics.fats;

          // Basic nutrition scoring
          let nutritionScore = 0;
          
          // Calorie adequacy (assuming 2000 cal baseline)
          if (calories >= 1500 && calories <= 2500) {
            nutritionScore += 10;
          } else if (calories >= 1200 && calories <= 3000) {
            nutritionScore += 5;
          }

          // Protein adequacy (assuming 0.8g per kg bodyweight)
          if (protein >= 60 && protein <= 200) {
            nutritionScore += 10;
          } else if (protein >= 40 && protein <= 250) {
            nutritionScore += 5;
          }

          // Macro balance
          const totalMacros = protein + carbs + fats;
          if (totalMacros > 0) {
            const proteinRatio = protein / totalMacros;
            const carbRatio = carbs / totalMacros;
            const fatRatio = fats / totalMacros;

            if (proteinRatio >= 0.1 && proteinRatio <= 0.35 &&
                carbRatio >= 0.3 && carbRatio <= 0.65 &&
                fatRatio >= 0.2 && fatRatio <= 0.35) {
              nutritionScore += 5;
            }
          }

          dayScore += nutritionScore;
          dayMetricsCount++;
        }

        if (dayMetricsCount > 0) {
          score += dayScore / dayMetricsCount;
          metricsCount++;
        }
      });

      return metricsCount > 0 ? Math.round(score / metricsCount) : 50;
    } catch (error) {
      console.error('Error calculating lifestyle score:', error);
      return 50;
    }
  }

  /**
   * Calculate trend score based on test result improvements
   */
  private calculateTrendScore(bloodTests: BloodTestResult[]): number {
    if (bloodTests.length < 4) return 50; // Need at least 4 tests for trend

    // Group tests by month and compare recent vs older
    const now = new Date();
    const threeMonthsAgo = subDays(now, 90);
    const sixMonthsAgo = subDays(now, 180);

    const recentTests = bloodTests.filter(test => 
      new Date(test.created_at) >= threeMonthsAgo
    );
    
    const olderTests = bloodTests.filter(test => {
      const testDate = new Date(test.created_at);
      return testDate >= sixMonthsAgo && testDate < threeMonthsAgo;
    });

    if (recentTests.length === 0 || olderTests.length === 0) return 50;

    const recentNormalRate = recentTests.filter(t => t.status === 'normal').length / recentTests.length;
    const olderNormalRate = olderTests.filter(t => t.status === 'normal').length / olderTests.length;

    if (olderNormalRate === 0) return 50;

    const improvement = ((recentNormalRate - olderNormalRate) / olderNormalRate) * 100;
    
    // Convert improvement to score
    if (improvement > 20) return 100; // Excellent improvement
    if (improvement > 10) return 85;  // Good improvement
    if (improvement > 0) return 70;   // Slight improvement
    if (improvement > -10) return 50; // Stable
    if (improvement > -20) return 30; // Slight decline
    return 10; // Significant decline
  }

  /**
   * Calculate monitoring score (frequency and consistency)
   */
  private calculateMonitoringScore(bloodTests: BloodTestResult[]): number {
    if (bloodTests.length === 0) return 0;

    let score = 0;

    // Frequency bonus
    const totalTests = bloodTests.length;
    if (totalTests >= 20) score += 30; // Excellent monitoring
    else if (totalTests >= 15) score += 25; // Good monitoring
    else if (totalTests >= 10) score += 20; // Moderate monitoring
    else if (totalTests >= 5) score += 15; // Basic monitoring
    else score += 10; // Minimal monitoring

    // Consistency bonus (regular intervals)
    const sortedTests = bloodTests.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let consistentIntervals = 0;
    for (let i = 1; i < sortedTests.length; i++) {
      const daysDiff = differenceInDays(
        new Date(sortedTests[i].created_at),
        new Date(sortedTests[i-1].created_at)
      );
      
      // Bonus for regular intervals (30-90 days between tests)
      if (daysDiff >= 30 && daysDiff <= 90) {
        consistentIntervals++;
      }
    }

    const consistencyRate = consistentIntervals / Math.max(1, sortedTests.length - 1);
    score += consistencyRate * 20; // Up to 20 points for consistency

    // Recency bonus
    const latestTest = new Date(sortedTests[sortedTests.length - 1].created_at);
    const daysSinceLastTest = differenceInDays(new Date(), latestTest);
    
    if (daysSinceLastTest <= 30) score += 20; // Recent test
    else if (daysSinceLastTest <= 90) score += 15; // Moderately recent
    else if (daysSinceLastTest <= 180) score += 10; // Somewhat recent
    else score += 5; // Old test

    return Math.min(100, Math.round(score));
  }

  /**
   * Calculate improvement percentage (placeholder - will be enhanced)
   */
  private calculateImprovementPercentage(bloodTests: BloodTestResult[]): number {
    if (bloodTests.length < 2) return 0;

    // Group tests by month and compare recent vs older
    const now = new Date();
    const threeMonthsAgo = subDays(now, 90);
    const sixMonthsAgo = subDays(now, 180);

    const recentTests = bloodTests.filter(test => 
      new Date(test.created_at) >= threeMonthsAgo
    );
    
    const olderTests = bloodTests.filter(test => {
      const testDate = new Date(test.created_at);
      return testDate >= sixMonthsAgo && testDate < threeMonthsAgo;
    });

    if (recentTests.length === 0 || olderTests.length === 0) return 0;

    const recentNormalRate = recentTests.filter(t => t.status === 'normal').length / recentTests.length;
    const olderNormalRate = olderTests.filter(t => t.status === 'normal').length / olderTests.length;

    if (olderNormalRate === 0) return 0;

    const improvement = ((recentNormalRate - olderNormalRate) / olderNormalRate) * 100;
    return Math.round(improvement);
  }

  /**
   * Calculate average tests per month
   */
  private calculateAverageTestsPerMonth(bloodTests: BloodTestResult[]): number {
    if (bloodTests.length === 0) return 0;

    const firstTest = new Date(bloodTests[bloodTests.length - 1].created_at);
    const lastTest = new Date(bloodTests[0].created_at);
    
    const monthsDiff = (lastTest.getFullYear() - firstTest.getFullYear()) * 12 + 
                      (lastTest.getMonth() - firstTest.getMonth());
    
    const totalMonths = Math.max(1, monthsDiff);
    return Math.round(bloodTests.length / totalMonths);
  }

  /**
   * Get recent activity for dashboard
   */
  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const user = await this.getCurrentUser();
      const activities: RecentActivity[] = [];

      // Get recent blood tests
      const { data: recentBloodTests } = await supabase
        .from('blood_test_results')
        .select('test_name, created_at, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentBloodTests) {
        recentBloodTests.forEach(test => {
          activities.push({
            type: 'blood_test',
            date: test.created_at,
            title: `Blood Test: ${test.test_name}`,
            description: `Test result: ${test.status}`,
            value: test.status
          });
        });
      }

      // Get recent daily metrics
      const { data: recentDailyMetrics } = await supabase
        .from('daily_metrics')
        .select('metric_name, date, value')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3);

      if (recentDailyMetrics) {
        recentDailyMetrics.forEach(metric => {
          activities.push({
            type: 'daily_metric',
            date: metric.date,
            title: `Daily Metric: ${metric.metric_name}`,
            description: `Recorded value: ${metric.value}`,
            value: metric.value.toString()
          });
        });
      }

      // Sort by date (most recent first)
      return activities.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 8); // Return top 8 activities
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  /**
   * Get trends data for charts
   */
  async getDashboardTrends(): Promise<DashboardTrends> {
    try {
      const user = await this.getCurrentUser();
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);

      // Get blood test trends
      const { data: bloodTests } = await supabase
        .from('blood_test_results')
        .select('created_at, status')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      const bloodTestTrend = this.aggregateDataByDate(
        bloodTests || [],
        'created_at',
        'count'
      );

      const abnormalTestsTrend = this.aggregateDataByDate(
        (bloodTests || []).filter(test => test.status === 'high' || test.status === 'low'),
        'created_at',
        'count'
      );

      // Calculate health score trend (simplified)
      const healthScoreTrend = this.calculateHealthScoreTrend(bloodTests || [] as any);

      return {
        bloodTestTrend: bloodTestTrend as any,
        healthScoreTrend,
        abnormalTestsTrend: abnormalTestsTrend as any
      };
    } catch (error) {
      console.error('Error getting dashboard trends:', error);
      return {
        bloodTestTrend: [],
        healthScoreTrend: [],
        abnormalTestsTrend: []
      };
    }
  }

  /**
   * Aggregate data by date for trend charts
   */
  private aggregateDataByDate(
    data: any[],
    dateField: string,
    valueField: string
  ): { date: string; [key: string]: any }[] {
    const grouped = data.reduce((acc, item) => {
      const date = format(new Date(item[dateField]), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date, [valueField]: 0 };
      }
      acc[date][valueField]++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }

  /**
   * Calculate health score trend
   */
  private calculateHealthScoreTrend(bloodTests: BloodTestResult[]): { date: string; score: number }[] {
    const dailyScores: Record<string, number[]> = {};

    bloodTests.forEach(test => {
      const date = format(new Date(test.created_at), 'yyyy-MM-dd');
      if (!dailyScores[date]) {
        dailyScores[date] = [];
      }
      
      // Simple scoring: 100 for normal, 50 for abnormal
      const score = test.status === 'normal' ? 100 : 50;
      dailyScores[date].push(score);
    });

    return Object.entries(dailyScores).map(([date, scores]) => ({
      date,
      score: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    }));
  }
}

export default DashboardService; 