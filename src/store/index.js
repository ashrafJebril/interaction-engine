import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import auth from './auth-store'
import comments from './comments.store'
import counters from './counters-store'
import program from './program-store'
import users from './user-store'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function ( /* { ssrContext } */ ) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      users,
      program,
      comments,
      counters,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
