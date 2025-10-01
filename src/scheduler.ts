import { state, nowEpoch, Job } from './state';
import { fetchTxnsFromTo } from './utils/near-blocks-api';
import { agentAccountId } from "@neardefi/shade-agent-js";
import { nsToEpochMinute, toYocto } from './utils/utils';

export async function processDueJobs() {
  const ts = nowEpoch();
  const agentId = await agentAccountId();

  console.log("Scheduler on!");
  
  for (const job of state.jobs) {
    console.log("job is", job);
    console.log(job.status !== 'PENDING' && job.status !== 'PENDING_DEPOSIT');
    console.log(job.execute_at_epoch, ts);
    
    if (job.status !== 'PENDING' && job.status !== 'PENDING_DEPOSIT') continue;
    console.log("here");
        
    if (job.status === 'PENDING_DEPOSIT') {
      console.log("Checking for Deposit! for Job", job.job_id);
      console.log("Expected from address:", job.sender_address);

      const { txns } = await fetchTxnsFromTo(agentId, job.sender_address, { per_page: 25 });
      console.log(txns);
      
      for (const tx of txns) {
        const txTimeEpochMinute = nsToEpochMinute(tx.block_timestamp);

        // only accept new txns after job was created
        if (txTimeEpochMinute < job.created_at_epoch) continue;

        const action = tx.actions.find((a: any) => a.action === 'TRANSFER' && a.deposit);
        if (!action) continue;

        const depositYocto = BigInt(action.deposit);
        const expectedYocto = toYocto(job.amount);

        if (depositYocto === expectedYocto) {
          console.log("Deposit verified for job", job.job_id);

          job.status = 'PENDING'; // now eligible for processing
          job.updated_at_epoch = ts;
          job.events.push({
            ts_epoch: ts,
            type: 'DEPOSIT_RECEIVED_FAKE', // or 'DEPOSIT_CONFIRMED' if you add that
            payload: {
              from_address: job.sender_address,
              amount: String(job.amount),
              token: job.sending_token,
            },
          });
          break;
        }
      }
      continue; // don’t drop into processing this cycle until next tick
    }

    if (job.execute_at_epoch > ts) continue;

    // === PROCESSING jobs ===
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
      job.events.push({
        ts_epoch: job.updated_at_epoch,
        type: 'ERROR',
        payload: { message: e?.message || String(e) },
      });
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
