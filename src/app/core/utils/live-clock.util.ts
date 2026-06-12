/**
 * Live match clock helpers.
 *
 * The clock is anchored to server data (`live_minute` minutes carried into the
 * current period + `periodStartedAt` timestamp), so it keeps running across
 * page reloads and stays consistent for every viewer.
 */

export function getLiveSeconds(match: any, nowMs: number = Date.now()): number {
    const baseSeconds = (match?.live_minute || 0) * 60;
    if (!match?.periodStartedAt) return baseSeconds;
    const elapsed = Math.floor((nowMs - new Date(match.periodStartedAt).getTime()) / 1000);
    return baseSeconds + Math.max(0, elapsed);
}

/** Running clock as "MM:SS" (e.g. "47:12"). Shows "HT" during half time. */
export function formatLiveClock(match: any, nowMs: number = Date.now()): string {
    if (match?.match_period === 'half_time') return 'HT';
    const total = getLiveSeconds(match, nowMs);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Current match minute (football style, kickoff = 1'). */
export function getLiveMinute(match: any, nowMs: number = Date.now()): number {
    return Math.floor(getLiveSeconds(match, nowMs) / 60) + 1;
}
