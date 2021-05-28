// import {BFast} from 'bfastjs';
// import {Injectable} from '@angular/core';
// import {ShopModel} from '../models/shop.model';
// import {SocketController} from 'bfastjs/dist/controllers/SocketController';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class SyncStoresService {
//   private stockSocket: SocketController;
//
//   constructor() {
//   }
//
//   start(): void {
//     this.init();
//     this.startStoreSocket()
//       .catch();
//   }
//
//   init(): void {
//     BFast.init({
//       applicationId: 'smartstock_lb', projectId: 'smartstock'
//     });
//   }
//
//   async startStoreSocket(): void {
//     const smartStoreCache = BFast.cache({database: 'smartstock', collection: 'config'});
//     const shop: ShopModel = await smartStoreCache.get('activeShop');
//     this.stockSocket = BFast.functions().event('/storeItems', () => {
//       console.log('storeItems socket connect');
//       this.getMissedStores(shop, smartStoreCache);
//       this.stockSocket.emit({
//         auth: null,
//         body: {applicationId: shop ? shop.applicationId : null, projectId: shop ? shop.projectId : null}
//       });
//     }, () => {
//       console.log('storeItems socket disconnect');
//     });
//
//     this.stockSocket.listener(async data => {
//       const smartStoreCache1 = BFast.cache({database: 'smartstock', collection: 'config'});
//       const shop1: ShopModel = await smartStoreCache1.get('activeShop');
//       this.updateLocalStore(data.body ? data.body : data, shop1)
//         .catch();
//     });
//   }
//
//   async getMissedStores(shop, smartStoreCache) {
//     if (shop && shop.applicationId && shop.projectId) {
//       let lastUpdate = await smartStoreCache.get('lastUpdate');
//       if (lastUpdate) {
//         await this.mergeStores(shop, lastUpdate, smartStoreCache);
//         return;
//       }
//       lastUpdate = new Date().toISOString();
//       BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
//       const storeItems = await BFast.database(shop.projectId).collection('storeItems')
//         .getAll(null, {cacheEnable: false, dtl: 7});
//       await BFast.cache({database: 'storeItems', collection: shop.projectId})
//         .set('all', storeItems);
//       await smartStoreCache.set('lastUpdate', lastUpdate);
//     }
//   }
//
//   async mergeStores(shop, lastUpdate, smartStoreCache) {
//
//     const stocksCache = BFast.cache({database: 'storeItems', collection: shop.projectId});
//
//     BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
//     const remoteStores: any = await BFast.functions().request(`/functions/storeItems/sync/${shop.projectId}?lastUpdateTime=${lastUpdate}`)
//       .get();
//
//     if (remoteStores
//       && remoteStores.lastUpdateTime
//       && remoteStores.projectId
//       && remoteStores.results
//       && Array.isArray(remoteStores.results)
//       && remoteStores.results.length > 0) {
//       const localStores: any[] = await stocksCache.get('all');
//       const localStoreMap = {};
//       if (localStores) {
//         localStores.forEach(value => {
//           localStoreMap[value.id] = value;
//         });
//       }
//       if (remoteStores && remoteStores.results) {
//         remoteStores.results.forEach(value => {
//           localStoreMap[value.id] = value;
//         });
//       }
//       const newStores = [];
//       Object.keys(localStoreMap).forEach(key => {
//         newStores.push(localStoreMap[key]);
//       });
//       await stocksCache.set('all', newStores);
//       await smartStoreCache.set('lastUpdate', (remoteStores && remoteStores.lastUpdateTime)
//         ? remoteStores.lastUpdateTime : undefined);
//       // console.log(localStores);
//       /// console.log(remoteStores);
//     } else {
//       // console.log('no new storeItems');
//     }
//   }
//
//   async updateLocalStore(data, shop) {
//
//     if (shop && shop.applicationId && shop.projectId && data && data.data) {
//       BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
//       const stocksCache = BFast.cache({database: 'storeItems', collection: shop.projectId});
//       const storeItems: any[] = await stocksCache.get('all');
//       const {operationType, fullDocument, documentKey, updateDescription} = data.data;
//       switch (operationType) {
//         case 'insert':
//           fullDocument.id = fullDocument['_id'];
//           delete fullDocument._id;
//           fullDocument.createdAt = fullDocument['_created_at'];
//           delete fullDocument._created_at;
//           fullDocument.createdAt = fullDocument['_created_at'];
//           delete fullDocument._updated_at;
//           storeItems.push(fullDocument);
//           await stocksCache.set('all', storeItems);
//           return;
//         case 'delete':
//           await stocksCache.set('all', storeItems.filter(store => store.id !== documentKey['_id']));
//           return;
//         case 'update':
//           await stocksCache.set('all', storeItems.map(store => {
//             if (store.id === documentKey['_id']) {
//               // updatedFields
//               // removedFields
//               const updatedFields = updateDescription['updatedFields'];
//               const removedFields = updateDescription['removedFields'];
//               if (updateDescription && updatedFields) {
//                 if (updatedFields['_updated_at']) {
//                   store.updatedAt = updatedFields['_updated_at'];
//                 }
//                 Object.keys(updatedFields)
//                   .filter(key => !key.toString().startsWith('_'))
//                   .forEach(key => {
//                     store[key] = updatedFields[key];
//                   });
//               }
//               if (updateDescription && removedFields && Array.isArray(removedFields)) {
//                 removedFields.forEach(field => {
//                   delete store[field];
//                 });
//               }
//               return store;
//             } else {
//               return store;
//             }
//           }));
//           return;
//         case 'replace':
//           await stocksCache.set('all', storeItems.map(store => {
//             if (store.id === documentKey['_id']) {
//               return fullDocument;
//             } else {
//               return store;
//             }
//           }));
//           return;
//         default:
//           return;
//       }
//     }
//   }
//
//   stop() {
//     if (this.stockSocket) {
//       this.stockSocket.close();
//     }
//   }
//
// }
