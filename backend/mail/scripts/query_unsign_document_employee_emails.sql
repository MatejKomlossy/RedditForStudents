SELECT email, name, link

FROM employees
         JOIN document_signatures on
            document_signatures.employee_id = employees.id
        and not employees.deleted
         JOIN documents on
    document_signatures.document_id = documents.id

where deadline <= now() - ('1 day'::interval) * 3
  and not old
  and not edited
  and not exists(select *
                 from cancel_signs
                 where document_signature_id = document_signatures.id);