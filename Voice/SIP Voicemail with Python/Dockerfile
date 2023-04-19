FROM python:3.10

WORKDIR /app
COPY Pipfile Pipfile.lock ./
RUN pip install pipenv && pipenv install
COPY . .

EXPOSE 3000
CMD ["pipenv", "run","python", "index.py"]