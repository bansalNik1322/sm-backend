import * as bcrypt from 'bcrypt';
import { Request } from 'express';

// Encrypt text
export const encryptText = async (text: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(text, 10);
  console.log('Encrypted Text:', hashedPassword); // Debug: Check encrypted text
  return hashedPassword ?? '';
};

// Compare text with hashed value
export const compareText = async (
  text: string,
  hashed: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(text, hashed);
  return isMatch;
};

export const generateOTP = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let otp = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }
  return otp;
};

export const device = (req: Request) => {
  const userAgent = req?.headers?.['user-agent'];

  let deviceType;
  if (/mobile/i.test(userAgent)) {
    deviceType = 'Mobile';
  } else if (/iPad|iPhone|iPod|iOS/i.test(userAgent)) {
    deviceType = 'iOS';
  } else if (/Android/i.test(userAgent)) {
    deviceType = 'Android';
  } else {
    deviceType = 'Desktop';
  }

  // Ensure deviceId is a string or null
  const deviceId = Array.isArray(req?.query?.deviceId)
    ? req?.query?.deviceId[0]
    : req?.query?.deviceId || null;

  let ipAddress: string | string[] =
    req?.headers?.['x-forwarded-for'] ||
    req?.headers?.['x-real-ip'] ||
    req?.socket?.remoteAddress;

  if (typeof ipAddress === 'string') {
    if (ipAddress?.includes('::ffff:')) {
      ipAddress = ipAddress?.split('::ffff:')[1];
    }
    if (ipAddress?.includes(':')) {
      ipAddress = ipAddress?.split(':')[0];
    }
  }

  return {
    userAgent,
    deviceType,
    deviceId,
    ip_address: ipAddress || '0.0.0.0',
  };
};
