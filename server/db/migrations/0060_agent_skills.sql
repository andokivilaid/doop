CREATE TABLE "agent_skill_overrides" (
	"scope" text NOT NULL,
	"slug" text NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"title" text,
	"summary" text,
	"markdown" text,
	"updated_by" text NOT NULL,
	"updated_at" bigint NOT NULL,
	CONSTRAINT "agent_skill_overrides_scope_slug_pk" PRIMARY KEY("scope","slug")
);
--> statement-breakpoint
CREATE TABLE "agent_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"scope" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"markdown" text NOT NULL,
	"created_by" text NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "agent_skills_scope_slug_idx" ON "agent_skills" USING btree ("scope","slug");