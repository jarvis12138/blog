
<!-- # 前言 -->

最近有点空稍微看了一下 `vue-cli` 脚手架的源码，感觉挺有意思的，记录一下给大家看看。

**前情提要：vue-cli@2.9.0**

根据官网例子生成一个 `vue` 应用，只需要 `vue init webpack test` 。

那 `vue init xxx` 是怎么来的呢？让我们举个小栗子：

先创建一个 `mytool` 文件夹，然后 `npm init` 。

生成的目录结构是：

```
mytool
├── package.json
├── index.js
```

在 `package.json` 添加

```
"bin": {
    "mytool": "index.js"
}
```

在 `index.js` 添加

```
#!/usr/bin/env node
console.log('I am a tool CLI');
```

最后， `npm link` ，就可以生成一个 `mytool` 命令工具脚手架！

进入 `cmd` 命令行，输入 `mytool` ：

```
> mytool
// I am a tool CLI
```

可以看到，这样就生成了一个全局命令。

好了，让我们看一下 `vue-cli` 中的 `package.json` 

```
"bin": {
    "vue": "bin/vue",
    "vue-init": "bin/vue-init",
    "vue-list": "bin/vue-list"
}
```

先看下 `"vue": "bin/vue"` ，进入 `bin/vue` 文件

这里我们要先了解下 `commander` node大神**tj**写的命令行解析插件。在github上还贴心的提供了[中文文档](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)。

```javascript
#!/usr/bin/env node
require('commander')
  // 版本信息
  .version(require('../package').version)
  // 用法简介，说明信息
  // 尖括号<>代表必填，方括号[]代表选填
  .usage('<command> [options]')
  // 命令
  // 在 command 后没有 action ，则自动会找 vue-init 文件
  .command('init', 'generate a new project from a template')
  .command('list', 'list available official templates')
  // 输入的参数
  .parse(process.argv)
```

简单来说，当你在命令行输入 `vue` ，他会输出：

```
E:\fork\mytool>vue
Usage: vue <command> [options]
Options:
  -V, --version  output the version number
  -h, --help     output usage information
Commands:
  init           generate a new project from a template
  list           list available official templates
  build          prototype a new project
  create         (for v3 warning only)
  help [cmd]     display help for [cmd]
```

这只是一些提示信息。

下面进入正题，输入 `vue init webpack test` 进入 `"bin/vue-init` 文件

![parse](https://github.com/jarvis12138/blog/blob/master/question/image/vue-init.png?raw=true)

```javascript
// var program = require('commander')
// program.parse(process.argv)
// program.args[0] 获取到 vue init webpack test 中的 webpack 字段
var template = program.args[0]
var hasSlash = template.indexOf('/') > -1 // 是否有斜杠，后面将会用来判定是否为官方模板
var rawName = program.args[1] // 项目构建目录名
var templatePath = exists(template) ? template : path.normalize(path.join(process.cwd(), template))
var inPlace = !rawName || rawName === '.' // 没写或者“.”，表示当前目录下构建项目
var name = inPlace ? path.relative('../', process.cwd()) : rawName // 如果在当前目录下构建项目,当前目录名为项目构建目录名，否则是当前目录下的子目录【rawName】为项目构建目录名
var to = path.resolve(rawName || '.') // 项目构建目录的绝对路径
var clone = program.clone || false // 是否采用clone模式，提供给“download-git-repo”的参数
```

主逻辑

```javascript
if (exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?',
    name: 'ok'
  }], function (answers) {
    if (answers.ok) {
      run()
    }
  })
} else {
  run()
}
```

上面代码， `vue-cli` 会判断 `inPlace` 和 `exists(to)` , `true` 则询问开发者，当开发者回答“yes”的时候执行 `run` 函数，否则直接执行 `run` 函数。

```javascript
function run () {
  // check if template is local
  if (exists(templatePath)) {
    // 渲染模板
    generate(name, templatePath, to, function (err) {
      if (err) logger.fatal(err)
      console.log()
      logger.success('Generated "%s".', name)
    })
  } else {
    checkVersion(function () {
      if (!hasSlash) { // 官方模板还是第三方模板
        // use official templates
        var officialTemplate = 'vuejs-templates/' + template
        if (template.indexOf('#') !== -1) {
          downloadAndGenerate(officialTemplate) // 下载模板
        } else {
          if (template.indexOf('-2.0') !== -1) {
            warnings.v2SuffixTemplatesDeprecated(template, inPlace ? '' : name)
            return
          }
          warnings.v2BranchIsNowDefault(template, inPlace ? '' : name)
          downloadAndGenerate(officialTemplate) // 下载模板
        }
      } else {
        downloadAndGenerate(template) // 下载模板
      }
    })
  }
}
```

```javascript
function downloadAndGenerate (template) {
  var tmp = os.tmpdir() + '/vue-template-' + uid()
  var spinner = ora('downloading template') // 显示加载的插件
  spinner.start() // 显示加载状态
  // 从node下载仓库的插件
  download(template, tmp, { clone: clone }, function (err) {
    spinner.stop()
    process.on('exit', function () {
      rm(tmp)
    })
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    generate(name, tmp, to, function (err) {
      if (err) logger.fatal(err)
      console.log()
      logger.success('Generated "%s".', name)
    })
  })
}
```

generate.js

```javascript
module.exports = function generate (name, src, dest, done) {
  var opts = getOptions(name, src) // 获取配置
  var metalsmith = Metalsmith(path.join(src, 'template')) // 初始化Metalsmith对象
  var data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  })
  // 注册配置对象中的helper
  opts.helpers && Object.keys(opts.helpers).map(function (key) {
    Handlebars.registerHelper(key, opts.helpers[key])
  })
  // Metalsmith 在渲染项目文件流程中角色相当于 gulp.js ，可以通过添加一些插件对构建文件进行处理，如重命名、合并等。 
  metalsmith
    .use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles(opts.skipInterpolation))
    .clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build(function (err) {
      done(err)
      logMessage(opts.completeMessage, data)
    })
  return data
}
```


