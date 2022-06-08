function checkAuth(config) {
  let isTokenValid = true  // Token is considered valid even if not given at all
  let isAuthorized = false // Authorized only if valid token given
  if (config && config.headers) {
    if (config.headers.Authorization === 'Token abcd') {
      console.log('Valid token, authorized')
      isAuthorized = true
      isTokenValid = true
    } else {
      console.warn('Invalid token')
      isAuthorized = false
      isTokenValid = false
    }
  }
  return {
    isTokenValid: isTokenValid,
    isAuthorized: isAuthorized
  }
}

export default {
  create: (options) => {
    return {
      get: (url, config) => {
        console.log('GET', url, config)
        const auth = checkAuth(config)
        let dataOut = {}
        let status = 401
        if (auth.isTokenValid) {
          status = 200
          if (url === '/api/collectives/') {
            dataOut = [{ name: 'jla', title: 'JLA', description: '', creator: 'superman' }]
          } else if (url === '/api/collective/jla/questions/') {
            dataOut = [{ name: 'q1', title: 'Question 1', description: '' }]
          } else if (url === '/api/collective/jla/permissions/') {
            if (auth.isAuthorized) {
              dataOut = { 'can_edit': true, 'can_join': true }
            } else {
              dataOut = { 'can_edit': false, 'can_join': false }
            }
          }
        }
        return new Promise((resolve, reject) => {
          const response = {
            status: status,
            data: dataOut
          }
          console.log(response)
          resolve(response)
        })
      },
      put: (url, dataIn, config) => {
        console.log('PUT', url, dataIn, config)
        const auth = checkAuth(config)
        let status = 401
        let dataOut = {}
        if (auth.isTokenValid && auth.isAuthorized) {
          status = 200
          dataOut = dataIn
        }
        return new Promise((resolve, reject) => {
          resolve({
            status: status,
            data: dataOut
          })
        })
      },
      post: (url, dataIn, config) => {
        console.log('PUT', url, dataIn, config)
        let status = 401  // Unauthorized by default
        let dataOut = {}
        if (url === '/auth/token/login/') {
          dataOut = { auth_token: 'abcd' }
          status = 200
        } else if (url === '/auth/token/logout/') {
          status = 204
        } else if (url === '/auth/users/') {
          status = 201
          dataOut = { username: dataIn.username }
        } else {
          // For any other endpoint need to be logged in
          const auth = checkAuth(config)
          if (auth.isTokenValid && auth.isAuthorized) {
            status = 201
            dataOut = dataIn
          }
        }
        return new Promise((resolve, reject) => {
          resolve({
            status: status,
            data: dataOut
          })
        })
      },
      delete: (url, config) => {
        const auth = checkAuth(config)
        let status = 401
        if (auth.isTokenValid && auth.isAuthorized) {
          status = 204
        }
        return new Promise((resolve, reject) => {
          resolve({
            status: status
          })
        })
      }
    }
  }
}
