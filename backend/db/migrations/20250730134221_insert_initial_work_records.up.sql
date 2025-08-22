-- db/migrations/000002_insert_initial_work_records.down.sql
INSERT INTO work_records (user_id, clock_out_time)
VALUES
  ('sample123', '2024-07-01 18:30:00'),
  ('sample123', '2024-07-02 18:45:00');