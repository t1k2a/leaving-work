-- db/migrations/000001_create_work_records_table.up.sql
CREATE TABLE work_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    clock_out_time TIMESTAMP NOT NULL
);