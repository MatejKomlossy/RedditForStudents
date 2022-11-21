insert into students (isic_number, password, nick_name)
values	('S4210001770444445414141414107F', '53423cb9661c9419ada22856c7053555a2ce4e11be200125f7a8487e480f4aa5', 'dv'),
  		('S421000215804J', '4c3b3284e206c3db72440736cfdbd185f0e61a3c7fd9f049987196b987d3d1ee', 'mk'),
		('S421000218121U', '7175517a370b5cd2e664e3fd29c4ea9db5ce17058eb9772fe090a5485e49dad6', 'or');




insert into posts (title, post_text, student_id, changed, flag)
values	('testovací post 1', 'joij foie \nfiojeifjewfaewiofjewjf', 1, now(), true), 
  		('testovací post 2', 'text pre post \n\n. Zdraví vás ...', 2, now(), true),
		('testovací post 3', 'text pre post \t tabulator medzera', 3, now(), true);





insert into ratings (category, post_id, student_id)
values	(0, 1, 2),
		(0, 1, 3),
		(-1, 2, 1),
 		(-1, 2, 2),
		(-1, 2, 3),
		(1, 3, 1),
 		(1, 3, 2),
		(1, 3, 3)