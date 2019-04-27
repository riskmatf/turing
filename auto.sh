#!/usr/bin/env bash

build_server_flag=0
build_client_flag=0
deploy_flag=0
serve_flag=0
help_flag=0

arguments_parse()
{
    while [ $# -ne 0 ];
    do
        case "$1" in
        --help | -h)
            help_flag=1
            ;;
        --build-client)
            build_client_flag=1
            ;;
        --build-server)
            build_server_flag=1
            ;;
        --serve)
            serve_flag=1
            ;;
        --deploy)
            deploy_flag=1
            ;;
        esac
        shift
    done
}

display_help()
{
    echo 'bash auto.sh'
    echo 'Program made for automatic building(server, client), starting development server and deploying of turing project'
    echo 'Arguments:'
    echo '-h | --help - displays this help message'
    echo '--build-client - Building client react app. This can take a few minutes'
    echo '--build-server - Building nodejs server(compiles ts->js). This is usually fast'
    echo '--serve - starts dev server default localhost:8888 this is a blocking operation and it will execute last'
    echo '--deploy - deploy project to server. This does not compile project it deploys last compiled version of
    server and client'

    exit 0
}

build_server()
{
    echo 'Building server...'
    pushd "$PWD"

    if [ ! -e './server' ];
    then
        echo './server directory does not exist'
        echo 'Run script from root of the project'
        exit 1
    fi

    if [ ! -e './deploy' ];
    then
        echo './deploy directory does not exist'
        echo 'Run script from root of the project'
        exit 1
    fi

    echo "Entering $(realpath ./server/)"
    cd ./server/

    npm run build
    cp -r ./build/* ../deploy/api/turing

    echo "Exiting $(realpath ./server)"
    popd
}

build_client()
{
    echo 'Building client...'
    pushd "$PWD"

    if [ ! -e './client' ];
    then
        echo './client directory does not exist'
        echo 'Run script from root of the project'
        exit 1
    fi

    if [ ! -e './deploy' ];
    then
        echo './deploy directory does not exist'
        echo 'Run script from root of the project'
        exit 1
    fi

    echo "Entering $(realpath ./client/)"
    cd ./client/

    npm run build
    cp -r ./build/* ../deploy/public/turing

    echo "Exiting $(realpath ./client/)"
    popd
}

deploy()
{
    echo 'TODO: will be done soon. As soon as the server works again'
}

serve()
{
    echo ' Starting development server...'

    if [ ! -e './deploy' ];
    then
        echo './deploy directory does not exist'
        echo 'Run script from root of the project'
        exit 1
    fi

   pushd "$PWD"
   cd ./deploy
   node main.js
   popd
}

arguments_parse "$@"
if [ $help_flag -ne 0 ];
then
    display_help
fi

if [ $build_client_flag -ne 0 ];
then
    build_client
fi

if [ $build_server_flag -ne 0 ];
then
    build_server
fi

if [ $deploy_flag -ne 0 ];
then
    deploy
fi

if [ $serve_flag -ne 0 ];
then
    serve
fi
