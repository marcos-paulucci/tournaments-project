import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import asyncAwait from 'redux-async-await'
import { routerReducer, routerMiddleware } from 'react-router-redux'

export function configureStore(history, initialState) {

    const reducer = combineReducers({
        routing: routerReducer
    });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(
            applyMiddleware(
                asyncAwait,
                routerMiddleware(history)
            )
        )
    );

    return store
}
