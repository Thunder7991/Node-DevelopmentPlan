function Type(type) {
  return Reflect.metadata('design:type', type);
}

function ParamTypes(...types) {
  return Reflect.metadata('design:paramtypes', types);
}

function ReturnType(type) {
  return Reflect.metadata('design:returntype', type);
}

@ParamTypes(String, Number)
class Guang {
  constructor(text, i) {}
  @Type(String)
  get name() {
    return 'text';
  }

  @Type(Function)
  @ParamTypes(Number, Number)
  @ReturnType(Number)
  add(x, y) {
    return x + y;
  }
}

const obj = new Guang('a', 1);
const paramsTypes = Reflect.getMetadata('design:paramtypes', obj, 'add');
console.log(paramsTypes);

export {};
