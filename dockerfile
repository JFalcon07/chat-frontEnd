FROM nginx:alpine
COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/chat-project /usr/share/nginx/html