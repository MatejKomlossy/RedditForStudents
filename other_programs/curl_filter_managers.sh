// set connection_database.debug to true
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"ids":"[1]"}' \
  http://localhost:8180/employees/ids