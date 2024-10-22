DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('email', 'google', 'github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."document_status" AS ENUM('draft', 'signed', 'pending_signature');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('member', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."version_status" AS ENUM('current', 'archived', 'pending_review');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"accountType" "type" NOT NULL,
	"githubId" text,
	"googleId" text,
	"password" text,
	"salt" text,
	"deletedAt" timestamp,
	CONSTRAINT "gf_accounts_githubId_unique" UNIQUE("githubId"),
	CONSTRAINT "gf_accounts_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"action" text NOT NULL,
	"targetId" integer,
	"targetType" text,
	"createdAt" timestamp DEFAULT now(),
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileId" integer NOT NULL,
	"summary" text NOT NULL,
	"generatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "approval_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileId" integer NOT NULL,
	"reviewerId" integer NOT NULL,
	"approvalStatus" text DEFAULT 'pending' NOT NULL,
	"reviewDate" timestamp,
	"comments" text,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "automations" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileId" integer,
	"action" text NOT NULL,
	"triggerTime" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileId" integer NOT NULL,
	"userId" integer NOT NULL,
	"comment" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"parentCommentId" integer,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "containers" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"parentId" integer,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileId" integer NOT NULL,
	"userId" integer NOT NULL,
	"canView" boolean DEFAULT true,
	"canEdit" boolean DEFAULT false,
	"canComment" boolean DEFAULT true,
	"canSign" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileId" integer NOT NULL,
	"versionNumber" integer NOT NULL,
	"versionStatus" "version_status" DEFAULT 'current' NOT NULL,
	"fileKey" text NOT NULL,
	"changeLog" text,
	"createdAt" timestamp DEFAULT now(),
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"containerId" integer NOT NULL,
	"userId" integer NOT NULL,
	"fileName" text NOT NULL,
	"fileKey" text NOT NULL,
	"fileSize" integer NOT NULL,
	"fileType" text NOT NULL,
	"currentVersion" integer DEFAULT 1,
	"createdAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	CONSTRAINT "files_fileKey_unique" UNIQUE("fileKey")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_magic_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "gf_magic_links_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_newsletter" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "gf_newsletter_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"createdOn" timestamp NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"displayName" text,
	"imageId" text,
	"image" text,
	"bio" text DEFAULT '' NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "gf_profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "gf_reset_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "signatures" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileId" integer NOT NULL,
	"userId" integer NOT NULL,
	"signatureDate" timestamp DEFAULT now() NOT NULL,
	"geoLocation" jsonb NOT NULL,
	"isValid" boolean DEFAULT true,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"stripeSubscriptionId" text NOT NULL,
	"stripeCustomerId" text NOT NULL,
	"stripePriceId" text NOT NULL,
	"expires" timestamp NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "gf_subscriptions_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"emailVerified" timestamp,
	"deletedAt" timestamp,
	CONSTRAINT "gf_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_verify_email_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "gf_verify_email_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_accounts" ADD CONSTRAINT "gf_accounts_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_summaries" ADD CONSTRAINT "ai_summaries_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_reviewerId_gf_user_id_fk" FOREIGN KEY ("reviewerId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "automations" ADD CONSTRAINT "automations_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "containers" ADD CONSTRAINT "containers_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_permissions" ADD CONSTRAINT "file_permissions_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_permissions" ADD CONSTRAINT "file_permissions_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_versions" ADD CONSTRAINT "file_versions_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_containerId_containers_id_fk" FOREIGN KEY ("containerId") REFERENCES "public"."containers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_notifications" ADD CONSTRAINT "gf_notifications_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_profile" ADD CONSTRAINT "gf_profile_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_reset_tokens" ADD CONSTRAINT "gf_reset_tokens_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_session" ADD CONSTRAINT "gf_session_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_subscriptions" ADD CONSTRAINT "gf_subscriptions_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_verify_email_tokens" ADD CONSTRAINT "gf_verify_email_tokens_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_account_type_idx" ON "gf_accounts" ("userId","accountType");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "containers_user_id_idx" ON "containers" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "files_file_key_idx" ON "files" ("fileKey");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "magic_links_token_idx" ON "gf_magic_links" ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reset_tokens_token_idx" ON "gf_reset_tokens" ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "gf_session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_stripe_subscription_id_idx" ON "gf_subscriptions" ("stripeSubscriptionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verify_email_tokens_token_idx" ON "gf_verify_email_tokens" ("token");