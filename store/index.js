import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            vuexContext.commit('setPosts', [
              {
                id: '1',
                title: 'First Post',
                previewText: 'This is our first post!',
                thumbnail:
                  'https://i.investopedia.com/image/jpeg/1509206221062/tech_global_shutterstock_134102588.jpg'
              },
              {
                id: '2',
                title: 'Second Post',
                previewText: 'This is our second post!',
                thumbnail:
                  'https://i.investopedia.com/image/jpeg/1509206221062/tech_global_shutterstock_134102588.jpg'
              }
            ]);
            resolve();
          }, 1500);
        });
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts);
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      }
    }
  });
};

export default createStore;
