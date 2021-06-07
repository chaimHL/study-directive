import Observer from './Observer.js'
// observe 函数用于观察一个对象的属性是否已被监测的，如果不是则让其属性成为响应式的
export default (value) => {
	if (typeof value !== 'object') return
	let ob 
	if (value.__ob__ !== undefined) {
		ob = value.__ob__
	} else {
		ob = new Observer(value)
	}
	return ob 
}