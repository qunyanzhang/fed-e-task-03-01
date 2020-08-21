class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (obj, key, val) {
    const that = this
    // 负责收集依赖
    let dep = new Dep()
    // 如果val此时是对象，会把val内部的属性转换成响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        // return obj[key] // 这种写法会造成栈溢出，因为在调用obj[key]的时候，又会触发get
        return val // 产生闭包，val不会释放
      },
      set (newValue) {
        if (newValue === val) {
          return
        }
        val = newValue
        // 此时this指向data
        // this.walk(newValue)
        that.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}