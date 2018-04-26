# APIs documentation

## Application info

Application info is fetched from `package.json` file, they will define the `info` section of the generated file

|Property|Value|Target property|
|--|--|--|
|`version`|Package version|`version`|
|`name`|Package name|`title`|
|`description`|Package description|`description`|


## Endpoints info
Each endpoint is defined by both its route and method, the route is defined inside the controllers file while the method is determined based on the controller file name. The documentation contains the input and the output structure based on the schema and model linked with the controller.

### Controller documentation

|JsDoc item|used for|info|
|--|--|--|
|returns| specifies the return model |optional|
|property| specifies documentation properties |optional, multiple items|

**`returns`**

Model file name or dynamic object definition.

``` javascript
/** 
 * @returns {declineHistory}
 * ...
 */ 
```

If the returned data is an array of a specific model use (`[]`) after the model name.

``` javascript
/** 
 * @returns {declineHistory[]}
 * ...
 */ 
```

**Inline object definition**

To define a returned object structure without creating a model class for it, the `@returns` JsDoc entry **MUST** use `object` (or `object[]`) as the defintion, then the inline object structure as the description of `@returns` property using the format `{[Property name]:[Proeprty type]:[Poperty description]}`, use comma to seperate object's properties. 

``` javascript
/** 
 * @returns {object} {id:integer:Identity, name:string:Name}
 * ...
 */ 1
```
``` json
{
  "properties" : {
    "id" : {
      "type" : "integer",
      "description" : "Identity"
    },
    "name" : {
      "type" : "string",
      "description" : "Identity"
    }
  }
}
```
> Inline object structure supports only one level with primitive types `integer`, `string`, `number` and `boolean`

**`property`**
|Property|Used for|Info|
|--|--|--|
|tags|End point tags|required, comma seperated|
|route|End point route|required, comma seperated|
|schema|Controllers schema file name|optional, comma sperated|
|responseCodes|Additional response codes|optional, comma seperated|

> when the `route` has multiple values [aliases], each value will generate an endpoint documentation; all endpoints are identical except for route value.

``` javascript
/**
 * ** Documentation description **
 * @returns {** return type **}
 * @property {string} schema - ** schema files names comma seperated **
 * @property {string} tags - ** tags names comma seperated **
 * @property {string} route - ** routes comma seperated **
 * @property {string} responseCodes - ** response codes comma seperated **
 */
```

Example: 
``` javascript 
/**
 * Get users list
 * @returns {User[]}
 * @property {string} schema - listUserSchema, paginationSchema
 * @property {string} tags - Users
 * @property {string} route - /users/
 */
class GetUsersController {
...
```
``` json
...
"/v1/users/": {
  "get": {
    "tags": [
      "Users"
    ],
    "description": "Get users list",
    "parameters": [ ... ],
    "responses": {
      "200": {
        "description": "Get users list Succeed.",
        "schema": {
          "type": "object",
          "allOf": [
            {
              "type": "array",
              "items": {
                "properties": { ... }
              }
            }
          ]
        }
      },
      "400": {...},
      "500": {...}
    }
  }
}
...
```

> Can be set over the `class` definition or the exported `controller` function in the controller file

``` javascript
/**
 * Get users list
 * @returns {User[]}
 * @property {string} schema - listUserSchema, paginationSchema
 * @property {string} tags - Users
 * @property {string} route - /users/
 */
module.exports.controller = (req, res) => v1.controller(req, res);
```

``` json
...
"/v2/users/": {
  "get": {
    "tags": [
      "Users"
    ],
    "description": "Get users list",
    "parameters": [ ... ],
    "responses": {
      "200": {
        "description": "Get users list Succeed.",
        "schema": {
          "type": "object",
          "allOf": [
            {
              "type": "array",
              "items": {
                "properties": { ... }
              }
            }
          ]
        }
      },
      "400": {...},
      "500": {...}
    }
  }
}
...
```


### Schema documentation

``` javascript
/**
  * ** Description **
  * @type {** type **}
  * @property {** propery type **} ** property name ** - ** property  value(s) **
  */
```

Example
``` javascript
/**
  * filter based on user type
  * @type {string}
  * @property {string[]} enum - Registered,Visitor
  */
```
``` json
...
  "parameters": [
    {
      "name": "type",
      "in": "query",
      "description": "filter based on user type",
      "required": false,
      "type": "string",
      "enum": [
        "Registered",
        "Visitor",
      ]
    },
  ]
  ...
```

**Nested objects**

If the property name indicates a hierarchical object -contains parent property named foloowed by property name- the object will be constructed as a nested object

``` javascript
module.exports = {
    'userInfo.Id': {
      ...
    },
    'userInfo.name': {
     ...
    },
    ...
}
```
``` json
"schema": {
  "type": "object",
  "properties": {
    "userInfo": {
      "type": "object",
      "properties": {
        "Id": {
          ...
        },
        "name": {
          ...
        },
...  
```
**Multiple property settings**

If the schema files contains a dynamic definitons; the `default` property will be used as a reference and it should contain all properties, specific locale definiton should be part of the property's documentation

``` javascript
module.exports = {
  default: {
    ...
    /**
    * Id [optional for update]
    * @type {string}
    */
    'userInfo.Id': {
      in: 'body',
      errorMessage: 'invalid update operation',
    },
    ...
```

``` json
...
"Id": {
  "description": "Id [optional for update]",
  "type": "string"
},
```

> Schema additioanl properties must be recognized by the openAPI standard, as the generator will add them as is without validation


### Model documentation

``` javascript
/**
 * @property {** type **} ** name ** - ** value **
 * @type {** type **}
 */
```

Example

``` javascript
class User {
  constructor() {
    /**
     * @property {string} format - YYYY-MM-DDThh:mm:ss.sssZ
     * @type {string}
     */
    this.signupDate = undefined;
  ...
```
``` json
...
"properties": {
  "signupDate": {
    "type": "string",
    "format" : "YYYY-MM-DDThh:mm:ss.sssZ"
  },
  ...
}
```

**Type** 

`@type` value can contain either a primitive type or a sub-model file name, if it points to another model the documentation will include that model documentation as nested properties

``` javascript
class User {
  constructor() {
    ...
    /** User type info
    * @type {UserType}
    */
    this.userType = undefined;
    ...
  }...
}
```
``` json
...
"responses": {
  "200": {
    ...
    "schema": {
      "type": "object",
      "properties": { ...
        "userType": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            },
    ...
```