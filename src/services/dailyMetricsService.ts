import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface DailyMetrics {
  weight?: number;
  systolicBP?: number;
  diastolicBP?: number;
  steps?: number;
  totalSleep?: number;
  restingHeartRate?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  calories?: number;
}

export interface DailyMetricsWithDate extends DailyMetrics {
  date: string;
  user_id: string;
}

class DailyMetricsService {
  private async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  /**
   * Save daily metrics for a specific date
   */
  async saveDailyMetrics(date: Date, metrics: DailyMetrics): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      const formattedDate = format(date, 'yyyy-MM-dd');

      // Transform metrics object into array of individual metric records
      const metricRecords = Object.entries(metrics)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([metric_name, value]) => ({
          user_id: user.id,
          date: formattedDate,
          metric_name,
          value: Number(value),
          notes: null
        }));

      if (metricRecords.length === 0) {
        throw new Error('No valid metrics to save');
      }

      // Delete existing metrics for this date first (upsert behavior)
      const { error: deleteError } = await supabase
        .from('daily_metrics')
        .delete()
        .eq('user_id', user.id)
        .eq('date', formattedDate);

      if (deleteError) {
        console.error('Error deleting existing metrics:', deleteError);
      }

      // Insert new metrics
      const { error: insertError } = await supabase
        .from('daily_metrics')
        .insert(metricRecords);

      if (insertError) {
        console.error('Error inserting metrics:', insertError);
        throw new Error(`Failed to save metrics: ${insertError.message}`);
      }

      console.log(`Successfully saved ${metricRecords.length} metrics for ${formattedDate}`);
    } catch (error) {
      console.error('Error in saveDailyMetrics:', error);
      throw error;
    }
  }

  /**
   * Load daily metrics for a specific date
   */
  async loadDailyMetrics(date: Date): Promise<DailyMetrics> {
    try {
      const user = await this.getCurrentUser();
      const formattedDate = format(date, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('daily_metrics')
        .select('metric_name, value')
        .eq('user_id', user.id)
        .eq('date', formattedDate);

      if (error) {
        console.error('Error loading daily metrics:', error);
        throw new Error(`Failed to load metrics: ${error.message}`);
      }

      // Transform array of metric records back to object
      const metrics: DailyMetrics = {};
      data?.forEach(record => {
        const value = Number(record.value);
        if (!isNaN(value)) {
          metrics[record.metric_name as keyof DailyMetrics] = value;
        }
      });

      return metrics;
    } catch (error) {
      console.error('Error in loadDailyMetrics:', error);
      throw error;
    }
  }

  /**
   * Get weekly averages for a specific week
   */
  async getWeeklyAverages(weekStart: Date, weekEnd: Date): Promise<DailyMetrics> {
    try {
      const user = await this.getCurrentUser();
      const startDate = format(weekStart, 'yyyy-MM-dd');
      const endDate = format(weekEnd, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('daily_metrics')
        .select('metric_name, value, date')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        console.error('Error loading weekly data:', error);
        throw new Error(`Failed to load weekly data: ${error.message}`);
      }

      // Group by metric name and calculate averages
      const metricGroups: { [key: string]: number[] } = {};
      data?.forEach(record => {
        const value = Number(record.value);
        if (!isNaN(value)) {
          if (!metricGroups[record.metric_name]) {
            metricGroups[record.metric_name] = [];
          }
          metricGroups[record.metric_name].push(value);
        }
      });

      // Calculate averages
      const averages: DailyMetrics = {};
      Object.entries(metricGroups).forEach(([metric_name, values]) => {
        if (values.length > 0) {
          const average = values.reduce((sum, val) => sum + val, 0) / values.length;
          averages[metric_name as keyof DailyMetrics] = Number(average.toFixed(1));
        }
      });

      return averages;
    } catch (error) {
      console.error('Error in getWeeklyAverages:', error);
      throw error;
    }
  }

  /**
   * Get trend data for the last N weeks
   */
  async getTrendData(weeks: number = 8): Promise<Array<{ weekStart: Date; metrics: DailyMetrics }>> {
    try {
      const user = await this.getCurrentUser();
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (weeks * 7));

      const { data, error } = await supabase
        .from('daily_metrics')
        .select('metric_name, value, date')
        .eq('user_id', user.id)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading trend data:', error);
        throw new Error(`Failed to load trend data: ${error.message}`);
      }

      // Group by week and calculate weekly averages
      const weeklyData: { [weekKey: string]: { [metric: string]: number[] } } = {};
      
      data?.forEach(record => {
        const recordDate = new Date(record.date);
        const weekStart = this.getWeekStart(recordDate);
        const weekKey = format(weekStart, 'yyyy-MM-dd');
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {};
        }
        
        if (!weeklyData[weekKey][record.metric_name]) {
          weeklyData[weekKey][record.metric_name] = [];
        }
        
        const value = Number(record.value);
        if (!isNaN(value)) {
          weeklyData[weekKey][record.metric_name].push(value);
        }
      });

      // Calculate weekly averages and format result
      const trendData = Object.entries(weeklyData).map(([weekKey, metrics]) => {
        const weekStart = new Date(weekKey);
        const weeklyAverages: DailyMetrics = {};
        
        Object.entries(metrics).forEach(([metric_name, values]) => {
          if (values.length > 0) {
            const average = values.reduce((sum, val) => sum + val, 0) / values.length;
            weeklyAverages[metric_name as keyof DailyMetrics] = Number(average.toFixed(1));
          }
        });

        return {
          weekStart,
          metrics: weeklyAverages
        };
      });

      return trendData.sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
    } catch (error) {
      console.error('Error in getTrendData:', error);
      throw error;
    }
  }

  /**
   * Check if metrics exist for a specific date
   */
  async hasMetricsForDate(date: Date): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      const formattedDate = format(date, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('daily_metrics')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', formattedDate)
        .limit(1);

      if (error) {
        console.error('Error checking metrics existence:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasMetricsForDate:', error);
      return false;
    }
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }
}

export const dailyMetricsService = new DailyMetricsService(); 