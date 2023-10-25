#!/bin/bash

docker --log-level=debug build -t $0 . && docker run --rm -v $(pwd):/package $0
