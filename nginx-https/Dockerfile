FROM nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

RUN apt-get update && apt-get -y install openssl

RUN mkdir /etc/nginx/ssl && \
chown -R root:root /etc/nginx/ssl && \
chmod -R 600 /etc/nginx/ssl

ENV KEYPATH /etc/nginx/ssl/localhost.key
ENV CERTPATH /etc/nginx/ssl/localhost.cert
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${KEYPATH} -out ${CERTPATH} -subj "/C=GB/ST=London/L=London/O=Global Security/OU=IT Department/CN=localhost"

RUN echo "server { \
    listen 80 default_server; \
    listen [::]:80 default_server; \
    listen 443 ssl default_server; \
    listen [::]:443 ssl default_server; \
    ssl_certificate $CERTPATH; \
    ssl_certificate_key $KEYPATH; \
    server_name localhost; \
    location / { \
        proxy_pass http://vk-app:5000/; \
        error_log /var/log/nginx.log; \
    } \
}" > /etc/nginx/conf.d/nginx.conf

