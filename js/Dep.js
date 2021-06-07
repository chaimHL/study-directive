export default class Dep {
	constructor(arg) {
	   // 用数组存储自己的订阅者, 数组里是 Watcher 实例
		 this.subs = []
	}
	
	// 添加订阅
	addSub(sub) {
		this.subs.push(sub)
	}
	
	// 添加依赖
	depend() {
		// Dep.target 就是我们指定的一个全局唯一位置，换成 window.target 也一样
		if (Dep.target) {
			this.addSub(Dep.target)
		}
	}
	
	// 通知更新
	notify() {
		const subs = this.subs.slice() // 浅克隆
		subs.forEach(item => {
			item.update()
		})
	}
}