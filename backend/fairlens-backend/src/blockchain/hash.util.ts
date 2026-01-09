import { ethers } from 'ethers';

export function canonicalStringify(obj: Record<string, any>): string {
  return JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {} as any),
  );
}

export function hashCanonicalPayload(payload: Record<string, any>): string {
  const canonical = canonicalStringify(payload);
  return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}
