import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { IJWTPayload } from '../interfaces/global.interface';

export const encryptText = async (text: string): Promise<string> => {
  const encrypt_password = await bcrypt.hash(text, 10);
  return encrypt_password ?? '';
};

export const compareText = async (
  text: string,
  hashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(text, hashed);
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
  const userAgent = req.headers['user-agent'];

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
  const deviceId = Array.isArray(req.query.deviceId)
    ? req.query.deviceId[0]
    : req.query.deviceId || null;

  let ipAddress: string | string[] =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress;

  console.log(
    'IPV4-IPV6',
    req.headers['x-forwarded-for'],
    req.headers['x-real-ip'],
    req.socket.remoteAddress,
  );
  console.log(req?.headers);

  if (typeof ipAddress === 'string') {
    if (ipAddress.includes('::ffff:')) {
      ipAddress = ipAddress.split('::ffff:')[1];
    }
    if (ipAddress.includes(':')) {
      ipAddress = ipAddress.split(':')[0];
    }
  }

  // Return with device type, ID, and IP address
  return {
    userAgent,
    deviceType,
    deviceId,
    ip_address: ipAddress,
  };
};
