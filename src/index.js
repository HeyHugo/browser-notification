function BrowserNotification(options) {

  const defaults = {
    timeout: 0,
    cooldown: 0,
    onClick: () => {}
  };
  const settings = Object.assign(defaults, options);

  const isAvailable = new Promise((resolve, reject) => {
    if (!("Notification" in window)) {
      console.info("This browser does not support desktop notification");
      resolve(false);
    }
    else if (Notification.permission === 'granted') {
      resolve(true);
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
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

  isAvailable.then((result) => {
    available = result;
  });

  window.onfocus = () => {
    focused = true;
  }

  window.onblur = () => {
    focused = false;
  }

  function notify(title, notifyOptions) {
    if (!available || focused || cooldownActive) {
      return;
    }

    const n = new Notification(title, notifyOptions);

    n.onclick = () => {
      window.focus();
      settings.onClick();
      n.close();
    }

    if (settings.timeout !== null) {
      window.setTimeout(() => {
        n.close();
      }, settings.timeout);
    }

    if (settings.cooldown !== null) {
      cooldownActive = true;
      window.setTimeout(() => {
        cooldownActive = false;
      }, settings.cooldown);
    }
  }

  return {
    notify: notify,
    isAvailable: isAvailable
  };
}

export {BrowserNotification};
