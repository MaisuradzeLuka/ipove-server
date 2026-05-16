CREATE TYPE "public"."user_category" AS ENUM('developer', 'handyman');--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"lastname" text,
	"phone_number" bigint,
	"email" text NOT NULL,
	"address" text,
	"city" text,
	"category" "user_category",
	"avatar" text,
	"examples" text[] DEFAULT '{}' NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_complete" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
