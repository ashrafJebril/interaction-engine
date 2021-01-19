import axios from 'axios'
import {
  LocalStorage
} from 'quasar'

const state = {
  isUserLoggedIn: false,
  tokens: []
}

const mutations = {
  setTokens(state, payload) {
    state.tokens = payload
    state.isUserLoggedIn = true;
    LocalStorage.set('tokens', payload)
    LocalStorage.set('isUserLoggedIn', true)
  }
}

const actions = {
  login({
    commit,
    dispatch
  }, payload) {

    axios.post('http://gotrueauthentication-env.eba-srsxfj8j.eu-west-1.elasticbeanstalk.com/token?grant_type=password', payload).then(res => {
      commit('setTokens', res.data)
      setTimeout(() => {
        dispatch('refreshToken')
      }, 840000)
      this.$router.push({
        name: 'dashboard',
        path: '/dashboard'
      })
    })
  },
  async refreshToken() {
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
