!(function (e, r) {
  e.swvr =
    e.swvr ||
    function (r = {}) {
      Object.assign((e.swvr.p = e.swvr.p || {}), r);
    };
  let t = r.currentScript,
    n = r.createElement("script");
  (n.type = "module"),
    (n.src = "https://cdn.signalwire.com/video/rooms/index.js"),
    (n.onload = function () {
      let n = r.createElement("ready-room");
      (n.params = e.swvr.p), t.parentNode.appendChild(n);
    }),
    t.parentNode.insertBefore(n, t);
  let i = r.createElement("link");
  (i.type = "text/css"),
    (i.rel = "stylesheet"),
    (i.href = "https://cdn.signalwire.com/video/rooms/signalwire.css"),
    t.parentNode.insertBefore(i, t),
    (e.SignalWire = e.SignalWire || {}),
    (e.SignalWire.Prebuilt = { VideoRoom: e.swvr });
})(window, document);

SignalWire.Prebuilt.VideoRoom({
  token: "vpt_cc56fea7323b3016b9b2db95e104fb38",
  // userName: 'your-name'
});
