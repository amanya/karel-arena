FROM ubuntu:16.10
MAINTAINER albertmp@eml.cc

ENV DEBIAN_FRONTEND noninteractive
ENV REDIS_URL=127.0.0.1

RUN apt-get update
RUN apt-get install -y python3 python-pip gunicorn supervisor git nginx redis-server

COPY . /app

RUN pip install -r /app/requirements.txt

RUN rm /etc/nginx/sites-enabled/default
COPY karel-arena.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/karel-arena.conf /etc/nginx/sites-enabled/karel-arena.conf
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY gunicorn.conf /etc/supervisor/conf.d/gunicorn.conf

CMD ["/usr/bin/supervisord"]
