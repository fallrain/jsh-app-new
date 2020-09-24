import util from '../util/index';

const baseURL = 'account';
const urls = {
  outstandingAmount(code) {
    // 我的-基本信息
    return '/rebate/management/delivery/outstandingAmount';
  },
  posPaymentList: '/money/management/posterminal/list',
  posNianfeiList: '/money/management/posnianfei/list',
  posChargeList: '/terminal/pos/service/charge/list',
  posInformationList: '/pos/terminal/showPosTerminalWindow'
};
util.addPrefix(baseURL, urls);
export default urls;
