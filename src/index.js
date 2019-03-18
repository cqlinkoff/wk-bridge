export default class WKBridge {
  constructor (options = {}) {
    const { namespace = '' } = options
    this.namespace = namespace
    this.lastId = 0
    this.callbacks = {}
    window.executeCallback = (id, error, value) => {
      if (error) {
        this.sendError(id, error)
      } else {
        this.sendResponse(id, value)
      }
    }

    if (!window.webkit && window[namespace]) {
      const context = window[namespace]
      const webkit = {
        messageHandlers: {}
      }

      Object.keys(context).forEach(function (key) {
        if (!webkit.messageHandlers[key]) {
          webkit.messageHandlers[key] = {
            postMessage: function (param) {
              context[key](JSON.stringify(param))
            }
          }
        }
      })

      window.webkit = webkit
    }
  }

  postMessage (handler, data) {
    return new Promise((resolve, reject) => {
      const id = this.lastId++
      this.callbacks[id] = (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
      window.webkit.messageHandlers[handler].postMessage({
        'name': handler,
        'object': data,
        'id': id
      })
    })
  }

  sendResponse (id, result) {
    const callback = this.callbacks[id]
    if (callback) {
      callback(null, result)
      delete this.callbacks[id]
    }
  }

  sendError (id, error) {
    const callback = this.callbacks[id]
    if (callback) {
      callback(error instanceof Error ? error : new Error(error), null)
      delete this.callbacks[id]
    }
  }
}
