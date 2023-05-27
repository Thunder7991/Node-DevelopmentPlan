/*
 * @Author: thunderchen
 * @Date: 2023-05-27 20:06:20
 * @LastEditTime: 2023-05-27 20:06:20
 * @email: 853524319@qq.com
 * @Description:  控制反转
 */

class A {
    constructor(params) {
        this.params = params
    }
}

class B extends A {
    constructor(params) {
        super(params)
    }
    run(){
        console.log(this.params);
    }
}

new B('hello').run()

// B 中代码的实现是需要依赖 A 的，两者的代码耦合度非常高。
// 在两者之间的业务逻辑复杂程度增加的情况下，维护成本与代码可读性都会随着增加，并且很难再多引入额外的模块进行功能拓展。


// 为了解决这个问题, 可以引入IOC容器

class Container {
    constructor() { this.modules = {} }
  
    provide(key, object) { this.modules[key] = object }
  
    get(key) { return this.modules[key] }
  }

  const mo = new Container();

mo.provide('a', new A('hello'))
mo.provide('c', new C('world'))

class B {
  constructor(container) {
    this.a = container.get('a');
    this.c = container.get('c');
  }
  run() {
    console.log(this.a.params + ' ' + this.c.params)
  }
}

new B(mo).run();

//上述 container 就是IOC控制器