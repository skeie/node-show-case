ALTER TABLE phases ADD COLUMN rest_time varchar(10);

UPDATE phases SET rest_time = '90' WHERE position = 1;
UPDATE phases SET rest_time = '180' WHERE position = 2;
UPDATE phases SET rest_time = '60' WHERE position = 3;
UPDATE phases SET rest_time = '30' WHERE position = 4;
