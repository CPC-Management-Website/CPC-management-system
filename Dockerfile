FROM python:3.11-slim

WORKDIR /src

# setup cron
RUN apt-get update && apt-get -y install --no-install-recommends cron && rm -rf /var/lib/apt/lists/*
COPY ./backend/cron/crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab && crontab /etc/cron.d/crontab

COPY ./backend/requirements.txt .

RUN pip3 install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY ./backend .
RUN rm requirements.txt
COPY ./view/src/urls/server_urls.json ../view/src/urls/server_urls.json

EXPOSE 5000

CMD ["sh", "-c", "printenv > .env && cron && gunicorn application:app -b 0.0.0.0:5000 -w ${WORKERS:-1}"]
