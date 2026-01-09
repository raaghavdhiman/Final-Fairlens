import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { hashCanonicalPayload } from '../blockchain/hash.util';


@Injectable()
export class AuditService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly blockchainService: BlockchainService,
) {}


  async log(params: {
  userId: string;
  action: string;
  tenderId?: string;
  details?: string;
}) {
  // 1. Create audit log in DB
  const audit = await this.prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      tenderId: params.tenderId,
      details: params.details,
    },
  });

  // 2. Build canonical payload
  const payload = {
    auditId: audit.id,
    tenderId: audit.tenderId,
    action: audit.action,
    userId: audit.userId,
    timestamp: audit.timestamp.toISOString(),
  };

  // 3. Hash payload
  const auditHash = hashCanonicalPayload(payload);

  // 4. Anchor on blockchain
  const txHash = await this.blockchainService.anchorAudit(
    auditHash,
    audit.action,
    audit.tenderId ?? '',
  );

  // 5. Store proof
  await this.prisma.auditLog.update({
    where: { id: audit.id },
    data: { auditHash, txHash },
  });

  return audit;
}

}
