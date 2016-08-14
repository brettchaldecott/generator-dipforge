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
  curl -sL https://deb.nodesource.com/setup_4.x | bash && \
  apt-get install -y nodejs && \

  # upgrade npm
  npm install -g npm && \

  # install yeoman bower gulp
  npm install -g \
    yo \
    bower \
    gulp-cli && \

  # cleanup
  apt-get clean && \
  rm -rf \
    /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*

# down load the dipforge template structure
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/dipforge-template-<%= dipforgeVersion %>.zip /tmp
RUN unzip /tmp/dipforge-template-<%= dipforgeVersion %>.zip -d /home/dipforge/dipforge/

# add the dipforge template from the context directory
ADD dipforge /home/dipforge/dipforge

# add the daemons
<%= enableDNS %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0005-DNSServer-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableRDBUserManagment %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0020-RDBUserManager-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableEmailServer %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0045-EmailServer-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableDesktopServer %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0050-DesktopServer-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableDesktopServer %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0050-EventServer-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableMasterRDFStore %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0057-MasterRDFStore-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableRSSReader %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0102-RSSReader-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableTypeManager %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0150-CoadunationTypeManager-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableRequestBroker %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0180-RequestBroker-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableProjectManager %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0200-ProjectManager-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
<%= enableAuditTrailConsole %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/AuditTrailConsole-<%= dipforgeVersion %>.war /home/dipforge/dipforge/deploy/
<%= enableDipforgeAdmin %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/DipforgeAdmin-<%= dipforgeVersion %>.war /home/dipforge/dipforge/deploy/
<%= enableFileManager %>ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/FileManager-<%= dipforgeVersion %>.war /home/dipforge/dipforge/deploy/

# standard required daemons
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0010-HsqlDBEngineDaemon-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0040-MessageService-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0040-ServiceBroker-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0050-Timer-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0060-Tomcat-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0100-AuditTrailServer-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0101-DeploymentDaemon-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0140-GroovyDaemon-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0160-DataMapperBroker-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/0170-ChangeManager-<%= dipforgeVersion %>.jar /home/dipforge/dipforge/deploy/

# standard required environment
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/DipforgeEnvironment-<%= dipforgeVersion %>.ear /home/dipforge/dipforge/deploy/
ADD https://github.com/brettchaldecott/dipforge/releases/download/<%= dipforgeVersion %>/DipforgeEntryPoint-<%= dipforgeVersion %>.war /home/dipforge/dipforge/deploy/

# copy sources
#COPY . /home/jhipster/generator-jhipster

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
CMD ["/home/dipforge/dipforge/bin/run.sh"]
