select id, first_name, last_name, anet_id
from employees
where deleted = false and employees.id =any(array[Query1])