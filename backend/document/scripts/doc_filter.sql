-- noinspection SqlNoDataSourceInspection,SqlDialectInspection

with doc as (
    select *
    from documents
    where not old Query1 Query2
)
   , float as (
    select (count(document_id)
            filter ( where
                    case when doc.require_superior
                             then document_signatures.e_date is not null and document_signatures.s_date is not null
                         else document_signatures.e_date is not null end))::float as count
         , (count(document_id))::float as total
         , document_id
    from document_signatures inner join doc on document_id = doc.id and not exists(select *
                                      from cancel_signs
                                      where cancel_signs.document_signature_id = document_signatures.id)
    group by document_id
)
select case when (float.document_id isnull or total = 0) then 100 else (count / total * 100) end as percentage,
       doc.id,
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
       edited,
       old
from float
         right join doc on document_id = doc.id
