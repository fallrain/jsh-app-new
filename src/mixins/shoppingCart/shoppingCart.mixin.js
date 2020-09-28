import {
  getYj
} from '@/lib/dataDictionary';
import {
  produce
} from 'immer';

export default {
  methods: {
    showToast(option) {
      /* 展示toast */
      this.$refs.toast.open({
        timeout: 2000,
        ...option
      });
    },
    getProduct(goods) {
      /* 获取产品 */
      return goods.productList && goods.productList[0];
    },
    getChangeObject(obj, map) {
      /* 获取改变后的immer数据 */
      return produce(obj, (draft) => {
        this.changeObject(draft, map);
      });
    },
    changeObject(draft, map) {
      /* 根据字段改变数据 */
      Object.keys(map).forEach((key) => {
        let keyObj = draft;
        if (typeof key === 'string') {
          const keyAy = key.split('.');
          keyAy.forEach((v, index) => {
            if (index !== keyAy.length - 1) {
              keyObj = keyObj[v];
            }
          });
          keyObj[keyAy[keyAy.length - 1]] = map[key];
        } else {
          draft[key] = map[key];
        }
      });
    },
    getPriceVersionData(goods) {
      /* 获取应该取值价格版本数据 */
      console.count('getPriceVersionData');
      /**
       * @goods:array 商品
       * */
      /* 选择的版本信息 */
      const product = this.getProduct(goods);
      if (!product) {
        return [];
      }
      let choseVersions = [];
      // 后来修改的版本
      let updateVersion;
      if (goods.choseOtherVersions && goods.choseOtherVersions.length) {
        updateVersion = JSON.parse(JSON.stringify(goods.choseOtherVersions));
        // 来源，update表示来着更新的值，更新的的版本可取消
        updateVersion.forEach((v) => {
          v.$origin = 'update';
          if (!v.priceType) {
            // 添加版本调货标记
            v.$isTransfer = true;
          }
        });
      }
      const {
        priceType,
        productCode,
        // 价格版本，根据这个去版本价里轮询匹配
        priceVersion,
        // 版本调货版本号，以此来判断是否是版本调货
        stockVersion
      } = product;
        // 普通版本
        // 接口大写小写都可能返回
      const priceTypeUpper = this.jshUtil.getPriceType(priceType);
      if (!stockVersion && priceTypeUpper === 'PT') {
        if (updateVersion) {
          choseVersions = updateVersion;
        } else {
          const commonPrice = JSON.parse(JSON.stringify(product.priceInfo.commonPrice));
          // 格式化不（普通价格接口未做两位小数处理）
          commonPrice.invoicePrice = this.jshUtil.formatNumber(commonPrice.invoicePrice, 2);
          // 赋值priceType，跟其他版本类型的价格数据结构统一
          commonPrice.priceType = 'PT';
          choseVersions = [commonPrice];
        }
      } else {
        // 之前已经选择的版本
        let preVersion;
        // 取版本价格
        if (Object.keys(this.versionPrice).length) {
          // 1.获取当前产品的所有版本价格信息
          // 2.versionPrice的取值的key，版本调货取version，其他取activity
          // 3.版本调货用stockVersion来查找，其他版本用priceVersion来查找
          let curAllVersion;
          if (stockVersion) {
            // 接口太烂，字段乱七八糟，需要注意
            curAllVersion = this.versionPrice.version.version[productCode];
            if (curAllVersion) {
              // 查找匹配的版本调货
              preVersion = curAllVersion.find(v => v.versionCode === stockVersion);
              // 添加版本调货标记
              preVersion.$isTransfer = true;
            }
          } else {
            curAllVersion = this.versionPrice.activity[productCode];
            if (curAllVersion) {
              // 查找匹配的大版本（工程 特价 样机。。）的匹配的版本
              preVersion = curAllVersion[priceTypeUpper].find(v => v.versionCode === priceVersion);
            }
          }
        }
        // 有修改了的版本，则加入修改版本
        if (updateVersion && updateVersion.length) {
          // 多版本的情况已经被【版本组件】的自定义check function处理，所以此处只处理单版本
          if (updateVersion.length === 1) {
            let updateVersionPriceType = updateVersion[0].priceType;
            if (updateVersionPriceType) {
              updateVersionPriceType = updateVersionPriceType.toUpperCase();
            }
            // 如果了，则增加个版本调货
            if (
              (!updateVersionPriceType && (priceTypeUpper === 'TJ' || priceTypeUpper === 'GC'))
              || (updateVersionPriceType && (updateVersionPriceType === 'TJ' || updateVersionPriceType === 'GC') && stockVersion)
            ) {
              choseVersions = [
                ...updateVersion
              ];
              if (preVersion) {
                choseVersions.push(preVersion);
              }
            } else {
              // 否则就是修改后的版本
              choseVersions = updateVersion;
            }
          }
        } else {
          // 无修改用之前的版本
          if (preVersion) {
            choseVersions = [preVersion];
          }
        }
      }
      // 设置是否是正品样机的标记 $isRealProduct
      choseVersions.forEach((version) => {
        const {
          priceType: type
        } = version;
        if (type) {
          const typeUpper = type.toUpperCase();
          if (getYj()[typeUpper]) {
            const curAllVersion = this.versionPrice.activity[productCode];
            if (!curAllVersion) {
              return;
            }
            const choseVersion = curAllVersion.YJCY.find(v => v.versionCode === version.versionCode);
            const {
              realQty
            } = choseVersion;
            // 如果存在正品样机，则设置正品样机标记，并设置数量，此数量为最小购买数量
            if (choseVersion && (realQty || realQty === 0)) {
              version.$isRealProduct = true;
              version.realQty = realQty;
              const {
                invoicePrice,
                usableQty
              } = version;
              version.$realProductTotalPrice = this.jshUtil.formatNumber(this.jshUtil.arithmetic(invoicePrice, usableQty, 3), 2);
            }
          }
        }
      });
      return choseVersions;
    },
  }
};
