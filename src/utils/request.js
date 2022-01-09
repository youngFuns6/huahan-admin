import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import VueRouter from '../router/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
  headers: {
    "Content-Type": "application/json"
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
      const res = response.data
      return res
    // console.log(res)
    // if the custom code is not 20000, it is judged as an error.
    

  },
  error => {
    // console.log(error)
    console.log('err' + error.response.data.message) // for debug
    Message.error(error.response.data.message)

    if (error.response.data.code === -3006) {
      console.log('000')
      VueRouter.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default service
