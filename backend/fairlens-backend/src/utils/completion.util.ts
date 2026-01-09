import { MilestoneStatus } from '@prisma/client';

export function calculateCompletionPercent(
  tenderBudget: number,
  milestones: {
    amount: number;
    status: MilestoneStatus;
    isPaid: boolean;
  }[],
): number {
  if (!tenderBudget || tenderBudget <= 0) {
    return 0;
  }

  const completedAmount = milestones
    .filter(
      (m) =>
        m.status === MilestoneStatus.COMPLETED ||
        m.isPaid === true
    )
    .reduce((sum, m) => sum + m.amount, 0);

  const percent = (completedAmount / tenderBudget) * 100;

  // Clamp for safety
  return Math.min(Math.max(Number(percent.toFixed(2)), 0), 100);
}
