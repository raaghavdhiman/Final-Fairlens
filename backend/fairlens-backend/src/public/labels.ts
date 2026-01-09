export const EVENT_LABELS: Record<
  string,
  {
    label: string;
    icon: string;
    category: 'milestone' | 'payment' | 'tender' | 'verification';
    severity: 'info' | 'success' | 'warning';
  }
> = {
  MILESTONE_CREATED: {
    label: 'Milestone created',
    icon: '🧱',
    category: 'milestone',
    severity: 'info',
  },
  MILESTONE_STARTED: {
    label: 'Work started on milestone',
    icon: '🏗️',
    category: 'milestone',
    severity: 'info',
  },
  MILESTONE_SUBMITTED: {
    label: 'Work submitted for review',
    icon: '📤',
    category: 'milestone',
    severity: 'info',
  },
  MILESTONE_VERIFIED: {
    label: 'Milestone verified by government',
    icon: '✅',
    category: 'milestone',
    severity: 'success',
  },
  MILESTONE_PAID: {
    label: 'Payment released for milestone',
    icon: '💰',
    category: 'payment',
    severity: 'success',
  },
  CONTRACTOR_VERIFIED: {
    label: 'Contractor verified on blockchain',
    icon: '🛡️',
    category: 'verification',
    severity: 'success',
  },
  TENDER_AWARDED: {
    label: 'Tender awarded',
    icon: '📄',
    category: 'tender',
    severity: 'info',
  },
};
