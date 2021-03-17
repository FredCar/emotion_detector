FROM python:3.8

COPY requirements.txt /src/
RUN pip install -r /src/requirements.txt

COPY api.py /src/api.py
COPY utils /src/utils/

CMD ["python", "/src/api.py"]