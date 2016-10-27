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
     build-essential \
     sudo && \

  # install node.js
  apt-get install -y npm nodejs-legacy

RUN npm install -g npm

RUN npm install -g \
    yo \
    bower \
    gulp-cli ; exit 0

  # cleanup
RUN apt-get clean && \
  rm -rf \
    /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*

# add the dipforge template from the context directory
ADD dipforge /home/dipforge/dipforge

# change the permissions for the dipforge directory
RUN \
  chown -R dipforge:dipforge \
    /home/dipforge && \
  sed -i.bkp -e \
      's/%sudo\s\+ALL=(ALL\(:ALL\)\?)\s\+ALL/%sudo ALL=NOPASSWD:ALL/g' \
      /etc/sudoers

# expose the working directory, the dipforge ports
USER dipforge
WORKDIR "/home/dipforge/dipforge"
EXPOSE 8080 2000 8083 53 25 143 110
ENTRYPOINT ["/usr/bin/sudo","/home/dipforge/dipforge/bin/run.sh"]
