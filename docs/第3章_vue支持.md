# 第 3 章 vue 支持

**参考**  
[vue 风格指南](https://v3.cn.vuejs.org/style-guide)  
[插件规则集 eslint-plugin-vue](https://eslint.vuejs.org/rules)  
[使用 Eslint & standard 规范前端代码](https://www.cnblogs.com/zhoumingjie/p/11582862.html)  
[各种 lint 预设 pk](https://www.npmtrends.com/eslint-config-airbnb-vs-prettier-vs-standard)  
[为什么推荐使用 prettier](https://blog.csdn.net/qq_21567385/article/details/109136668)  
[我为什么推荐 Prettier 来统一代码风格](https://blog.csdn.net/Fundebug/article/details/78342784)  
[Vue CLI 3.0 文档](https://www.bluesdream.com/blog/vue-cli-3-document-install-and-create.html)  
[ESLint 与 Prettier 配合使用](https://segmentfault.com/a/1190000015315545)

## vue cli

**选择代码检测和格式化方案**  
使用脚手架创建项目的时候，是可以直接选择 eslint 的集成。  
![图](/images/1-1.png#xxl)

```shell
选择Linter / Formatter配置:
选项：
  ESLint with error prevention only  // 自带默认规则集
  ESLint + Airbnb config  // Airbnb规则集
  ESLint + Standard config // Standard规则集
  ESLint + Prettier // Prettier则集
```

默认的规则集太简单，但大家又不喜欢自己来配置繁杂的 rules 规则，所以一般情况下都会选择一些规则集（比较流行的有 airbnb、standard、prettier 等）。

相比之下大家都推荐 Prettier 预设规范，配置更少，用起来更舒服，而且 Prettier 还提供了扩展方便集成到编辑器中进行一键`代码格式化`。

我们来看看比较也能得出结果：
![图](/images/1-2.png#xxl)

我们分别使用自带默认规则集、Standard 规则集、Prettier 则集来生成，项目看看区别(只有 extends 配置有区别，其它都一样)：

```javascript
extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
]
extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
]
extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
]
```

**选择何时进行代码检测**  
![图](/images/1-3.png#xxl)

```javascript
Pick additional lint features:
  Lint on save // 保存就检测
  Lint and fix on commit // fix和commit时候检查
```

## rules

### js/ts 缩进

配置 rules 如下

```javascript
'indent': 2,
```

![tu](/images/1-4.gif)

### vue 首行缩进

纯靠 Indent 会使得 Vue 设置 Script 标签首层不缩进等问题，所以我们需要使用额外插件规则集

配置 rules 如下：
其中，type 为缩进元素设置，可以设置为空格数或者“tab”，这里设置为 2，表示一个缩进为 2 个空格。然后将 baseIndent 设置为 1，表示整体移动一个缩进（表示上面设置的 2 个空格）

```javascript
'vue/script-indent': ['error', 2,
    {
    'baseIndent': 1,
    }
]
```

为了避免同时受到 indent 规则的影响，所以我们需要额外配置 overrides 排除忽略属性  
对于匹配 overrides.files 且不匹配 overrides.excludedFiles 的 文件，overrides.rules 中的规则会覆盖 rules 中的同名规则。

```javascript
overrides: [
  {
    files: ["*.vue"],
    rules: {
      indent: "off",
    },
  },
];
```

最终效果如下  
![tu](/images/1-5.gif)

### vue 模板属性中划线

必须用中划线，不可用驼峰。  
此规则强制在 Vue 模板中的自定义组件上使用带连字符的属性名称。
配置 rules 如下：

```javascript
"vue/attribute-hyphenation": ["error", "always", {
    "ignore": []
}]
```

### vue 模板属性换行

在 JavaScript 中，将具有多个属性的对象拆分为多行被广泛认为是一种很好的约定，因为它更容易阅读。我们的模板和 JSX 应该得到同样的考虑。---[官网](https://vuejs.org/style-guide/rules-strongly-recommended.html#multi-attribute-elements)  
（其实我并不喜欢，因为页面会变得冗长和丑）

配置 rules 如下：
单行的时候可接受的属性个数 1，存在手动换为多行的时候 支持每行属性个数也是 1。这也是默认设置

```javascript
"vue/max-attributes-per-line": ["error", {
    "singleline": 1,
    "multiline": 1
}]
```

![tu](/images/1-6.gif#xl)

但是效果如上，并不好，存在以下问题：

- 多行属性对齐问题，没有以组件位置为 base
- 当标签上属性>1 的时候，第一个属性也应该换行，实际上没有

所以引出了另一个配置，配置 rules 如下：
单行属性时，第一个属性的位置不用换行,多行就必须要换行.  
更优秀的是它顺带处理了多行属性对齐基准问题

```javascript
"vue/first-attribute-linebreak": ["error", {
    "singleline": "ignore",
    "multiline": "below"
}]
```

![tu](/images/1-7.gif#xl)

## Prettier

如上规则，其实完成一个优秀的 eslint配置 还需要几十个甚至上百个规则配置，实在麻烦。  
于是大家都使用了预设的规则集 Prettier。

**安装使用**

需要[安装两个](https://prettier.io/docs/en/integrating-with-linters.html)依赖（假设你没用脚手架预设）

```shell
yarn add --dev eslint-plugin-prettier eslint-config-prettier
```

eslint-plugin-prettier：这是一个 ESLint 插件，这意味着它包含 ESLint 将检查的其他规则的实现。这个插件在引擎盖下使用了 Prettier，当您的代码与 Prettier 的预期输出不同时，会引发问题。这些问题可以通过--fix 自动修复。使用这个插件，您不需要单独运行 prettier 命令，该命令将作为插件的一部分运行。此插件不会关闭与格式相关的规则，如果您手动或通过 eslint-config-prettier 发现此类规则的冲突，则需要将其关闭。

eslint-config-prettier：这是一个 ESLint 配置，它包含规则的配置（无论某些规则是开启，关闭还是特殊配置）。通过此配置，您可以通过关闭与 Prettier 冲突的格式相关规则，将其与其他 ESLint 配置一起使用，例如 eslint-config-airbnb。使用此配置，您不需要使用 prettier-eslint，因为在 Prettier 格式化代码后，ESLint 不会抱怨。但是，您需要单独运行 prettier 命令。

```javascript
extends: [
    ...
    "plugin:prettier/recommended"
]
```
完成如上配置即可。
通常情况下，默认的prettier规范已够我们使用，如果需要调整，直接修改prettier.config.js配置文件即可。

## 推荐eslint配置
```javascript
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": "error",
  },
};

```
