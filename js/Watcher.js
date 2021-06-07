import Dep from './Dep.js'
let uid = 0
export default class Watcher {
	constructor(target, expression, callback) {
		this.id = uid++ // 让每个 watcher 实例有一个自己的 id
		this.target = target // target 为新建实例时传入的要监控的对象(obj)
		this.getter = parsePath(expression) // getter 会是一个函数, 在下面定义的 get 里调用
		this.callback = callback // callback 就是传入的回调函数
		this.val = this.get() // 获取对象 target 的 expression 属性的值
	}

	// 数据更新触发
	update() {
		this.run()
	}

	get() {
		// 将 Dep.target 赋值为 new 的这个 Watcher 实例本身，代表进入依赖收集阶段
		Dep.target = this
		const obj = this.target
		
		let value
		try {
			/*
				注意，一旦这里去获取 obj 的 expression 属性的值, 
				因为 obj 已经被 observe 了，所以就会触发 defineReactive, 
				Object.defineProperty 里的 get() 就会被触发
			*/
			value = this.getter(obj)
		} finally { // 在 try 语句块之后执行, 无论是否有异常抛出或捕获都将执行
			Dep.target = null // 退出依赖收集
		}
		return value
	}

	run() {
		this.getAndInvoke(this.callback)
	}

	getAndInvoke(cb) {
		const newValue = this.get()
		if (newValue !== this.val || typeof newValue === 'object') {
			const oldValue = this.val
			cb.call(this.target, newValue, oldValue)
		}
	}
}

// 传入一个属性字符串比如 a.m.n, 然后返回一个函数(getter)，给这个函数传入 obj, 则可以得到 obj.a.m.n 的值
const parsePath = function(str) {
	const segments = str.split('.')
	return function(obj) {
		const value = segments.reduce((accumulator, currentValue) => {
			return accumulator = accumulator[currentValue]
		}, obj)
		return value
	}
}
