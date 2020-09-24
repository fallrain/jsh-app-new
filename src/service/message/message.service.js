import urls from '../url/message.url';
import {
  jPostJson,
  jGet
} from '@/lib/request';

export default {
  messageList(data) {
    /* 消息列表 */
    return jPostJson(urls.messageList, data);
  },
  updateAllMessageRead(data) {
    /* 消息全部已读 */
    return jGet(urls.updateAllMessageRead, data);
  },
  getNotReadMessageCount(data) {
    /* 消息全部已读 */
    return jGet(urls.getNotReadMessageCount, data);
  },
  deleteMessage(data) {
    /* 删除此消息 */
    return jGet(urls.deleteMessage, data);
  },
  indexList(data) {
    return jGet(urls.indexList, data);
  },
  getInfomation(id, data) {
    return jGet(urls.getInfomation(id), data);
  },
  page(queryStr) {
    return jPostJson(urls.page(queryStr));
  }

};
