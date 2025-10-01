CREATE TABLE `devices` (
	`did` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`token` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `devices_did_idx` ON `devices` (`did`);--> statement-breakpoint
CREATE UNIQUE INDEX `devices_did_token_unique` ON `devices` (`did`,`token`);