import { createClient } from 'redis'; // Removed unused RedisClientType import

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
              submittedBy: parsed.data?.submittedBy || parsed.submittedBy,
              submittedName: parsed.data?.submittedName || parsed.submittedName
            }
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

// This function is no longer needed as we've moved the duplicate check to addSubmission
export async function addSubmission(type: string, data: SubmissionData) {
  return withRedis(async (client) => {
    try {
      // Check for existing submission with the same name and type
      const submissions = await getAllSubmissions();
      const normalizedInput = data.name.trim().toLowerCase();
      
      const exists = submissions.some((sub: Submission) => {
        return (
          sub.type === type && 
          sub.data?.name?.trim().toLowerCase() === normalizedInput
        );
      });
      
      if (exists) {
        const formattedName = data.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        throw new Error(`Ingredient "${formattedName}" already exists`);
      }
      
      const id = `submission:${Date.now()}`;
      const submission = {
        id,
        type,
        data: {
          ...data,
          name: data.name.trim()
        },
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await client.set(id, JSON.stringify(submission));
      return submission;
    } catch (error) {
      console.error('Error in addSubmission:', error);
      throw error;
    }
  });
}

export async function submissionExists(type: string, name: string): Promise<boolean> {
  try {
    const submissions = await getAllSubmissions();
    const normalizedInput = name.trim().toLowerCase();
    
    return submissions.some((sub: Submission) => {
      const submission = typeof sub === 'string' ? JSON.parse(sub) : sub;
      return (
        submission.type === type && 
        submission.data.name.trim().toLowerCase() === normalizedInput
      );
    });
  } catch (error) {
    console.error('Error checking if submission exists:', error);
    return false;
  }
}

// List all ingredients
export async function listIngredients(): Promise<any[]> {
  const client = await getRedisClient();
  try {
    const keys = await client.keys('ingredient:*');
    if (keys.length === 0) return [];
    
    const values = await Promise.all(
      keys.map(async (key) => {
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
      })
    );
    
    return values.filter(Boolean);
  } catch (error) {
    console.error('Error listing ingredients:', error);
    return [];
  }
}

// Delete a submission by ID
export async function deleteSubmission(id: string): Promise<boolean> {
  const client = await getRedisClient();
  try {
    if (!id.startsWith('submission:')) {
      id = `submission:${id}`;
    }
    
    const result = await client.del(id);
    return result === 1;
  } catch (error) {
    console.error('Error deleting submission:', error);
    return false;
  }
}

// Create a new ingredient
export async function createIngredient(ingredient: {
  name: string;
  type: string;
  category: string;
  description?: string;
}): Promise<boolean> {
  const client = await getRedisClient();
  try {
    const id = `ingredient:${Date.now()}`;
    await client.set(
      id,
      JSON.stringify({
        ...ingredient,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    return true;
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return false;
  }
}
