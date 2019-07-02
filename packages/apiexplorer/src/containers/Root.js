/* global APIExplorer */

import React, { Component } from 'react'
import { Provider } from 'react-redux'

import { createBrowserHistory as createHistory } from 'history'
import { ConnectedRouter } from 'react-router-redux'

import ReduxToastr from 'react-redux-toastr'
import { Switch, Route } from 'react-router'
import Application from '../containers/Application'
import NotFound from '../containers/NotFound'

import { Helmet } from 'react-helmet'

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

export default class Root extends Component {
  render () {
    const { store } = this.props

    return (
      <Provider store={store}>
        <div>
          <Helmet>
            <title>API Explorer</title>
            <link rel='shortcut icon' type='image/png' href='/images/favicon.png' />
            <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css' />
            <link rel='stylesheet' href='//fonts.googleapis.com/css?family=Source+Code+Pro' />
            <link rel='stylesheet' href='//diegoddox.github.io/react-redux-toastr/4.0/react-redux-toastr.min.css' />
          </Helmet>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path={`${APIExplorer.basePath}`} component={Application} />
              <Route component={NotFound} />
            </Switch>
          </ConnectedRouter>
          <ReduxToastr transitionIn='fadeIn' transitionOut='fadeOut' progressBar />
        </div>
      </Provider>
    )
  }
}
