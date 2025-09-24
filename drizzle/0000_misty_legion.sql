CREATE TABLE `devices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`did` text NOT NULL,
	`token` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `devices_did_idx` ON `devices` (`did`);--> statement-breakpoint
CREATE UNIQUE INDEX `devices_did_unique` ON `devices` (`did`);