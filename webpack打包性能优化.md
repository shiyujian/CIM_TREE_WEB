# `webpack` 打包性能优化

前端使用 `webpack` 进行编译打包，由于模块逐步增加，需要编译打包的内容越来越多，所以提高 `webpack` 构建效率迫在眉睫。

## 保障依赖关系，提高效率

从包依赖方式出发使用 `yarn` 而不是 `npm` ，`yarn` 不仅可以保障依赖统一性，能避免重复，还能缓存它安装过的包，而且安装速度快，使用`yarn` 无疑可以很大程度改善工作流和工作效率。

## 除去多余的 `import` 依赖关系

由于 `webpack` 会针对 `import` 内容进行打包，所以没用到的 `import` 需要除去。

采用 `eslint` 检测机制，步骤如下：

1. 安装 `eslint`

   ```shell
   yarn add eslint --dev
   ```

   推荐使用本地安装，全局安装之后再安装 `plugin` 真心累。

   **需要注意：`yarn` 的全局安装不要到 `npm` 的全局目录下，目录结构不同会导致各类问题。**

   采用本地安装 `yarn` 之后，每次指令都会很烦，例如

   ```shell
   ./node_modules/.bin/eslint src/**/*.js
   ```

   为了简化处理，可以通过如下指令来简化

   ```shell
   yarn eslint src/**/*.js
   ```

2. 配置文件

   一般来讲，可以通过指令进行初始化

   ```shell
   eslint --init
   ```

   我们直接采用自己的初步配置文件，将 `.eslintrc` 和 `.eslintignore` 放到根目录下，以下是 `.eslintrc` 文件内容：

   ```json
   {
       "extends": "eslint:recommended",
       "env": {
           "browser": true,
           "commonjs": true,
           "es6": true
       },
       "parserOptions": {
           "ecmaVersion": 6
       },
       "rules": {
           "no-console": "off",
           "curly": "warn"
       }
   }
   ```

   完整的配置文档可以在 [官网查阅](http://eslint.cn/docs/user-guide/configuring)。

3. 添加各类插件以及完善 `.eslintrc` 配置

   ```shell
   yarn add babel-eslint --dev
   yarn add eslint-plugin-react --dev
   ```

   最终的配置文件 `.eslintrc` 内容：

   ```json
   {
   	"parser": "babel-eslint",
   	"extends": [
   		"eslint:recommended",
   		"plugin:react/recommended"
   	],
   	"env": {
   		"browser": true,
   		"commonjs": true,
   		"es6": true
   	},
   	"parserOptions": {
   		"ecmaVersion": 6,
   		"sourceType": "module",
   		"ecmaFeatures": {
   			"jsx": true
   		}
   	},
   	"rules": {
   		"no-console": "off",
   		"curly": "warn"
   	}
   }
   ```

4. 验证结果

   执行指令（每个模块都可以根据自己需要去验证）

   ```shell
   yarn eslint src/APP/air/**/*.js
   ```

   结果如下

   ```shell
   F:\codesV\3.gitlab\CIM_WEB\src\APP\air\api.js
     10:8  error  '$' is defined but never used  no-unused-vars

   â 1 problem (1 error, 0 warnings)
   ```

   去掉多余的 `import $ from 'jquery';` 之后，再也没有这个错误了。

5. 引入 `airbnb` 代码检测

   一个团队内部都可以去建立各自的代码规范，以防各执一词，可以才有大厂公认的规范。

   由于我们使用了 `react + es6` ，需要使用 `eslint-config-airbnb` 这个配置文件。

   ```shell
   yarn add --dev eslint-config-airbnb-base eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y

   yarn add --dev eslint-config-airbnb
   ```

   安装完成之后修改配置文件 `.eslintrc` 内容即可:

   ```json
   {
   	"extends": "airbnb"
   }
   ```

以上完美解决多余的 `import` 依赖关系。

## 待续

