'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function MigrationTool() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
    total?: number;
    updated?: number;
    unchanged?: number;
    errors?: string[];
  } | null>(null);

  const runMigration = async () => {
    if (!confirm('Are you sure you want to run the migration? This will update all submissions.')) {
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);
    
    try {
      const response = await fetch('/api/foodtree/admin/migrate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to run migration');
      }

      setMigrationResult(result);
      
      if (result.success) {
        toast.success('Migration completed successfully', {
          description: result.message,
        });
      } else {
        toast.warning('Migration completed with issues', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Migration failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <div>
        <h3 className="text-lg font-semibold">Database Migration</h3>
        <p className="text-sm text-muted-foreground">
          Migrate submission sources from old types (grown/gathered/prepared) to new types (plant/animal/other).
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={runMigration} 
          disabled={isMigrating}
          variant="destructive"
        >
          {isMigrating ? 'Migrating...' : 'Run Migration'}
        </Button>
        
        {isMigrating && (
          <div className="text-sm text-muted-foreground">
            Migration in progress, please wait...
          </div>
        )}
      </div>

      {migrationResult && (
        <div className={`p-4 rounded-md ${migrationResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
          <h4 className="font-medium mb-2">
            {migrationResult.success ? '✅ Migration Complete' : '⚠️ Migration Completed with Issues'}
          </h4>
          <p className="text-sm mb-2">{migrationResult.message}</p>
          
          {migrationResult.total !== undefined && (
            <div className="grid grid-cols-3 gap-4 text-sm mt-3">
              <div>
                <div className="font-medium">Total</div>
                <div>{migrationResult.total}</div>
              </div>
              <div>
                <div className="font-medium">Updated</div>
                <div className="text-green-600 dark:text-green-400">
                  {migrationResult.updated}
                </div>
              </div>
              <div>
                <div className="font-medium">Unchanged</div>
                <div>{migrationResult.unchanged}</div>
              </div>
            </div>
          )}

          {migrationResult.errors?.length ? (
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-1">Errors ({migrationResult.errors.length}):</h5>
              <div className="max-h-40 overflow-y-auto text-xs bg-background p-2 rounded border">
                {migrationResult.errors.map((error, i) => (
                  <div key={i} className="py-1 border-b last:border-0 last:pb-0">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
