import axios from 'axios'
import {
  LocalStorage
} from 'quasar'

const state = {
  programs: [],
  ProgramSubjects: []
}

const mutations = {
  SET_PROGRAMS(state, payload) {
    state.programs = payload;
  },
  setProgramSubjects(state, payload) {
    state.ProgramSubjects = payload
  },
}

const actions = {
  async getPrograms({
    commit,
    dispatch
  }) {
    //Change ID and text
    await axios.get('https://cmut9724yl.execute-api.eu-west-1.amazonaws.com/content/programs', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    }).then(async (response) => {
      commit('SET_PROGRAMS', response.data.data.sort(function (a, b) {
        return a.order - b.order;
      }).reverse());
    });
  },
  async getProgramSubject({
    commit
  }, payload) {
    await axios.get(`https://cmut9724yl.execute-api.eu-west-1.amazonaws.com/content/subjects?program_id=${payload}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      commit('setProgramSubjects', response.data.data);
    });
  },
}

const getters = {
  programs: (state) => {
    return state.programs
  },
  ProgramSubjects: (state) => {
    return state.ProgramSubjects
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
