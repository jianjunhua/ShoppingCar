var obj = {
    a: 1
};

Object.defineProperty(obj, 'a', {
    value: 10,
    writable: false, //不可重写
    enumerable: false, //不可遍历
    configurable: false, //不可修改描述符本身
});

var obj1 = {};
var internalValue = undefined;
Object.defineProperty(obj1, 'a', {
    get: function() {
        return internalValue;
    }, //读取器getter
    set: function(val) {
        internalValue = val;
    } //设置器setter
});

obj1.a = 2;
console.log(obj1.a);