import { def } from './utils.js'

// 获取 Array.prototype，因为数组的方法都定义在这上面
const arrayPrototype = Array.prototype

// 让 arrayMethods 的隐式原型(__proto__)指向 Array.prototype
const arrayMethods = Object.create(arrayPrototype) 

// 7 种可以改变数组自身的方法
const methodsCouldChange = [
	'push',
	'pop',
	'unshift',
	'shift',
	'splice',
	'reserve',
	'sort'
]

// 改写上面 7 种数组方法
methodsCouldChange.forEach(item => {
	// 保留数组方法的功能
	const original = arrayPrototype[item]
	def(arrayMethods, item, function() { // 注意这里不能用箭头函数，因为 arguments 和 this 指向的原因
		// 能 console 就说明能侦测到改变了
		console.log('数组被改变了')
		// 给改写的方法添加上功能
		const result = original.apply(this, arguments)
		// 如果是 push、unshift、splice，则要判断有没有新增项
		let inserted = []
		switch (item){
			// 不同的 case 使用相同的代码
			case 'push':
			case 'unshift':
				inserted = [...arguments] // 扩展运算符背后调用的是遍历器接口 Symbol.iterator， arguments 就有遍历器接口
				break
			case 'splice':
			// arguments 为类数组对象，不能直接调用数组方法，
			// 下面这句也可以写成 inserted = Array.prototype.slice.call(arguments,2)
			inserted = [...arguments].slice(2)
				break
			default:
				break
		}
		// 获取到 Observe 实例 ob，以便调用实例方法 observeArray
		const ob = this.__ob__
		if (inserted.length) {
			ob.observeArray(inserted)
		}
		
		ob.dep.notify()
		
		return result
	}, false)
})

export default arrayMethods