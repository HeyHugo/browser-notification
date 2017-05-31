# browser-notification

Tiny library built around browsers native [Notification-API](https://developer.mozilla.org/en-US/docs/Web/API/Notification) with some useful default behavior.

[Demo](http://jsbin.com/riboqubela/edit?js,output)

**browser-notification does just a few things**
- Look for [browser support](http://caniuse.com/#feat=notifications) and ask for user permission when initialized.
- Clicking a notification will focus the browser tab that fired the notification.
- `ignoreFocused` - If browser tab is already focused `notify()` -call will be ignored. **optional, default: true**
- For API ergonomics it's always possible to fire `notify()` since in case Notifications are not available it's just a no-op (does nothing).
- `cooldown` - milliseconds before consecutive notification can be fired. **optional, default: 0**
- `timeout` - milliseconds to wait before auto-closing notifications. **optional, default: 0 (disabled)**

### Install
```
yarn add browser-notificaiton
```
or
```
npm install browser-notification --save
```
The library has no dependencies and size is less than 1kB (minified + gzipped).
A UMD build is available in `/dist` of the npm package.

### Usage

```
import {initNotifications, notify} from 'browser-notification';

// Check browser support, ask permission, initialize
initNotifications();
...
// Notify
notify('This is the title.', {body: '...and this is the body'});
```

**Note** - The underlying Notifications API for permission is async so if you want to initialize at the same time as firing `notify()`, you must first resolve the promise returned from `initNotifications()` to ensure initialization is complete, see API and example below.

### API
`initNotifications({options})`
Create and setup the notifier object, asking for permission, returns a promise resolving a boolean indicating wheather notifications are available or not.

Default options:

```
{
  ignoreFocused: true, // ignore notify() -calls when browser tab is already focused.
  timeout: 0,  // Set a time (ms) > 0 to activate
  cooldown: 0,  // Set a time (ms) > 0 to activate
}
```

`notify(title, {options})`
Takes the same arguments at the native [Notification API call](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification)
returns the Notification object or null if notification was not sent.
_The Notification object can be used to attach event handlers onclick/onclose/onerror/onshow_


Example of initializing and calling `notify` asyncronously. Also using timeout/cooldown feature
```
import {initNotifications, notify} from 'browser-notification';

initNotifications({
    timeout: 3000,  // Auto-close notifications after 3 sec
    cooldown: 3000,  // Ignore new notify calls for 3 sec
}).then(function(isAvailable) {
  notify('Ping!');

  if (isAvailable) {
    console.log('notification was sent');
  }
  else {
    console.log('notification was not sent');
  }
});
```
