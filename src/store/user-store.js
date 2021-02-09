import graphqlClient from '../apollo/graphql';
import gql from "graphql-tag";
import {Token} from '../util/token.service'
const state = {
  teaching_assistant: []
}

const mutations = {
  set_teaching_assistant(state, payload) {
    state.teaching_assistant = payload
  }
}

const actions = {
  async getTeacherAssistant({
    commit
  }) {
    try {
      ;
      await new graphqlClient(Token.getInstance()._get()).subscribe({
        query: gql `
        query teaching_assistant {
          users(where: {_or: [
            {user_type: {_eq: "teaching_assistant"}},
            {user_type: {_eq: "teacher"}}
          ], }) {
            id
            avatar_url
            display_name
            user_type
            username
            extra_info
          }
        }`
      }).subscribe(res => {
        console.log(res)
        commit('set_teaching_assistant', res.data.users)
      })
    } catch (err) {
      console.log(err)
      // dispatch('logout')
    }
  },
  assignTA({
    dispatch
  }, payload) {
    
    new graphqlClient(Token.getInstance()._get())
      .mutate({
        // Query
        mutation: gql `
        mutation MyMutation($id: Int, $extra_info: jsonb) {
          update_users(where: {id: {_eq: $id}}, _set: {extra_info: $extra_info}) {
            affected_rows
          }
        }
          `,
        // Parameters
        variables: payload,
      }).then(res => {
        dispatch('getTeacherAssistant')
      }).catch(err => {
        console.log(err)
      })
  },
  async userData({
    commit,
    dispatch
  }, payload) {
    
    new graphqlClient(Token.getInstance()._get())
      .query({
        // Query
        query: gql `
        query userData($id: Int!) {
          users(where: {id: {_eq: $id}}) {
            extra_info
          }
        }
          `,
        // Parameters
        variables: {
          id: payload
        },
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
  }
}

const getters = {
  teaching_assistant: (state) => {
    return state.teaching_assistant
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}
