import WKBridge from '../src'

beforeAll(() => {
  const context = {
    testSuccess: (param) => {
      const { id } = JSON.parse(param)
      window.executeCallback(id, null, { status: true })
    },
    testFail: (param) => {
      const { id } = JSON.parse(param)
      window.executeCallback(id, new Error('error'), null)
    },
    testFailWithMessage: (param) => {
      const { id } = JSON.parse(param)
      window.executeCallback(id, 'error message', null)
    }
  }

  const namespace = {
    messageHandlers: {}
  }

  Object.keys(context).forEach(function (key) {
    if (!namespace.messageHandlers[key]) {
      namespace.messageHandlers[key] = {
        postMessage: function (param) {
          if (!param) return
          context[key](JSON.stringify(param))
        }
      }
    }
  })

  if (!window.webkit) {
    window.webkit = namespace
  }
})

describe('WKBridge', () => {
  test('create instance', () => {
    const wkBridge = new WKBridge()

    expect(wkBridge).toBeInstanceOf(WKBridge)
  })

  test('call postMessage', () => {
    const wkBridge = new WKBridge()

    const promise = wkBridge.postMessage('testSuccess', {})

    expect(promise).toBeInstanceOf(Promise)
  })

  test('call success cb', async () => {
    const wkBridge = new WKBridge()

    const res = await wkBridge.postMessage('testSuccess', {})
    expect(res.status).toBe(true)
  })

  test('call fail cb', async () => {
    const wkBridge = new WKBridge()
    try {
      await wkBridge.postMessage('testFail', {})
    } catch (error) {
      expect(error.message).toBe('error')
    }
  })

  test('call fail cb', async () => {
    const wkBridge = new WKBridge()
    try {
      await wkBridge.postMessage('testFailWithMessage', {})
    } catch (error) {
      expect(error.message).toBe('error message')
    }
  })
})
