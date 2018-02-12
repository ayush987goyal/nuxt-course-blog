import Vuex from 'vuex';
import Cookie from 'js-cookie';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
        state.loadedPosts[postIndex] = editedPost;
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios
          .$get('/posts.json')
          .then(data => {
            const postsArray = [];
            for (const key in data) {
              postsArray.push({ ...data[key], id: key });
            }
            vuexContext.commit('setPosts', postsArray);
          })
          .catch(e => context.error(e));
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts);
      },
      addPost({ commit, state }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return this.$axios
          .$post('/posts.json?auth=' + state.token, createdPost)
          .then(data => {
            commit('addPost', { ...createdPost, id: data.name });
          })
          .catch(error => console.log(error));
      },
      editPost({ commit, state }, editedPost) {
        const updatedPost = { ...editedPost, updatedDate: new Date() };

        return this.$axios
          .$put('/posts/' + editedPost.id + '.json?auth=' + state.token, updatedPost)
          .then(res => {
            commit('editPost', updatedPost);
          })
          .catch(e => console.log(e));
      },
      authenticateUser({ commit, dispatch }, authData) {
        let authUrl =
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
          process.env.fbApiKey;

        if (!authData.isLogin) {
          authUrl =
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
            process.env.fbApiKey;
        }

        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(result => {
            commit('setToken', result.idToken);
            localStorage.setItem('token', result.idToken);
            localStorage.setItem(
              'tokenExpiration',
              new Date().getTime() + +result.expiresIn * 1000
            );
            Cookie.set('jwt', result.idToken);
            Cookie.set('expirationDate', new Date().getTime() + +result.expiresIn * 1000);
          })
          .catch(error => console.log(error));
      },
      initAuth({ commit, dispatch }, req) {
        let token = null;
        let expirationDate = null;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1];
        } else {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');
        }

        if (new Date().getTime() > +expirationDate || !token) {
          dispatch('logout');
          return;
        }
        commit('setToken', token);
      },
      logout({ commit }) {
        commit('clearToken');
        Cookie.remove('jwt');
        Cookie.remove('expirationDate');
        if (process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }
  });
};

export default createStore;
