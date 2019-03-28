const GLOBAL_CALLBACKS = '$$_wk_bridge_callbacks'

export default class WKBridge {
  constructor (options = {}) {
    const { namespace = '' } = options
    this.namespace = namespace
    this.lastId = 0
    this.callbacks = {}
    this.handlers = {}

    if (!window.executeCallback) {
      window[GLOBAL_CALLBACKS] = {}
      window.executeCallback = (id, error, value) => {
        window[GLOBAL_CALLBACKS][id](id, error, value)
      }
    }

    if (!window.webkit) {
      const webkit = {
        messageHandlers: {}
      }

      window.webkit = webkit
    }

    if (window[namespace]) {
      const context = window[namespace]

      Object.keys(context).forEach((key) => {
        const handler = ['$$', namespace, key].join('_')
        this.handlers[key] = handler
        window.webkit.messageHandlers[handler] = {
          postMessage: (param) => {
            context[key](JSON.stringify(param))
          }
        }
      })
    }
  }

  callback = (id, error, value) => {
    if (!this.callbacks[id]) {
      throw new TypeError('No callback found')
    } else {
      this.callbacks[id](error, value)
    }
  }

  postMessage (key, data) {
    return new Promise((resolve, reject) => {
      const id = `$$_${this.lastId++}`
      this.callbacks[id] = (err, data) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(err))
        } else {
          resolve(data)
        }
      }
      window[GLOBAL_CALLBACKS][id] = this.callback
      const handler = this.handlers[key]
      window.webkit.messageHandlers[handler].postMessage({
        'name': handler,
        'object': data,
        'id': id
      })
    })
  }
}
