with recursive report AS (
    select *
    from documents
    WHERE documents.id = ?
    union all
    select documents.*
    from report
             join documents on report.prev_version_id = documents.id
)
SELECT document_signatures.id                                                                  as d_s_id,
       employee_id                                                                             as e_d_s_id,
       e_date,
       superior_id,
       s_date,
       document_id,
       exists(select * from cancel_signs where document_signature_id = document_signatures.id) as cancel,

       employees.id                                                                            as e_id,
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
       import_id,

       report.id                                                                               as d_id,
       name,
       link,
       type,
       note,
       release_date,
       deadline,
       order_number,
       version,
       prev_version_id,
       assigned_to,
       require_superior,
       edited

FROM report
         join document_signatures on
    document_signatures.document_id = report.id
         join employees on
            document_signatures.employee_id = employees.id and not employees.deleted
order by deadline;