import axios from 'axios'
import { Notify } from 'quasar'
import {
  LocalStorage
} from 'quasar'

const state = {
  isUserLoggedIn: false,
  "X-Hasura-User-Id": {},
  tokens: []
}

const mutations = {
  setTokens(state, payload) {
    state.tokens = payload
    state.isUserLoggedIn = true;
    LocalStorage.set('tokens', payload)
    LocalStorage.set('isUserLoggedIn', true)
  },
  setXHasuraUserId(state, payload) {
    state['X-Hasura-User-Id'] = payload;
    LocalStorage.set('X-Hasura-User-Id', payload)
  }
}

const actions = {
  login({
    commit,
    dispatch
  }, payload) {
    axios.post('http://gotrueauthentication-env.eba-srsxfj8j.eu-west-1.elasticbeanstalk.com/token?grant_type=password', payload).then(res => {
      commit('setTokens', res.data)
      dispatch('userInfo')
      setTimeout(() => {
        dispatch('refreshToken')
      }, 840000)
      this.$router.push({
        name: 'dashboard',
        path: '/dashboard'
      })
    })
  },
  async refreshToken({
    commit
  }) {
    try {

      axios.post(`http://gotrueauthentication-env.eba-srsxfj8j.eu-west-1.elasticbeanstalk.com/token?grant_type=refresh_token&refresh_token=${LocalStorage.getItem('tokens').refresh_token}`, null).then(res => {
        // res.data
        commit('setTokens', res.data)
      })
    } catch (error) {
      return false;
    }
  },
  async logout() {
    const access_token = LocalStorage.getItem('tokens').access_token
    await axios.post('http://gotrueauthentication-env.eba-srsxfj8j.eu-west-1.elasticbeanstalk.com/logout', null, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': "Bearer " + access_token
      }
    }).then(res => {
      LocalStorage.remove('tokens')
      LocalStorage.set('isUserLoggedIn', false)
      this.$router.push({
        name: "login",
        path: "/login"
      })
    }).catch(err => {
      console.log(err);
      // window.location.reload();
    })
  },
  async userInfo({
    commit,
    dispatch
  }) {
    const access_token = LocalStorage.getItem('tokens').access_token
    let headers = {
      "Access-Control-Allow-Origin": "*",
      'Content-type': 'application/json',
      'x-access-token': access_token
    }
    await axios.post('https://j0mxal47ub.execute-api.eu-west-1.amazonaws.com/interaction/syncuser', null, {
      headers: headers
    }).then(res => {
      console.log(res)
      if (res.data.data['X-Hasura-Role'] == 'student') {
        Notify.create({
          color: "negative",
          icon: "warning",
          progress: true,
          textColor: 'white',
          timeout: 4000,
          classes: "text-center text-xl",
          position: "bottom",
          message: "You are not allowed to login here."
        })
        this.$router.push({
          name: "login",
          path: "/login"
        })
        setTimeout(()=>{
          location.href="https://abwaab.me"
        },4000)
        dispatch('logout')
      } else {
        dispatch('userData', res.data.data['X-Hasura-User-Id'])
        commit('setXHasuraUserId', res.data.data['X-Hasura-User-Id'])
      }
    })
  }
}

const getters = {
  isUserLoggedIn: (state) => {
    return state.isUserLoggedIn
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}
