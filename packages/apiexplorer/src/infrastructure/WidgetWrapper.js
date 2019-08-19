import { connect } from 'react-redux'
import { List } from 'immutable'

export default function widgetWrapper (widgetTab) {
  return connect((state, props) => connectFn(state, props))(widgetTab)
}

function connectFn (state, props) {
  let operation = state.operations.filter(op => op.get('id') === props.match.params.id).first()
  operation = operation !== undefined && operation.size > 0 ? operation.toJS() : null
  let operationResponse = state.operationResponses.get(props.match.params.id)
  let apiName = operation !== null ? operation.apiname : null
  let operationId = operation !== null ? operation.id : null
  return {
    operation: operation,
    operationResponse: operationResponse,
    operations: state.operations,
    definitions: state.definitions.size > 0 ? state.definitions.toJS() : {},
    apis: state.apis.get('byName').get(apiName),
    apiConfig: APIExplorer.getAPI(apiName),
    config: {
      useProxy: state.configs.get('url').useProxy,
      headers: state.configs.get('headers'),
      queryString: state.configs.get('url').getQueryString(),
      HttpClientConfigurator: APIExplorer.HttpClientConfigurator
    },
    operationLocalParameters: state.operationLocalParameters.get(operationId) || {},
    operationLastParameters: state.operationLastParameters.get(operationId) || List([])
  }
}
