import { withRedis } from '@/lib/kv';

async function cleanupSubmissions() {
  try {
    await withRedis(async (client) => {
      // Get all submission keys
      const keys = await client.keys('submission:*');
      
      // Get all submissions
      const submissions = await Promise.all(
        keys.map(async (key) => {
          const data = await client.get(key);
          return { key, data: data ? JSON.parse(data) : null };
        })
      );

      console.log(`Found ${submissions.length} submissions to process`);

      // Process each submission
      for (const { key, data } of submissions) {
        if (!data) continue;

        // Create a clean submission object with standardized structure
        const cleanSubmission = {
          id: data.id,
          type: data.type,
          data: {
            name: data.data?.name || data.name,
            source: data.data?.source,
            // Only include preparationMethod if it exists
            ...(data.data?.preparationMethod && { preparationMethod: data.data.preparationMethod }),
            // Always include parentIngredients as an array
            parentIngredients: Array.isArray(data.data?.parentIngredients) 
              ? data.data.parentIngredients 
              : [],
            // Standardize submitter information
            submittedBy: 'Jose Maria Barbeito',
            submittedName: 'Jose Maria Barbeito',
            // Only include animal-specific fields if they exist
            ...(data.data?.isSourceAnimal !== undefined && { isSourceAnimal: data.data.isSourceAnimal }),
            ...(data.data?.animalType && { animalType: data.data.animalType }),
            // Keep the original source if this was converted from another type
            ...(data.data?.previousSource && { previousSource: data.data.previousSource })
          },
          status: data.status || 'pending',
          // Keep the original submission time if it exists, otherwise use current time
          submittedAt: data.submittedAt || new Date().toISOString(),
          // Always update the updatedAt timestamp
          updatedAt: new Date().toISOString(),
          // Keep the original creation time if it exists, otherwise use submission time or current time
          createdAt: data.createdAt || data.submittedAt || new Date().toISOString()
        };

        // Update the submission in Redis
        await client.set(key, JSON.stringify(cleanSubmission));
        console.log(`Updated submission: ${key}`);
      }

      console.log('Cleanup complete!');
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupSubmissions();
