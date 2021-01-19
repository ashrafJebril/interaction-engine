import {
  ApolloClient
} from 'apollo-client';
import {
  HttpLink
} from 'apollo-link-http';
import {
  InMemoryCache
} from 'apollo-cache-inmemory';
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'




export default class apollo {
  constructor(token) {
    let link = {}

    if (token) {
      const httpLink = new HttpLink({
        // You should use an absolute URL here
        uri: 'http://interactionengine-env.eba-t6fqryya.eu-west-1.elasticbeanstalk.com/v1/graphql',
        fetch,
          headers: {
            Authorization: `Bearer ${token}`
          }
      })

      // Create the subscription websocket link
      const wsLink = new WebSocketLink({
        uri: 'ws://interactionengine-env.eba-t6fqryya.eu-west-1.elasticbeanstalk.com/v1/graphql',
        options: {
          reconnect: true,
          connectionParams: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          },
        },
      })

      // using the ability to split links, you can send data to each link
      // depending on what kind of operation is being sent
       link = split(
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        },
        wsLink,
        httpLink
      )

    } else {
      const httpLink = new HttpLink({
        // You should use an absolute URL here
        uri: 'http://interactionengine-env.eba-t6fqryya.eu-west-1.elasticbeanstalk.com/v1/graphql',
        fetch
      })

      // Create the subscription websocket link
      const wsLink = new WebSocketLink({
        uri: 'ws://interactionengine-env.eba-t6fqryya.eu-west-1.elasticbeanstalk.com/v1/graphql',
        options: {
          reconnect: true,

        },
      })

      // using the ability to split links, you can send data to each link
      // depending on what kind of operation is being sent
       link = split(
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        },
        wsLink,
        httpLink
      )

    }
    return new ApolloClient({
      // Provide the URL to the API server.
      link: link,
      // Using a cache for blazingly
      // fast subsequent queries.
      cache: new InMemoryCache(),
    })
  }
}
