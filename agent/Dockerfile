FROM python:3.9-slim-buster

WORKDIR /app
COPY ./agent.py ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
ENV FLASK_APP=agent.py

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "agent:app"]
