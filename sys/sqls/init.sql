CREATE DATABASE IF NOT EXISTS dev;
USE dev;

CREATE TABLE IF NOT EXISTS settings (
	id varchar(100) NOT NULL,
    last_update DATETIME,
    update_id int,
    settings JSON,
    PRIMARY KEY (id)
);