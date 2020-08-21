class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  // 编译模板，处理文本节点和元素节点
  compile (el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 处理文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }
      // 判断node节点是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement (node) {
    // console.log(node.attributes) // 获取节点的属性节点
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach(attr => {
      // 判断是否是指令，以 v- 开头
      let attrName = attr.name
      if(this.isDirective(attrName)) {
        // v-text --> text 
        attrName = attrName.substr(2)
        const key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  update (node, key, attrName) {
    if(attrName.startsWith('on')) {
      const event = attrName.replace('on:', '')
      return this.onUpdater && this.onUpdater(node, event, key)
    }
    console.log(this)
    const updateFn = this[`${attrName}Updater`]
    updateFn && updateFn.call(this, node, this.vm[key], key) // 如果直接调用updateFn，则内部this指向全局，所以用updateFn.call改变内部this指向当前实例
  }

  // 处理v-text指令
  textUpdater (node, value, key) {
    node.textContent = value
    // 创建watcher对象
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  // 处理v-html指令
  htmlUpdater (node, value, key) {
    node.innerHTML = value
    // 创建watcher对象
    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue
    })
  }

  // 处理v-on指令
  onUpdater (node, event, script) {
    return node.addEventListener(event, (e) => this.vm[script](e))
  }

  // 处理v-model
  modelUpdater (node, value, key) {
    node.value = value
    // 创建watcher对象
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 编译文本节点，处理插值表达式
  compileText (node) {
    // console.dir(node) // 以对象形式打印
    // {{ msg }}
    let reg = /\{\{(.+?)\}\}/ // ?表示尽可能早的结束匹配,()提取分组
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim() // key 就是 msg
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher对象
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }
  // 判断元素属性是否是指令
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }
}