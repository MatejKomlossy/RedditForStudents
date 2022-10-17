SELECT email, name, lector as link

FROM online_trainings
         JOIN online_training_signatures on
    training_id = online_trainings.id
         JOIN employees on employee_id = employees.id

where not edited
  and not employees.deleted
  and deadline <= now() - ('1 day'::interval);