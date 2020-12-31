import {
  ApolloClient
} from 'apollo-client';
import {
  HttpLink
} from 'apollo-link-http';
import {
  InMemoryCache
} from 'apollo-cache-inmemory';


export default class apollo {
  constructor(token) {
    let link = {}
    if (token) {
      link = {
        uri: 'http://interactionengine-env.eba-t6fqryya.eu-west-1.elasticbeanstalk.com/v1/graphql',
        fetch,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    } else {
      link = {
        uri: 'http://interactionengine-env.eba-t6fqryya.eu-west-1.elasticbeanstalk.com/v1/graphql',
        fetch,
      }
    }
    return new ApolloClient({
      // Provide the URL to the API server.
      link: new HttpLink(link),
      // Using a cache for blazingly
      // fast subsequent queries.
      cache: new InMemoryCache(),
    })
  }
}
