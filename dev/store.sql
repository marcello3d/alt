DROP TABLE store IF EXISTS;
CREATE TABLE store (
	id INT PRIMARY KEY,
	parent INT NULL,
	name VARCHAR NOT NULL,
	idx INT NULL,
	value VARCHAR NOT NULL,
	FOREIGN KEY(parent) REFERENCES store(id) ON DELETE CASCADE
);
CREATE INDEX ON store(value);
CREATE INDEX ON store(parent,idx);
CREATE INDEX ON store(parent,name);