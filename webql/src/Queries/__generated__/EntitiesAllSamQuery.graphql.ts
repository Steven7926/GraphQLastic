/**
 * @generated SignedSource<<b18325dfe82b74c09316b0c665b63b55>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type EntityType = "COMPANY" | "PERSON" | "%future added value";
export type RegistrationStatus = "ACTIVE" | "EXPIRED" | "INACTIVE" | "PENDING" | "%future added value";
export type SearchSource = "ELASTICSEARCH" | "POSTGRES" | "%future added value";
export type UsState = "CA" | "CO" | "DC" | "FL" | "GA" | "MD" | "NY" | "TX" | "VA" | "WA" | "%future added value";
export type EntitiesAllSamQuery$variables = {
  after?: any | null | undefined;
  before?: any | null | undefined;
  first?: number | null | undefined;
  offset?: number | null | undefined;
  search?: string | null | undefined;
  source?: SearchSource | null | undefined;
  state?: UsState | null | undefined;
  status?: RegistrationStatus | null | undefined;
  type?: EntityType | null | undefined;
};
export type EntitiesAllSamQuery$data = {
  readonly samEntities: {
    readonly nodes: ReadonlyArray<{
      readonly cageCode: string | null | undefined;
      readonly city: string | null | undefined;
      readonly id: any;
      readonly name: string;
      readonly state: string | null | undefined;
      readonly status: string | null | undefined;
      readonly type: string | null | undefined;
      readonly uei: string | null | undefined;
    }>;
    readonly pageInfo: {
      readonly endCursor: any | null | undefined;
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly startCursor: any | null | undefined;
    };
    readonly totalCount: number;
    readonly totalSearch: number;
  } | null | undefined;
};
export type EntitiesAllSamQuery = {
  response: EntitiesAllSamQuery$data;
  variables: EntitiesAllSamQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": 10,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": 0,
  "kind": "LocalArgument",
  "name": "offset"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "search"
},
v5 = {
  "defaultValue": "ELASTICSEARCH",
  "kind": "LocalArgument",
  "name": "source"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "state"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "type"
},
v9 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "after",
        "variableName": "after"
      },
      {
        "kind": "Variable",
        "name": "before",
        "variableName": "before"
      },
      {
        "kind": "Variable",
        "name": "first",
        "variableName": "first"
      },
      {
        "kind": "Variable",
        "name": "offset",
        "variableName": "offset"
      },
      {
        "kind": "Variable",
        "name": "search",
        "variableName": "search"
      },
      {
        "kind": "Variable",
        "name": "source",
        "variableName": "source"
      },
      {
        "kind": "Variable",
        "name": "state",
        "variableName": "state"
      },
      {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
      },
      {
        "kind": "Variable",
        "name": "type",
        "variableName": "type"
      }
    ],
    "concreteType": "SamEntityConnection",
    "kind": "LinkedField",
    "name": "samEntities",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalCount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalSearch",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "PageInfo",
        "kind": "LinkedField",
        "name": "pageInfo",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasNextPage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasPreviousPage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endCursor",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startCursor",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "SamEntity",
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cageCode",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "uei",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "city",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "state",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "EntitiesAllSamQuery",
    "selections": (v9/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v8/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/)
    ],
    "kind": "Operation",
    "name": "EntitiesAllSamQuery",
    "selections": (v9/*: any*/)
  },
  "params": {
    "cacheID": "c16e20fe69cb06589276a3e29886a1c1",
    "id": null,
    "metadata": {},
    "name": "EntitiesAllSamQuery",
    "operationKind": "query",
    "text": "query EntitiesAllSamQuery(\n  $first: Int = 10\n  $offset: Int = 0\n  $before: Cursor = null\n  $after: Cursor = null\n  $search: String = null\n  $source: SearchSource = ELASTICSEARCH\n  $type: EntityType = null\n  $state: UsState = null\n  $status: RegistrationStatus = null\n) {\n  samEntities(first: $first, offset: $offset, before: $before, after: $after, search: $search, source: $source, type: $type, state: $state, status: $status) {\n    totalCount\n    totalSearch\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n      startCursor\n    }\n    nodes {\n      name\n      id\n      cageCode\n      type\n      uei\n      city\n      state\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "dd9e66e31e55946795eb6d4ff4814366";

export default node;
