module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // 命名规范 忽略index
    'vue/multi-word-component-names': ['warn', { ignores: ['index'] }],
    // 限制行数为1000
    'max-lines': ['error', 1000],
    // 单行最大字符数：100
    'max-len': ['error', { code: 100 }],
    // 将重载的函数写在一起以增加代码可读性
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    // 禁止使用 tslint:<rule-flag> 等相关注释
    '@typescript-eslint/ban-tslint-comment': 'error',
    // 逗号的前面无空格，后面有空格
    '@typescript-eslint/comma-spacing': 'error',
    // 关键字前后有一个空格
    '@typescript-eslint/keyword-spacing': 'error',
    // 禁止使用 Array 构造函数创建数组
    '@typescript-eslint/no-array-constructor': 'error',
    // 避免重复的类成员命名
    '@typescript-eslint/no-dupe-class-members': 'error',
    // 禁止出现空函数，普通函数（非 async/await/generator）、箭头函数、类上的方法除外
    '@typescript-eslint/no-empty-function': 'error',
    // 禁止不必要的分号
    '@typescript-eslint/no-extra-semi': 'error',
    // 禁止使用无意义的 void 类型，void 只能用在函数的返回值中
    '@typescript-eslint/no-invalid-void-type': 'error',
    // 禁止使用 namespace 来定义命名空间，但允许使用 declare namespace 定义外部命名空间
    '@typescript-eslint/no-namespace': 'error',
    // 禁止在 optional chaining 之后使用 non-null 断言（感叹号）
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    // 禁止变量声明跟踪在外部范围内声明的变量
    '@typescript-eslint/no-shadow': 'error',
    // 禁止无用的表达式
    '@typescript-eslint/no-unused-expressions': 'error',
    // 声明的变量必须被使用
    '@typescript-eslint/no-unused-vars': 'error',
    // 禁止在定义变量之前就使用它
    '@typescript-eslint/no-use-before-define': 'error',
    // 禁止出现没必要的 constructor
    '@typescript-eslint/no-useless-constructor': 'error',
    // 禁止使用 module 来定义命名空间，declare module 是允许的
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    // 命名函数的空格规则，遵循 JS 约定
    '@typescript-eslint/space-before-function-paren': 'error',
    // 三斜杠导入语法已废弃，在非 dts 文件中禁止使用
    '@typescript-eslint/triple-slash-reference': 'error',
    // 定义类型时应正确添加空格
    '@typescript-eslint/type-annotation-spacing': 'error',
    // nterface 和 type 定义时必须声明成员的类型
    '@typescript-eslint/typedef': 'error',
    // 不允许重复声明
    '@typescript-eslint/no-redeclare': 'error',
    // 给 template 提供 eslint-disable 的能力
    'vue/comment-directive': 'error',
    // 防止 JSX 中使用的变量被标记为未使用
    'vue/jsx-uses-vars': 'error',
    // Prop 定义类型应该是构造函数
    'vue/require-prop-type-constructor': 'error',
    // Prop 的默认值必须匹配它的类型
    'vue/require-valid-default-prop': 'error',
    // 为 v-for 设置键值
    'vue/require-v-for-key': 'error',
    // 计算属性禁止包含异步方法
    'vue/no-async-in-computed-properties': 'error',
    // 禁止在对象字面量中出现重复的键
    'vue/no-dupe-keys': 'error',
    // 禁止出现重复的属性
    'vue/no-duplicate-attributes': 'error',
    // 禁止出现语法错误
    'vue/no-parsing-error': 'error',
    // 禁止使用 vue 中的关键字
    'vue/no-reserved-keys': 'error',
    // 禁止在计算属性中对属性修改
    'vue/no-side-effects-in-computed-properties': 'error',
    // 禁止在 <textarea> 中出现 {{message}}
    'vue/no-textarea-mustache': 'error',
    // render 函数必须有返回值
    'vue/require-render-return': 'error',
    // 计算属性必须有返回值
    'vue/return-in-computed-property': 'error',
    // 强制在 v-on 指令使用 exact 修饰符，当同一个标签上有另一个带修饰符的 v-on 指令
    'vue/use-v-on-exact': 'error',
    // 检查template-root指令的合法性
    'vue/valid-template-root': 'error',
    // 检查v-bind指令的合法性
    'vue/valid-v-bind': 'error',
    // 检查v-cloak指令的合法性
    'vue/valid-v-cloak': 'error',
    // 检查v-else-if指令的合法性
    'vue/valid-v-else-if': 'error',
    // 检查v-else指令的合法性
    'vue/valid-v-else': 'error',
    // 检查v-for指令的合法性
    'vue/valid-v-for': 'error',
    // 检查v-html指令的合法性
    'vue/valid-v-html': 'error',
    // 检查v-if指令的合法性
    'vue/valid-v-if': 'error',
    // 检查v-model指令的合法性
    'vue/valid-v-model': 'error',
    // 检查v-on指令的合法性
    'vue/valid-v-on': 'error',
    // 检查v-once指令的合法性
    'vue/valid-v-once': 'error',
    // 检查v-pre指令的合法性
    'vue/valid-v-pre': 'error',
    // 检查v-show指令的合法性
    'vue/valid-v-show': 'error',
    // 组件的 data 必须是一个函数
    'vue/no-shared-component-data': 'error',
    // 把var语句看作是在块级作用域范围之内，不能在块外使用
    'block-scoped-var': 'error',
    // 多行语句必须用大括号包裹，单行语句推荐用大括号包裹
    curly: 'error',
    // 禁止使用arguments.caller和arguments.callee
    'no-caller': 'error',
    // 统一在点号之前换行
    'dot-location': ['error', 'property'],
    // 优先使用 `.` 访问对象的属性
    'dot-notation': 'error',
    // case或default字句出现词法声明时，必须用块包裹
    'no-case-declarations': 'error',
    // 不要在解构中出现空模式，即 {} 或 []
    'no-empty-pattern': 'error',
    // 禁止扩展原生对象
    'no-extend-native': 'error',
    // 禁止不必要的.bind()调用
    'no-extra-bind': 'error',
    // 禁止不必要的label
    'no-extra-label': 'error',
    // 不要让case语句落,
    'no-fallthrough': 'error',
    // 不要省略小数点前或小数点后的0
    'no-floating-decimal': 'error',
    // 禁止使用eval
    'no-eval': 'error',
    // 禁止对原生对象或只读的全局对象进行赋值
    'no-global-assign': 'error',
    // 禁止使用类eval的方法，如 setTimeout 传入字符串
    'no-implied-eval': 'error',
    // 禁止使用__iterator__属性
    'no-iterator': 'error',
    // 禁止使用不必要的代码块
    'no-lone-blocks': 'error',
    // 禁止在循环中的函数内出现外部作用域中定义且会发生变化的变量，以防止闭包副作用
    'no-loop-func': 'error',
    // 禁止出现多个连续空格
    'no-multi-spaces': 'error',
    // 禁止使用多行字符串
    'no-multi-str': 'error',
    // 不要使用Function构造函数创建函数
    'no-new-func': 'warn',
    // 不要使用new Number/String/Boolean
    'no-new-wrappers': 'warn',
    // 禁用八进制字面量
    'no-octal': 'error',
    // 禁止在字符串字面量中使用八进制转义序列，如 var foo = "Copyright 251";
    'no-octal-escape': 'error',
    // 禁止使用 __proto__ 属性
    'no-proto': 'error',
    // 禁止在 return 语句中赋值
    'no-return-assign': 'error',
    // 禁止使用 javascript:url，如 location.href = "javascript:void(0)";
    'no-script-url': 'error',
    // 禁止自我赋值
    'no-self-assign': 'error',
    // 禁止自我比较
    'no-self-compare': 'error',
    // 禁止使用逗号操作符，除非用于 for 循环条件或明确用小括号包裹
    'no-sequences': 'error',
    // 禁止未使用的标签
    'no-unused-labels': 'error',
    // 禁用不必要的 catch
    'no-useless-catch': 'error',
    // 禁止不必要的字符串拼接
    'no-useless-concat': 'error',
    // 禁止不必要的转义字符
    'no-useless-escape': 'error',
    // 禁止多余的 return; 语句
    'no-useless-return': 'error',
    // 不要使用 void 运算符
    'no-void': 'error',
    // 禁止使用 with
    'no-with': 'error',
    // 将立即执行函数表达式（IIFE）用小括号包裹
    'wrap-iife': 'error',
    // 箭头函数的箭头前后各留一个空格
    'arrow-spacing': 'error',
    // 子类的constructor中必须使用 super，非子类的constructor中不能使用super
    'constructor-super': 'error',
    // generator函数的 * 号前面无空格，后面有一个空格
    'generator-star-spacing': 'error',
    // 禁止对类声明变量重新赋值
    'no-class-assign': 'error',
    // 避免箭头函数与比较操作符产生混淆
    'no-confusing-arrow': 'error',
    // 禁止修改const声明的变量
    'no-const-assign': 'error',
    // 禁止使用new Symbol
    'no-new-symbol': 'error',
    // 在constructor中，禁止在调用super()前使用this或super关键字
    'no-this-before-super': 'error',
    // 对象的属性名不要使用无必要的计算属性
    'no-useless-computed-key': 'error',
    // 禁止在解构/import/export时进行无用的重命名
    'no-useless-rename': 'error',
    // 使用const或let声明变量，不要使用 var
    'no-var': 'error',
    // 优先使用 const，只有当变量会被重新赋值时才使用 let
    'prefer-const': 'error',
    // generator函数内必须有yield语句
    'require-yield': 'error',
    // 剩余和扩展操作符与操作对象间不应有空格
    'rest-spread-spacing': 'error',
    // yield* 表达式的 * 号前面无空格，后面有一个空格
    'yield-star-spacing': 'error',
    // for 循环中的计数器应朝着正确方向移动
    'for-direction': 'error',
    // getter 需要有返回值
    'getter-return': 'error',
    // 不要使用async函数作为Promise的executor
    'no-async-promise-executor': 'error',
    // 不要与负零进行比较
    'no-compare-neg-zero': 'error',
    // 不要在条件表达式中使用赋值语句
    'no-cond-assign': 'error',
    // 禁止使用debugger
    'no-debugger': 'error',
    // 函数的参数列表中禁止出现重复命名的参数
    'no-dupe-args': 'error',
    // switch 语句中禁止出现重复的case
    'no-duplicate-case': 'error',
    // 不要出现空代码块
    'no-empty': 'error',
    // 禁止在正则中使用空字符集[]，这不能匹配任何字符，可能是typo
    'no-empty-character-class': 'error',
    // 禁止对catch的入参重新赋值
    'no-ex-assign': 'error',
    // 避免不必要的布尔类型转换
    'no-extra-boolean-cast': 'error',
    // 不要对函数声明重新赋值
    'no-func-assign': 'error',
    // 不要在块中使用函数声明
    'no-inner-declarations': 'error',
    // 禁止在RegExp构造函数中使用无效的正则表达式
    'no-invalid-regexp': 'error',
    // 禁止不规则的空白符
    'no-irregular-whitespace': 'error',
    // 禁止在正则的字符集语法[]中使用由多个字符点构成的字符
    'no-misleading-character-class': 'error',
    // 禁止将全局对象 Math、JSON、Reflect 当作函数进行调用
    'no-obj-calls': 'error',
    // 不要直接在对象上调用Object.prototypes上的方法
    'no-prototype-builtins': 'error',
    // 禁止在正则表达式中出现多个连续空格
    'no-regex-spaces': 'error',
    // 禁用稀疏数组，如var items = [,,];
    'no-sparse-arrays': 'error',
    // 避免令人困惑的多行表达式，多是由不加分号导致
    'no-unexpected-multiline': 'error',
    // 不要在return等语句之后出现不可达的代码
    'no-unreachable': 'error',
    // 禁止在finally中出现控制流语句，如return, throw, break 或 continue
    'no-unsafe-finally': 'error',
    // 禁止对关系运算符左边的运算元使用否定操作符，包括 in 和 instanceof
    'no-unsafe-negation': 'error',
    // 使用Number.isNaN()，而不是直接与NaN进行比较
    'use-isnan': 'error',
    // 同typeof表达式结果进行比较的值必须是有效的字符串
    // 即"undefined", "object", "boolean", "number", "string", "function" 或 "symbol"
    'valid-typeof': 'error',
    // 方括号内部两侧无空格-数组
    'array-bracket-spacing': 'error',
    // 单行代码块的大括号内部两侧有空格
    'block-spacing': 'error',
    // 用逗号分隔的多行结,，将逗号放到行尾
    'comma-style': 'error',
    // 方括号内部两侧无空格-计算属性
    'computed-property-spacing': 'error',
    // 在函数的小括号内使用一致的换行风格
    'function-paren-newline': ['error', 'consistent'],
    // JSX 属性使用双引号，不要使用单引号
    'jsx-quotes': 'error',
    // 定义对象字面量时，key, value 之间有且只有一个空格
    'key-spacing': 'error',
    // 禁止在调用构造函数时省略小括号
    'new-parens': 'error',
    // 不要混用空格和tab
    'no-mixed-spaces-and-tabs': 'error',
    // 禁止连续赋值
    'no-multi-assign': 'error',
    // 禁止出现多个（大于2个）连续空行
    'no-multiple-empty-lines': 'error',
    // 使用字面量创建对象
    'no-new-object': 'error',
    // 避免不必要的三元表达式
    'no-unneeded-ternary': 'error',
    // 禁止属性调用前有空格
    'no-whitespace-before-property': 'error',
    // 省略大括号的单行语句前不要换行
    'nonblock-statement-body-position': 'error',
    // 对象的属性需遵循一致的换行风格：即所有属性要么都换行，要么都写在一行
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    // 一条声明语句声明一个变量
    'one-var': ['error', 'never'],
    // 一行声明一个变量
    'one-var-declaration-per-line': 'error',
    // 对象字面量的属性名不要用引号包裹，除非包含特殊字符
    'quote-props': ['error', 'as-needed'],
    // 分号的前面无空格，后面有空格
    'semi-spacing': 'error',
    // 块的左大括号前有一个空格
    'space-before-blocks': 'error',
    // 小括号内部两侧无空格
    'space-in-parens': 'error',
    // 中缀操作符两侧有空格
    'space-infix-ops': 'error',
    // 一元操作符两侧无空格，包括 -、+、--、++、!、!!
    'space-unary-ops': 'error',
    // 注释内容和注释符之间需留有一个空格
    'spaced-comment': 'error',
    // switch的case和default子句冒号前面无空格，后面有空格
    'switch-colon-spacing': 'error',
    // 模板字符串的tag后面无空格
    'template-tag-spacing': 'error',
    // 禁止delete变量
    'no-delete-var': 'error',
    // 禁止标签与变量同名
    'no-label-var': 'error',
    // 禁止使用保留字命名变量
    'no-shadow-restricted-names': 'error',
    // 不要使用嵌套的三元表达式
    'no-nested-ternary': 'error',
    // 不要将变量初始化成 undefined
    'no-undef-init': 'error',
    // 某些数组方法的回调函数中必须包含return语句
    'array-callback-return': 'error'
  }
}
