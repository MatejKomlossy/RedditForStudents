DROP TABLE IF EXISTS students CASCADE;
CREATE TABLE students (
                          id serial primary key,
                          isic_number varchar unique,
                          password varchar,
                          nick_name varchar unique
);
select * from students;

DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts (
                          id serial primary key,
						  title varchar,
                          post_text varchar,
                          student_id integer references students,
						  changed timestamp default now(),
                          flag boolean
);
select * from posts;

DROP TABLE IF EXISTS images CASCADE;
CREATE TABLE images (
                          id serial primary key,
                          alt varchar,
                          post_id integer references posts
						  
);
select * from images;

DROP TABLE IF EXISTS ratings CASCADE;
CREATE TABLE ratings (
                          id serial primary key,
                          category smallint check(category >=0 and category <=2),
                          post_id integer references posts,
						  student_id integer references students,
					      unique (post_id, student_id)
	
						  
);
select * from ratings;