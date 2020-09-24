import urls from '../url/account.url';
import {
  jPostJson
} from '@/lib/request';

export default {
  posPaymentList(data) {
    /* pos申请 */
    return jPostJson(urls.posPaymentList, data);
  },
  posInformationList(data) {
    return jPostJson(urls.posInformationList, data);
  },
  posYearfeeList(data) {
    /* pos年费 */
    return jPostJson(urls.posNianfeiList, data);
  },
  posChargeList(data) {
    /* pos手续费 */
    return jPostJson(urls.posChargeList, data);
  }
};
