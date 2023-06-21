#!/bin/sh

replace_conf(){
  sed -e "s|$1|$2|g" $3 > $3.tmp && mv $3.tmp $3    
}

for file in $(find "/app/js" -type f | sort); do
  replace_conf '%AUTH_SERVER_URL%' "$AUTH_SERVER_URL" ${file}
  replace_conf '%AUTH_REALM%' "$AUTH_REALM" ${file}
  replace_conf '%AUTH_CLIENT_ID%' "$AUTH_CLIENT_ID" ${file}
done

replace_conf '%BASE_URL%' "$BASE_URL" /app/index.html

nginx -g "daemon off;"