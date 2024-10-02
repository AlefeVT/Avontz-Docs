import { relations, sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  pgEnum,
  serial,
  text,
  timestamp,
  pgTable,
} from 'drizzle-orm/pg-core';

// Enums para roles e tipos de arquivos/armazenamento
export const roleEnum = pgEnum('role', ['member', 'admin']);
export const accountTypeEnum = pgEnum('type', ['email', 'google', 'github']);

// Tabela de usuários
export const users = pgTable('gf_user', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
});

// Tabela de contas
export const accounts = pgTable(
  'gf_accounts',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountType: accountTypeEnum('accountType').notNull(),
    githubId: text('githubId').unique(),
    googleId: text('googleId').unique(),
    password: text('password'),
    salt: text('salt'),
  },
  (table) => ({
    userIdAccountTypeIdx: index('user_id_account_type_idx').on(
      table.userId,
      table.accountType
    ),
  })
);

// Tabela de magic links
export const magicLinks = pgTable(
  'gf_magic_links',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    token: text('token'),
    tokenExpiresAt: timestamp('tokenExpiresAt', { mode: 'date' }),
  },
  (table) => ({
    tokenIdx: index('magic_links_token_idx').on(table.token),
  })
);

// Tabela de reset tokens
export const resetTokens = pgTable(
  'gf_reset_tokens',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    token: text('token'),
    tokenExpiresAt: timestamp('tokenExpiresAt', { mode: 'date' }),
  },
  (table) => ({
    tokenIdx: index('reset_tokens_token_idx').on(table.token),
  })
);

// Tabela de tokens de verificação de email
export const verifyEmailTokens = pgTable(
  'gf_verify_email_tokens',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    token: text('token'),
    tokenExpiresAt: timestamp('tokenExpiresAt', { mode: 'date' }),
  },
  (table) => ({
    tokenIdx: index('verify_email_tokens_token_idx').on(table.token),
  })
);

// Tabela de perfis
export const profiles = pgTable('gf_profile', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  displayName: text('displayName'),
  imageId: text('imageId'),
  image: text('image'),
  bio: text('bio').notNull().default(''),
});

// Tabela de sessões
export const sessions = pgTable(
  'gf_session',
  {
    id: text('id').primaryKey(),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
  })
);

// Tabela de assinaturas
export const subscriptions = pgTable(
  'gf_subscriptions',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
    stripeCustomerId: text('stripeCustomerId').notNull(),
    stripePriceId: text('stripePriceId').notNull(),
    stripeCurrentPeriodEnd: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => ({
    stripeSubscriptionIdIdx: index(
      'subscriptions_stripe_subscription_id_idx'
    ).on(table.stripeSubscriptionId),
  })
);

// Tabela de newsletters
export const newsletters = pgTable('gf_newsletter', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
});

// Tabela de notificações
export const notifications = pgTable('gf_notifications', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isRead: boolean('isRead').notNull().default(false),
  type: text('type').notNull(),
  message: text('message').notNull(),
  createdOn: timestamp('createdOn', { mode: 'date' }).notNull(),
});

// Tabela de plantas
export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  scientificName: text('scientificName'),
  description: text('description').notNull(),
  history: text('history'),
  photoName: text('photoFileName').notNull(),
  qrCode: text('qrCode'), 
  createdAt: timestamp('createdAt', { mode: 'date' }).default(sql`now()`),
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

/**
 * RELACIONAMENTOS
 */

/**
 * TYPES
 */
export type Subscription = typeof subscriptions.$inferSelect;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type MagicLink = typeof magicLinks.$inferSelect;
export type ResetToken = typeof resetTokens.$inferSelect;
export type VerifyEmailToken = typeof verifyEmailTokens.$inferSelect;
export type Account = typeof accounts.$inferSelect;

export type NewPlant = typeof plants.$inferInsert;

export type Plants = typeof plants.$inferSelect;

export type PlantId = Plants["id"];
