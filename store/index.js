import Vuex from 'vuex';

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
      addPost({ commit }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return this.$axios
          .$post('/posts.json', createdPost)
          .then(data => {
            commit('addPost', { ...createdPost, id: data.name });
          })
          .catch(error => console.log(error));
      },
      editPost({ commit }, editedPost) {
        const updatedPost = { ...editedPost, updatedDate: new Date() };

        return this.$axios
          .$put('/posts/' + editedPost.id + '.json', updatedPost)
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
