import { createApp } from 'vue';
import MessageConstructor from '@/components/Message/Message';
import { toRawType } from '@/js/util';

let instance;

const Message = function (options) {
  const mountNode = document.createElement('div');
  if (toRawType(options) === 'String') {
    options = {
      message: options,
    };
  }
  const app = createApp(MessageConstructor, { ...options });
  instance = app.mount(mountNode);
  instance.show();
};

export default {
  install(app) {
    app.config.globalProperties.$message = Message;
  },
};
