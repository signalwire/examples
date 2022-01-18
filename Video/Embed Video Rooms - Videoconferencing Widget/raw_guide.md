The SignalWire Video APIs give you full flexibility to build your own personalized video conferencing experience. But if you just need a basic video-conference widget, you can get started by copy-pasting a **Video Room Widget** from your SignalWire space. Video Rooms can be embedded in your CMS like **WordPress**, **Drupal**, or any other kind of **static HTML page**, simply by **copy-pasting** a snippet of HTML code.


[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/66d92e0-readyrooms.png",
        "readyrooms.png",
        1008,
        698,
        "#66605b"
      ],
      "sizing": "80",
      "caption": "You can embed the Video Room widget in any kind of webpage just by pasting a code snippet."
    }
  ]
}
[/block]
# What do I need to run this? 

To use the Video Room Widget you just need a web page or web space with support for custom HTML and JavaScript. 

We have prepared for you two examples to try it out: one on GitHub, the other on [CodeSandbox](https://codesandbox.io/s/embeddable-room-22ydp?file=/index.html).

# Obtaining the code snippet

You can get the code snippet for your Video Room Widget by logging into your [SignalWire space](https://signalwire.com/signin) and going to the **Video Section**. Select or create a new room, then click on **Embed Room** to copy the code. A screen like the following will open:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/093ddc4-Screenshot_2021-10-11_at_12.01.11.png",
        "Screenshot 2021-10-11 at 12.01.11.png",
        1454,
        1324,
        "#c2c3c4"
      ],
      "sizing": "80"
    }
  ]
}
[/block]
You can copy either the code for guests, or the code for accessing the room with moderator permissions. You could decide to embed these into different pages of your website, one internal and one accessible by the public.

# Customizing the code (optional)

You can perform some basic customization to the code that you have copied. At the bottom of your snippet of code, you will find a function call like this one:

```javascript
swvr({
  token: 'vrg_xxxxxxxxxxxxx',
  // userName: 'your-name'
});
```

To change the username of whomever joins the room, uncomment `userName` and set it to the value you prefer. For more informations about the parameters that you can configure, see the [Technical Reference](#technical-reference) below.

# Using the code

Here we will give you some **examples** on how to use the code that we have copied in the previous section.

## Static HTML page

Paste the snippet of code inside the `<body>` of your page, in the position where you want it to appear. If you need to, you can control the size and position of the widget by wrapping it in a properly styled `div` element. For example, to make sure that the size is exactly 400px x 250px and that the widget is horizontally centered:

```html
<div style="margin: 0 auto; width: 400px; height: 250px;">
    [paste here your snippet of code]
</div>
```

For a live example, explore our implementation on CodeSandbox: https://codesandbox.io/s/embeddable-room-22ydp?file=/index.html.

## WordPress

Add a new **Custom HTML** block to your page or post. Paste the code snippet in the HTML block, and you are ready to go.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e363016-Screenshot_2021-10-08_at_13.01.09_copy.png",
        "Screenshot 2021-10-08 at 13.01.09 copy.png",
        2056,
        1266,
        "#eff0f1"
      ],
      "caption": "",
      "sizing": "80"
    }
  ]
}
[/block]
# Technical Reference

This is the list of parameters that you can configure in the code snippet of an embedded room.

**userName**:  
A custom user name for the user joining the room.

**theme**:  
To force a specific theme. Allowed values are `'light' | 'dark' | 'auto'`.

**audio**:  
[Audio constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) to use for the devices. Set to false if you don't want to use audio devices. Default: true

**video**:  
[Video constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) to use for the devices. Set to false if you don't want to use video devices. Default: true


# Wrap Up
Embeddable rooms are an easy way to integrate a videoconferencing experience into any web page, without advanced software development experience. All you need to do is copy and paste a snippet of code.

# Sign Up Here

If you would like to test this example with your own credentials, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!