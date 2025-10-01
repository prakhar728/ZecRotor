import { state, nowEpoch } from './state';

async function processDueJobs() {
  const ts = nowEpoch();
  for (const job of state.jobs) {
    if ((job.status !== 'PENDING') && (job.status !== 'PENDING_DEPOSIT')) continue;
    if (job.execute_at_epoch > ts) continue;

    job.status = 'PROCESSING';
    job.updated_at_epoch = ts;
    job.events.push({ ts_epoch: ts, type: 'PROCESSING_STARTED', payload: {} });

    try {
      await new Promise((r) => setTimeout(r, 50));
      const fakeTx = {
        tx_id: `fake_${job.job_id.slice(0, 8)}_${ts}`,
        sent_at_epoch: ts,
        to: job.destination_address,
        token: job.destination_token,
      };
      job.events.push({ ts_epoch: ts, type: 'TX_SUBMITTED_FAKE', payload: fakeTx });
      job.status = 'COMPLETED';
      job.updated_at_epoch = nowEpoch();
      job.events.push({ ts_epoch: job.updated_at_epoch, type: 'JOB_COMPLETED', payload: {} });
    } catch (e: any) {
      job.status = 'FAILED';
      job.updated_at_epoch = nowEpoch();
      job.events.push({ ts_epoch: job.updated_at_epoch, type: 'ERROR', payload: { message: e?.message || String(e) } });
    }
  }
}

export function startScheduler() {
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => {
    processDueJobs().catch(() => { });
    setInterval(() => processDueJobs().catch(() => { }), 60_000);
  }, Math.max(0, msToNextMinute));
}
