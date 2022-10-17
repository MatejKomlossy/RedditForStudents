with training as (
    select *
    from online_trainings
    where not edited Query1 Query2
)
   ,float as (
    select count(training_id)
            filter ( where online_training_signatures.date is not null ) as count
              , count(training.id)::float as total, training_id
    from online_training_signatures inner join training on online_training_signatures.training_id=training.id
    group by training_id
)
select case when (training_id isnull or total = 0) then 100 else (count / total * 100) end as percentage,
       training.*
from float
         right join training on training_id = training.id