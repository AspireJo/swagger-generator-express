
# Add new endpoint

Make the following changes 

### Controllers
- File must be created based on the contollers pattern you are using to identify controllers
- File name must contain the method and version based on the `fileName` regex that you are using to identify the file name. ex: `_get.v2.js`
- Add `JsDoc` documentation above the controller's class or `controller` function
  - **Description** : does not require any tags 
    ``` javascript
    /**
    * This is an end point description
    */
    ```
  - **Route** : add `@proeprty` named `route` followed by comma seperated values
    ``` javascript
    /**
    * @property {string} route - /endpoit-route-with-params, /another-end-point-alias
    */
    ```
  - **Tags** : add `@property` named `tags` followed by comma seperated values
    ``` javascript
    /**
    * @property {string} tags - tag1, tag2
    */
    ```
  - **Input schema** : add `@property` named `schema` followed by comma seperated file names
    ``` javascript
    /**
    * @property {string} schema - file1, file2
    */
    ```
  - **Additional codes** : add `@property` tag named `responseCodes` followed by comma seperated codes
    ``` javascript
    /**
    * @property {string} responseCodes - 204, 501
    */
    ```
  - **Return model** : add `@returns` tag with the return model file name
    ``` javascript
    /**
    * @returns {fileName}
    */
    ```

### Schema
- File must be created based on the schema pattern you are using to identify schemas
- File name is unique accross all `schema` folders
- Add `JsDoc` documentation above each property in the schema
  - **Description** : does not require any tags 
    ``` javascript
    /**
    * This is a schema proeprty description
    */
    ```
  - **Type** : add `@type` tag with the property type
    ``` javascript
    /**
    * @type {integer}
    */
    ```
  - **Additional properties** : add `@property` tag for each property followed by its type and description
    ``` javascript
    /**
    * @property {integer} minLength - 0
    * @property {integer} maxLength - 100
    */
    ```

### Model
- File must be created based on the model pattern you are using to identify models
- File name is unique accross all `models` folders
- Add `JsDoc` documentation above each property in the schema
  - 
  - **Description** : does not require any tags 
    ``` javascript
    /**
    * This is a schema proeprty description
    */
    ```
  - **Type** : add `@type` tag with the property type [or model file name]
    ``` javascript
    /**
    * @type {integer}
    */
    ```
  - **Additional properties** : add `@property` tag for each property followed by its type and description
    ``` javascript
    /**
    * @property {string} format - YYYY-MM-DDThh:mm:ss.sssZ
    */
    ```
  - Add `augments` tag for parent model -if the model `extends` another one-
    ``` javascript
    /**
    * @augments parentModelFileName
    */
    ```