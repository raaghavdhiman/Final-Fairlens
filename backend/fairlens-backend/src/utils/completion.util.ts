import { MilestoneStatus } from '@prisma/client';

export function calculateCompletionPercent(
  tenderBudget: number,
  milestones: {
    amount: number;
    status: MilestoneStatus;
  }[],
): number {
  if (!tenderBudget || tenderBudget <= 0) {
    return 0;
  }

  const completedAmount = milestones
    .filter(
      (m) =>
        m.status === MilestoneStatus.COMPLETED ||
        m.status === MilestoneStatus.PAID, // if you use PAID separately
    )
    .reduce((sum, m) => sum + m.amount, 0);

  const percent = (completedAmount / tenderBudget) * 100;

  // Clamp for safety
  return Math.min(Math.max(Number(percent.toFixed(2)), 0), 100);
}
