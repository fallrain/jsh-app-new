import util from '../util/index';

const baseURL = 'message/api';
const urls = {
  // 消息列表
  messageList: '/message/page',
  // 消息全部已读
  updateAllMessageRead: '/message/updateAllMessageRead',
  // 未读消息
  getNotReadMessageCount: '/message/getNotReadMessageCount',
  // 删除此消息
  deleteMessage: '/message/deleteMessage',
  // 首页新闻资讯
  indexList: '/notice/indexList',
  // 首页新闻资讯详情
  getInfomation(id) {
    return `/notice/detail/${id}`;
  },
  page: queryStr => `/notice/page${queryStr}`
};
util.addPrefix(baseURL, urls);
export default urls;
