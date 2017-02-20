# browser-notification

Small library built around browsers native [Notification-API](https://developer.mozilla.org/en-US/docs/Web/API/Notification) with some useful default behavior.
(A particular good fit for chat/messaging -type applications)

**browser-notification does just a few things**
- Look for [browser support](http://caniuse.com/#feat=notifications) and ask for user permission when initialized.
- Clicking a notification will focus the browser tab that fired the notification.
- `ignoreFocused` - If browser tab is already focused `notify()` -call will be ignored. **optional, default: true**
- For API simplicity one can always fire `notify()` since in case Notifications are not available it's just a no-op.
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
import {BrowserNotification} from 'browser-notification';

// Check browser support, ask permission, initialize
const notifier = BrowserNotification();
...
// Notify
notifier.notify('This is the title.', {body: '...and this is the body'});
```

**Note** - The underlying Notifications API for permission is async so if you want to initialize `BrowserNotification` at the same time as firing `notify`, you must first resolve `BrowserNotification.availablePromise` to ensure initialization is complete, see API and example below.

### API
`BrowserNotification({options})`
Create and setup the notifier object, asking for permission
Default options:

```
{
  ignoreFocused: true, // ignore notify() -calls when browser tab is already focused.
  timeout: 0,  // Set a time (ms) > 0 to activate
  cooldown: 0,  // Set a time (ms) > 0 to activate
}
```

`BrowserNotification.notify(title, {options})`
Takes the same arguments at the native [Notification API call](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification)
returns the Notification object or null if notification was not sent.
_The Notification object can be used to attach event handlers onclick/onclose/onerror/onshow_


`BrowserNotification.availablePromise`
Promise for checking wether notifications API is available.

Example of initializing `BrowserNotification` and calling `notify` "at the same time". Also using timeout/cooldown feature
```
const notifier = BrowserNotification({
    timeout: 3000,  // Auto-close notifications after 3 sec
    cooldown: 3000,  // Ignore new notify calls for 3 sec
});
notifier.availablePromise.then(function(isAvailable) {
  notifier.notify('Ping!');

  if (isAvailable) {
    console.log('notification was sent');
  }
  else {
    console.log('notification was not sent');
  }
})
```
