# Local Development: k3d + Tilt + Helm

Runs GraphQLastic on a local Kubernetes cluster: [k3d](https://k3d.io) (k3s in Docker) for the cluster, [Tilt](https://tilt.dev) for the build/deploy/reload loop, and [Helm](https://helm.sh) charts for each piece. Everything is driven from the `Makefile` and `Tiltfile` in this folder.

What gets deployed:

| Piece | Chart | Image | Notes |
|---|---|---|---|
| Go GraphQL server | `../helm/backend` | `graphqlastic-server` (`server/dockerfile`) | port 5051, `/query` API, `/` playground |
| React/Relay frontend | `../helm/frontend` | `graphqlastic-webql` (`webql/dockerfile`) | Vite dev server on 5173, plus the ingress |
| Postgres | `../helm/platform` | `graphqlastic-postgres` (`postgres/Dockerfile`) | `postgres:16` + `init.sql`, tsvector search |
| Elasticsearch | `../helm/platform` | `elasticsearch:8.14.1` | single node, security off |
| pgAdmin | `../helm/platform` | `dpage/pgadmin4:8.12` | web SQL client for the Postgres above |

The ingress serves everything at **http://localhost:8081**:

| Path | Goes to |
|---|---|
| `/query` | Go server (GraphQL API) |
| `/pgadmin` | pgAdmin |
| everything else | frontend |

## Prerequisites

- Docker (running locally)
- `k3d`, `jq`, `helm` and `tilt`, installed automatically if missing:

  ```bash
  make check-deps
  ```
- Python with `requirements.txt` installed, only for the optional **repopulate-data** button in Tilt. The in-cluster populate job doesn't need it

## Project Layout

```
./deployment
    ./dev
    ├── Makefile                # k3d cluster + registry, image builds, helm-deploy targets
    ├── k3d_registry_push.sh    # pushes locally built images into the k3d registry
    ├── images                  # image names to push (read by the push script)
    ├── Tiltfile                # dev loop: build images, deploy charts, live update, port-forwards
    ./helm
    ├── backend                 # Go GraphQL server
    ├── frontend                # webql frontend + ingress
    └── platform                # postgres, elasticsearch and pgadmin, with persistent volumes
```

## Quick Start

### Option A: Tilt (recommended for active development)

1. Create the k3d cluster and local registry:

   ```bash
   make k3d-up
   ```

2. Start Tilt:

   ```bash
   make tilt
   ```

   The Tilt UI is at `http://localhost:10360` (8080 and Tilt's default 10350 are often taken). `make tilt-debug` runs the same with Tilt's debug logging.

3. Data loads automatically: the **populate-data** job runs once Postgres and Elasticsearch are up, and fills them if they don't already hold the expected number of records (see [Populate Job](#populate-job)). 5M records take about 20 minutes. To force a full reload anyway, trigger **repopulate-data** in the Tilt UI.

4. Open the app at http://localhost:8081.

5. To look at the data in SQL, open pgAdmin at http://localhost:8081/pgadmin and log in with `admin@example.com` / `admin`. The **GraphQLastic** server is already registered; its password is `postgres` (tick "Save password").

6. Tear down:

   ```bash
   make tilt-down   # stops Tilt-managed resources and deletes namespaces
   make k3d-down    # deletes the k3d cluster and registry
   ```

### Option B: Makefile only (one-off build and deploy, no live reload)

```bash
make k3d-up        # create cluster and image registry
make helm-deploy   # build the 3 images, push them to the k3d registry, helm upgrade --install all 3 charts
```

This deploys into the `graphqlastic-dev` namespace. The populate job loads the data if it's missing; follow it with:

```bash
kubectl --context k3d-graphqlastic-dev -n graphqlastic-dev logs -f -l app=populate-data
```

Every Helm command in the Makefile passes `--kube-context k3d-graphqlastic-dev`, so it never deploys to whatever cluster `kubectl` happens to point at.

To remove the releases (the data volumes are kept):

```bash
make helm-uninstall
```

## What the Tiltfile Does

- **`allow_k8s_contexts`** restricts Tilt to the `k3d-graphqlastic-dev` context, so it never targets a real cluster.
- **`default_registry`** pushes images to the k3d registry at `localhost:9100` (`k3d-graphqlastic-dev-registry:9100` from inside the cluster). Tilt tags every build uniquely, so a rebuild always rolls the pod onto the new image.
- **Go server**: any change under `server/` rebuilds the image and redeploys. The runtime image is distroless (no shell), so there's no live update. The dockerfile caches Go modules and compiled packages between builds, so rebuilds only recompile what changed.
- **Frontend**: changes under `webql/src` are synced into the running container and Vite hot reloads them. Changing `package.json` or `package-lock.json` rebuilds the image.
- **Postgres**: built from `postgres/`. `init.sql` only runs when the data volume is empty. To apply a schema change, delete the `postgres-data` PVC (or run the SQL yourself).
- **Port-forwards** use host ports that don't clash with `docker compose`:

  | Service | Host port |
  |---|---|
  | GraphQL server / playground | `5052` |
  | Postgres | `5434` |
  | Elasticsearch | `9201` |

## Populate Job

`../helm/platform/templates/populate-job.yaml` runs `populate_index.py --only-if-missing` in the cluster (image built from `populate.Dockerfile` at the repo root). It's idempotent:

1. An init container waits until Postgres and Elasticsearch accept connections.
2. The script counts the records in both stores. If **both** hold exactly `populate.records` (5,000,000 by default in `../helm/platform/values.yaml`), it exits without changing anything.
3. Otherwise (empty, or a load that died halfway) it does a full reload. That wipes both stores first, so a retry never leaves duplicates.

The job is named `populate-data-<helm revision>`, so every `helm upgrade` creates a fresh one that re-checks the data, and usually finishes in seconds. Under Tilt it's always `populate-data-1`, and it re-runs when `populate_index.py` changes. Set `populate.enabled=false` to skip it.

## Registry Notes

Image pushes go to `REGISTRY_NAME.localhost:REGISTRY_PORT` (default `k3d-graphqlastic-dev-registry.localhost:9100`). Port 9100 keeps it separate from other local k3d registries on 9099.

**If `k3d-registry-push` fails to resolve the registry host**, add an entry to `/etc/hosts`:

```
127.0.0.1   k3d-graphqlastic-dev-registry.localhost
```

## Common Commands

| Command | Description |
|---|---|
| `make check-deps` | Install missing local tooling (`k3d`, `jq`, `helm`, `tilt`) |
| `make k3d-up` | Create the k3d cluster and local registry |
| `make k3d-down` | Delete the cluster and registry |
| `make tilt` | Start Tilt (build, deploy, live update, port-forward) |
| `make tilt-debug` | Start Tilt with debug logging |
| `make tilt-down` | Stop Tilt and delete its namespaces |
| `make build-images` | Build the server, webql and postgres images |
| `make helm-deploy` | Build and push the images, `helm upgrade --install` all three charts |
| `make helm-uninstall` | Remove the Helm releases |
| `make k3d-registry-push` | Build the images and push the tags listed in `images` to the k3d registry |

## pgAdmin Notes

- It runs in server mode, so it has a login page, unlike the docker compose one at `localhost:5050`. k3d's load balancer listens on every network interface, so `:8081` can be reached from your network, not just this machine. Change the login under `pgadmin` in `../helm/platform/values.yaml`, or set `pgadmin.enabled=false` to leave it out.
- It's served under `/pgadmin` with `SCRIPT_NAME`, so all its links and redirects carry that prefix.
- The server registration comes from the `pgadmin-servers` ConfigMap, and pgAdmin only reads it on first start. To re-apply it, delete the `pgadmin-data` PVC.

## Troubleshooting

- **Elasticsearch pod keeps restarting**: it needs about 1 GiB of memory (512 MB heap plus overhead). Check `kubectl describe pod` for OOM kills, and raise `elasticsearch.resources` in `../helm/platform/values.yaml` if needed.
- **Frontend loads but shows no data**: the frontend calls `/query` (set by `VITE_GRAPHQL_URL` in `../helm/frontend/envs/dev.env`), which only works through the ingress at http://localhost:8081, not through a direct port-forward to Vite.
- **Search returns nothing**: the stores are probably still loading. Check the populate job's logs (`kubectl logs -l app=populate-data`, or the **populate-data** resource in Tilt).
