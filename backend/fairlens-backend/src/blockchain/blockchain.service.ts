import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';

/**
 * ABI contains ONLY what backend needs.
 * Escrow-style milestone payment.
 */
const ABI = [
  // ---- Audit anchoring ----
  'event AuditAnchored(bytes32 indexed auditHash, string action, string tenderId, uint256 timestamp)',
  'function anchorAudit(bytes32 auditHash, string action, string tenderId) external',

  // ---- Contractor verification ----
  'event ContractorVerified(bytes32 indexed contractorHash, address wallet, uint256 timestamp)',
  'function verifyContractor(bytes32 contractorHash, address wallet) external',

  // ---- Escrow milestone payment ----
  'event MilestonePaid(bytes32 indexed milestoneHash, address indexed contractor, uint256 amount, uint256 timestamp)',
  'function releaseMilestonePayment(bytes32 milestoneHash, address contractor, uint256 amount) external',
];

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const privateKey = process.env.BACKEND_PRIVATE_KEY;
    const contractAddress = process.env.FAIRLENS_VERIFIER_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing blockchain environment variables');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, ABI, this.wallet);

    this.logger.log('BlockchainService connected to Sepolia');
  }

  /* =========================================================
     AUDIT LOG ANCHORING
     ========================================================= */
  async anchorAudit(
    auditHash: string,
    action: string,
    tenderId: string,
  ): Promise<string> {
    const tx = await this.contract.anchorAudit(
      auditHash,
      action,
      tenderId,
    );

    await tx.wait();
    return tx.hash;
  }

  /* =========================================================
     CONTRACTOR ON-CHAIN VERIFICATION
     ========================================================= */
  async verifyContractor(
    contractorHash: string,
    wallet: string,
  ): Promise<string> {
    const tx = await this.contract.verifyContractor(
      contractorHash,
      wallet,
    );

    await tx.wait();
    return tx.hash;
  }

  /* =========================================================
   ESCROW MILESTONE PAYMENT (FINAL & CORRECT)
   ========================================================= */

async releaseMilestonePayment(params: {
  milestoneHash: string;
  contractorWallet: string;
  amountWei: bigint;
}): Promise<string> {
  const { milestoneHash, contractorWallet, amountWei } = params;

  this.logger.log(
    `Releasing escrow payment | milestone=${milestoneHash} | amountWei=${amountWei}`,
  );

  // ⛓️ Send transaction (DO NOT wait inside Prisma tx)
  const tx = await this.contract.releaseMilestonePayment(
    milestoneHash,
    contractorWallet,
    amountWei,
  );

  this.logger.log(
    `Milestone payment submitted | txHash=${tx.hash}`,
  );

  // ✅ RETURN IMMEDIATELY
  return tx.hash;
}





}
