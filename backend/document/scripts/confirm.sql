update documents
set edited= false
where id = ?
returning assigned_to, require_superior, name, link;