import { createClient, RedisClientType } from 'redis';

// Cache TTL in seconds (5 minutes)
const CACHE_TTL = 300;

// Create a type for our Redis client
type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let isConnecting = false;

// Lazy-load Redis client
export const getRedisClient = async (): Promise<RedisClient> => {
  if (redisClient && redisClient.isReady) {
    return redisClient;
  }
  
  if (isConnecting) {
    // If we're already trying to connect, wait a bit and try again
    await new Promise(resolve => setTimeout(resolve, 100));
    return getRedisClient();
  }
  
  isConnecting = true;
  
  try {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    console.log('Connecting to Redis at:', url.replace(/:([^:]+)@/, ':***@')); // Log redacted URL
    
    const isSecure = url.startsWith('rediss://');
    
    // Close existing connection if it exists
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch (e) {
        console.warn('Error closing existing Redis connection:', e);
      }
      redisClient = null;
    }

    redisClient = createClient({
      url,
      socket: {
        tls: isSecure,
        rejectUnauthorized: false, // Required for Redis Cloud with TLS
        connectTimeout: 10000, // 10 seconds
        reconnectStrategy: (retries) => {
          console.log(`Redis reconnecting attempt ${retries}`);
          if (retries > 5) {
            console.error('Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 200, 2000); // Exponential backoff up to 2s
        }
      },
      pingInterval: 10000, // Send a ping every 10 seconds to keep the connection alive
      disableOfflineQueue: false // Allow commands to be queued while reconnecting
    }) as RedisClient;

    // Add error event listeners
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis client reconnecting...');
    });
    
    await redisClient.connect();
    console.log('Successfully connected to Redis');
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch (e) {
        console.warn('Error closing Redis connection after failed connect:', e);
      }
      redisClient = null;
    }
    throw error;
  } finally {
    isConnecting = false;
  }
};

// For backward compatibility
export const redis = {
  get: async (key: string) => {
    const client = await getRedisClient();
    return client.get(key);
  },
  set: async (key: string, value: string) => {
    const client = await getRedisClient();
    return client.set(key, value);
  },
  keys: async (pattern: string) => {
    const client = await getRedisClient();
    return client.keys(pattern);
  },
  // Add other Redis methods as needed
};


// Create a new Redis client for each request
export async function withRedis<T>(fn: (client: RedisClient) => Promise<T>): Promise<T> {
  const client = await getRedisClient();
  
  try {
    return await fn(client);
  } catch (error) {
    console.error('Redis operation failed:', error);
    throw error;
  }
}

export async function getAllSubmissions() {
  try {
    const client = await getRedisClient();
    
    // Use SCAN to get all keys matching the pattern
    const keys = await client.keys('submission:*');
    if (keys.length === 0) return [];
    
    // Get all values in a single pipeline
    const values = await Promise.all(keys.map(async key => {
      try {
        const value = await client.get(key);
        return { key, value };
      } catch (e) {
        console.error(`Error getting value for key ${key}:`, e);
        return { key, value: null };
      }
    }));
    
    // Parse each value as JSON and ensure consistent structure
    const submissions = values
      .filter(item => item.value)
      .map(({ key, value }) => {
        try {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value;
          
          // Ensure we have a consistent structure
          const submission = {
            id: key.replace('submission:', ''),
            ...parsed,
            // Ensure we have a proper date
            createdAt: parsed.createdAt || parsed.submittedAt || new Date().toISOString(),
            // Ensure we have a proper type
            type: parsed.type || 'unknown',
            // Ensure we have proper data structure
            data: {
              ...(parsed.data || {}),
              name: parsed.data?.name || parsed.name,
              // Check both root and data for submittedBy
              submittedBy: parsed.data?.submittedBy || parsed.submittedBy || 'Anonymous',
              submittedName: parsed.data?.submittedName || parsed.submittedName
            },
            // Ensure submittedBy is at the root as well
            submittedBy: parsed.submittedBy || parsed.data?.submittedBy || 'Anonymous'
          };
          
          // Clean up any undefined values
          Object.keys(submission).forEach(k => {
            if (submission[k] === undefined) {
              delete submission[k];
            }
          });
          
          return submission;
        } catch (e) {
          console.error('Error parsing submission:', e, 'Value:', value);
          return null;
        }
      })
      .filter(Boolean) // Filter out any null values from failed parses
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ); // Sort by date, newest first
      
    return submissions;
  } catch (error) {
    console.error('Error in getAllSubmissions:', error);
    throw error;
  }
}

interface SubmissionData {
  name: string;
  submittedBy?: string;
  submittedName?: string;
  [key: string]: unknown;
}

interface Submission {
  id: string;
  type: string;
  data: SubmissionData;
  status: string;
  submittedAt: string;
  updatedAt: string;
  createdAt?: string;
}

// Add a new submission to the database
export async function addSubmission(type: string, data: SubmissionData) {
  return withRedis(async (client) => {
    try {
      const normalizedInput = data.name.trim().toLowerCase();
      
      // Check for existing submission with the same name and type
      const submissions = await getAllSubmissions();
      const submissionExists = submissions.some((sub: Submission) => {
        return (
          sub.type === type && 
          sub.data?.name?.trim().toLowerCase() === normalizedInput
        );
      });
      
      if (submissionExists) {
        throw new Error(`"${data.name}" already exists in submissions`);
      }

      // Check for existing ingredient with the same name
      const ingredientKeys = await client.keys('ingredient:*');
      if (ingredientKeys.length > 0) {
        const pipeline = client.multi();
        ingredientKeys.forEach(key => pipeline.get(key));
        const results = await pipeline.exec();
        
        const ingredientExists = results.some(([err, item]) => {
          if (err || !item) return false;
          try {
            const ingredient = JSON.parse(item as string);
            return ingredient.name && 
                   ingredient.name.trim().toLowerCase() === normalizedInput;
          } catch (e) {
            console.error('Error parsing ingredient:', e);
            return false;
          }
        });

        if (ingredientExists) {
          throw new Error(`"${data.name}" already exists in the database`);
        }
      }
      
      // If we get here, no duplicates found - create the submission
      const id = `submission:${Date.now()}`;
      const { submittedBy, ...restData } = data;
      const submission = {
        id,
        type,
        data: {
          ...restData,
          name: data.name.trim(),
          // Ensure submittedBy is included in the data object
          submittedBy: submittedBy || data.submittedBy || 'Anonymous'
        },
        // Also include submittedBy at the root for backward compatibility
        submittedBy: submittedBy || data.submittedBy || 'Anonymous',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        // First add to the submission index
        await client.sAdd('submission:index', id);
        
        // Then store the submission
        await client.set(id, JSON.stringify(submission));
        
        console.log('Successfully added submission:', { id, name: data.name });
        return submission;
      } catch (error) {
        console.error('Error in submission transaction:', error);
        // Attempt to clean up if something went wrong
        try {
          await client.sRem('submission:index', id);
          await client.del(id);
        } catch (cleanupError) {
          console.error('Error during cleanup after failed submission:', cleanupError);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in addSubmission:', {
        error,
        type,
        name: data.name,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  });
}

// List all ingredients with optional search and pagination
export async function listIngredients(searchTerm?: string, page = 1, pageSize = 50): Promise<{data: any[], total: number}> {
  const client = await getRedisClient();
  try {
    const keys = await client.keys('ingredient:*');
    if (keys.length === 0) return { data: [], total: 0 };
    
    // Use a pipeline for better performance
    const pipeline = client.pipeline();
    keys.forEach(key => pipeline.get(key));
    const results = await pipeline.exec();
    
    const ingredients = results.map(([err, data]) => {
      if (err || !data) return null;
      return JSON.parse(data as string);
    }).filter(Boolean);
    
    // Filter by search term if provided
    if (searchTerm) {
      ingredients = ingredients.filter(ingredient => {
        return ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Paginate results
    const total = ingredients.length;
    const offset = (page - 1) * pageSize;
    const data = ingredients.slice(offset, offset + pageSize);
    
    return { data, total };
  } catch (error) {
    console.error('Error listing ingredients:', error);
    return { data: [], total: 0 };
  }
}

// Create a new ingredient with indexing
export const createIngredient = async (ingredient: {
  name: string;
  type: string;
  category: string;
  description?: string;
  parentIngredients?: string[];
  foodType?: string;
}): Promise<boolean> => {
  try {
    const client = await getRedisClient();
    const id = `ingredient:${Date.now()}`;
    const now = new Date().toISOString();
    const ingredientData = {
      id,
      ...ingredient,
      createdAt: now,
      updatedAt: now,
      // Ensure these fields exist
      parentIngredients: ingredient.parentIngredients || [],
      foodType: ingredient.foodType || 'grown'
    };
    
    // Start a transaction
    const multi = client.multi();
    
    // Store the ingredient
    multi.set(id, JSON.stringify(ingredientData));
    
    // Add to indexes
    multi.sadd('ingredient:index', id);
    multi.sadd(`ingredient:type:${ingredient.type}`, id);
    
    if (ingredient.foodType) {
      multi.sadd(`ingredient:foodType:${ingredient.foodType}`, id);
    }
    
    // Add to name index for faster lookups
    multi.set(`ingredient:name:${ingredient.name.toLowerCase()}`, id);
    
    // Update parent relationships if this is a prepared ingredient
    if (ingredient.parentIngredients && ingredient.parentIngredients.length > 0) {
      ingredient.parentIngredients.forEach(parentId => {
        multi.sadd(`ingredient:children:${parentId}`, id);
      });
    }
    
    // Execute the transaction
    await multi.exec();
    
    // Invalidate relevant caches
    await client.del('ingredients::1:50'); // First page
    
    return true;
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return false;
  }
};

// Delete a submission by ID
export async function deleteSubmission(id: string): Promise<boolean> {
  return withRedis(async (client) => {
    try {
      // Delete the submission from the main submissions hash
      const key = `submission:${id}`;
      await client.del(key);
      
      // Remove from pending submissions set if it exists there
      await client.sRem('submissions:pending', id);
      
      // Remove from approved submissions set if it exists there
      await client.sRem('submissions:approved', id);
      
      return true;
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw error;
    }
  });
}

// ... (rest of the code remains the same)
