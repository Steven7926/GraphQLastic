#!/bin/bash

set -e

REGISTRY_PORT=${REGISTRY_PORT:-9100} REGISTRY_NAME=${REGISTRY_NAME:-k3d-graphqlastic-dev-registry}

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

while IFS= read -r IMG
do
    LOCAL_TAG="$IMG"
    echo "$LOCAL_TAG"
  	# .localhost for dns
  	# if this push doesn't work add $REGISTRY_NAME.localhost to /etc/hosts
  	docker tag "$LOCAL_TAG" "$REGISTRY_NAME.localhost:$REGISTRY_PORT/$LOCAL_TAG"
  	docker push "$REGISTRY_NAME.localhost:$REGISTRY_PORT/$LOCAL_TAG"
done < <(sed 's/\r$//' "$SCRIPT_DIR/images")