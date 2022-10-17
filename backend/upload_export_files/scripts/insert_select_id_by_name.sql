with s as (
    select id, name
    from NameTable
    where name = MyInseredName
),
     i as (
         insert into NameTable (name)
             select MyInseredName as insertMy
             where not exists(select id from s where name = insertMy)
             returning id, name
     )
select id, name
from i
union all
select id, name
from s