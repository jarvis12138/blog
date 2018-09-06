
### 实现高度与宽度成比例(4:3)

```html
<!-- 原理：`padding'如果是百分比的话,那这个百分比是相对于其父元素的宽度而言的 -->
<div class="box">
    <!-- width 40%, height 30% -->
    <div class="item"></div>
</div>

<style>
.box{width: 100px;border: 1px solid #222;}
.item{width: 40%;height: 0;padding-bottom: 30%;background-color: #cccccc;}
</style>
```