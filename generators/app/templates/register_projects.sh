#b!/bin/bash
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


function check_for_dipforge {
	response=`curl -u ${USERNAME}:${PASSWORD} ${TEST_URL}`
	if [[ $response == *"\"status\":\"Up\""* ]]; then
		echo "The string contains status"
		return 1
	fi
	echo "The string does not contain status"
	return 0

	return $#
}

function publish_project {
	if [ "$#" -ne 1 ] ; then
		echo "[publish_project] invalid arguments"
		echo "parameters <project>"
		exit -1
	fi
	local project=$1
	while check_for_dipforge ; do
		echo "Dipforge is not up what 20 seconds"
		sleep 20
	done

	echo "Publish the project ${project}"
	curl -u ${USERNAME}:${PASSWORD} "${REGISTER_URL}${project}"

}

function project_list {
	if [ "$#" -ne 1 ] ; then
		echo "[project_list] invalid arguments"
		echo "parameters <config_file>"
		exit -1
	fi
	local config_file=$1

	while read -r -u 10 line; do
		local file_info=(${line})
		publish_project ${file_info[@]}
	done 10<${config_file};

}

CURRENT_CONTEXT="/home/dipforge/dipforge/bin"
PUBLISH_PROJECTS_PATH="${CURRENT_CONTEXT}/publish_projects"
USERNAME="admin"
PASSWORD="<%= adminPassword %>"
TEST_URL="http://localhost:8080/DipforgeAPI/public/com/dipforge/projects/CheckDipforge.groovy"
REGISTER_URL="http://localhost:8080/DipforgeAPI/public/com/dipforge/projects/RegisterProject.groovy?project="

project_list ${PUBLISH_PROJECTS_PATH}
