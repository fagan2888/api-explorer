import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Enumerable from 'linq'
import { OperationsFilter } from '.'

class LateralMenu extends Component {
  constructor (props) {
    super(props)
    this.state = { filter: this.getFilterState('') }
  }

  // ----------------------------------------------------------------------------------------
  // Filtering
  // ----------------------------------------------------------------------------------------
  getFilterState (filterText) {
    // Convert filterText into a regex
    // EX: "GET u ent    vi" -> "GETuentvi" -> /G.*E.*T.*u.*e.*n.*t.*v.*i/i
    return {
      text: filterText,
      regex: new RegExp(filterText.replace(/\s/g, '').split('').join('.*'), 'i')
    }
  }

  handleFilterUpdate (text) {
    this.setState({ filter: this.getFilterState(text) })
  }

  matchFilterRegex (text) {
    return this.state.filter.regex.test(text)
  }

  isApiVisible (api, operations) {
    if (this.state.filter.text === '') return true
    return operations.some(o => this.isOperationVisible(o))
  }

  isTagVisible (tag, operations) {
    if (this.state.filter.text === '') return true
    if (this.matchFilterRegex(tag)) return true
    return operations.some(o => this.isOperationVisible(o))
  }

  isOperationVisible (operation) {
    if (this.state.filter.text === '') return true
    if (operation.spec.tags.some(tag => this.matchFilterRegex(tag))) return true
    return this.matchFilterRegex(operation.spec.httpMethod + operation.spec.url)
  }

  // ----------------------------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------------------------
  render () {
    const operationsByApi = this.props.apis.get('byOrder')
      .map(name => this.props.operations.filter(o => o.apiname === name))
      .toArray()
    return (
      <div id='lateral-menu'>
        <ul className='nav'>
          <OperationsFilter placeholder='e.g. getusersession' onFilter={text => this.handleFilterUpdate(text)} />
          {operationsByApi.map(apiOperations => this.renderAPI(apiOperations))}
        </ul>
      </div>
    )
  }

  renderAPI (apiOperations) {
    if (apiOperations.length === 0 || !this.isApiVisible(apiOperations[0].apiname, apiOperations)) return

    const tags = Enumerable.from(apiOperations).selectMany(o => o.spec.tags).distinct().toArray()
    return (
      <li key={apiOperations[0].apiname}>
        <a href='#'>
          <i className='fa fa-fw fa-user' />
          <span />
          <strong>{apiOperations[0].apiname}</strong><span />
        </a>
        <ul className='nav nav-second-level'>
          {tags.map(tag => this.renderOperationsWithTag(apiOperations, tag))}
        </ul>
      </li>
    )
  }

  renderOperationsWithTag (operations, tag) {
    const visibleOperations = Enumerable.from(operations).where(o => (o.spec.tags).indexOf(tag) !== -1).toArray()

    if (!this.isTagVisible(tag, visibleOperations)) return

    return (
      <li key={visibleOperations[0].apiname + tag}>
        <a href='#'>{tag}</a>
        <ul className='nav nav-third-level'>
          {visibleOperations.map(o => this.renderOperation(o))}
        </ul>
      </li>
    )
  }

  renderOperation (operation) {
    if (!this.isOperationVisible(operation)) {
      return
    }

    const httpMethodClasses = `btn btn-http-method btn-xs btn-http-method-${operation.spec.httpMethod}`

    const liClass = cx('lioperation', {
      'active': this.props.selectedOperationId && operation.id === this.props.selectedOperationId,
      'deprecated-api': operation.spec.deprecated
    })

    return (
      <li key={operation.id} id={operation.id} className={liClass} title={operation.spec.description}>
        <Link to={APIExplorer.LinkGenerator.toOperation(operation)} className='operation-container' >
          <span className='operation'>
            <span className={httpMethodClasses}>{operation.spec.httpMethod.toUpperCase()}</span>
            &nbsp;
            {operation.spec.security && (
              <span key={`security${operation.id}`}
                style={{ width: '1em', display: 'inline-block', opacity: '0.5', marginRight: '0px 5px', color: 'Yellow' }}>
                <i className='fa fa-lock' title='Secured' />
              </span>)}
            <span className='operation-url'>{operation.spec.url}</span>
          </span>
        </Link>

      </li>
    )
  }
}

export default LateralMenu
