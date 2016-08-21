'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the striking ' + chalk.red('generator-dipforge') + ' generator!'
    ));

    var prompts = [{
      type    : 'input',
      name    : 'name',
      message : 'Dipforge Docker Instance Name',
      default: 'dipforge'
    },{
      type    : 'input',
      name    : 'dipforgeVersion',
      message : 'Dipforge Version',
      default : '4.1.a2'
    },{
      type    : 'input',
      name    : 'hostname',
      message : 'Hostname',
      default : 'localhost'
    },{
      type    : 'input',
      name    : 'adminPassword',
      message : 'Admin Password',
      default : 'admin'
    },{
      type    : 'checkbox',
      name    : 'enabledDaemons',
      message : 'Pick the daemons to enable ?',
      choices: ['DNS', 'RDBUserManagement', 'Email', 'Desktop', 'MasterRDF', 'RSS','TypeManager','RequestBroker','ProjectManager'],
    },{
      type    : 'confirm',
      name    : 'recursiveLookup',
      message : 'Enable recursive look ups ?',
      when: function(answers) {
        for (var answer in answers.enabledDaemons) {
          var daemon = answers.enabledDaemons[answer]
          if (daemon == "DNS") {
            return true;
          }
        }
        return false;
      },
      default: false
    },{
      type    : 'checkbox',
      name    : 'enabledWeb',
      message : 'Pick the web extra consoles ?',
      choices: ['AuditTrailConsole', 'Admin', 'FileManager'],
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.appname = props.name
    }.bind(this));
  },

  // this generator method is responsible for retrieving the files
  fetchFiles: function() {
    var thisRef = this
    var tokens = { dipforge_home: "/home/dipforge/dipforge", HOST_NAME: thisRef.props.hostname ,
      JAVA_HOME: "/usr/lib/jvm/java-8-openjdk-amd64/", ADMIN_PASSWORD: thisRef.props.adminPassword,
      recursive_lookup: (thisRef.props.recursiveLookup? "true" : "false")}

    var callback = function() {

    };

    // download the template
    this.extract("https://github.com/brettchaldecott/dipforge/releases/download/" +
        this.props.dipforgeVersion + "/generator-dipforge-template-" + this.props.dipforgeVersion + ".zip",this.destinationPath(this.props.name + '/dipforge-template'),
        {extract: true},callback);

    var dipforgeCallback = function() {
      // this code assumes that  the template will be downloaded already due to its small size.
      thisRef.fs.copyTpl (
        thisRef.destinationPath(thisRef.props.name + '/dipforge-template/'),
        thisRef.destinationPath(thisRef.props.name + '/dipforge/'),
        tokens
      );
    }

    this.extract("https://github.com/brettchaldecott/dipforge/releases/download/" +
            this.props.dipforgeVersion + "/dipforge-template-" + this.props.dipforgeVersion + ".zip",this.destinationPath(this.props.name + '/dipforge'),
            {extract: true},dipforgeCallback);

  },

  // this generator method is responsible for downloading the daemon jars
  downloadDaemons: function() {
    var archiveCallback = function(result) {
    }

    var archives = [
      "0010-HsqlDBEngineDaemon-" + this.props.dipforgeVersion + ".jar",
      "0040-MessageService-" + this.props.dipforgeVersion + ".jar",
      "0040-ServiceBroker-" + this.props.dipforgeVersion + ".jar",
      "0050-Timer-" + this.props.dipforgeVersion + ".jar",
      "0060-Tomcat-" + this.props.dipforgeVersion + ".jar",
      "0100-AuditTrailServer-" + this.props.dipforgeVersion + ".jar",
      "0101-DeploymentDaemon-" + this.props.dipforgeVersion + ".jar",
      "0140-GroovyDaemon-" + this.props.dipforgeVersion + ".jar",
      "0160-DataMapperBroker-" + this.props.dipforgeVersion + ".jar",
      "0170-ChangeManager-" + this.props.dipforgeVersion + ".jar",
      "DipforgeEnvironment-" + this.props.dipforgeVersion + ".ear",
      "DipforgeEntryPoint-" + this.props.dipforgeVersion + ".war"]

    for (var answer in this.props.enabledDaemons) {
      var answerStr = this.props.enabledDaemons[answer]
      if (answerStr == "DNS") {
        archives.push("0005-DNSServer-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "RDBUserManagement") {
        archives.push("0020-RDBUserManager-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "Email") {
        archives.push("0045-EmailServer-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "Desktop") {
        archives.push("0050-DesktopServer-" + this.props.dipforgeVersion + ".jar")
        archives.push("0050-EventServer-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "MasterRDF") {
        archives.push("0057-MasterRDFStore-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "RSS") {
        archives.push("0102-RSSReader-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "TypeManager") {
        archives.push("0150-CoadunationTypeManager-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "RequestBroker") {
        archives.push("0180-RequestBroker-" + this.props.dipforgeVersion + ".jar")
      } else if (answerStr == "ProjectManager") {
        archives.push("0200-ProjectManager-" + this.props.dipforgeVersion + ".jar")
      }
    }

    for (var answer in this.props.enabledWeb) {
      var answerStr = this.props.enabledWeb[answer]
      if (answerStr == "AuditTrailConsole") {
        archives.push("AuditTrailConsole-" + this.props.dipforgeVersion + ".war")
      } else if (answerStr == "Admin") {
        archives.push("DipforgeAdmin-" + this.props.dipforgeVersion + ".war")
      } else if (answerStr == "FileManager") {
        archives.push("FileManager-" + this.props.dipforgeVersion + ".war")
      }
    }


    for (var archive in archives) {
      var archiveName = archives[archive]
      this.fetch("https://github.com/brettchaldecott/dipforge/releases/download/" +
              this.props.dipforgeVersion + "/" +  archiveName,this.destinationPath(this.props.name + '/dipforge/deploy/'),
              archiveCallback);
    }
  },

  writing: function () {
    var tokens = {
      name: this.props.name, dipforgeVersion: this.props.dipforgeVersion};

    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath(this.props.name + '/Dockerfile'),
      tokens
    );
  }
});
