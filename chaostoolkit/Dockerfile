FROM chaostoolkit/chaostoolkit:latest

USER root

# Install wget, bash and curl
RUN apk add --no-cache bash curl wget

# Download and install k6
RUN curl -L -o k6.tar.gz https://github.com/grafana/k6/releases/download/v1.2.3/k6-v1.2.3-linux-amd64.tar.gz \
    && tar -xzf k6.tar.gz -C /usr/bin --strip-components=1 \
    && rm k6.tar.gz

# Install the Chaos Toolkit k6 extension
RUN pip install chaostoolkit-k6

# Install system dependencies for reporting
RUN apk add --no-cache cairo cairo-dev pango-dev gdk-pixbuf-dev

# Install pandoc 3.7.0.2
RUN wget -q https://github.com/jgm/pandoc/releases/download/3.7.0.2/pandoc-3.7.0.2-linux-amd64.tar.gz \
    && tar -xzf pandoc-3.7.0.2-linux-amd64.tar.gz \
    && cp -r pandoc-3.7.0.2/bin/* /usr/local/bin/ \
    && rm -rf pandoc-3.7.0.2*

# Install Pumba 0.11.6
RUN curl -L https://github.com/alexei-led/pumba/releases/download/0.11.6/pumba_linux_amd64 -o /usr/local/bin/pumba \
    && chmod +x /usr/local/bin/pumba

# Install Chaos Toolkit extensions
RUN pip install chaostoolkit-k6 chaostoolkit-reporting

WORKDIR /home/chaostoolkit/logs