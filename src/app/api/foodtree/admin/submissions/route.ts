import { NextResponse } from 'next/server';
import { listSubmissions, updateSubmissionStatus, deleteSubmission, approveSubmission } from '@/lib/foodtree/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const submissions = await listSubmissions(status || undefined);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, notes } = await request.json();

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'id and status (approved/rejected) are required' }, { status: 400 });
    }

    if (status === 'approved') {
      const submission = await approveSubmission(id);
      return NextResponse.json(submission);
    } else {
      const submission = await updateSubmissionStatus(id, 'rejected', notes);
      return NextResponse.json(submission);
    }
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 });
    }

    await deleteSubmission(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
