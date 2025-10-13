CREATE TABLE `allow` (
	`did` text NOT NULL,
	`serviceDid` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `allow_did_serviceDid_unique` ON `allow` (`did`,`serviceDid`);