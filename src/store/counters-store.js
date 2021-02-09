import graphqlClient from '../apollo/graphql';
import gql from "graphql-tag";
import {Token} from '../util/token.service'
import {
  LocalStorage
} from 'quasar'
const state = {
  posts: 0,
  commentsCount: 0
}

const mutations = {
  getPostsCount(state, payload) {
    state.posts = payload
  },
  getCommentsCount(state, payload) {
    state.commentsCount = payload
  }
}

const actions = {
  async counters({
    dispatch
  }) {
    await dispatch("getPostsCount");
    await dispatch("getCommentsCount");
  },
  async getPostsCount({
    commit
  }) {
    try {

      await new graphqlClient(Token.getInstance()._get()).subscribe({
        query: gql `
        query PostCount {
          comments(where: {parent_comment: {_is_null: true}}) {
            id
          }
        }

            `
      }).subscribe(res => {
        
        commit('getPostsCount', res.data.comments.length)
      })
    } catch (err) {
      console.log(err)
      // dispatch('logout')
    }

  },
  async getCommentsCount({
    commit
  }) {
    try {
      
      await new graphqlClient(Token.getInstance()._get()).subscribe({
        query: gql `
        query MyQuery {
          comments(where: {parent_comment: {_is_null: false}}) {
            id
          }
        }`
      }).subscribe(res => {

        commit('getCommentsCount', res.data.comments.length)
      })
    } catch (err) {
      console.log(err)
      // dispatch('logout')
    }

  },
}

const getters = {
  posts(state) {
    return state.posts
  },
  commentsCount(state) {
    return state.commentsCount
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
