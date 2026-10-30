FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY populate_index.py ./

ENV PYTHONUNBUFFERED=1

CMD ["python", "populate_index.py", "--only-if-missing"]
