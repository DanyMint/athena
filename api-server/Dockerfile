FROM python:3.13-alpine
LABEL authors="dan"

RUN mkdir /app
WORKDIR /app

RUN apk update && apk add --no-cache postgresql-dev gcc python3-dev musl-dev
RUN pip install --upgrade pip

COPY requirements.txt  /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x start.sh
