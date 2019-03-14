import WKBridge from '../src'

beforeAll(() => {
  const context = {
    testSuccess: () => {
      window.executeCallback(null, {})
    },
    testFail: () => {
      window.executeCallback(new Error('error'), null)
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
          console.log(key)
          console.log(context[key])
          context[key](JSON.stringify(param))
        }
      }
    }
  })

  if (!window.webkit) {
    window.webkit = namespace
  }
  console.log(window.webkit)
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

  test('call postMessage', async () => {
    const wkBridge = new WKBridge()

    const res = await wkBridge.postMessage('testSuccess', {})

    console.log(res)

    expect(res).toBeDefined()
  })
})
