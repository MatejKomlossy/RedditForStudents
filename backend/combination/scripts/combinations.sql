select distinct branch_id,
                branches.name    as branch_name,
                city_id,
                cities.name      as city_name,
                department_id,
                departments.name as department_name,
                division_id,
                divisions.name   as division_name
from (select distinct branch_id, city_id, department_id, division_id
      from employees
      where deleted = false) as tuple
         inner join
     branches on tuple.branch_id = branches.id
         inner join
     cities on cities.id = tuple.city_id
         inner join
     departments on departments.id = tuple.department_id
         inner join
     divisions on divisions.id = tuple.division_id;
