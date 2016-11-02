'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
    initializing: {
        setupVars: function () {
            this.projects = [];
            this.zipFiles = [];
        }
    },
    prompting: {
        getConfig: function() {
            var done = this.async();

            function askForConfig(done) {
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
                    name    : 'dockerImageName',
                    message : 'Docker Image Name',
                    default : 'dipforge'
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
                },{
                    type    : 'confirm',
                    name    : 'useSudo',
                    message : 'Use sudo when executing docker command ?',
                    default: false
                }];

                this.prompt(prompts).then(function (props) {
                    this.name = props.name;
                    this.dipforgeVersion = props.dipforgeVersion;
                    this.dockerImageName = props.dockerImageName;
                    this.hostname = props.hostname;
                    this.adminPassword = props.adminPassword;
                    this.enabledDaemons = props.enabledDaemons;
                    this.recursiveLookup = props.recursiveLookup;
                    this.enabledWeb = props.enabledWeb;
					this.useSudo = props.useSudo;
                    this.props = props;
                    done();
                }.bind(this));
            }

            askForConfig.call(this, done);
        },
        getProjects: function() {
            var done = this.async();
            function askForProjects(done) {
                this.log(chalk.green('\nProjects #' + (this.projects.length + 1) + '\n'));

                var prompts = [
                    {
                        type: 'confirm',
                        name: 'projectAdd',
                        message: 'Do you want to add a git project?',
                        default: true
                    },
                    {
                        when: function (response) {
                            return response.projectAdd === true;
                        },
                        type: 'input',
                        name: 'projectName',
                        validate: function (input) {
                            if (input === '') {
                                return 'Your project name cannot be empty';
                            }
                            return true;
                        },
                        message: 'What is the name of your project?'
                    }]

                this.prompt(prompts).then(function (props) {
                    if (props.projectAdd) {
                        this.projects.push(props.projectName);
                        askForProjects.call(this, done);
                    } else {
                        done();
                    }
                }.bind(this));
            }
            askForProjects.call(this, done);
        },
        getZipeFiles: function() {
            var done = this.async();
            function askForZipFiles(done) {
                this.log(chalk.green('\nZip Files #' + (this.zipFiles.length + 1) + '\n'));

                var prompts = [
                    {
                        type: 'confirm',
                        name: 'zipAdd',
                        message: 'Do want to apply a zip to your dipforge instance ?',
                        default: true
                    },
                    {
                        when: function (response) {
                            return response.zipAdd === true;
                        },
                        type: 'input',
                        name: 'zipUrl',
                        validate: function (input) {
                            if (input === '') {
                                return 'Your zip url cannot be empty';
                            }
                            return true;
                        },
                        message: 'What is the url for the zip file to apply ?'
                    }]

                this.prompt(prompts).then(function (props) {
                    if (props.zipAdd) {
                        this.zipFiles.push(props.zipUrl);
                        askForZipFiles.call(this, done);
                    } else {
                        done();
                    }
                }.bind(this));
            }
            askForZipFiles.call(this, done);
        }
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



        var fileContents = "";
        for (var archive in archives) {
            var archiveName = archives[archive]
            var url = "https://github.com/brettchaldecott/dipforge/releases/download/" +
                this.props.dipforgeVersion + "/" +  archiveName;
            var target = this.destinationPath(this.props.name + '/dipforge/deploy/' + archiveName);
            fileContents += url + " " + target + "\n";
            //this.fetch("https://github.com/brettchaldecott/dipforge/releases/download/" +
            //      this.props.dipforgeVersion + "/" +  archiveName,this.destinationPath(this.props.name + '/dipforge/deploy/'),
            //      archiveCallback);
        }
        this.fs.write(this.destinationPath(this.props.name + "/downloads"), fileContents);

        // build a projects content file
        var projectsContents = "";
        for (var index in this.projects) {
            var project = this.projects[index]
            if (project == undefined) {
                continue;
            }
            var projectName = project.substring(project.lastIndexOf("/"),project.lastIndexOf("."))
            var target = this.destinationPath(this.props.name + "/dipforge/var/projects/" + projectName)
            projectsContents += project + " " + target + "\n";
        }
        this.fs.write(this.destinationPath(this.props.name + "/projects"), projectsContents);

        // build the zip apply contents
        var zipContents = "";
        for (var index in this.zipFiles) {
            var zipUrl = this.zipFiles[index]
            if (zipUrl == undefined) {
                continue;
            }
            var zipName = zipUrl.substring(zipUrl.lastIndexOf("/"))
            var target = this.destinationPath(this.props.name + "/" + zipName)
            zipContents += zipUrl + " " + target + "\n";
        }
        this.fs.write(this.destinationPath(this.props.name + "/zips"), zipContents);

        // create the docker image file name
        this.fs.write(this.destinationPath(this.props.name + "/docker_image_name"), this.props.dockerImageName);

        // setup the sudo file
        if (this.props.useSudo) {
            this.fs.write(this.destinationPath(this.props.name + "/sudo"), "sudo");
        } else {
            this.fs.write(this.destinationPath(this.props.name + "/sudo"), "");
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

        this.copy(
            this.templatePath('build.sh'),
            this.destinationPath(this.props.name + '/build.sh')
        ).on('end',function() {
            this.spawnCommand("chmod",["a+x",this.destinationPath(this.props.name + '/build.sh')]);
        });

        this.copy(
            this.templatePath('dipforge.sh'),
            this.destinationPath(this.props.name + '/dipforge/bin/dipforge.sh')
        ).on('end',function() {
            this.spawnCommand("chmod",["a+x",this.destinationPath(this.props.name + '/dipforge/bin/dipforge.sh')]);
        });

    }
});


