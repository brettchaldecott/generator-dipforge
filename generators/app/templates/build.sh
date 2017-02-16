#!/bin/bash
#
# Copyright 2016 Brett Chaldecott
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#

# environmental variables
CURRENT_CONTEXT=`pwd`
DOWNLOAD_FILE="${CURRENT_CONTEXT}/downloads"
PROJECTS_FILE="${CURRENT_CONTEXT}/projects"
ZIP_FILE="${CURRENT_CONTEXT}/zips"
DIPFORGE_DIRECTORY="${CURRENT_CONTEXT}/dipforge"
REQUIRED_COMMANDS=("curl" "docker" "git" "unzip")
DOCKER_IMAGE_NAME="${CURRENT_CONTEXT}/docker_image_name"
SUDO_FILE="${CURRENT_CONTEXT}/sudo"


# check for commands
function has_command {
    if [ "$#" -ne 1 ] ; then
        echo "[has_command] invalid arguments"
        echo "parameters <command>"
        exit -1
    fi
    local command_check=`which $1`
    return $?
}

function check_commands {
    declare -a invalid_commands
    for required_command in ${REQUIRED_COMMANDS[@]} ; do
        has_command ${required_command}
        if [ ! $? ] ; then
            invalid_commands+=("${required_command}")
        fi
    done

    if [ ! -z "${invalid_commands}" ] ; then
        echo "For this script to execute the following commands are required"
        echo "commands: ${invalid_commands[@]}"
        exit -1
    fi
}

# download the files
function download_file {
    if [ "$#" -ne 2 ] ; then
        echo "[download_file] invalid arguments"
        echo "parameters <url> <target>"
        exit -1
    fi
    local url=$1
    local target=$2

    if [ -f ${target} ] ; then
        return 0
    fi

    echo "Download ${url}"
    curl -o ${target} -L ${url}
}

function download_files {
    if [ "$#" -ne 1 ] ; then
        echo "[download_files] invalid arguments"
        echo "parameters <config_file>"
        exit -1
    fi
    local config_file=$1

    while read -r -u 10 line; do
        download_file ${line}
    done 10<${config_file};

}

# get the projects from git
function download_git_project {
    if [ "$#" -ne 2 ] ; then
        echo "[extract_files] invalid arguments"
        echo "parameters <url> <target_directory>"
        exit -1
    fi
    local url=$1
    local target_directory=$2

	# clone a directory and update it if it exists
    if [ -f ${target_directory} ] ; then
    	cd ${target_directory} && git pull origin master ; cd -
	else
    	git clone ${url} ${target_directory}
    fi
}

function download_git_projects {
    if [ "$#" -ne 1 ] ; then
        echo "[download_files] invalid arguments"
        echo "parameters <config_file>"
        exit -1
    fi
    local config_file=$1

    while read -r -u 11 line; do
        download_git_project ${line}
    done 11<${config_file};


}


# get the zip files
function download_zip_files {
    if [ "$#" -ne 1 ] ; then
        echo "[download_zip_files] invalid arguments"
        echo "parameters <config_file>"
        exit -1
    fi
    local config_file=$1

    while read -r -u 10 line; do
        local file_info=(${line})
        download_file ${file_info[@]}
        unzip -o ${file_info[1]} -d ${DIPFORGE_DIRECTORY}
    done 10<${config_file};

}


# loop through the list of git projects

function main {
    # check for tools
    check_commands

    # download files
    download_files "${DOWNLOAD_FILE}"

    # projects files
    download_git_projects "${PROJECTS_FILE}"

    # zip files
    download_zip_files "${ZIP_FILE}"

    # create the docker image
    `cat ${SUDO_FILE}` docker build -t `cat ${DOCKER_IMAGE_NAME}` ${CURRENT_CONTEXT}
}


# execute the main function
main
