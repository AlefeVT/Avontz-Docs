ALTER TABLE "containers" ADD COLUMN "parentId" integer;--> statement-breakpoint
ALTER TABLE "containers" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "containers" ADD CONSTRAINT "containers_parentId_containers_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."containers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
