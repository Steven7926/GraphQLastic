
#######################################  k3d Local Development Targets ##################################################
CLUSTER_NAME ?= graphqlastic-dev
APP_NAME ?= graphqlastic
CLUSTER_SERVER_SIZE ?= 1
REGISTRY_PORT ?= 9100
REGISTRY_NAME_CREATE ?= $(CLUSTER_NAME)-registry
REGISTRY_NAME = k3d-$(REGISTRY_NAME_CREATE)
LB_HTTP_PORT ?= 8081
LB_HTTPS_PORT ?= 8082
ROOT ?= ../..


## build-images: make docker images for each project
.PHONY: build-images
build-images:
	docker build $(DOCKER_BUILD_NETWORK_ARGS) -t $(APP_NAME)-server -f $(ROOT)/server/dockerfile $(ROOT)/server
	docker build $(DOCKER_BUILD_NETWORK_ARGS) -t $(APP_NAME)-webql -f $(ROOT)/webql/dockerfile $(ROOT)/webql
	docker build $(DOCKER_BUILD_NETWORK_ARGS) -t $(APP_NAME)-postgres -f $(ROOT)/postgres/Dockerfile $(ROOT)/postgres
	docker build $(DOCKER_BUILD_NETWORK_ARGS) -t $(APP_NAME)-populate -f $(ROOT)/populate.Dockerfile $(ROOT)

## k3d-build-images: make docker images for k3d
.PHONY: k3d-build-images
k3d-build-images: build-images

## k3d-registry-create: create a local registry for k3d cluster
.PHONY: k3d-registry-create
k3d-registry-create:
	k3d registry list -o json | jq -e --arg name '$(REGISTRY_NAME)' '.[] | select(.name == $$name)' > /dev/null || \
		k3d registry create $(REGISTRY_NAME_CREATE) -p $(REGISTRY_PORT)

## k3d-registry-push: push locally built images to k3d registry
.PHONY: k3d-registry-push
k3d-registry-push: k3d-build-images
	chmod +x ./k3d_registry_push.sh
	REGISTRY_PORT=$(REGISTRY_PORT) REGISTRY_NAME=$(REGISTRY_NAME) ./k3d_registry_push.sh

## k3d-cluster: create new k3d cluster and registry for local development
.PHONY: k3d-cluster
k3d-cluster: k3d-registry-create
	k3d cluster create $(CLUSTER_NAME) \
		-v $(CURDIR)/.k3d:/data \
		-p $(LB_HTTP_PORT):80@loadbalancer \
		-p $(LB_HTTPS_PORT):443@loadbalancer \
		-s $(CLUSTER_SERVER_SIZE) \
		--registry-use=$(REGISTRY_NAME):$(REGISTRY_PORT) \
		--image rancher/k3s:latest

## k3d-up: bring up k3d cluster for local development
.PHONY: k3d-up
k3d-up: k3d-cluster

## k3d-down: tear down the k3d cluster, registry, and all development services
.PHONY: k3d-down
k3d-down: k3d-clean k3d-registry-clean

## k3d-clean: stop and delete the k3d cluster
.PHONY: k3d-clean
k3d-clean:
	k3d cluster stop $(CLUSTER_NAME)
	k3d cluster delete $(CLUSTER_NAME)

## k3d-registry-clean: delete the local image registry
.PHONY: k3d-registry-clean
k3d-registry-clean:
	k3d registry delete $(REGISTRY_NAME)
##########################################################################################################################



##################################### Helm Targets for deploying the chart to k3d cluster ################################
CHART_PATH ?= ../helm
RELEASE_NAME ?= $(CLUSTER_NAME)
NAMESPACE ?= $(CLUSTER_NAME)
IMAGE_TAG ?= latest
VALUES_FILE ?= values-dev.yaml
CLUSTER_REGISTRY = $(REGISTRY_NAME):$(REGISTRY_PORT)
KUBE_CONTEXT ?= k3d-$(CLUSTER_NAME)
HELM = helm --kube-context $(KUBE_CONTEXT)

.PHONY: helm-deploy
helm-deploy: k3d-registry-push
	$(HELM) upgrade --install $(RELEASE_NAME)-platform $(CHART_PATH)/platform \
		--namespace $(NAMESPACE) \
		--create-namespace \
		-f $(CHART_PATH)/platform/$(VALUES_FILE) \
		--set postgres.image=$(CLUSTER_REGISTRY)/$(APP_NAME)-postgres \
		--set postgres.tag=$(IMAGE_TAG) \
		--set populate.image=$(CLUSTER_REGISTRY)/$(APP_NAME)-populate \
		--set populate.tag=$(IMAGE_TAG) \
		--wait
	$(HELM) upgrade --install $(RELEASE_NAME)-server $(CHART_PATH)/backend \
		--namespace $(NAMESPACE) \
		-f $(CHART_PATH)/backend/$(VALUES_FILE) \
		--set image.repository=$(CLUSTER_REGISTRY)/$(APP_NAME)-server \
		--set image.tag=$(IMAGE_TAG) \
		--wait
	$(HELM) upgrade --install $(RELEASE_NAME)-webql $(CHART_PATH)/frontend \
		--namespace $(NAMESPACE) \
		-f $(CHART_PATH)/frontend/$(VALUES_FILE) \
		--set image.repository=$(CLUSTER_REGISTRY)/$(APP_NAME)-webql \
		--set image.tag=$(IMAGE_TAG) \
		--wait
	@echo "GraphQLastic is up at http://localhost:$(LB_HTTP_PORT)"
	@echo "pgAdmin is at http://localhost:$(LB_HTTP_PORT)/pgadmin (admin@example.com / admin)"
	@echo "The populate-data job loads the data if needed: kubectl --context $(KUBE_CONTEXT) -n $(NAMESPACE) logs -f -l app=populate-data"

.PHONY: helm-uninstall
helm-uninstall:
	$(HELM) uninstall $(RELEASE_NAME)-webql --namespace $(NAMESPACE)
	$(HELM) uninstall $(RELEASE_NAME)-server --namespace $(NAMESPACE)
	$(HELM) uninstall $(RELEASE_NAME)-platform --namespace $(NAMESPACE)
###########################################################################################################################


##################################### Dependency Installs ###################################################################
.PHONY: check-deps
check-deps:
	@command -v k3d >/dev/null 2>&1 || { \
		echo "k3d not found, installing..."; \
		curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash; \
	}
	@command -v jq >/dev/null 2>&1 || { \
		echo "jq not found, installing..."; \
		if command -v apt-get >/dev/null 2>&1; then \
			sudo apt-get update && sudo apt-get install -y jq; \
		elif command -v brew >/dev/null 2>&1; then \
			brew install jq; \
		else \
			echo "ERROR: no supported package manager found for jq" >&2; exit 1; \
		fi; \
	}
	@command -v helm >/dev/null 2>&1 || { \
		echo "helm not found, installing..."; \
		curl -s https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash; \
	}
	@command -v tilt >/dev/null 2>&1 || { \
		echo "tilt not found, installing..."; \
		curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash; \
	}
	@echo "All dependencies present: k3d, jq, helm, tilt"
#############################################################################################################################

##################################### Tilt Commands #########################################################################
TILT_PORT ?= 10360

.PHONY: tilt tilt-debug tilt-down
tilt:
	tilt up --port $(TILT_PORT) --stream
tilt-debug:
	tilt up --port $(TILT_PORT) --stream --debug

tilt-down:
	tilt down --delete-namespaces
#############################################################################################################################
