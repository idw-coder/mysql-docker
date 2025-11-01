USE myapp_db;
ALTER TABLE notes ADD COLUMN tags JSON AFTER content;