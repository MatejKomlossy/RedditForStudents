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
       online_training_signatures.date as s_date

FROM "online_training_signatures"
         JOIN online_trainings on
    online_trainings.id = online_training_signatures.training_id
WHERE employee_id = ?
  and "online_training_signatures".date IS not NULL
