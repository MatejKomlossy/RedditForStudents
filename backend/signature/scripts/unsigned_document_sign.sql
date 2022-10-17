SELECT document_signatures.id as d_s_id,
       employee_id            as e_d_s_id,
       e_date,
       superior_id,
       s_date,
       document_id,
       false                  as cancel,

       documents.id           as d_id,
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

FROM "documents"
         JOIN document_signatures on
    document_signatures.document_id = documents.id
WHERE employee_id = ?
  and not edited
  and e_date IS NULL
  and not exists(select * from cancel_signs where document_signature_id = document_signatures.id)
  and not old