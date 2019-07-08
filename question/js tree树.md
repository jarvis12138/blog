
来源：[司徒正美 字典树的应用](https://www.cnblogs.com/rubylouvre/p/6652259.html)

```
Problem Description:
Ignatius最近遇到一个难题,老师交给他很多单词(只有小写字母组成,不会有重复的单词出现),现在老师要他统计出以某个字符串为前缀的单词数量(单词本身也是自己的前缀).

Input:
输入数据的第一部分是一张单词表,每行一个单词,单词的长度不超过10,它们代表的是老师交给Ignatius统计的单词,一个空行代表单词表的结束.第二部分是一连串的提问,每行一个提问,每个提问都是一个字符串.

Output:
对于每个提问,给出以该字符串为前缀的单词的数量.
##Sample Input
banana
band
bee
absolute
acm

ba
b
band
abc

Sample Output:
2
3
1
0

```

```js
//字典树（前缀 Trie）
var trie = {}


function add(trie, str) { //构建一个trie
    for (var i = 0, n = str.length; i < n; i++) {
        var c = str[i]
        if (trie[c] == null) {
            trie[c] = {
                val: c,
                deep: i,
                appearCount: 1
            }
            trie = trie[c]
        } else {
            trie = trie[c]
            trie.appearCount++
        }
    }

}

add(trie, "banana")
add(trie, "band")
add(trie, "bee")
add(trie, "absolute")
add(trie, "acm")

console.log(trie)

function has(trie, str) {
    for (var i = 0, n = str.length; i < n; i++) {
        var c = str[i]
        if (c in trie) {
            trie = trie[c]
            if (i === n - 1) {
                console.log(trie.appearCount)
                return trie.appearCount
            }
        } else {
            console.log(0)
            return 0
        }
    }
    console.log(0) //0为找不到
    return 0
}
console.log('answer:')
has(trie, 'ba')
has(trie, 'b')
has(trie, 'band')
has(trie, 'abc')

// 字典树的查询时间复杂度是O(logL)，L是字符串的长度。所以效率还是比较高的。
```

扩展： [为什么我认为数据结构与算法对前端开发很重要？](https://github.com/LeuisKen/leuisken.github.io/issues/2#)   [Trie树的JS或TS实现](https://www.jianshu.com/p/ba70ca95c33b?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)   [手撕排序算法 - 前端进阶必备](https://juejin.im/post/5d1b454d6fb9a07ec42b7518#heading-7)


```js
var list = [
    {id: '1', pid: '0', name: '设置'},
    {id: '1-1', pid: '1', name: '权限设置'},
    {id: '1-1-1', pid: '1-1', name: '用户管理列表'},
    {id: '1-1-2', pid: '1-1', name: '用户管理新增'},
    {id: '1-1-3', pid: '1-1', name: '角色管理列表'},
    {id: '1-2', pid: '1', name: '菜单设置'},
    {id: '1-2-1', pid: '1-2', name: '菜单列表'},
    {id: '1-2-2', pid: '1-2', name: '菜单添加'},
    {id: '2', pid: '0', name: '订单'},
    {id: '2-1', pid: '2', name: '报单审核'},
    {id: '2-2', pid: '2', name: '退款管理'},
    {id: '2-2-2', pid: '2-1', name: '保单状态'}
];

function buildTree(data, pid, tree) {
    for(var i=0; i<data.length; i++) {
        if(data[i].pid == pid) {
            var c= JSON.parse(JSON.stringify(data[i]));
            if(!tree.children) {
                tree.children = [];
            }
            tree.children.push(c);
            buildTree(data, c.id, c);
        }
    }
    return tree;
}

console.log(list);
console.log(buildTree(list, '0', {}));
```











