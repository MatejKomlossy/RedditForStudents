SELECT online_trainings.id             as t_id,
       name,
       lector,
       agency,
       place,
       online_trainings.date           as on_date,
       duration,
       agenda,
       deadline,

       online_training_signatures.id   as s_id,
       training_id,
       employee_id,
       online_training_signatures.date as s_date,

       e.id                            as e_id,
       first_name,
       last_name,
       login,
       password,
       role,
       email,
       job_title,
       manager_id,
       branch_id,
       division_id,
       department_id,
       city_id,
       deleted,
       import_id

FROM "online_training_signatures"
         JOIN online_trainings on
            online_trainings.id = online_training_signatures.training_id and online_trainings.id = ?
         join employees e on online_training_signatures.employee_id = e.id