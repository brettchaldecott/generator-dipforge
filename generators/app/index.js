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
      message : 'Dipforge Docker Instance Name'
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
          if (answer == "DNS") {
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

  fetchFiles: function() {
    var thisRef = this
    var tokens = { dipforge_home: "/home/dipforge/dipforge", HOST_NAME: thisRef.props.hostname ,
      JAVA_HOME: "/usr/lib/jvm/java-8-openjdk-amd64/", ADMIN_PASSWORD: thisRef.props.adminPassword,
      recursive_lookup: (thisRef.props.recursiveLookup? "true" : "false")}

    var callback = function() {
        // setup the templates
        thisRef.fs.copyTpl (
          thisRef.destinationPath(thisRef.props.name + '/dipforge-template/'),
          thisRef.destinationPath(thisRef.props.name + '/dipforge/'),
          tokens
        );
    };

    this.extract("https://github.com/brettchaldecott/dipforge/releases/download/" +
        this.props.dipforgeVersion + "/generator-dipforge-template-" + this.props.dipforgeVersion + ".zip",this.destinationPath(this.props.name + '/dipforge-template'),
        {extract: true},callback);

  },

  writing: function () {
    var tokens = {
      name: this.props.name, dipforgeVersion: this.props.dipforgeVersion,
      enableDNS: "#",
      enableRDBUserManagment: "#",
      enableEmailServer: "#",
      enableDesktopServer: "#",
      enableMasterRDFStore: "#",
      enableRSSReader: "#",
      enableTypeManager: "#",
      enableRequestBroker: "#",
      enableProjectManager: "#",
      enableAuditTrailConsole: "#",
      enableDipforgeAdmin: "#",
      enableFileManager: "#"};

    for (var answer in this.props.enabledDaemons) {
      var answerStr = this.props.enabledDaemons[answer]
      if (answerStr == "DNS") {
        tokens['enableDNS'] = "";
      } else if (answerStr == "RDBUserManagement") {
        tokens['enableRDBUserManagment'] = "";
      } else if (answerStr == "Email") {
        tokens['enableEmailServer'] = "";
      } else if (answerStr == "Desktop") {
        tokens['enableDesktopServer'] = "";
      } else if (answerStr == "MasterRDF") {
        tokens['enableMasterRDFStore'] = "";
      } else if (answerStr == "RSS") {
        tokens['enableRSSReader'] = "";
      } else if (answerStr == "TypeManager") {
        tokens['enableTypeManager'] = "";
      } else if (answerStr == "RequestBroker") {
        tokens['enableRequestBroker'] = "";
      } else if (answerStr == "ProjectManager") {
        tokens['enableProjectManager'] = "";
      }
    }

    for (var answer in this.props.enabledWeb) {
      var answerStr = this.props.enabledDaemons[answer]
      if (answerStr == "AuditTrailConsole") {
        tokens['enableAuditTrailConsole'] = "";
      } else if (answerStr == "Admin") {
        tokens['enableDipforgeAdmin'] = "";
      } else if (answerStr == "FileManager") {
        tokens['enableFileManager'] = "";
      }
    }


    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath(this.props.name + '/Dockerfile'),
      tokens
    );
  }
});
