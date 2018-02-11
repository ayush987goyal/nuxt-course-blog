import Vuex from 'vuex';
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
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
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios
          .get('https://vuejs-http-dcd62.firebaseio.com/nuxt-blog/posts.json')
          .then(res => {
            const postsArray = [];
            for (const key in res.data) {
              postsArray.push({ ...res.data[key], id: key });
            }
            vuexContext.commit('setPosts', postsArray);
          })
          .catch(e => context.error(e));
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts);
      },
      addPost({ commit }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return axios
          .post('https://vuejs-http-dcd62.firebaseio.com/nuxt-blog/posts.json', createdPost)
          .then(result => {
            commit('addPost', { ...createdPost, id: result.data.name });
          })
          .catch(error => console.log(error));
      },
      editPost({ commit }, editedPost) {
        const updatedPost = { ...editedPost, updatedDate: new Date() };

        return axios
          .put(
            'https://vuejs-http-dcd62.firebaseio.com/nuxt-blog/posts/' + editedPost.id + '.json',
            updatedPost
          )
          .then(res => {
            commit('editPost', updatedPost);
          })
          .catch(e => console.log(e));
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
