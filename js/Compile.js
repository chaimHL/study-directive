import Watcher from './Watcher.js'

export default class Compile {
  constructor(el, vue) {
    this.$vue = vue // vue 实例
    this.$el = document.querySelector(el) // 挂载点
    // 如果用户传了挂载点
    if (this.$el) {
      // 调用函数，让节点变为 fragment，类似 mustache 里的 tokens
      // vue 源码里实际用的是 ast
      const $fragment = this.node2Fragment(this.$el)
			// 编译，对文档片段(fragment) 进行编译，这样比直接编译真实的 DOM 节点(this.$el) 性能更好
			this.compile($fragment)
			// 将文档片段上 DOM 树
			this.$el.appendChild($fragment)
    }
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment()
    let child
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }

	compile(el) {
		const nodeList = el.childNodes // 这里得到是一个 NodeList 类型的集合，不是数组，但可以使用 forEach() 来迭代
		const regExp = /\{\{(.*)\}\}/ // 正则获取 mustache 内容
		nodeList.forEach(item => {
			const text = item.textContent // 获取到的 item 都是节点，不是字符串，所以获取文字要用 .textContent
			if (item.nodeType === 1) { // 元素节点
				this.compileElement(item)
			} else if (item.nodeType === 3 && regExp.test(text)) { // 文本节点
				const dataName = text.match(regExp)[1].trim()
				this.compileText(item, dataName)
			}
		})
	}

	compileElement(node) {
		const attrs = node.attributes // 这里得到的 attrs 是一个 NamedNodeMap 对象，不是数组
		// Array.prototype.slice.call(attrs) 将 attrs 转为数组
		// slice 返回一个新的数组对象，是一个原数组的浅拷贝；通过 call 让 attrs 能使用 Array.prototype 的 slice 方法
		Array.prototype.slice.call(attrs).forEach(item => {
			// 获取 name 和 value
			const name = item.name 
			const value = item.value
			if (name.indexOf('v-') === 0) { // 以 v- 开头的属性即为指令
				const directiveName = name.substring(2)
				if (directiveName === 'model') {
					// 添加 watcher，一旦改变了 v-model 绑定的这个属性的值，就能实时响应
					new Watcher(this.$vue, value, newVal => {
						node.value = newVal
					})
					// 获取这个 value 在 data 里的值
					const v = this.getDataValue(this.$vue, value)
					// 这里仅处理这个 node 是 input 这种情况，所以直接用 value 属性赋值
					node.value = v
					// 如果输入 input 的值改变
					node.addEventListener('input', e => {
						// 将 data 里的属性的值改成输入 input 的值
						this.setDataValue(this.$vue, value, e.target.value)
					})
				}
			}
		})
	}

	compileText(node, dataName) {
		// 获取到 data 中变量的值，然后放到对应节点里
		node.textContent = this.getDataValue(this.$vue ,dataName)
		new Watcher(this.$vue, dataName, newVal => {
			node.textContent = newVal
		})
	}

	getDataValue(obj, dataName) {
		const nameArr = dataName.split('.')
		const value = nameArr.reduce((acc, cur) => {
			return acc[cur]
		}, obj)
		return value
	}
	
	// 设置 data 里某个属性的值
	setDataValue(obj, dataName, dataValue) {
		const nameArr = dataName.split('.')
		let val = obj
		nameArr.forEach((item, index, arr) => {
			if (index < arr.length - 1) {
				val = val[item]
			} else {
				val[item] = dataValue
			}
		})
	}
}
