import List from './views/List.vue'
import Add from './views/Add.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'


export const routes = [
  {
    path: "/list",
    component: List
  },
  {
    path: "/add",
    component: Add
  },
  {
    path: "/",
    component: Login
  },
  {
    path: "/signup",
    component: Signup
  }
]