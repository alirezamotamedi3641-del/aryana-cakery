CREATE TABLE `cake_enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`required_date` text NOT NULL,
	`message` text NOT NULL,
	`image_key` text,
	`image_name` text,
	`image_type` text,
	`image_bytes` integer,
	`created_at` text NOT NULL
);
