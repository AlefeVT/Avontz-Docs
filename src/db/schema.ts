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
export const fileTypeEnum = pgEnum('fileType', [
  'pdf',
  'doc',
  'image',
  'other',
]);
export const storageClassEnum = pgEnum('storageClass', [
  'Standard',
  'InfrequentAccess',
  'Archive',
]);

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

// Tabela de containers
export const containers = pgTable(
  'containers',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    parentId: integer('parentId'),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    deletedAt: timestamp('deletedAt', { mode: 'date' }), // Remover nullable, campo ainda pode ser null sem essa função
  },
  (table) => ({
    userIdNameIdx: index('containers_user_id_name_idx').on(
      table.userId,
      table.name
    ),
  })
);

// Tabela de arquivos
export const files = pgTable(
  'files',
  {
    id: serial('id').primaryKey(),
    containerId: integer('containerId')
      .notNull()
      .references(() => containers.id, { onDelete: 'cascade' }),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    key: text('key').notNull().unique(),
    fileName: text('fileName').notNull(),
    fileSize: text('fileSize').notNull(),
    fileType: fileTypeEnum('fileType').notNull(),
    storageClass: storageClassEnum('storageClass')
      .notNull()
      .default('Standard'),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    deletedAt: timestamp('deletedAt', { mode: 'date' }), // Não precisa de `.nullable()`, o campo já aceita null
  },
  (table) => ({
    containerIdUserIdIdx: index('files_container_id_user_id_idx').on(
      table.containerId,
      table.userId
    ),
  })
);

// Tabela de assinaturas
export const signatures = pgTable(
  'signatures',
  {
    id: serial('id').primaryKey(),
    fileId: integer('fileId')
      .notNull()
      .references(() => files.id, { onDelete: 'cascade' }),
    userId: integer('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    signatureType: text('signatureType').notNull(),
    signatureValue: text('signatureValue').notNull(),
    signedAt: timestamp('signedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    fileIdUserIdIdx: index('signatures_file_id_user_id_idx').on(
      table.fileId,
      table.userId
    ),
  })
);

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

/**
 * RELACIONAMENTOS
 */

export const containerRelations = relations(containers, ({ many, one }) => ({
  files: many(files),
  user: one(users, { fields: [containers.userId], references: [users.id] }),
}));

export const fileRelations = relations(files, ({ many, one }) => ({
  signatures: many(signatures),
  container: one(containers, {
    fields: [files.containerId],
    references: [containers.id],
  }),
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));

export const signatureRelations = relations(signatures, ({ one }) => ({
  file: one(files, { fields: [signatures.fileId], references: [files.id] }),
  user: one(users, { fields: [signatures.userId], references: [users.id] }),
}));

/**
 * TYPES
 */
export type Subscription = typeof subscriptions.$inferSelect;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type File = typeof files.$inferSelect;
export type Signature = typeof signatures.$inferSelect;
export type MagicLink = typeof magicLinks.$inferSelect;
export type ResetToken = typeof resetTokens.$inferSelect;
export type VerifyEmailToken = typeof verifyEmailTokens.$inferSelect;
export type ContainerType = typeof containers.$inferSelect;
export type Account = typeof accounts.$inferSelect;
