# Dockerfile
FROM python:3.9.10-alpine3.14
EXPOSE 5000
WORKDIR /backend/
COPY . .
RUN pip install -r requirements.txt
ENV FLASK_APP=app
CMD ["flask", "--app", "app", "run", "--host=0.0.0.0"]