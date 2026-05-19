import webpush from 'web-push';
import pool from './db';

// VAPID keys from environment variables
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

// Configure web-push with VAPID keys
if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:admin@eldent.com',
    publicVapidKey,
    privateVapidKey
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushToken {
  id: number;
  user_id: number | null;
  admin_id: number | null;
  token: string;
  endpoint: string;
  keys_json: string;
}

export interface NotificationData {
  type?: string;
  appointmentId?: number;
  [key: string]: unknown;
}

// Save push token to database
export async function savePushToken(
  userId: number | null,
  adminId: number | null,
  subscription: PushSubscription
): Promise<void> {
  try {
    const { endpoint, keys } = subscription;
    const token = keys.p256dh; // Use p256dh as a unique token identifier
    const keysJson = JSON.stringify(keys);

    // Check if token already exists
    const [existing] = await pool.execute(
      'SELECT id FROM push_tokens WHERE token = ?',
      [token]
    ) as [Record<string, unknown>[], unknown];

    if (existing.length > 0) {
      // Update existing token
      await pool.execute(
        'UPDATE push_tokens SET endpoint = ?, keys_json = ?, updated_at = CURRENT_TIMESTAMP WHERE token = ?',
        [endpoint, keysJson, token]
      );
    } else {
      // Insert new token
      await pool.execute(
        'INSERT INTO push_tokens (user_id, admin_id, token, endpoint, keys_json) VALUES (?, ?, ?, ?, ?)',
        [userId, adminId, token, endpoint, keysJson]
      );
    }
  } catch (error) {
    console.error('Error saving push token:', error);
  }
}

// Get push tokens for a user
export async function getUserPushTokens(userId: number): Promise<PushToken[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM push_tokens WHERE user_id = ?',
      [userId]
    ) as [PushToken[], unknown];
    return rows;
  } catch (error) {
    console.error('Error getting user push tokens:', error);
    return [];
  }
}

// Get push tokens for admin
export async function getAdminPushTokens(adminId: number): Promise<PushToken[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM push_tokens WHERE admin_id = ?',
      [adminId]
    ) as [PushToken[], unknown];
    return rows;
  } catch (error) {
    console.error('Error getting admin push tokens:', error);
    return [];
  }
}

// Get all admin push tokens
export async function getAllAdminPushTokens(): Promise<PushToken[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM push_tokens WHERE admin_id IS NOT NULL'
    ) as [PushToken[], unknown];
    return rows;
  } catch (error) {
    console.error('Error getting all admin push tokens:', error);
    return [];
  }
}

// Send push notification
export async function sendPushNotification(
  tokens: PushToken[],
  title: string,
  body: string,
  data?: NotificationData
): Promise<void> {
  const payload = JSON.stringify({
    title,
    body,
    data,
  });

  for (const token of tokens) {
    try {
      const subscription = {
        endpoint: token.endpoint,
        keys: JSON.parse(token.keys_json) as PushSubscription['keys'],
      };

      await webpush.sendNotification(subscription, payload);
    } catch (error) {
      const err = error as { statusCode?: number };
      // If token is invalid or expired, remove it from database
      if (err.statusCode === 410 || err.statusCode === 404) {
        await pool.execute('DELETE FROM push_tokens WHERE id = ?', [token.id]);
      }
      console.error('Error sending push notification:', error);
    }
  }
}

// Send notification to user
export async function notifyUser(
  userId: number,
  title: string,
  body: string,
  data?: NotificationData
): Promise<void> {
  const tokens = await getUserPushTokens(userId);
  if (tokens.length > 0) {
    await sendPushNotification(tokens, title, body, data);
  }
}

// Send notification to admin
export async function notifyAdmin(
  adminId: number,
  title: string,
  body: string,
  data?: NotificationData
): Promise<void> {
  const tokens = await getAdminPushTokens(adminId);
  if (tokens.length > 0) {
    await sendPushNotification(tokens, title, body, data);
  }
}

// Send notification to all admins
export async function notifyAllAdmins(
  title: string,
  body: string,
  data?: NotificationData
): Promise<void> {
  const tokens = await getAllAdminPushTokens();
  if (tokens.length > 0) {
    await sendPushNotification(tokens, title, body, data);
  }
}
