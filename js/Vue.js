import Compile from './Compile.js'
import observe from './observe.js'
import Watcher from './Watcher.js'

export default class Vue {
  constructor(options) {
    this.$options = options || {} // 让创建 Vue 实例的用户能拿到 options
    this._data = options.data || undefined
    // 初始化定义在 options 上的 data
    this._initData()
    // 数据变为响应式数据
    observe(this._data)
    // 对 options 里用户定义的 watch 进行处理
    this._initWatch() 
    // 模板编译
    new Compile(options.el, this)
  }

  // 将 data 数据定义到 vue 实例上，这样在 index.html 里就能直接通过 vm.xx 获取属性
  _initData() {
    Object.keys(this._data).forEach(item => {
      Object.defineProperty(this, item, {
        configurable: true,
        enumerable: true,
        get() {
          return this._data[item]
        },
        set(newVal) {
          this._data[item] = newVal
        }
      })
    })
  }

  _initWatch() {
    const watch = this.$options.watch
    Object.keys(watch).forEach(item => {
      // 这里第一个参数可以用 this 也就是 vue 实例
      // 是因为 _initData 已经把所有 data 里的数据定义到 vue 实例上了
      new Watcher(this, item, watch[item])
    })
  }
}