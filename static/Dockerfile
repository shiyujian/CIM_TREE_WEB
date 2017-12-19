FROM    ubuntu:14.04
ADD sources.list /etc/apt/sources.list
RUN apt-get update && apt-get install -y curl wget tar bzip2 unzip vim && apt-get install -y nginx python-dev && \
   apt-get install -y  python-pip && apt-get clean all
COPY pip.conf /root/.pip/pip.conf 
RUN pip install supervisor
WORKDIR /usr/src/app
COPY . /usr/src/app
ADD supervisord.conf /etc/supervisor/supervisord.conf
RUN mkdir -p /etc/supervisor.conf.d && \
    mkdir -p /var/log/supervisor
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN ln -s /usr/src/app/qh2web_nginx.conf /etc/nginx/sites-enabled
EXPOSE 8088
CMD ["supervisord","-n"]
