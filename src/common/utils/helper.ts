import { Socket } from 'socket.io';
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

export const device = (client: Request | Socket) => {
  let userAgent: string | undefined;
  let ipAddress: string | string[] | undefined;
  let deviceId: string | null = null;

  if ('headers' in client) {
    // Handle Express.Request
    userAgent = client.headers['user-agent'];
    ipAddress =
      client.headers['x-forwarded-for'] ||
      client.headers['x-real-ip'] ||
      client.socket?.remoteAddress;
    deviceId = (
      Array.isArray(client.query?.deviceId)
        ? client.query.deviceId[0]
        : client.query?.deviceId || null
    ) as string;
  } else if ('handshake' in client) {
    // Handle Socket.IO
    userAgent = client.handshake.headers['user-agent'];
    ipAddress =
      client.handshake.headers['x-forwarded-for'] ||
      client.handshake.headers['x-real-ip'] ||
      client.handshake.address;
  }

  if (typeof ipAddress === 'string') {
    if (ipAddress.includes('::ffff:')) {
      ipAddress = ipAddress.split('::ffff:')[1];
    }
    if (ipAddress.includes(':')) {
      ipAddress = ipAddress.split(':')[0];
    }
  }

  let deviceType = 'Desktop';
  if (userAgent) {
    if (/mobile/i.test(userAgent)) {
      deviceType = 'Mobile';
    } else if (/iPad|iPhone|iPod|iOS/i.test(userAgent)) {
      deviceType = 'iOS';
    } else if (/Android/i.test(userAgent)) {
      deviceType = 'Android';
    }
  }

  return {
    userAgent,
    deviceType,
    deviceId,
    ip_address: ipAddress || '0.0.0.0',
  };
};
