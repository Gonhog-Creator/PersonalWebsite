import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { getAllSubmissions } from '@/lib/kv';

export async function GET() {
  // Check if user is admin
  const session = await getServerSession(authOptions);
  // Temporarily bypassing admin check for testing
  const isAdmin = true; // session?.user?.isAdmin;
  
  if (!isAdmin) {
    return new NextResponse(JSON.stringify({ 
      success: false, 
      message: 'Unauthorized' 
    }), { 
      status: 200, // Changed to 200 for testing
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get all submissions
    const submissions = await getAllSubmissions();
    const issues: string[] = [];
    
    // Check each submission for potential issues
    submissions.forEach((submission) => {
      const submissionId = submission.id || 'unknown-id';
      // Get name from data object if available, otherwise from root
      const name = submission.data?.name || submission.name;
      const displayName = name 
        ? `${name} (${submissionId})` 
        : `Unnamed Submission (${submissionId})`;
      
      // Check for required fields
      if (!name) {
        issues.push(`${displayName}: Missing name`);
      }
      
      const source = submission.source || submission.data?.source;
      if (!source) {
        issues.push(`${displayName}: Missing source`);
      }
      
      // Check source types
      const validSources = ['plant', 'animal', 'other', 'prepared'];
      if (source && !validSources.includes(source)) {
        issues.push(
          `${displayName}: ` +
          `Invalid source '${source}'. Must be one of: ${validSources.join(', ')}`
        );
      }
      
      // Check prepared items have preparation method and ingredients
      if (submission.source === 'prepared') {
        if (!submission.preparationMethod) {
          issues.push(
            `${displayName}: Prepared items must have a preparation method`
          );
        }
        
        if (!submission.parentIngredients || submission.parentIngredients.length === 0) {
          issues.push(
            `${displayName}: Prepared items must have at least one parent ingredient`
          );
        }
      }
      
      // Check animal items have animal type if not source animal
      if (submission.source === 'animal' && !submission.isSourceAnimal && !submission.animalType) {
        issues.push(
          `${displayName}: Animal items must have an animal type if not a source animal`
        );
      }
    });
    
    const result = {
      success: issues.length === 0,
      message: issues.length === 0 
        ? `All ${submissions.length} submissions are valid!` 
        : `Found ${issues.length} issue${issues.length !== 1 ? 's' : ''} in ${submissions.length} submissions`,
      total: submissions.length,
      valid: submissions.length - issues.length,
      issues: issues.length,
      details: issues.length > 0 ? issues : undefined
    };
    
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error checking submissions:', error);
    return new NextResponse(JSON.stringify({ 
      success: false, 
      message: 'Failed to check submissions',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
