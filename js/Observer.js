import { def } from './utils.js'
import defineReactive from './defineReactive.js'
import arrayMethods from './array.js'
import observe from './observe.js'
import Dep from './Dep.js'

export default class Observer {
	constructor(value) {
		this.dep = new Dep() // 本案例中，这里不写也行
		// 给 value 添加 __ob__ 属性，值为这次 new 的实例，也就是构造函数中的 this
		// 因为希望这个属性是不可被枚举的，所以用 def 函数处理
		def(value, '__ob__', this, false)
		
		if (Array.isArray(value)) { // 判断传入的对象是否是数组
			// 将数组 value 的隐式原型指向 arrayMethods
			Object.setPrototypeOf(value, arrayMethods)
			this.observeArray(value)
		} else {
			this.walk(value)
		}
	}
	// 处理对象，让对象的属性变为响应式
	walk(value) {
		for (let key in value) {
			defineReactive(value, key)
		}
	}
	// 处理数组，让数组的每一项变为响应式
	observeArray(arr) {
		arr.forEach(item => {
			observe(item)
		})
	}
}
