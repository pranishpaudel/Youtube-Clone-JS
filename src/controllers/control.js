import { Cluster } from "puppeteer-cluster";

// Function to be executed by each cluster worker
async function botTask({ page, data }) {
  // Your bot logic goes here
  console.log(`Bot ${data.botId} is running`);

  // Example: Print "Hello, World!"
  console.log("Hello, World!");

  // Your bot logic continues...

  // Close the page when done
  await page.close();
}

// Number of parallel tasks (bots)
const numBots = 4;

// Create a cluster with the specified number of workers
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: numBots,
  });

  // Queue tasks for each bot
  for (let i = 0; i < numBots; i++) {
    cluster.queue({ botId: i }, botTask);
  }

  // Wait for all tasks to finish
  await cluster.idle();
  await cluster.close();
})();
