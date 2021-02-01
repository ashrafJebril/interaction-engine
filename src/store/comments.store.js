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
  async getComments({
    commit,
    dispatch
  }, payload) {
    try {
      let token = LocalStorage.getItem('tokens') ? LocalStorage.getItem('tokens').access_token : ''
      const comments = await new graphqlClient(token).query({
        query: gql `
        query Comments($limit: Int, $offset: Int) {
          comments(where: {parent_comment: {_is_null: true}}, limit: $limit, offset: $offset, order_by: {id: desc}) {
            id
            body
            created_at
            parent_lecture
            content_info
            user {
              avatar_url
              display_name
            }
            comments {
              id
              user {
                avatar_url
                display_name
                extra_info
              }
              body
              created_at
              content_info
              parent_comment
            }
          }
        }

`,
        variables: payload
      })

      commit('getComments', comments.data.comments)
    } catch (err) {
      dispatch('logout')
    }

  },
  replyComment({
    dispatch
  }, payload) {
    let token = LocalStorage.getItem('tokens') ? LocalStorage.getItem('tokens').access_token : ''
    new graphqlClient(token)
      .mutate({
        // Query
        mutation: gql `
        mutation MyMutation($body: String!, $parent_lecture: Int!, $userId: Int, $parent_comment: Int,$content_info: jsonb) {
          insert_comments_one(object: {body: $body, parent_lecture: $parent_lecture, user_id: $userId, parent_comment: $parent_comment, content_info: $content_info}) {
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
      }).catch(err => {
        console.log(err)
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
