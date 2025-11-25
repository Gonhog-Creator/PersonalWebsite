'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { Submission } from '@/types/submission';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface FoodTypeChartProps {
  submissions: Submission[];
}

type FoodCategory = 'plant' | 'animal' | 'other';

interface FoodTypeCounts {
  plant: number;
  animal: number;
  other: number;
}

export function FoodTypeChart({ submissions }: FoodTypeChartProps) {
  // Count submissions by food category
  const foodTypeCounts = submissions.reduce<FoodTypeCounts>((acc, submission) => {
    // Get the source from the submission data, default to 'other' if not specified
    const source = (submission.data as any)?.source?.toLowerCase() || 'other';
    
    // Map the source to our categories
    if (source === 'plant') {
      acc.plant += 1;
    } else if (source === 'animal') {
      acc.animal += 1;
    } else {
      acc.other += 1;
    }
    
    return acc;
  }, { plant: 0, animal: 0, other: 0 });

  // Prepare data for the chart
  const data: ChartData<'pie'> = {
    labels: ['Plant-based', 'Animal-based', 'Other'],
    datasets: [
      {
        data: [
          foodTypeCounts.plant,
          foodTypeCounts.animal,
          foodTypeCounts.other
        ],
        backgroundColor: [
          '#10B981', // Green for plant-based
          '#EF4444', // Red for animal-based
          '#6B7280', // Gray for other
        ],
        borderColor: '#1F2937',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#9CA3AF',
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'pie'>) => {
            const label = context.label || '';
            const value = context.raw as number || 0;
            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-medium mb-4 text-white">
        Food Type Distribution
      </h3>
      <div className="h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
