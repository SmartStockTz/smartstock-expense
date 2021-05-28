# Smartstock Core Stores

Angular2 library that provides store module to be used across smartstock


## Peer Dependencies

Please refer to `package.json>peerDependencies` to see a list of the dependecies
you need to install in your project

## Installation

Install the latest dependencies from npm `npm install --save @smartstocktz/storeItems --registry=https://npm.pkg.github.com`

## Usages

To use this library include it at `imports` section of your angular module. Example

```typescript


// imports
import {StoreModule} from '@smartstocktz/storeItems';

@NgModule({
// ....
  imports: [
    StoreModule
  ],
// ....
})
export class AppModule { }

```

