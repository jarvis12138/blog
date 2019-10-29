// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true, // 标识当前配置文件为eslint的根配置文件，让其停止在父级目录中继续寻找。
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  // extends: [
  //   // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  //   // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  //   'plugin:vue/essential', 
  //   // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  //   'standard'
  // ],
  // required to lint *.vue files
  // plugins: [
  //   'vue'
  // ],
  // add your custom rules here
  // rules: {
  //   // allow async-await
  //   'generator-star-spacing': 'off',
  //   // allow debugger during development
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  // }
}
