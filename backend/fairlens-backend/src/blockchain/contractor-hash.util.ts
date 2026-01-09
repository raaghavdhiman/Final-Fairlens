import { keccak256, toUtf8Bytes } from 'ethers';

/*
  🔐 CANONICAL CONTRACTOR IDENTITY
  --------------------------------
  This hash MUST be:
  - Deterministic
  - Recomputable forever
  - Independent of time
*/

export interface ContractorIdentityPayload {
  contractorId: string;
  name: string;
  walletAddress: string;
  verifiedBy: string; // logical authority (e.g. GOVERNMENT)
}

export function hashContractorIdentity(
  payload: ContractorIdentityPayload,
): string {
  const canonical = JSON.stringify({
    contractorId: payload.contractorId,
    name: payload.name.trim(),
    walletAddress: payload.walletAddress.toLowerCase(),
    verifiedBy: payload.verifiedBy,
  });

  return keccak256(toUtf8Bytes(canonical));
}
