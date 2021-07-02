import { createApp, nextTick } from 'vue';

import messageBox from '@/components/MessageBox/index.vue';

let instance;
const createInstance = (options) => {
  const mountNode = document.createElement('div');
  const app = createApp(messageBox, {
    ...options,
  });
  instance = app.mount(mountNode);
  document.body.appendChild(mountNode);
};

const MessageBox = async function (option) {
  if (!instance) {
    createInstance();
  }
  await nextTick();
  instance.type = option.type || 'alert';
  instance.message = option.message;
  instance.confirmCallback = option.confirmCallback;
  instance.cancelCallback = option.cancelCallback;
  instance.confirmText = option.confirmText || '确定';
  instance.cancelText = option.cancelText || '取消';
  instance.visible = true;
};

MessageBox.alert = (message, callback, confirmText) => {
  if (Object.prototype.toString.call(message) === '[object Object]') {
    const option = message;
    callback = option.confirmCallback;
    confirmText = option.confirmText || '确定';
    message = option.message;
  }
  MessageBox({
    message,
    type: 'alert',
    confirmText: confirmText,
    confirmCallback: () => {
      if (callback) callback();
    },
  });
};

MessageBox.confirm = (
  message,
  confirmCallback,
  cancelCallback,
  confirmText,
  cancelText
) => {
  if (Object.prototype.toString.call(message) === '[object Object]') {
    const option = message;
    confirmCallback = option.confirmCallback;
    cancelCallback = option.cancelCallback;
    confirmText = option.confirmText || '确定';
    cancelText = option.cancelText || '取消';
    message = option.message;
  }
  MessageBox({
    message,
    type: 'confirm',
    confirmText,
    cancelText,
    confirmCallback: () => {
      if (confirmCallback) confirmCallback();
    },
    cancelCallback: () => {
      if (cancelCallback) cancelCallback();
    },
  });
};

MessageBox.close = async () => {
  await nextTick();
  instance.visible = false;
};

export default {
  install(app) {
    app.config.globalProperties.$msg = MessageBox;
  },
};
