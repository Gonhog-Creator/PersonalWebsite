import UpdatesClient from './UpdatesClient';

export const updates = [
  {
    version: '1.2.0',
    date: 'November 25, 2025',
    title: 'Selection Update',
    type: 'enhancement',
    changes: [
      'Changes to interactive tree, you can now select a node and see all parent nodes highlighted in yellow',
      'Improved submission handling to filter out profanity',
      'Admin Dashboard updates'
    ]
  },
  {
    version: '1.1.2',
    date: 'November 20, 2025',
    title: 'Submission Hotfix',
    type: 'enhancement',
    changes: [
      'Fixed issue with duplicate submission searching that was causing all submissions to be rejected'
    ]
  },
  {
    version: '1.1.1',
    date: 'November 20, 2025',
    title: 'Update Page',
    type: 'enhancement',
    changes: [
      'Added Update Page for Food Tree Project',
      'Minor Fixes'
    ]
  },
  {
    version: '1.1.0',
    date: 'November 20, 2025',
    title: 'Improved Data Management',
    type: 'enhancement',
    changes: [
      'Standardized submission data structure',
      'Enhanced data validation and cleanup',
      'Improved error handling and user feedback',
      'Updated Admin Page for cleanliness',
      'Reorganized Ingredient submission typed to Animal, Plant, Other, and Processed',
      'Animal submission now offers Animal Product vs Source Animal'
    ]
  },
  {
    version: '1.0.0',
    date: 'November 10, 2025',
    title: 'Initial Release',
    type: 'launch',
    changes: [
      'Basic food tree visualization',
      'Ingredient submission system',
      'Main Page Creation',
      'Tile Added to Side Quests'
    ]
  }
];

export default function VersionUpdates() {
  return <UpdatesClient />;
}
