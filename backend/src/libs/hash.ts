import crypto from 'crypto';

export const uniqueKey = () =>{
    return crypto.randomBytes(16).toString('hex');
}

export function generateCodePassword(role: "DRIVER" | "STUDENT" | "ADMIN", mobileNumber: string): string {
  const prefixMap = {
    DRIVER: "DRV",
    STUDENT: "STU",
    ADMIN: "ADM",
  };

  const prefix = prefixMap[role];
  const last4 = mobileNumber.slice(-4);
  const random = Math.floor(100 + Math.random() * 900); // Optional for added randomness

  return `${prefix}${last4}`; // OR `${prefix}${last4}${random}` for more uniqueness
}