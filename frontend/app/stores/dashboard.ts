import { defineStore } from 'pinia';
import type {
  ActivityEvent,
  DashboardActivityPayload,
  DashboardStatsPayload,
} from '#shared/types/api';

export const useDashboardStore = defineStore('prism-dashboard', () => {
  const api = useApiClient();
  const stats = ref<DashboardStatsPayload | null>(null);
  const activity = ref<ActivityEvent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDashboardData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get<DashboardStatsPayload>('/dashboard/stats', undefined, 'dashboard-stats'),
        api.get<DashboardActivityPayload>(
          '/dashboard/activity',
          undefined,
          'dashboard-activity',
        ),
      ]);
      stats.value = statsRes.data;
      activity.value = activityRes.data.events || [];
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      error.value = api.extractApiErrorMessage(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    stats,
    activity,
    loading,
    error,
    fetchDashboardData,
  };
});
