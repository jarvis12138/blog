
### git add

```
git add .（后面为“.”）

git add 文件夹/ 添加整个文件夹及文件夹下的内容
```

### git status 查看提交状态

```
红色为未提交、绿色为提交状态
```

### git add 撤销

```
由于git add . 一次性提交所有文件，导致提交了多余文件：

git status 先看一下add 中的文件
git reset HEAD 如果后面什么都不跟的话 就是上一次add 里面的全部撤销了
git reset HEAD XXX/XXX/XXX.java 就是对某个文件进行撤销了
```

### git 取消本地commit (未push)

```
git log 找到想要撤销的id
git reset --soft commit_id 就可以回滚到某一个commit，然后保留下修改的内容
注意： 尽量不要使用 git reset --hard 撤回，因为本地文件也会撤回
```