DROP TABLE IF EXISTS students CASCADE;
CREATE TABLE students (
                          id serial primary key,
                          isic_number varchar unique,
                          password varchar,
                          nick_name varchar unique
-- other atributes will appear later because we are agil  .........  
);
-- other tables will appear later because we are agil  .........
