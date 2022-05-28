export default {
  create: (options) => {
    return {
      get: (url) => {
        let dataOut = {}
        if (url === '/api/collectives/') {
          dataOut = [{ name: 'jla', title: 'JLA', description: '' }]
        } else if (url === '/api/collective/jla/questions/') {
          dataOut = [{ name: 'q1', title: 'Question 1', description: '' }]
        }
        return new Promise((resolve, reject) => {
          resolve({
            status: 200,
            data: dataOut
          })
        })
      },
      put: (url, dataIn) => {
        let status = 200
        let dataOut = dataIn
        return new Promise((resolve, reject) => {
          resolve({
            status: status,
            data: dataOut
          })
        })
      },
      post: (url, dataIn) => {
        let status = 201
        let dataOut = {}
        if (url === '/auth/token/login/') {
          dataOut = { auth_token: 'abcd' }
          status = 200
        } else if (url === '/auth/token/logout/') {
          status = 204
        } else if (url === '/auth/users/') {
          dataOut = { username: dataIn.username }
        }
        return new Promise((resolve, reject) => {
          resolve({
            status: status,
            data: dataOut
          })
        })
      },
      delete: (url) => {
        return new Promise((resolve, reject) => {
          resolve({
            status: 204
          })
        })
      }
    }
  }
}

/* vi.mock('axios', () => {
  return {
    default: {
      create(options) {
        return {
          get: (url) => {
            let dataOut = {}
            if (url === '/api/collectives/') {
              dataOut = [{ name: 'jla', title: 'JLA', description: '' }]
            }
            return new Promise((resolve, reject) => {
              resolve({
                status: 200,
                data: dataOut
              })
            })
          },
          post: (url, dataIn) => {
            let status = 201
            let dataOut = {}
            if (url === '/auth/token/login/') {
              dataOut = { auth_token: 'abcd' }
              status = 200
            } else if (url === '/auth/users/') {
              dataOut = { username: dataIn.username }
            }
            return new Promise((resolve, reject) => {
              resolve({
                status: status,
                data: dataOut
              })
            })
          },
          delete: (url) => {
            return new Promise((resolve, reject) => {
              resolve({
                status: 204
              })
            })
          }
        }
      }
    }
  }
})
*/