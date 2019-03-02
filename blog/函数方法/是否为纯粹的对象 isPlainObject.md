

```javascript
    
var class2type = {};
var core_hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
    var key;
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    // 首先排除一些，比如不是 object 类型、是 DOM 元素
    if ( !obj || Object.prototype.toString.call(obj) !== "[object Object]" || obj.nodeType || window.window === obj ) {
        return false;
    }

    try {
        // Not own constructor property must be Object
        if ( obj.constructor &&
            !core_hasOwn.call(obj, "constructor") &&
            !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
            return false;
        }
    } catch ( e ) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
    }

    // Support: IE<9
    // Handle iteration over inherited properties before own properties.
    // jQuery.support.ownLast 这个是用来对浏览器进行功能判断的，请参考jQuery.support，下面的for语句，则是对obj的第一个元素进行判断，判断第一个元素是否在实例中。至于为何做这个判断，按照注释来说，是为了处理一种继承的属性，在for循环时，会出现在本身属性之前。

    // if ( jQuery.support.ownLast ) {
        for ( key in obj ) {
            return core_hasOwn.call( obj, key );
        }
    // }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    // 这个正好和之前的相反，获取最后一个属性，然后判断最后一个属性是否为对象本身的属性，如果是则返回true，如果不是则返回false，这里同样，没有理解到为什么可以用这个思想来做判断，关于这个本身属性是排在前面还是后面的问题.

    for ( key in obj ) {}
    return key === undefined || core_hasOwn.call( obj, key );
}

console.log(isPlainObject( Object.create({}) )); // true
console.log(isPlainObject( {} )); // true
```
