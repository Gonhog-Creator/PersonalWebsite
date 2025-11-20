import { cleanupSubmissions } from './cleanupSubmissions';

async function main() {
  console.log('Starting submission cleanup...');
  await cleanupSubmissions();
  console.log('Cleanup completed!');
  process.exit(0);
}

main().catch(console.error);
