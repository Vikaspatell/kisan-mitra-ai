import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import { User, SafeUser, ChatMessage, Notification, GovernmentScheme, MandiPrice } from '../types';
import { REAL_GOVERNMENT_SCHEMES, REAL_MANDI_PRICES } from './seedData';

// Storage paths for fallback mode
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreSchema {
  users: User[];
  chatMessages: ChatMessage[];
  notifications: Notification[];
  schemes: GovernmentScheme[];
  mandiPrices: MandiPrice[];
}

let pgPool: Pool | null = null;
let isPostgresConnected = false;
let store: StoreSchema = {
  users: [],
  chatMessages: [],
  notifications: [],
  schemes: REAL_GOVERNMENT_SCHEMES,
  mandiPrices: REAL_MANDI_PRICES,
};

function ensureStoreFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } else {
    try {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      store = {
        users: parsed.users || [],
        chatMessages: parsed.chatMessages || [],
        notifications: parsed.notifications || [],
        schemes: parsed.schemes && parsed.schemes.length > 0 ? parsed.schemes : REAL_GOVERNMENT_SCHEMES,
        mandiPrices: parsed.mandiPrices && parsed.mandiPrices.length > 0 ? parsed.mandiPrices : REAL_MANDI_PRICES,
      };

      // Seed default demo farmer if empty
      if (store.users.length === 0) {
        const demoHash = bcrypt.hashSync('kisan123', 10);
        const demoUser: User = {
          id: 'farmer_demo_1001',
          name: 'Ramesh Kumar Patel',
          phone: '9876543210',
          email: 'ramesh.farmer@kisanmitra.in',
          passwordHash: demoHash,
          state: 'Uttar Pradesh',
          district: 'Aligarh',
          village: 'Khair',
          landSize: 3.5,
          crops: ['Wheat', 'Mustard', 'Potato'],
          preferredLanguage: 'hi',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.users.push(demoUser);

        store.notifications.push({
          id: 'notif_demo_1',
          userId: demoUser.id,
          type: 'scheme',
          title: 'PM-KISAN 17th Installment Credited / पीएम-किसान 17वीं किस्त जारी',
          message: 'Direct benefit transfer of ₹2,000 has been credited to your Aadhaar-linked bank account.',
          severity: 'success',
          isRead: false,
          actionUrl: '/schemes',
          createdAt: new Date().toISOString(),
        });

        store.notifications.push({
          id: 'notif_demo_2',
          userId: demoUser.id,
          type: 'market',
          title: 'Mustard Rate Spike in Aligarh Mandi / सरसों का भाव बढ़ा',
          message: 'Mustard modal price reached ₹5,680/quintal in your local market. Favorable time for market arrivals.',
          severity: 'info',
          isRead: false,
          actionUrl: '/market-prices',
          createdAt: new Date().toISOString(),
        });

        fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
      }
    } catch {
      fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
    }
  }
}

function persistStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
}

export async function initDb(): Promise<void> {
  ensureStoreFile();

  try {
    const pool = new Pool({
      connectionString: config.databaseUrl,
      connectionTimeoutMillis: 3000,
    });

    const client = await pool.connect();
    pgPool = pool;
    isPostgresConnected = true;
    console.log(`[DB] Connected to PostgreSQL at ${config.databaseUrl.replace(/:\/\/.*@/, '://***@')}`);

    // Read and run schema.sql
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('[DB] PostgreSQL schema verified and up to date.');
    }

    // Seed schemes if not present
    const schemeCountRes = await client.query('SELECT COUNT(*) FROM government_schemes');
    if (parseInt(schemeCountRes.rows[0].count, 10) === 0) {
      for (const s of REAL_GOVERNMENT_SCHEMES) {
        await client.query(
          `INSERT INTO government_schemes (id, name, name_hi, name_te, category, state, department, summary, summary_hi, summary_te, benefits, benefits_hi, benefits_te, eligibility, required_documents, application_steps, official_portal_url, source, last_updated)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
           ON CONFLICT (id) DO NOTHING`,
          [
            s.id, s.name, s.nameHi || null, s.nameTe || null, s.category, s.state || null, s.department,
            s.summary, s.summaryHi || null, s.summaryTe || null, s.benefits, s.benefitsHi || null, s.benefitsTe || null,
            JSON.stringify(s.eligibility), JSON.stringify(s.requiredDocuments), JSON.stringify(s.applicationSteps),
            s.officialPortalUrl, s.source, s.lastUpdated
          ]
        );
      }
      console.log(`[DB] Seeded ${REAL_GOVERNMENT_SCHEMES.length} real government schemes into PostgreSQL.`);
    }

    // Seed mandi prices if not present
    const mandiCountRes = await client.query('SELECT COUNT(*) FROM mandi_prices');
    if (parseInt(mandiCountRes.rows[0].count, 10) === 0) {
      for (const m of REAL_MANDI_PRICES) {
        await client.query(
          `INSERT INTO mandi_prices (id, state, district, market, commodity, variety, min_price, max_price, modal_price, unit, arrival_date, source)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          [
            m.id, m.state, m.district, m.market, m.commodity, m.variety,
            m.minPrice, m.maxPrice, m.modalPrice, m.unit, m.arrivalDate, m.source
          ]
        );
      }
      console.log(`[DB] Seeded ${REAL_MANDI_PRICES.length} real mandi market prices into PostgreSQL.`);
    }

    client.release();
  } catch (err: unknown) {
    const error = err as Error;
    isPostgresConnected = false;
    console.warn(`[DB] Notice: Local PostgreSQL server not reachable (${error.message || 'connection failed'}).`);
    console.log('[DB] Seamlessly running in synchronized persistent storage mode so application is fully operational out-of-the-box.');
  }
}

// User operations
export const dbUsers = {
  async findByPhone(phone: string): Promise<User | null> {
    if (isPostgresConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM users WHERE phone = $1', [phone]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email,
        passwordHash: r.password_hash,
        state: r.state,
        district: r.district,
        village: r.village,
        landSize: Number(r.land_size),
        crops: typeof r.crops === 'string' ? JSON.parse(r.crops) : (r.crops || []),
        preferredLanguage: r.preferred_language || 'en',
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    }
    return store.users.find(u => u.phone === phone) || null;
  },

  async findById(id: string): Promise<User | null> {
    if (isPostgresConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email,
        passwordHash: r.password_hash,
        state: r.state,
        district: r.district,
        village: r.village,
        landSize: Number(r.land_size),
        crops: typeof r.crops === 'string' ? JSON.parse(r.crops) : (r.crops || []),
        preferredLanguage: r.preferred_language || 'en',
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    }
    return store.users.find(u => u.id === id) || null;
  },

  async create(user: User): Promise<User> {
    if (isPostgresConnected && pgPool) {
      await pgPool.query(
        `INSERT INTO users (id, name, phone, email, password_hash, state, district, village, land_size, crops, preferred_language, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          user.id, user.name, user.phone, user.email || null, user.passwordHash,
          user.state, user.district, user.village || null, user.landSize,
          JSON.stringify(user.crops), user.preferredLanguage, user.createdAt, user.updatedAt
        ]
      );
      return user;
    }
    store.users.push(user);
    persistStore();
    return user;
  },

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    if (isPostgresConnected && pgPool) {
      const current = await this.findById(id);
      if (!current) return null;
      const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
      await pgPool.query(
        `UPDATE users SET name = $1, state = $2, district = $3, village = $4, land_size = $5, crops = $6, preferred_language = $7, updated_at = $8
         WHERE id = $9`,
        [
          updated.name, updated.state, updated.district, updated.village || null,
          updated.landSize, JSON.stringify(updated.crops), updated.preferredLanguage, updated.updatedAt, id
        ]
      );
      return updated;
    }
    const idx = store.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...updates, updatedAt: new Date().toISOString() };
    persistStore();
    return store.users[idx];
  }
};

// Chat operations
export const dbChat = {
  async getMessagesByUserId(userId: string): Promise<ChatMessage[]> {
    if (isPostgresConnected && pgPool) {
      const res = await pgPool.query(
        'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
        [userId]
      );
      return res.rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        role: r.role,
        content: r.content,
        language: r.language,
        createdAt: r.created_at,
      }));
    }
    return store.chatMessages.filter(m => m.userId === userId);
  },

  async addMessage(message: ChatMessage): Promise<ChatMessage> {
    if (isPostgresConnected && pgPool) {
      await pgPool.query(
        'INSERT INTO chat_messages (id, user_id, role, content, language, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [message.id, message.userId, message.role, message.content, message.language, message.createdAt]
      );
      return message;
    }
    store.chatMessages.push(message);
    persistStore();
    return message;
  },

  async clearUserMessages(userId: string): Promise<void> {
    if (isPostgresConnected && pgPool) {
      await pgPool.query('DELETE FROM chat_messages WHERE user_id = $1', [userId]);
      return;
    }
    store.chatMessages = store.chatMessages.filter(m => m.userId !== userId);
    persistStore();
  }
};

// Notification operations
export const dbNotifications = {
  async getByUserId(userId: string): Promise<Notification[]> {
    if (isPostgresConnected && pgPool) {
      const res = await pgPool.query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        type: r.type,
        title: r.title,
        message: r.message,
        severity: r.severity,
        isRead: r.is_read,
        actionUrl: r.action_url,
        createdAt: r.created_at,
      }));
    }
    return store.notifications.filter(n => n.userId === userId);
  },

  async create(notification: Notification): Promise<Notification> {
    if (isPostgresConnected && pgPool) {
      await pgPool.query(
        'INSERT INTO notifications (id, user_id, type, title, message, severity, is_read, action_url, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [notification.id, notification.userId, notification.type, notification.title, notification.message, notification.severity, notification.isRead, notification.actionUrl || null, notification.createdAt]
      );
      return notification;
    }
    store.notifications.unshift(notification);
    persistStore();
    return notification;
  },

  async markAsRead(id: string, userId: string): Promise<boolean> {
    if (isPostgresConnected && pgPool) {
      const res = await pgPool.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return (res.rowCount ?? 0) > 0;
    }
    const notif = store.notifications.find(n => n.id === id && n.userId === userId);
    if (!notif) return false;
    notif.isRead = true;
    persistStore();
    return true;
  },

  async markAllAsRead(userId: string): Promise<void> {
    if (isPostgresConnected && pgPool) {
      await pgPool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [userId]);
      return;
    }
    store.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    persistStore();
  }
};

// Schemes operations
export const dbSchemes = {
  async getAll(): Promise<GovernmentScheme[]> {
    if (isPostgresConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM government_schemes ORDER BY name ASC');
      return res.rows.map(r => ({
        id: r.id,
        name: r.name,
        nameHi: r.name_hi,
        nameTe: r.name_te,
        category: r.category,
        state: r.state,
        department: r.department,
        summary: r.summary,
        summaryHi: r.summary_hi,
        summaryTe: r.summary_te,
        benefits: r.benefits,
        benefitsHi: r.benefits_hi,
        benefitsTe: r.benefits_te,
        eligibility: typeof r.eligibility === 'string' ? JSON.parse(r.eligibility) : r.eligibility,
        requiredDocuments: typeof r.required_documents === 'string' ? JSON.parse(r.required_documents) : r.required_documents,
        applicationSteps: typeof r.application_steps === 'string' ? JSON.parse(r.application_steps) : r.application_steps,
        officialPortalUrl: r.official_portal_url,
        source: r.source,
        lastUpdated: r.last_updated,
      }));
    }
    return store.schemes;
  },

  async getById(id: string): Promise<GovernmentScheme | null> {
    const all = await this.getAll();
    return all.find(s => s.id === id) || null;
  }
};

// Mandi prices operations
export const dbMandi = {
  async getAll(): Promise<MandiPrice[]> {
    if (isPostgresConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM mandi_prices ORDER BY updated_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        state: r.state,
        district: r.district,
        market: r.market,
        commodity: r.commodity,
        variety: r.variety,
        minPrice: Number(r.min_price),
        maxPrice: Number(r.max_price),
        modalPrice: Number(r.modal_price),
        unit: r.unit,
        arrivalDate: r.arrival_date,
        source: r.source,
        updatedAt: r.updated_at,
      }));
    }
    return store.mandiPrices;
  }
};
