import {
    LocalStorage
  } from 'quasar'
  
export const Token = (function () {
  var instance;

  function createInstance() {
    let token = LocalStorage.getItem('tokens') ? LocalStorage.getItem('tokens').access_token : '';
    return {
      _get: () => {
        return token
      }
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
