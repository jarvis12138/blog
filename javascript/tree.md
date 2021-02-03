

### 生成二叉树

```js
// js 先序遍历 创建二叉树
var newTree = 'AB#D##C##'.split('');

function BinaryTree(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
}

function createBinaryTree(arr) {
    var root = null;
    if (arr.length) {
        var node = arr.shift();
        if (node !== '#') {
            root = new BinaryTree(node);
            root.left = createBinaryTree(arr);
            root.right = createBinaryTree(arr);
        }
    }
    return root;
}

console.log(createBinaryTree(newTree));
```
