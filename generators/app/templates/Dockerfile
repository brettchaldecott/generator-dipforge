FROM openjdk:8-jdk-alpine
MAINTAINER Brett Chaldecott <brett.chaldecott@gmail.com>

# run command
RUN \
  apk add --update bash && \
  rm -rf /var/cache/apk/* && \
  mkdir -p /home/dipforge/dipforge 

# copy the dipforge
COPY dipforge /home/dipforge/dipforge

WORKDIR "/home/dipforge/dipforge"
EXPOSE 8080 2000 8083 53 25 143 110
ENTRYPOINT ["/home/dipforge/dipforge/bin/dipforge.sh"]
