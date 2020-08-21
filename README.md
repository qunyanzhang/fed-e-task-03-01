# fed-e-task-03-01

## 简答题

1. 由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的；对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式 property。Vue.set内部实现原理：调用了defineReactive(ob.value, key, val)和ob.dep.notify(),将新添加的属性设为响应式数据，在属性的set方法触发时，调用notify方法通知观察者更新页面。

2. Diff算法是找同级别的子节点一次比较，然后再找下一级别的节点比较，算法时间复杂度为O(n)。在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引。
diff 算法的核心，对比新旧节点的 children，更新 DOM;
在对开始和结束节点比较的时候，总共有四种情况：
1).oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
2).oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)
3).oldStartVnode / newEndVnode (旧开始节点 / 新结束节点)
4).oldEndVnode / newStartVnode (旧结束节点 / 新开始节点)

## 编程题

1. 见目录 my-hash-vue-router, 参照课程history模式最后通过监听hashchange事件来改变路由地址的变化
2. 见目录 vue-html-on, v-html实现跟v-text类似，只是赋值的不是textContent而是innerHTML;v-on将methods中的方法挂载到Vue实例中，然后调用`this.vm[script]()`
3. 见目录 my-snabbdom, 根据snabbom规则语法实现