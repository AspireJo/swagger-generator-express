import _ from 'lodash';
import readers from './../reader';
import parsers from './../parser';
import response from './response';
import parameter from './parameter';
import Exceptions from './../exceptions';

export default async (controller, modelsMap, schemasMap, config) => {
  try {
    logger(`generate controller ${controller} docuemntation`);
    // get raw documentation from file
    const rawJsDoc = await readers.jsDoc(controller);
    // parse controller's method & version
    const { method, version } = await config.patterns.controllerInfoResolver(controller);
    if (!method || !version) throw new Error(`unknows method or version for controller ${controller}`);
    // get controller documentstion
    const jsDocs = await parsers.description.getClassDescription(rawJsDoc) || await parsers.description.getControllerDescription(rawJsDoc);
    if (!jsDocs || jsDocs.undocumented) throw Exceptions.undocumented(controller, 'missing controller documentation');
    // parse controller's route, model, schema, tags, responses
    const [routes, model, schema, tags, responses] =
      await Promise.all([
        parsers.controller.getRoute(jsDocs),
        parsers.controller.getReturnModel(jsDocs),
        parsers.controller.getSchemas(jsDocs),
        parsers.controller.getTags(jsDocs),
        parsers.controller.getResponses(jsDocs)
      ]);
    logger(`${routes.length} route/alias found for ${controller}`);
    // get description text
    const descriptionText = jsDocs.classdesc || jsDocs.description;
    // generate end point documentation
    // contains responses and parameters
    const [okResponse, errResponse, versionParams, schemaParams, otherResponses] =
      await Promise.all([
        response.getOkResponse(model, descriptionText, modelsMap),
        response.getErrorResponses(descriptionText),
        parameter.getVersionParameters(version, config),
        parameter.getSchemaParameters(schema, schemasMap),
        response.getAdditionalResponses(responses, config)
      ]);
    // construct route documentation
    const routeDescription = _.merge({}, { tags, description: descriptionText }, { responses: _.merge({}, okResponse, errResponse, otherResponses) });
    // construct route params documentation
    const versionAndSchemaParams = _.uniqBy(_.concat(versionParams, schemaParams).filter(a => a), 'name');
    // construct aliases documentation
    const genRes = await Promise.map(
      routes, async (alias) => {
        const route = _.replace(_.replace(config.baseRoute, '{version}', version), '{route}', _.trimStart(alias, '/'));
        const params = _.uniqBy(_.concat(_.cloneDeep(versionAndSchemaParams), await parameter.getUrlParameters(route, config)).filter(a => a), 'name');
        const x = {};
        x[route] = {};
        x[route][method] = _.merge({}, routeDescription, { parameters: params });
        return x;
      },
      { concurrency: concurrencyLimit }
    );
    logger(`finished controller ${controller}`);
    // merge routes documentation
    return _.merge({}, ...genRes);
  } catch (ex) {
    if (ex.code && (ex.code === -1001 || ex.code === -1002)) return { file: ex.file, message: ex.message };
    return Promise.reject(ex);
  }
};
