CREATE TABLE `actionItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`meetingId` int NOT NULL,
	`task` text NOT NULL,
	`pic` varchar(180),
	`deadline` varchar(80),
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`status` enum('todo','in_progress','done') NOT NULL DEFAULT 'todo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `actionItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`meetingDate` timestamp,
	`startedAt` timestamp,
	`endedAt` timestamp,
	`location` varchar(180),
	`organizer` varchar(180),
	`department` varchar(120),
	`agenda` text,
	`attendees` text,
	`status` enum('scheduled','processing','completed','archived') NOT NULL DEFAULT 'scheduled',
	`audioUrl` text,
	`transcript` text,
	`analysis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meetings_id` PRIMARY KEY(`id`)
);
