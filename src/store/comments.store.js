import graphqlClient from '../apollo/graphql';
import gql from "graphql-tag";
import {
  LocalStorage
} from 'quasar'
const state = {
  comments: {},
  firebaseUser: {}
}

const mutations = {
  getComments(state, payload) {

    state.comments = payload
  },
  firebaseUser(state, payload) {
    state.firebaseUser = payload
  }
}

const actions = {
  send({
    commit,
    dispatch
  }, payload) {
    let token = LocalStorage.getItem('tokens') ? LocalStorage.getItem('tokens').access_token : ''
    new graphqlClient(token)
      .mutate({
        // Query
        mutation: gql `
        mutation MyMutation($body: String!, $parent_lecture: Int!, $userId: Int) {
          insert_comments_one(object: {body: $body, parent_lecture: $parent_lecture, user_id: $userId}) {
            body
            created_at
            user {
              avatar_url
              display_name
            }
          }
        }`,
        // Parameters
        variables: payload,
      }).then(res => {
        dispatch('getComments', payload.parent_lecture)
      })
  },
  async getComments({
    commit
  }, payload) {
    let token = LocalStorage.getItem('tokens') ? LocalStorage.getItem('tokens').access_token : ''
    const comments = await new graphqlClient(token).query({
      query: gql `
            query Comments {
              comments {
                id
                body
                created_at
                parent_lecture
                user {
                  avatar_url
                  display_name
                }
                comments {
                  id
                  user {
                    avatar_url
                    display_name
                  }
                  body
                  created_at
                }
              }
            }
          `
    })
    commit('getComments', comments.data.comments)

  },
  replyComment({
    dispatch
  }, payload) {
    let token = LocalStorage.getItem('tokens') ? LocalStorage.getItem('tokens').access_token : ''
    new graphqlClient(token)
      .mutate({
        // Query
        mutation: gql `
        mutation MyMutation($body: String!, $parent_lecture: Int!, $parent_comment: Int, $userId: Int) {
          insert_comments_one(object: {body: $body, parent_lecture: $parent_lecture, parent_comment: $parent_comment, user_id: $userId}) {
            body
            created_at
            user {
              avatar_url
              display_name
            }
          }
        }


          `,
        // Parameters
        variables: payload,
      }).then(res => {
        dispatch('getComments', payload.parent_lecture)
      })
  }
}

const getters = {
  comments(state) {
    return state.comments
  },
  firebaseUser(state) {
    return state.firebaseUser
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}
