# Using the AppKit with Vite.js

This is the integration example of AppKit with Vite. We used `npm create vite@latest` and selected `Vanilla` and `JavaScript` when prompted. The scaffolding started us with the external file `main.js` where we could insert our `sw-video-conference` component with `innerHTML`.

```js
import "./style.css";
import "@signalwire/app-kit";

document.querySelector("#app")!.innerHTML = `
<sw-video-conference
token="vpt_25e...8dd"
user-name="Guest"
device-picker="true"
ref="videoComponent"
></sw-video-conference>
`;
```

Just these few lines of code are enough to run a fully functional video conference room. To go one step forward and use the `setupRoomSession` callback function available on the `sw-video-conference` component, we used `document.createElement` to create the element, access the callback function, and get the Room Session object before adding it to the HTML.

For a full guide to this implementation, see the blog [Video Conference AppKit: Vite Integration](https://signalwire.com/blogs/developers/video-conference-appkit-with-vite).
