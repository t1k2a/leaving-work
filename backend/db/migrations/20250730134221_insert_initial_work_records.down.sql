-- db/migrations/000002_insert_initial_work_records.down.sql
DELETE FROM work_records WHERE user_id = 'sample123';
