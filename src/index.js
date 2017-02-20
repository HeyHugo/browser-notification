function BrowserNotification(options) {
  // Handle old browsers - this way we can skip polyfill Promise and Object.assign
  // (No browser with Notification lacks Promise or Object.assign)
  if (!window.hasOwnProperty('Notification')) {
    console.info('This browser does not support notifications');

    // Return no-op function and mock promise
    return {
      notify: () => {},
      available: {
        then: fn => {
          fn(false);
        }
      }
    };
  }

  const defaults = {
    timeout: 0,
    cooldown: 0
  };
  const settings = Object.assign(defaults, options);

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

  let available = false;
  let cooldownActive = false;
  let focused = true;

  availablePromise.then(result => {
    available = result;
  });

  window.onfocus = () => {
    focused = true;
  };

  window.onblur = () => {
    focused = false;
  };

  function notify(title, notifyOptions) {
    if (!available || focused || cooldownActive) {
      return;
    }

    const n = new Notification(title, notifyOptions);

    n.onclick = () => {
      window.focus();
      n.close();
    };

    if (settings.timeout !== 0) {
      window.setTimeout(
        () => {
          n.close();
        },
        settings.timeout
      );
    }

    if (settings.cooldown !== 0) {
      cooldownActive = true;
      window.setTimeout(
        () => {
          cooldownActive = false;
        },
        settings.cooldown
      );
    }
  }

  return {
    notify: notify,
    available: availablePromise
  };
}

export {BrowserNotification};
