CREATE TYPE "public"."onboarding_step" AS ENUM('role', 'api_key', 'class', 'complete');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_step" "onboarding_step" DEFAULT 'role' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_intent" text;