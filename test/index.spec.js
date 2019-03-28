import WKBridge from '../src'

beforeAll(() => {
  window.chainLong = {
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
})

describe('WKBridge', () => {
  test('create instance', () => {
    const wkBridge = new WKBridge()

    expect(wkBridge).toBeInstanceOf(WKBridge)
    expect(wkBridge.namespace).toBe('')
  })

  test('inject multiple times', async () => {
    window.test = window.chainLong
    const wkBridge1 = new WKBridge({
      namespace: 'chainLong'
    })
    const wkBridge2 = new WKBridge({
      namespace: 'test'
    })

    const res1 = await wkBridge1.postMessage('testSuccess', {})
    expect(res1.status).toBe(true)

    const res2 = await wkBridge2.postMessage('testSuccess', {})
    expect(res2.status).toBe(true)
  })

  test('call postMessage', () => {
    const wkBridge = new WKBridge({
      namespace: 'chainLong'
    })

    const promise = wkBridge.postMessage('testSuccess', {})

    expect(promise).toBeInstanceOf(Promise)
    expect(wkBridge.namespace).toBe('chainLong')
  })

  test('call success cb', async () => {
    const wkBridge = new WKBridge({
      namespace: 'chainLong'
    })

    const res = await wkBridge.postMessage('testSuccess', {})
    expect(res.status).toBe(true)
  })

  test('call fail cb', async () => {
    const wkBridge = new WKBridge({
      namespace: 'chainLong'
    })
    try {
      await wkBridge.postMessage('testFail', {})
    } catch (error) {
      expect(error.message).toBe('error')
    }
  })

  test('call fail cb', async () => {
    const wkBridge = new WKBridge({
      namespace: 'chainLong'
    })
    try {
      await wkBridge.postMessage('testFailWithMessage', {})
    } catch (error) {
      expect(error.message).toBe('error message')
    }
  })

  test('call callback directly', async () => {
    const wkBridge = new WKBridge({
      namespace: 'chainLong'
    })
    expect(() => wkBridge.callback(1, {})).toThrow('No callback found')
    expect(() => wkBridge.callback(1, {})).toThrow('No callback found')
  })
})
