import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  serial,
  text,
  timestamp,
  pgTable,
  uniqueIndex,
  primaryKey,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['member', 'admin']);
export const accountTypeEnum = pgEnum('type', ['email', 'google', 'github']);

export const documentStatusEnum = pgEnum('document_status', [
  'draft',
  'signed',
  'pending_signature',
]);
export const versionStatusEnum = pgEnum('version_status', [
  'current',
  'archived',
  'pending_review',
]);

export const users = pgTable('gf_user', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

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
    deletedAt: timestamp('deletedAt', { mode: 'date' }),
  },
  (table) => ({
    userIdAccountTypeIdx: index('user_id_account_type_idx').on(
      table.userId,
      table.accountType
    ),
  })
);

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
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

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
    deletedAt: timestamp('deletedAt', { mode: 'date' }),
  },
  (table) => ({
    stripeSubscriptionIdIdx: index(
      'subscriptions_stripe_subscription_id_idx'
    ).on(table.stripeSubscriptionId),
  })
);

export const newsletters = pgTable('gf_newsletter', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
});

export const notifications = pgTable('gf_notifications', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isRead: boolean('isRead').notNull().default(false),
  type: text('type').notNull(),
  message: text('message').notNull(),
  createdOn: timestamp('createdOn', { mode: 'date' }).notNull(),
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

// Tabela de containers (pastas)
export const containers = pgTable(
  'containers',
  {
    id: serial('id').primaryKey(),
    userId: integer('userId').references(() => users.id, {
      onDelete: 'cascade',
    }),
    parentId: integer('parentId'), // Auto-referência para subpastas
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt', { mode: 'date' }).default(sql`now()`),
    deletedAt: timestamp('deletedAt', { mode: 'date' }),
  },
  (table) => ({
    userIdIdx: index('containers_user_id_idx').on(table.userId),
  })
);

// Tabela de arquivos com controle de versão
export const files = pgTable(
  'files',
  {
    id: serial('id').primaryKey(),
    containerId: integer('containerId')
      .references(() => containers.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('userId')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    fileName: text('fileName').notNull(),
    fileKey: text('fileKey').notNull().unique(), // Armazena o caminho do arquivo na Cloudflare R2
    fileSize: integer('fileSize').notNull(), // Tamanho em bytes
    fileType: text('fileType').notNull(),
    currentVersion: integer('currentVersion').default(1), // Versão atual
    createdAt: timestamp('createdAt', { mode: 'date' }).default(sql`now()`),
    deletedAt: timestamp('deletedAt', { mode: 'date' }),
  },
  (table) => ({
    fileKeyIdx: uniqueIndex('files_file_key_idx').on(table.fileKey),
  })
);

// Controle de versões de arquivos
export const fileVersions = pgTable('file_versions', {
  id: serial('id').primaryKey(),
  fileId: integer('fileId')
    .references(() => files.id, { onDelete: 'cascade' })
    .notNull(),
  versionNumber: integer('versionNumber').notNull(),
  versionStatus: versionStatusEnum('versionStatus')
    .default('current')
    .notNull(),
  fileKey: text('fileKey').notNull(), // Caminho para a versão específica
  changeLog: text('changeLog'), // Registro de mudanças
  createdAt: timestamp('createdAt', { mode: 'date' }).default(sql`now()`),
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

// Assinaturas de documentos com geolocalização
export const signatures = pgTable('signatures', {
  id: serial('id').primaryKey(),
  fileId: integer('fileId')
    .references(() => files.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('userId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  signatureDate: timestamp('signatureDate', { mode: 'date' })
    .notNull()
    .default(sql`now()`),
  geoLocation: jsonb('geoLocation').notNull(), // Geolocalização da assinatura
  isValid: boolean('isValid').default(true), // Validade da assinatura
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

// Comentários em documentos
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  fileId: integer('fileId')
    .references(() => files.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('userId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).default(sql`now()`),
  parentCommentId: integer('parentCommentId'), // Comentário pai, para suporte a threads
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

// Tabela de workflows de aprovação de documentos
export const approvalWorkflows = pgTable('approval_workflows', {
  id: serial('id').primaryKey(),
  fileId: integer('fileId')
    .references(() => files.id, { onDelete: 'cascade' })
    .notNull(),
  reviewerId: integer('reviewerId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  approvalStatus: text('approvalStatus').default('pending').notNull(), // Exemplo: 'pending', 'approved', 'rejected'
  reviewDate: timestamp('reviewDate'),
  comments: text('comments'), // Comentários do revisor
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

// Permissões detalhadas de acesso a arquivos
export const filePermissions = pgTable('file_permissions', {
  id: serial('id').primaryKey(),
  fileId: integer('fileId')
    .references(() => files.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('userId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  canView: boolean('canView').default(true),
  canEdit: boolean('canEdit').default(false),
  canComment: boolean('canComment').default(true),
  canSign: boolean('canSign').default(false),
});

// Automatização de processos
export const automations = pgTable('automations', {
  id: serial('id').primaryKey(),
  fileId: integer('fileId').references(() => files.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // Exemplo: 'reminder', 'lock_after_due_date'
  triggerTime: timestamp('triggerTime', { mode: 'date' }).notNull(),
  status: text('status').default('pending').notNull(), // Exemplo: 'pending', 'completed'
});

// Tabela de atividades
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  action: text('action').notNull(), // Exemplo: 'document_signed', 'file_uploaded', 'comment_added'
  targetId: integer('targetId'), // ID do alvo da ação (arquivo, documento)
  targetType: text('targetType'), // Tipo de alvo: 'file', 'container'
  createdAt: timestamp('createdAt', { mode: 'date' }).default(sql`now()`),
  deletedAt: timestamp('deletedAt', { mode: 'date' }),
});

// Tabela de resumos gerados por IA
export const aiSummaries = pgTable('ai_summaries', {
  id: serial('id').primaryKey(),
  fileId: integer('fileId')
    .references(() => files.id, { onDelete: 'cascade' })
    .notNull(),
  summary: text('summary').notNull(), // Resumo gerado
  generatedAt: timestamp('generatedAt', { mode: 'date' }).default(sql`now()`),
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

export type Container = typeof containers.$inferSelect;
export type File = typeof files.$inferSelect;
export type FileVersion = typeof fileVersions.$inferSelect;
export type Signature = typeof signatures.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type ApprovalWorkflow = typeof approvalWorkflows.$inferSelect;
export type FilePermission = typeof filePermissions.$inferSelect;
export type Automation = typeof automations.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type AISummary = typeof aiSummaries.$inferSelect;

export type ContainerId = Container['id'];

export type NewContainer = Omit<typeof containers.$inferInsert, 'id'>;