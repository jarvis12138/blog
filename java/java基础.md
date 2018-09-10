
### 方法重载

：：同一个类中，方法的功能相同方法名相同，参数（个数、类型）列表不同

### 四种权限（private，protected，public，default）

private: 只能在类中访问而不能在其他类中访问

protected: 只能被类本身的方法及子类访问，即使子类在不同的包中也可以访问

public: 不仅可以跨类访问，而且允许跨包（package）访问

default: 只允许在同一个包中进行访问

### 静态 static

### 继承

### this、super

### 构造函数

new Function() 默认调用无参构造方法,默认调用继承的父类的无参构造方法

```
静态代码块 > 构造代码块 > 构造方法
静态代码块随着类的加载而加载
子类初始化前先进行父类的初始化
```

```java
class Fu {
    static {
        System.out.print("静态代码块Fu");
    }

    {
        System.out.print("构造代码块Fu");
    }

    public Fu() {
        System.out.print("构造方法代码块Fu");
    }
}

class Z extends Fu {
    static {
        System.out.print("静态代码块Z");
    }

    {
        System.out.print("构造代码块Z");
    }

    public Z() {
        System.out.print("构造方法代码块Z");
    }
}

class Test {
    public static void main(String[] args) {
        Z z = new Z();
        // 静态代码块Fu
        // 静态代码块Z
        // 构造代码块Fu
        // 构造方法代码块Fu
        // 构造代码块Z
        // 构造方法代码块Z
    }
}
```

```
一个类的初始化过程：
    成员变量的初始化
    构造方法的初始化
子父类的初始化：
    先进行父类的初始化，再进行子类的初始化
```

```java
class X {
    Y b = new Y();
    X() {
        System.out.print("X");
    }
}

class Y {
    Y() {
        System.out.print("Y");
    }
}

public class Z extends X {
    Y y = new Y();
    Z() {
        System.out.print("Z");
    }
    public static void main(String[] args) {
        new Z();  // YXYZ
    }
}
```

### 方法重写

### final关键字

### 多态

某一个事物，在不同时刻表现出来的不同状态

```
从右往左 -> 动物 d = new 猫();
d.num 调用父类(动物)变量 (不能重写)
d.show() 调用子类(猫)方法 (重写了)
静态方法(static) 调用父类(动物)静态方法
```

### 抽象类

```
abstract 
抽象类中的成员方法既可是抽象的,也可以是非抽象的
抽象类不能实例化，有构造方法
```

### 接口

```
接口中的变量 默认 public final static a;
接口没有构造方法
接口中的方法 默认 public abstract void show();
```

### 抽象类和接口

```
成员区别：
    抽象类：
        成员变量：可以变量，也可以常量
        构造方法：有
        成员方法：可以抽象，也可以非抽象
    接口：
        成员变量：只可以常量
        成员方法：只可以抽象

设计理念区别：
    抽象类 被继承 提现的是：“is a”的关系，提现共性
    接口 被实现 提现是：“like a”的关系，是扩展功能
```

### 内部类

### 匿名内部类

```
new 类名或者接口名() {
    // 重写方法;
}
```

### Object

### StringBuffer

```java
StringBuffer sb = new StringBuffer(int capacity()); // 默认 10
sb.append();
sb.insert();
sb.deleteCharAt();
sb.delete();
sb.replace();
sb.reverse(); // 反转
sb.substring(); // 截取
```

### Arrays

### Integer

```java
Byte,Short,Integer,Long,Float,Double,Character,Boolean
```







