select first_name || ' ' || last_name ||  ' ' || anet_id as name
from employees where not deleted and
id = any