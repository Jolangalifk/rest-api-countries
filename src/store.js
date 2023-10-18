// themeStore.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    isDarkMode: false, // Awalnya, mode gelap dimatikan
  },
  mutations: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
      if (state.isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
  },
  actions: {
    // Tambahkan tindakan lain jika diperlukan
  },
  getters: {
    // Tambahkan getter jika diperlukan
  },
});
