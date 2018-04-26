import specs from './specs';
import responses from './responses';

export default {
  concurrencyLimit: 0,
  specs,
  customResponses: responses,
  patterns: {
    fileName: /_(delete|get|post|put|patch)\.(v\d+)(\.\S+)*\.js$/,
  }
};
