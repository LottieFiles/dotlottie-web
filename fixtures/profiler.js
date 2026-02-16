// stats.js - http://github.com/mrdoob/stats.js
!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : (t.Stats = e());
})(this, function () {
  var t = function () {
    function e(t) {
      return a.appendChild(t.dom), t;
    }
    function n(t) {
      for (var e = 0; e < a.children.length; e++) a.children[e].style.display = e === t ? 'block' : 'none';
      i = t;
    }
    var i = 0,
      a = document.createElement('div');
    (a.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000'),
      a.addEventListener(
        'click',
        function (t) {
          t.preventDefault(), n(++i % a.children.length);
        },
        !1,
      );
    var l = (performance || Date).now(),
      o = l,
      s = 0,
      d = e(new t.Panel('FPS', '#0ff', '#002')),
      $ = e(new t.Panel('MS', '#0f0', '#020'));
    if (self.performance && self.performance.memory) var r = e(new t.Panel('MB', '#f08', '#201'));
    return (
      n(0),
      {
        REVISION: 16,
        dom: a,
        addPanel: e,
        showPanel: n,
        begin: function () {
          l = (performance || Date).now();
        },
        end: function () {
          s++;
          var t = (performance || Date).now();
          if (($.update(t - l, 200), t >= o + 1e3 && (d.update((1e3 * s) / (t - o), 100), (o = t), (s = 0), r))) {
            var e = performance.memory;
            r.update(e.usedJSHeapSize / 1048576, e.jsHeapSizeLimit / 1048576);
          }
          return t;
        },
        update: function () {
          l = this.end();
        },
        domElement: a,
        setMode: n,
      }
    );
  };
  return (
    (t.Panel = function (t, e, n) {
      var i = 1 / 0,
        a = 0,
        l = Math.round,
        o = l(window.devicePixelRatio || 1),
        s = 80 * o,
        d = 48 * o,
        $ = 3 * o,
        r = 2 * o,
        f = 3 * o,
        p = 15 * o,
        c = 74 * o,
        m = 30 * o,
        u = document.createElement('canvas');
      (u.width = s), (u.height = d), (u.style.cssText = 'width:80px;height:48px');
      var y = u.getContext('2d');
      return (
        (y.font = 'bold ' + 9 * o + 'px Helvetica,Arial,sans-serif'),
        (y.textBaseline = 'top'),
        (y.fillStyle = n),
        y.fillRect(0, 0, s, d),
        (y.fillStyle = e),
        y.fillText(t, $, r),
        y.fillRect(f, p, c, m),
        (y.fillStyle = n),
        (y.globalAlpha = 0.9),
        y.fillRect(f, p, c, m),
        {
          dom: u,
          update: function (d, x) {
            (i = Math.min(i, d)),
              (a = Math.max(a, d)),
              (y.fillStyle = n),
              (y.globalAlpha = 1),
              y.fillRect(0, 0, s, p),
              (y.fillStyle = e),
              y.fillText(l(d) + ' ' + t + ' (' + l(i) + '-' + l(a) + ')', $, r),
              y.drawImage(u, f + o, p, c - o, m, f, p, c - o, m),
              y.fillRect(f + c - o, p, o, m),
              (y.fillStyle = n),
              (y.globalAlpha = 0.9),
              y.fillRect(f + c - o, p, o, l((1 - d / x) * m));
          },
        }
      );
    }),
    t
  );
});
var statsMB,
  statsFPS = new Stats();
statsFPS.showPanel(0),
  (statsFPS.dom.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000'),
  document.body.appendChild(statsFPS.dom);
var statsMS = new Stats();
function animate() {
  statsFPS.begin(),
    statsMS.begin(),
    statsMB && statsMB.begin(),
    statsFPS.end(),
    statsMS.end(),
    statsMB && statsMB.end(),
    requestAnimationFrame(animate);
}
statsMS.showPanel(1),
  (statsMS.dom.style.cssText = 'position:fixed;top:0;left:80px;cursor:pointer;opacity:0.9;z-index:10000'),
  document.body.appendChild(statsMS.dom),
  self.performance &&
    self.performance.memory &&
    ((statsMB = new Stats()).showPanel(2),
    (statsMB.dom.style.cssText = 'position:fixed;top:0;left:160px;cursor:pointer;opacity:0.9;z-index:10000'),
    document.body.appendChild(statsMB.dom)),
  requestAnimationFrame(animate);
