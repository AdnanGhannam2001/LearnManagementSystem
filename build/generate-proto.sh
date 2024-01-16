#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <arg>"
    exit 1
fi

yarn protoc --plugin=./node_modules/.bin/proto-gen-ts_proto --ts_proto_out=./libs/protobuf/src --ts_proto_opt=nestJs=true -I=./libs/protobuf/proto --experimental_allow_proto3_optional ./libs/protobuf/proto/$1