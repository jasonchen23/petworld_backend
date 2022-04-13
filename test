import { createStore } from 'vuex';
// import {createPersistedState} from 'vuex-persistedstate'
export default createStore({
    state:{ 
        cart:[],
        userId:[],
        isLogin: false
    },
    mutations: {
      //登入狀態
    setLoginState(state, userId){
      state.isLogin = true;
      state.userId = userId;
      console.log(state.userId)
    },
        //登出狀態
        setLogoutState(state){
          state.isLogin = false;
          state.userId = 0;
        },
        
      addCart(state,data) {
            const product = state.cart.find(
                (item) => item.id === data[1]
              );
              if (product){ 
                product.amount ++;
                product.total += product.price;
              }
              else {
                const newProduct = {
                  id: data[1],
                  title:data[0],
                  price:data[2],
                  amount: 1,
                  total:data[2]*1,
                };
                state.cart.push(newProduct);
              } 
        },
        removeCart(state,data) {
          const product = state.cart.find(
              (item) => item.id === data[1]
            );
            if (product){ 
              // 移除商品
              product.remove(product)
            }
      },
    },
    actions: {
      async setLogin({commit, dispatch}, userId){
        commit('setLoginState', userId);
      },
      async setLogout({commit}) {
        commit('setLogoutState');
      },
      async addCart( {commit} ,data) {
            commit('addCart', data)
        },
      async removeCart( {commit}, data){
            commit ('removeCart', data)
      }
    },
    // plugins: [
    //   createPersistedState({ paths: ['cart','userId'] })
    // ]
}) 