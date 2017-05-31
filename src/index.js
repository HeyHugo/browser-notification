let settings = {
  ignoreFocused: true,
  timeout: 0,
  cooldown: 0
};
let available = false;
let cooldownActive = false;
let focused = true;

function initNotifications(options) {
  // Handle old browsers - this way we can skip polyfill Promise and Object.assign
  if (!window.hasOwnProperty('Notification')) {
    console.info('This browser does not support notifications');

    // Mock promise always resolving to false
    return {
      then: fn => fn(false)
    };
  }

  settings = Object.assign({}, settings, options);

  window.onfocus = () => {
    focused = true;
  };

  window.onblur = () => {
    focused = false;
  };

  const availablePromise = new Promise((resolve, reject) => {
    if (Notification.permission === 'granted') {
      resolve(true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          resolve(true);
        }
        resolve(false);
      });
    } else {
      resolve(false);
    }
  });

  availablePromise.then(result => {
    available = result;
  });

  return availablePromise;
}

function notify(title, notifyOptions) {
  if (!available || (settings.ignoreFocused && focused) || cooldownActive) {
    return null;
  }

  const notification = new Notification(title, notifyOptions);

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  if (settings.timeout !== 0) {
    window.setTimeout(() => {
      notification.close();
    }, settings.timeout);
  }

  if (settings.cooldown !== 0) {
    cooldownActive = true;
    window.setTimeout(() => {
      cooldownActive = false;
    }, settings.cooldown);
  }

  return notification;
}

export {initNotifications, notify};
