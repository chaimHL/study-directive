import observe from './observe.js'
import Dep from './Dep.js'

export default function defineReactive(data, key, value) {
	const dep = new Dep()
	// 如果只传了两个参数，则让 value 直接等于 data[key]
	if (arguments.length === 2) value = data[key]
	
	// 注意这里不是传 key 而是传 value，因为 key 只是一个字符串，value 才是 key 指向的对象
	observe(value)
	
	// 让 data 的 key 属性变为响应式属性
	Object.defineProperty(data, key, {
    enumerable: true, // 可被枚举(for...in 或 Object.keys 方法)
    configurable: true, // 可被配置，比如删除
    get() {
			// 如果处于依赖收集阶段
			if (Dep.target) {
				dep.depend()
			}
			// console.log('触发get', 'data', data, 'key', key)
      return value
    },
    set(newValue) {
      value = newValue
			// 修改的属性也需要被观察，如果是对象需要被侦测
			observe(newValue)
			dep.notify()
			// console.log('触发set', 'data', data, 'key', key)
    }
  })
}
