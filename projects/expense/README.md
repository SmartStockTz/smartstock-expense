# Smartstock Expenses

Angular2 library that provides item module to be used across smartstock


## Peer Dependencies

Please refer to `package.json>peerDependencies` to see a list of the dependecies
you need to install in your project

## Installation

Install the latest dependencies from npm `npm install --save @smartstocktz/expenseItems --registry=https://npm.pkg.github.com`

## Usages

To use this library include it at `imports` section of your angular module. Example

```typescript


// imports
import {ExpenseModule} from '@smartstocktz/expenseItems';

@NgModule({
// ....
  imports: [
    ExpenseModule
  ],
// ....
})
export class AppModule { }

```

