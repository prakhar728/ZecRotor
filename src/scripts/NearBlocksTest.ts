// fetch-near-txns.js
// Run with: node fetch-near-txns.js

const TO_ACCOUNT = "testing69.near";
const FROM_ACCOUNT = "prakharojha.near";

const BASE_URL = "https://api.nearblocks.io";

async function fetchTxnsFromTo(toAccount, fromAccount, { per_page = 25, order = "desc", cursor } = {}) {
  const qs = new URLSearchParams({ from: fromAccount, to: toAccount });
  qs.set("per_page", per_page);
  qs.set("order", order);
  if (cursor) qs.set("cursor", cursor);

  const url = `${BASE_URL}/v1/account/${encodeURIComponent(toAccount)}/txns?${qs.toString()}`;
  console.log("Fetching:", url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NearBlocks ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

(async () => {
  try {
    const data = await fetchTxnsFromTo(TO_ACCOUNT, FROM_ACCOUNT, { per_page: 10 });
    console.log(`Found ${data.txns?.length || 0} transactions`);
    for (const tx of data.txns || []) {
        console.log(tx);
        
      console.log(
        `Hash: ${tx.transaction_hash}, From: ${tx.predecessor_account_id}, To: ${tx.receiver_account_id}, Block: ${tx.block_height}`
      );
    }
    if (data.cursor) {
      console.log("Next page cursor:", data.cursor);
    }
  } catch (err) {
    console.error("Error fetching transactions:", err.message);
  }
})();
