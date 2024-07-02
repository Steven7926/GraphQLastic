/**
 * @generated SignedSource<<804d5674ec943f41ecddadb47e182288>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type EntitiesAllSamQuery$variables = Record<PropertyKey, never>;
export type EntitiesAllSamQuery$data = {
  readonly SamEntities: ReadonlyArray<{
    readonly cageCode: string | null | undefined;
    readonly id: string;
    readonly name: string;
  }>;
};
export type EntitiesAllSamQuery = {
  response: EntitiesAllSamQuery$data;
  variables: EntitiesAllSamQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "SamEntity",
    "kind": "LinkedField",
    "name": "SamEntities",
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
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "EntitiesAllSamQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "EntitiesAllSamQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "500ae78d2df124cd4831ed64d02c8aeb",
    "id": null,
    "metadata": {},
    "name": "EntitiesAllSamQuery",
    "operationKind": "query",
    "text": "query EntitiesAllSamQuery {\n  SamEntities {\n    name\n    id\n    cageCode\n  }\n}\n"
  }
};
})();

(node as any).hash = "2d2b69e280cdd7749832d2c04f04daf5";

export default node;
