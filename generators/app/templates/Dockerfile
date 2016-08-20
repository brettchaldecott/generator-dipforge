 FROM ubuntu:xenial
MAINTAINER Brett Chaldecott <brett.chaldecott@gmail.com>

RUN \
  # configure the "dipforge" user
  groupadd dipforge && \
  useradd dipforge -s /bin/bash -m -g dipforge -G sudo && \
  echo 'dipforge:dipforge' |chpasswd && \
  mkdir /home/dipforge/dipforge && \

  # install open-jdk 8
  apt-get update && \
  apt-get install -y openjdk-8-jdk && \

  # install utilities
  apt-get install -y \
     wget \
     curl \
     vim \
     git \
     zip \
     unzip \
     bzip2 \
     fontconfig \
     python \
     g++ \
     build-essential && \

  # install node.js
  apt-get install -y npm nodejs-legacy

  # install yeoman bower gulp
RUN npm install -g \
    yo \
    bower \
    gulp ; exit 0

  # cleanup
RUN apt-get clean && \
  rm -rf \
    /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*

# add the dipforge template from the context directory
ADD dipforge /home/dipforge/dipforge

# copy sources
#COPY . /home/jhipster/generator-jhipster

# change the permissions for the dipforge directory
RUN \
  chown -R dipforge:dipforge \
    /home/dipforge

#RUN \
  # install jhipster
#  npm install -g /home/jhipster/generator-jhipster && \

  # fix jhipster user permissions
  #chown -R jhipster:jhipster \
  #  /home/jhipster \
  #  /usr/lib/node_modules && \

  # cleanup
  #rm -rf \
  #  /var/lib/apt/lists/* \
  #  /tmp/* \
  #  /var/tmp/*

# expose the working directory, the dipforge ports
USER dipforge
WORKDIR "/home/dipforge/dipforge"
VOLUME ["/home/dipforge/dipforge"]
EXPOSE 8080 2000 8083
ENTRYPOINT ["/home/dipforge/dipforge/bin/run.sh"]
