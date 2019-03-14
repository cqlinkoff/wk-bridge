export default class WKBridge {
  constructor () {
    this.lastId = 0
    this.callbacks = {}
    window.executeCallback = (id, error, value) => {
      if (error) {
        this.sendError(id, error)
      } else {
        this.sendResponse(id, value)
      }
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
    console.log(`<== ${id} sendError ${error}`)
    const callback = this.callbacks[id]
    if (callback) {
      callback(error instanceof Error ? error : new Error(error), null)
      delete this.callbacks[id]
    }
  }
}
