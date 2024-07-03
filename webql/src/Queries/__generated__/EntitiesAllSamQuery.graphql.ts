/**
 * @generated SignedSource<<b1b4bc6b2356cd1f16e6febb59c80532>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type EntitiesAllSamQuery$variables = {
  after?: any | null | undefined;
  before?: any | null | undefined;
  first?: number | null | undefined;
  offset?: number | null | undefined;
};
export type EntitiesAllSamQuery$data = {
  readonly samEntities: {
    readonly nodes: ReadonlyArray<{
      readonly cageCode: string | null | undefined;
      readonly id: any;
      readonly name: string;
    }>;
    readonly pageInfo: {
      readonly endCursor: any | null | undefined;
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly startCursor: any | null | undefined;
    };
    readonly totalCount: number;
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
v4 = [
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
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "EntitiesAllSamQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "EntitiesAllSamQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "09fbf44341bca185e7c1728c8eb14546",
    "id": null,
    "metadata": {},
    "name": "EntitiesAllSamQuery",
    "operationKind": "query",
    "text": "query EntitiesAllSamQuery(\n  $first: Int = 10\n  $offset: Int = 0\n  $before: Cursor = null\n  $after: Cursor = null\n) {\n  samEntities(first: $first, offset: $offset, before: $before, after: $after) {\n    totalCount\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n      startCursor\n    }\n    nodes {\n      name\n      id\n      cageCode\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "321930cfac6cae0428d182b769e0a007";

export default node;
