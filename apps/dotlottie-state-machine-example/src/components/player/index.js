import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
    }
  return target;
};

// ../web/dist/index.js
var s0 = Object.defineProperty;
var d0 = Object.defineProperties;
var u0 = Object.getOwnPropertyDescriptors;
var U1 = Object.getOwnPropertySymbols;
var s3 = Object.prototype.hasOwnProperty;
var d3 = Object.prototype.propertyIsEnumerable;
var v2 = (c, n, i) =>
  n in c ? s0(c, n, { enumerable: true, configurable: true, writable: true, value: i }) : (c[n] = i);
var x = (c, n) => {
  for (var i in n || (n = {})) s3.call(n, i) && v2(c, i, n[i]);
  if (U1) for (var i of U1(n)) d3.call(n, i) && v2(c, i, n[i]);
  return c;
};
var k = (c, n) => d0(c, u0(n));
var H1 = (c, n) => {
  var i = {};
  for (var d in c) s3.call(c, d) && n.indexOf(d) < 0 && (i[d] = c[d]);
  if (c != null && U1) for (var d of U1(c)) n.indexOf(d) < 0 && d3.call(c, d) && (i[d] = c[d]);
  return i;
};
var _ = (c, n, i) => v2(c, typeof n != 'symbol' ? n + '' : n, i);
var g = (c, n, i) =>
  new Promise((d, s) => {
    var m = (I) => {
        try {
          C(i.next(I));
        } catch (A) {
          s(A);
        }
      },
      w = (I) => {
        try {
          C(i.throw(I));
        } catch (A) {
          s(A);
        }
      },
      C = (I) => (I.done ? d(I.value) : Promise.resolve(I.value).then(m, w));
    C((i = i.apply(c, n)).next());
  });
var m2 = class {
  requestAnimationFrame(n) {
    return requestAnimationFrame(n);
  }
  cancelAnimationFrame(n) {
    cancelAnimationFrame(n);
  }
};
var _2 = class {
  constructor() {
    _(this, '_lastHandleId', 0);
    _(this, '_lastImmediate', null);
  }
  requestAnimationFrame(n) {
    return (
      this._lastHandleId >= Number.MAX_SAFE_INTEGER && (this._lastHandleId = 0),
      (this._lastHandleId += 1),
      (this._lastImmediate = setImmediate(() => {
        n(Date.now());
      })),
      this._lastHandleId
    );
  }
  cancelAnimationFrame(n) {
    this._lastImmediate && clearImmediate(this._lastImmediate);
  }
};
var j1 = class {
  constructor() {
    _(this, '_strategy');
    this._strategy = typeof requestAnimationFrame == 'function' ? new m2() : new _2();
  }
  requestAnimationFrame(n) {
    return this._strategy.requestAnimationFrame(n);
  }
  cancelAnimationFrame(n) {
    this._strategy.cancelAnimationFrame(n);
  }
};
var R = typeof window != 'undefined' && typeof window.document != 'undefined';
var B1 = new Uint8Array([80, 75, 3, 4]);
var u3 = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h'];
var g2 = '0.37.0-beta.7';
var y2 = '@lottiefiles/dotlottie-web';
var l3 = 0.75;
var l0 = (() => {
  var n;
  var c = typeof document != 'undefined' ? ((n = document.currentScript) == null ? void 0 : n.src) : void 0;
  return function (i = {}) {
    var d,
      s = i,
      m,
      w,
      C = new Promise((e, t) => {
        (m = e), (w = t);
      }),
      I = Object.assign({}, s),
      A = './this.program',
      H = '',
      l1;
    typeof document != 'undefined' && document.currentScript && (H = document.currentScript.src),
      c && (H = c),
      H.startsWith('blob:') ? (H = '') : (H = H.substr(0, H.replace(/[?#].*/, '').lastIndexOf('/') + 1)),
      (l1 = (e) =>
        fetch(e, { credentials: 'same-origin' }).then((t) =>
          t.ok ? t.arrayBuffer() : Promise.reject(Error(t.status + ' : ' + t.url)),
        ));
    var I1 = s.print || console.log.bind(console),
      o1 = s.printErr || console.error.bind(console);
    Object.assign(s, I), (I = null), s.thisProgram && (A = s.thisProgram);
    var F1 = s.wasmBinary,
      S1,
      T1 = false,
      V1,
      e1,
      T,
      t1,
      h1,
      N,
      E,
      I2,
      F2;
    function S2() {
      var e = S1.buffer;
      (s.HEAP8 = e1 = new Int8Array(e)),
        (s.HEAP16 = t1 = new Int16Array(e)),
        (s.HEAPU8 = T = new Uint8Array(e)),
        (s.HEAPU16 = h1 = new Uint16Array(e)),
        (s.HEAP32 = N = new Int32Array(e)),
        (s.HEAPU32 = E = new Uint32Array(e)),
        (s.HEAPF32 = I2 = new Float32Array(e)),
        (s.HEAPF64 = F2 = new Float64Array(e));
    }
    var T2 = [],
      x2 = [],
      R2 = [];
    function y3() {
      var e = s.preRun.shift();
      T2.unshift(e);
    }
    var n1 = 0,
      c1 = null;
    function x1(e) {
      var t;
      throw (
        ((t = s.onAbort) == null || t.call(s, e),
        (e = 'Aborted(' + e + ')'),
        o1(e),
        (T1 = true),
        (e = new WebAssembly.RuntimeError(e + '. Build with -sASSERTIONS for more info.')),
        w(e),
        e)
      );
    }
    var A2 = (e) => e.startsWith('data:application/octet-stream;base64,'),
      p1;
    function D2(e) {
      if (e == p1 && F1) return new Uint8Array(F1);
      throw 'both async and sync fetching of the wasm failed';
    }
    function b3(e) {
      return F1
        ? Promise.resolve().then(() => D2(e))
        : l1(e).then(
            (t) => new Uint8Array(t),
            () => D2(e),
          );
    }
    function k2(e, t, r) {
      return b3(e)
        .then((a) => WebAssembly.instantiate(a, t))
        .then(r, (a) => {
          o1(`failed to asynchronously prepare wasm: ${a}`), x1(a);
        });
    }
    function w3(e, t) {
      var r = p1;
      return F1 || typeof WebAssembly.instantiateStreaming != 'function' || A2(r) || typeof fetch != 'function'
        ? k2(r, e, t)
        : fetch(r, { credentials: 'same-origin' }).then((a) =>
            WebAssembly.instantiateStreaming(a, e).then(t, function (o) {
              return (
                o1(`wasm streaming compile failed: ${o}`), o1('falling back to ArrayBuffer instantiation'), k2(r, e, t)
              );
            }),
          );
    }
    var j, s1;
    function O2(e) {
      (this.name = 'ExitStatus'), (this.message = `Program terminated with exit(${e})`), (this.status = e);
    }
    var K1 = (e) => {
        for (; 0 < e.length; ) e.shift()(s);
      },
      q1 = s.noExitRuntime || true,
      W2 = typeof TextDecoder != 'undefined' ? new TextDecoder() : void 0,
      f1 = (e, t, r) => {
        var a = t + r;
        for (r = t; e[r] && !(r >= a); ) ++r;
        if (16 < r - t && e.buffer && W2) return W2.decode(e.subarray(t, r));
        for (a = ''; t < r; ) {
          var o = e[t++];
          if (o & 128) {
            var u = e[t++] & 63;
            if ((o & 224) == 192) a += String.fromCharCode(((o & 31) << 6) | u);
            else {
              var h = e[t++] & 63;
              (o =
                (o & 240) == 224
                  ? ((o & 15) << 12) | (u << 6) | h
                  : ((o & 7) << 18) | (u << 12) | (h << 6) | (e[t++] & 63)),
                65536 > o
                  ? (a += String.fromCharCode(o))
                  : ((o -= 65536), (a += String.fromCharCode(55296 | (o >> 10), 56320 | (o & 1023))));
            }
          } else a += String.fromCharCode(o);
        }
        return a;
      };
    class L3 {
      constructor(t) {
        this.Ha = t - 24;
      }
    }
    var $2 = 0,
      v1 = (e, t, r) => {
        var a = T;
        if (0 < r) {
          r = t + r - 1;
          for (var o = 0; o < e.length; ++o) {
            var u = e.charCodeAt(o);
            if (55296 <= u && 57343 >= u) {
              var h = e.charCodeAt(++o);
              u = (65536 + ((u & 1023) << 10)) | (h & 1023);
            }
            if (127 >= u) {
              if (t >= r) break;
              a[t++] = u;
            } else {
              if (2047 >= u) {
                if (t + 1 >= r) break;
                a[t++] = 192 | (u >> 6);
              } else {
                if (65535 >= u) {
                  if (t + 2 >= r) break;
                  a[t++] = 224 | (u >> 12);
                } else {
                  if (t + 3 >= r) break;
                  (a[t++] = 240 | (u >> 18)), (a[t++] = 128 | ((u >> 12) & 63));
                }
                a[t++] = 128 | ((u >> 6) & 63);
              }
              a[t++] = 128 | (u & 63);
            }
          }
          a[t] = 0;
        }
      },
      R1 = {},
      Y1 = (e) => {
        for (; e.length; ) {
          var t = e.pop();
          e.pop()(t);
        }
      };
    function m1(e) {
      return this.fromWireType(E[e >> 2]);
    }
    var d1 = {},
      i1 = {},
      A1 = {},
      _1,
      Q = (e, t, r) => {
        function a(l) {
          if (((l = r(l)), l.length !== e.length)) throw new _1('Mismatched type converter count');
          for (var p = 0; p < e.length; ++p) G(e[p], l[p]);
        }
        e.forEach((l) => (A1[l] = t));
        var o = Array(t.length),
          u = [],
          h = 0;
        t.forEach((l, p) => {
          i1.hasOwnProperty(l)
            ? (o[p] = i1[l])
            : (u.push(l),
              d1.hasOwnProperty(l) || (d1[l] = []),
              d1[l].push(() => {
                (o[p] = i1[l]), ++h, h === u.length && a(o);
              }));
        }),
          u.length === 0 && a(o);
      },
      z2,
      D = (e) => {
        for (var t = ''; T[e]; ) t += z2[T[e++]];
        return t;
      },
      y;
    function C3(e, t, r = {}) {
      var a = t.name;
      if (!e) throw new y(`type "${a}" must have a positive integer typeid pointer`);
      if (i1.hasOwnProperty(e)) {
        if (r.mb) return;
        throw new y(`Cannot register type '${a}' twice`);
      }
      (i1[e] = t), delete A1[e], d1.hasOwnProperty(e) && ((t = d1[e]), delete d1[e], t.forEach((o) => o()));
    }
    function G(e, t, r = {}) {
      return C3(e, t, r);
    }
    var X1 = (e) => {
        throw new y(e.Fa.Ia.Ga.name + ' instance already deleted');
      },
      Z1 = false,
      U2 = () => {},
      H2 = (e, t, r) => (t === r ? e : r.La === void 0 ? null : ((e = H2(e, t, r.La)), e === null ? null : r.fb(e))),
      j2 = {},
      g1 = [],
      Q1 = () => {
        for (; g1.length; ) {
          var e = g1.pop();
          (e.Fa.Ra = false), e.delete();
        }
      },
      y1,
      b1 = {},
      E3 = (e, t) => {
        if (t === void 0) throw new y('ptr should not be undefined');
        for (; e.La; ) (t = e.Ua(t)), (e = e.La);
        return b1[t];
      },
      D1 = (e, t) => {
        if (!t.Ia || !t.Ha) throw new _1('makeClassHandle requires ptr and ptrType');
        if (!!t.Ma != !!t.Ja) throw new _1('Both smartPtrType and smartPtr must be specified');
        return (t.count = { value: 1 }), w1(Object.create(e, { Fa: { value: t, writable: true } }));
      },
      w1 = (e) =>
        typeof FinalizationRegistry == 'undefined'
          ? ((w1 = (t) => t), e)
          : ((Z1 = new FinalizationRegistry((t) => {
              (t = t.Fa), --t.count.value, t.count.value === 0 && (t.Ja ? t.Ma.Pa(t.Ja) : t.Ia.Ga.Pa(t.Ha));
            })),
            (w1 = (t) => {
              var r = t.Fa;
              return r.Ja && Z1.register(t, { Fa: r }, t), t;
            }),
            (U2 = (t) => {
              Z1.unregister(t);
            }),
            w1(e));
    function k1() {}
    var L1 = (e, t) => Object.defineProperty(t, 'name', { value: e }),
      B2 = (e, t, r) => {
        if (e[t].Ka === void 0) {
          var a = e[t];
          (e[t] = function (...o) {
            if (!e[t].Ka.hasOwnProperty(o.length))
              throw new y(
                `Function '${r}' called with an invalid number of arguments (${o.length}) - expects one of (${e[t].Ka})!`,
              );
            return e[t].Ka[o.length].apply(this, o);
          }),
            (e[t].Ka = []),
            (e[t].Ka[a.Va] = a);
        }
      },
      e2 = (e, t, r) => {
        if (s.hasOwnProperty(e)) {
          if (r === void 0 || (s[e].Ka !== void 0 && s[e].Ka[r] !== void 0))
            throw new y(`Cannot register public name '${e}' twice`);
          if ((B2(s, e, e), s.hasOwnProperty(r)))
            throw new y(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`);
          s[e].Ka[r] = t;
        } else (s[e] = t), r !== void 0 && (s[e].vb = r);
      },
      P3 = (e) => {
        if (e === void 0) return '_unknown';
        e = e.replace(/[^a-zA-Z0-9_]/g, '$');
        var t = e.charCodeAt(0);
        return 48 <= t && 57 >= t ? `_${e}` : e;
      };
    function I3(e, t, r, a, o, u, h, l) {
      (this.name = e),
        (this.constructor = t),
        (this.Sa = r),
        (this.Pa = a),
        (this.La = o),
        (this.hb = u),
        (this.Ua = h),
        (this.fb = l),
        (this.ob = []);
    }
    var t2 = (e, t, r) => {
      for (; t !== r; ) {
        if (!t.Ua) throw new y(`Expected null or instance of ${r.name}, got an instance of ${t.name}`);
        (e = t.Ua(e)), (t = t.La);
      }
      return e;
    };
    function F3(e, t) {
      if (t === null) {
        if (this.Ya) throw new y(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!t.Fa) throw new y(`Cannot pass "${d2(t)}" as a ${this.name}`);
      if (!t.Fa.Ha) throw new y(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return t2(t.Fa.Ha, t.Fa.Ia.Ga, this.Ga);
    }
    function S3(e, t) {
      if (t === null) {
        if (this.Ya) throw new y(`null is not a valid ${this.name}`);
        if (this.Xa) {
          var r = this.Za();
          return e !== null && e.push(this.Pa, r), r;
        }
        return 0;
      }
      if (!t || !t.Fa) throw new y(`Cannot pass "${d2(t)}" as a ${this.name}`);
      if (!t.Fa.Ha) throw new y(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Wa && t.Fa.Ia.Wa)
        throw new y(
          `Cannot convert argument of type ${t.Fa.Ma ? t.Fa.Ma.name : t.Fa.Ia.name} to parameter type ${this.name}`,
        );
      if (((r = t2(t.Fa.Ha, t.Fa.Ia.Ga, this.Ga)), this.Xa)) {
        if (t.Fa.Ja === void 0) throw new y('Passing raw pointer to smart pointer is illegal');
        switch (this.tb) {
          case 0:
            if (t.Fa.Ma === this) r = t.Fa.Ja;
            else
              throw new y(
                `Cannot convert argument of type ${t.Fa.Ma ? t.Fa.Ma.name : t.Fa.Ia.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            r = t.Fa.Ja;
            break;
          case 2:
            if (t.Fa.Ma === this) r = t.Fa.Ja;
            else {
              var a = t.clone();
              (r = this.pb(
                r,
                W1(() => a.delete()),
              )),
                e !== null && e.push(this.Pa, r);
            }
            break;
          default:
            throw new y('Unsupporting sharing policy');
        }
      }
      return r;
    }
    function T3(e, t) {
      if (t === null) {
        if (this.Ya) throw new y(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!t.Fa) throw new y(`Cannot pass "${d2(t)}" as a ${this.name}`);
      if (!t.Fa.Ha) throw new y(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (t.Fa.Ia.Wa) throw new y(`Cannot convert argument of type ${t.Fa.Ia.name} to parameter type ${this.name}`);
      return t2(t.Fa.Ha, t.Fa.Ia.Ga, this.Ga);
    }
    function M1(e, t, r, a, o, u, h, l, p, f, v) {
      (this.name = e),
        (this.Ga = t),
        (this.Ya = r),
        (this.Wa = a),
        (this.Xa = o),
        (this.nb = u),
        (this.tb = h),
        (this.cb = l),
        (this.Za = p),
        (this.pb = f),
        (this.Pa = v),
        o || t.La !== void 0 ? (this.toWireType = S3) : ((this.toWireType = a ? F3 : T3), (this.Oa = null));
    }
    var N2 = (e, t, r) => {
        if (!s.hasOwnProperty(e)) throw new _1('Replacing nonexistent public symbol');
        s[e].Ka !== void 0 && r !== void 0 ? (s[e].Ka[r] = t) : ((s[e] = t), (s[e].Va = r));
      },
      B,
      x3 = (e, t, r = []) => (
        e.includes('j') ? ((e = e.replace(/p/g, 'i')), (t = (0, s['dynCall_' + e])(t, ...r))) : (t = B.get(t)(...r)), t
      ),
      R3 =
        (e, t) =>
        (...r) =>
          x3(e, t, r),
      O = (e, t) => {
        e = D(e);
        var r = e.includes('j') ? R3(e, t) : B.get(t);
        if (typeof r != 'function') throw new y(`unknown function pointer with signature ${e}: ${t}`);
        return r;
      },
      G2,
      V2 = (e) => {
        e = t3(e);
        var t = D(e);
        return Z(e), t;
      },
      O1 = (e, t) => {
        function r(u) {
          o[u] || i1[u] || (A1[u] ? A1[u].forEach(r) : (a.push(u), (o[u] = true)));
        }
        var a = [],
          o = {};
        throw (t.forEach(r), new G2(`${e}: ` + a.map(V2).join([', '])));
      },
      n2 = (e, t) => {
        for (var r = [], a = 0; a < e; a++) r.push(E[(t + 4 * a) >> 2]);
        return r;
      };
    function A3(e) {
      for (var t = 1; t < e.length; ++t) if (e[t] !== null && e[t].Oa === void 0) return true;
      return false;
    }
    function i2(e, t, r, a, o) {
      var u = t.length;
      if (2 > u) throw new y("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = t[1] !== null && r !== null,
        l = A3(t),
        p = t[0].name !== 'void',
        f = u - 2,
        v = Array(f),
        b = [],
        L = [];
      return L1(e, function (...z) {
        if (((L.length = 0), (b.length = h ? 2 : 1), (b[0] = o), h)) {
          var F = t[1].toWireType(L, this);
          b[1] = F;
        }
        for (var S = 0; S < f; ++S) (v[S] = t[S + 2].toWireType(L, z[S])), b.push(v[S]);
        if (((z = a(...b)), l)) Y1(L);
        else
          for (S = h ? 1 : 2; S < t.length; S++) {
            var q = S === 1 ? F : v[S - 2];
            t[S].Oa !== null && t[S].Oa(q);
          }
        return (F = p ? t[0].fromWireType(z) : void 0), F;
      });
    }
    var J2 = (e) => {
        e = e.trim();
        let t = e.indexOf('(');
        return t !== -1 ? e.substr(0, t) : e;
      },
      r2 = [],
      X = [],
      a2 = (e) => {
        9 < e && --X[e + 1] === 0 && ((X[e] = void 0), r2.push(e));
      },
      o2 = (e) => {
        if (!e) throw new y('Cannot use deleted val. handle = ' + e);
        return X[e];
      },
      W1 = (e) => {
        switch (e) {
          case void 0:
            return 2;
          case null:
            return 4;
          case true:
            return 6;
          case false:
            return 8;
          default:
            let t = r2.pop() || X.length;
            return (X[t] = e), (X[t + 1] = 1), t;
        }
      },
      K2 = {
        name: 'emscripten::val',
        fromWireType: (e) => {
          var t = o2(e);
          return a2(e), t;
        },
        toWireType: (e, t) => W1(t),
        Na: 8,
        readValueFromPointer: m1,
        Oa: null,
      },
      D3 = (e, t, r) => {
        switch (t) {
          case 1:
            return r
              ? function (a) {
                  return this.fromWireType(e1[a]);
                }
              : function (a) {
                  return this.fromWireType(T[a]);
                };
          case 2:
            return r
              ? function (a) {
                  return this.fromWireType(t1[a >> 1]);
                }
              : function (a) {
                  return this.fromWireType(h1[a >> 1]);
                };
          case 4:
            return r
              ? function (a) {
                  return this.fromWireType(N[a >> 2]);
                }
              : function (a) {
                  return this.fromWireType(E[a >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${t}): ${e}`);
        }
      },
      s2 = (e, t) => {
        var r = i1[e];
        if (r === void 0) throw ((e = `${t} has unknown type ${V2(e)}`), new y(e));
        return r;
      },
      d2 = (e) => {
        if (e === null) return 'null';
        var t = typeof e;
        return t === 'object' || t === 'array' || t === 'function' ? e.toString() : '' + e;
      },
      k3 = (e, t) => {
        switch (t) {
          case 4:
            return function (r) {
              return this.fromWireType(I2[r >> 2]);
            };
          case 8:
            return function (r) {
              return this.fromWireType(F2[r >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${t}): ${e}`);
        }
      },
      O3 = (e, t, r) => {
        switch (t) {
          case 1:
            return r ? (a) => e1[a] : (a) => T[a];
          case 2:
            return r ? (a) => t1[a >> 1] : (a) => h1[a >> 1];
          case 4:
            return r ? (a) => N[a >> 2] : (a) => E[a >> 2];
          default:
            throw new TypeError(`invalid integer width (${t}): ${e}`);
        }
      },
      W3 = Object.assign({ optional: true }, K2),
      q2 = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : void 0,
      $3 = (e, t) => {
        for (var r = e >> 1, a = r + t / 2; !(r >= a) && h1[r]; ) ++r;
        if (((r <<= 1), 32 < r - e && q2)) return q2.decode(T.subarray(e, r));
        for (r = '', a = 0; !(a >= t / 2); ++a) {
          var o = t1[(e + 2 * a) >> 1];
          if (o == 0) break;
          r += String.fromCharCode(o);
        }
        return r;
      },
      z3 = (e, t, r) => {
        if ((r != null || (r = 2147483647), 2 > r)) return 0;
        r -= 2;
        var a = t;
        r = r < 2 * e.length ? r / 2 : e.length;
        for (var o = 0; o < r; ++o) (t1[t >> 1] = e.charCodeAt(o)), (t += 2);
        return (t1[t >> 1] = 0), t - a;
      },
      U3 = (e) => 2 * e.length,
      H3 = (e, t) => {
        for (var r = 0, a = ''; !(r >= t / 4); ) {
          var o = N[(e + 4 * r) >> 2];
          if (o == 0) break;
          ++r,
            65536 <= o
              ? ((o -= 65536), (a += String.fromCharCode(55296 | (o >> 10), 56320 | (o & 1023))))
              : (a += String.fromCharCode(o));
        }
        return a;
      },
      j3 = (e, t, r) => {
        if ((r != null || (r = 2147483647), 4 > r)) return 0;
        var a = t;
        r = a + r - 4;
        for (var o = 0; o < e.length; ++o) {
          var u = e.charCodeAt(o);
          if (55296 <= u && 57343 >= u) {
            var h = e.charCodeAt(++o);
            u = (65536 + ((u & 1023) << 10)) | (h & 1023);
          }
          if (((N[t >> 2] = u), (t += 4), t + 4 > r)) break;
        }
        return (N[t >> 2] = 0), t - a;
      },
      B3 = (e) => {
        for (var t = 0, r = 0; r < e.length; ++r) {
          var a = e.charCodeAt(r);
          55296 <= a && 57343 >= a && ++r, (t += 4);
        }
        return t;
      },
      u2 = [],
      N3 = (e) => {
        var t = u2.length;
        return u2.push(e), t;
      },
      G3 = (e, t) => {
        for (var r = Array(e), a = 0; a < e; ++a) r[a] = s2(E[(t + 4 * a) >> 2], 'parameter ' + a);
        return r;
      },
      V3 = Reflect.construct,
      C1 = {},
      Y22 = (e) => {
        if (!(e instanceof O2 || e == 'unwind')) throw e;
      },
      l2 = 0,
      X2 = (e) => {
        var t;
        throw ((V1 = e), q1 || 0 < l2 || ((t = s.onExit) == null || t.call(s, e), (T1 = true)), new O2(e));
      },
      J3 = (e) => {
        if (!T1)
          try {
            if ((e(), !(q1 || 0 < l2)))
              try {
                (V1 = e = V1), X2(e);
              } catch (t) {
                Y22(t);
              }
          } catch (t) {
            Y22(t);
          }
      },
      h2 = {},
      Z2 = () => {
        if (!c2) {
          var e = {
              USER: 'web_user',
              LOGNAME: 'web_user',
              PATH: '/',
              PWD: '/',
              HOME: '/home/web_user',
              LANG:
                ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace(
                  '-',
                  '_',
                ) + '.UTF-8',
              _: A || './this.program',
            },
            t;
          for (t in h2) h2[t] === void 0 ? delete e[t] : (e[t] = h2[t]);
          var r = [];
          for (t in e) r.push(`${t}=${e[t]}`);
          c2 = r;
        }
        return c2;
      },
      c2,
      K3 = [null, [], []],
      q3 = () => {
        if (typeof crypto == 'object' && typeof crypto.getRandomValues == 'function')
          return (e) => crypto.getRandomValues(e);
        x1('initRandomDevice');
      },
      Q2 = (e) => (Q2 = q3())(e);
    _1 = s.InternalError = class extends Error {
      constructor(e) {
        super(e), (this.name = 'InternalError');
      }
    };
    for (var e3 = Array(256), $1 = 0; 256 > $1; ++$1) e3[$1] = String.fromCharCode($1);
    (z2 = e3),
      (y = s.BindingError =
        class extends Error {
          constructor(e) {
            super(e), (this.name = 'BindingError');
          }
        }),
      Object.assign(k1.prototype, {
        isAliasOf: function (e) {
          if (!(this instanceof k1 && e instanceof k1)) return false;
          var t = this.Fa.Ia.Ga,
            r = this.Fa.Ha;
          e.Fa = e.Fa;
          var a = e.Fa.Ia.Ga;
          for (e = e.Fa.Ha; t.La; ) (r = t.Ua(r)), (t = t.La);
          for (; a.La; ) (e = a.Ua(e)), (a = a.La);
          return t === a && r === e;
        },
        clone: function () {
          if ((this.Fa.Ha || X1(this), this.Fa.Ta)) return (this.Fa.count.value += 1), this;
          var e = w1,
            t = Object,
            r = t.create,
            a = Object.getPrototypeOf(this),
            o = this.Fa;
          return (
            (e = e(
              r.call(t, a, {
                Fa: { value: { count: o.count, Ra: o.Ra, Ta: o.Ta, Ha: o.Ha, Ia: o.Ia, Ja: o.Ja, Ma: o.Ma } },
              }),
            )),
            (e.Fa.count.value += 1),
            (e.Fa.Ra = false),
            e
          );
        },
        delete() {
          if ((this.Fa.Ha || X1(this), this.Fa.Ra && !this.Fa.Ta)) throw new y('Object already scheduled for deletion');
          U2(this);
          var e = this.Fa;
          --e.count.value,
            e.count.value === 0 && (e.Ja ? e.Ma.Pa(e.Ja) : e.Ia.Ga.Pa(e.Ha)),
            this.Fa.Ta || ((this.Fa.Ja = void 0), (this.Fa.Ha = void 0));
        },
        isDeleted: function () {
          return !this.Fa.Ha;
        },
        deleteLater: function () {
          if ((this.Fa.Ha || X1(this), this.Fa.Ra && !this.Fa.Ta)) throw new y('Object already scheduled for deletion');
          return g1.push(this), g1.length === 1 && y1 && y1(Q1), (this.Fa.Ra = true), this;
        },
      }),
      (s.getInheritedInstanceCount = () => Object.keys(b1).length),
      (s.getLiveInheritedInstances = () => {
        var e = [],
          t;
        for (t in b1) b1.hasOwnProperty(t) && e.push(b1[t]);
        return e;
      }),
      (s.flushPendingDeletes = Q1),
      (s.setDelayFunction = (e) => {
        (y1 = e), g1.length && y1 && y1(Q1);
      }),
      Object.assign(M1.prototype, {
        ib(e) {
          return this.cb && (e = this.cb(e)), e;
        },
        ab(e) {
          var t;
          (t = this.Pa) == null || t.call(this, e);
        },
        Na: 8,
        readValueFromPointer: m1,
        fromWireType: function (e) {
          function t() {
            return this.Xa
              ? D1(this.Ga.Sa, { Ia: this.nb, Ha: r, Ma: this, Ja: e })
              : D1(this.Ga.Sa, { Ia: this, Ha: e });
          }
          var r = this.ib(e);
          if (!r) return this.ab(e), null;
          var a = E3(this.Ga, r);
          if (a !== void 0)
            return a.Fa.count.value === 0
              ? ((a.Fa.Ha = r), (a.Fa.Ja = e), a.clone())
              : ((a = a.clone()), this.ab(e), a);
          if (((a = this.Ga.hb(r)), (a = j2[a]), !a)) return t.call(this);
          a = this.Wa ? a.eb : a.pointerType;
          var o = H2(r, this.Ga, a.Ga);
          return o === null
            ? t.call(this)
            : this.Xa
            ? D1(a.Ga.Sa, { Ia: a, Ha: o, Ma: this, Ja: e })
            : D1(a.Ga.Sa, { Ia: a, Ha: o });
        },
      }),
      (G2 = s.UnboundTypeError =
        ((e, t) => {
          var r = L1(t, function (a) {
            (this.name = t),
              (this.message = a),
              (a = Error(a).stack),
              a !== void 0 &&
                (this.stack =
                  this.toString() +
                  `
` +
                  a.replace(/^Error(:[^\n]*)?\n/, ''));
          });
          return (
            (r.prototype = Object.create(e.prototype)),
            (r.prototype.constructor = r),
            (r.prototype.toString = function () {
              return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
            }),
            r
          );
        })(Error, 'UnboundTypeError')),
      X.push(0, 1, void 0, 1, null, 1, true, 1, false, 1),
      (s.count_emval_handles = () => X.length / 2 - 5 - r2.length);
    var Y3 = {
        c: (e, t, r, a) => {
          x1(
            `Assertion failed: ${e ? f1(T, e) : ''}, at: ` +
              [t ? (t ? f1(T, t) : '') : 'unknown filename', r, a ? (a ? f1(T, a) : '') : 'unknown function'],
          );
        },
        n: (e, t, r) => {
          var a = new L3(e);
          throw ((E[(a.Ha + 16) >> 2] = 0), (E[(a.Ha + 4) >> 2] = t), (E[(a.Ha + 8) >> 2] = r), ($2 = e), $2);
        },
        Y: () => {},
        X: () => {},
        l: function () {
          return 0;
        },
        V: () => {},
        S: () => {},
        W: function () {
          return 0;
        },
        T: () => {},
        C: function () {},
        Q: () => {},
        U: () => {},
        Z: () => {
          x1('');
        },
        w: (e) => {
          var t = R1[e];
          delete R1[e];
          var r = t.Za,
            a = t.Pa,
            o = t.bb,
            u = o.map((h) => h.lb).concat(o.map((h) => h.rb));
          Q([e], u, (h) => {
            var l = {};
            return (
              o.forEach((p, f) => {
                var v = h[f],
                  b = p.jb,
                  L = p.kb,
                  z = h[f + o.length],
                  F = p.qb,
                  S = p.sb;
                l[p.gb] = {
                  read: (q) => v.fromWireType(b(L, q)),
                  write: (q, E1) => {
                    var U = [];
                    F(S, q, z.toWireType(U, E1)), Y1(U);
                  },
                };
              }),
              [
                {
                  name: t.name,
                  fromWireType: (p) => {
                    var f = {},
                      v;
                    for (v in l) f[v] = l[v].read(p);
                    return a(p), f;
                  },
                  toWireType: (p, f) => {
                    for (var v in l) if (!(v in f)) throw new TypeError(`Missing field: "${v}"`);
                    var b = r();
                    for (v in l) l[v].write(b, f[v]);
                    return p !== null && p.push(a, b), b;
                  },
                  Na: 8,
                  readValueFromPointer: m1,
                  Oa: a,
                },
              ]
            );
          });
        },
        J: () => {},
        da: (e, t, r, a) => {
          (t = D(t)),
            G(e, {
              name: t,
              fromWireType: function (o) {
                return !!o;
              },
              toWireType: function (o, u) {
                return u ? r : a;
              },
              Na: 8,
              readValueFromPointer: function (o) {
                return this.fromWireType(T[o]);
              },
              Oa: null,
            });
        },
        t: (e, t, r, a, o, u, h, l, p, f, v, b, L) => {
          (v = D(v)), (u = O(o, u)), l && (l = O(h, l)), f && (f = O(p, f)), (L = O(b, L));
          var z = P3(v);
          e2(z, function () {
            O1(`Cannot construct ${v} due to unbound types`, [a]);
          }),
            Q([e, t, r], a ? [a] : [], (F) => {
              if (((F = F[0]), a))
                var S = F.Ga,
                  q = S.Sa;
              else q = k1.prototype;
              F = L1(v, function (...f2) {
                if (Object.getPrototypeOf(this) !== E1) throw new y("Use 'new' to construct " + v);
                if (U.Qa === void 0) throw new y(v + ' has no accessible constructor');
                var o3 = U.Qa[f2.length];
                if (o3 === void 0)
                  throw new y(
                    `Tried to invoke ctor of ${v} with invalid number of parameters (${
                      f2.length
                    }) - expected (${Object.keys(U.Qa).toString()}) parameters instead!`,
                  );
                return o3.apply(this, f2);
              });
              var E1 = Object.create(q, { constructor: { value: F } });
              F.prototype = E1;
              var U = new I3(v, F, E1, L, S, u, l, f);
              if (U.La) {
                var P1;
                (P1 = U.La).$a != null || (P1.$a = []), U.La.$a.push(U);
              }
              return (
                (S = new M1(v, U, true, false, false)),
                (P1 = new M1(v + '*', U, false, false, false)),
                (q = new M1(v + ' const*', U, false, true, false)),
                (j2[e] = { pointerType: P1, eb: q }),
                N2(z, F),
                [S, P1, q]
              );
            });
        },
        r: (e, t, r, a, o, u) => {
          var h = n2(t, r);
          (o = O(a, o)),
            Q([], [e], (l) => {
              l = l[0];
              var p = `constructor ${l.name}`;
              if ((l.Ga.Qa === void 0 && (l.Ga.Qa = []), l.Ga.Qa[t - 1] !== void 0))
                throw new y(
                  `Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${
                    l.name
                  }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
                );
              return (
                (l.Ga.Qa[t - 1] = () => {
                  O1(`Cannot construct ${l.name} due to unbound types`, h);
                }),
                Q([], h, (f) => (f.splice(1, 0, null), (l.Ga.Qa[t - 1] = i2(p, f, null, o, u)), [])),
                []
              );
            });
        },
        f: (e, t, r, a, o, u, h, l) => {
          var p = n2(r, a);
          (t = D(t)),
            (t = J2(t)),
            (u = O(o, u)),
            Q([], [e], (f) => {
              function v() {
                O1(`Cannot call ${b} due to unbound types`, p);
              }
              f = f[0];
              var b = `${f.name}.${t}`;
              t.startsWith('@@') && (t = Symbol[t.substring(2)]), l && f.Ga.ob.push(t);
              var L = f.Ga.Sa,
                z = L[t];
              return (
                z === void 0 || (z.Ka === void 0 && z.className !== f.name && z.Va === r - 2)
                  ? ((v.Va = r - 2), (v.className = f.name), (L[t] = v))
                  : (B2(L, t, b), (L[t].Ka[r - 2] = v)),
                Q(
                  [],
                  p,
                  (F) => (
                    (F = i2(b, F, f, u, h)),
                    L[t].Ka === void 0 ? ((F.Va = r - 2), (L[t] = F)) : (L[t].Ka[r - 2] = F),
                    []
                  ),
                ),
                []
              );
            });
        },
        ca: (e) => G(e, K2),
        y: (e, t, r, a) => {
          function o() {}
          (t = D(t)),
            (o.values = {}),
            G(e, {
              name: t,
              constructor: o,
              fromWireType: function (u) {
                return this.constructor.values[u];
              },
              toWireType: (u, h) => h.value,
              Na: 8,
              readValueFromPointer: D3(t, r, a),
              Oa: null,
            }),
            e2(t, o);
        },
        k: (e, t, r) => {
          var a = s2(e, 'enum');
          (t = D(t)),
            (e = a.constructor),
            (a = Object.create(a.constructor.prototype, {
              value: { value: r },
              constructor: { value: L1(`${a.name}_${t}`, function () {}) },
            })),
            (e.values[r] = a),
            (e[t] = a);
        },
        D: (e, t, r) => {
          (t = D(t)),
            G(e, {
              name: t,
              fromWireType: (a) => a,
              toWireType: (a, o) => o,
              Na: 8,
              readValueFromPointer: k3(t, r),
              Oa: null,
            });
        },
        F: (e, t, r, a, o, u) => {
          var h = n2(t, r);
          (e = D(e)),
            (e = J2(e)),
            (o = O(a, o)),
            e2(
              e,
              function () {
                O1(`Cannot call ${e} due to unbound types`, h);
              },
              t - 1,
            ),
            Q([], h, (l) => (N2(e, i2(e, [l[0], null].concat(l.slice(1)), null, o, u), t - 1), []));
        },
        m: (e, t, r, a, o) => {
          if (((t = D(t)), o === -1 && (o = 4294967295), (o = (l) => l), a === 0)) {
            var u = 32 - 8 * r;
            o = (l) => (l << u) >>> u;
          }
          var h = t.includes('unsigned')
            ? function (l, p) {
                return p >>> 0;
              }
            : function (l, p) {
                return p;
              };
          G(e, { name: t, fromWireType: o, toWireType: h, Na: 8, readValueFromPointer: O3(t, r, a !== 0), Oa: null });
        },
        h: (e, t, r) => {
          function a(u) {
            return new o(e1.buffer, E[(u + 4) >> 2], E[u >> 2]);
          }
          var o = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            t
          ];
          (r = D(r)), G(e, { name: r, fromWireType: a, Na: 8, readValueFromPointer: a }, { mb: true });
        },
        v: (e) => {
          G(e, W3);
        },
        ja: (e, t, r, a, o, u, h, l, p, f, v, b) => {
          (r = D(r)),
            (u = O(o, u)),
            (l = O(h, l)),
            (f = O(p, f)),
            (b = O(v, b)),
            Q([e], [t], (L) => ((L = L[0]), [new M1(r, L.Ga, false, false, true, L, a, u, l, f, b)]));
        },
        E: (e, t) => {
          t = D(t);
          var r = t === 'std::string';
          G(e, {
            name: t,
            fromWireType: function (a) {
              var o = E[a >> 2],
                u = a + 4;
              if (r)
                for (var h = u, l = 0; l <= o; ++l) {
                  var p = u + l;
                  if (l == o || T[p] == 0) {
                    if (((h = h ? f1(T, h, p - h) : ''), f === void 0)) var f = h;
                    else (f += '\0'), (f += h);
                    h = p + 1;
                  }
                }
              else {
                for (f = Array(o), l = 0; l < o; ++l) f[l] = String.fromCharCode(T[u + l]);
                f = f.join('');
              }
              return Z(a), f;
            },
            toWireType: function (a, o) {
              o instanceof ArrayBuffer && (o = new Uint8Array(o));
              var u,
                h = typeof o == 'string';
              if (!(h || o instanceof Uint8Array || o instanceof Uint8ClampedArray || o instanceof Int8Array))
                throw new y('Cannot pass non-string to std::string');
              if (r && h)
                for (var l = (u = 0); l < o.length; ++l) {
                  var p = o.charCodeAt(l);
                  127 >= p ? u++ : 2047 >= p ? (u += 2) : 55296 <= p && 57343 >= p ? ((u += 4), ++l) : (u += 3);
                }
              else u = o.length;
              if (((l = p2(4 + u + 1)), (p = l + 4), (E[l >> 2] = u), r && h)) v1(o, p, u + 1);
              else if (h)
                for (h = 0; h < u; ++h) {
                  var f = o.charCodeAt(h);
                  if (255 < f) throw (Z(p), new y('String has UTF-16 code units that do not fit in 8 bits'));
                  T[p + h] = f;
                }
              else for (h = 0; h < u; ++h) T[p + h] = o[h];
              return a !== null && a.push(Z, l), l;
            },
            Na: 8,
            readValueFromPointer: m1,
            Oa(a) {
              Z(a);
            },
          });
        },
        u: (e, t, r) => {
          if (((r = D(r)), t === 2))
            var a = $3,
              o = z3,
              u = U3,
              h = (l) => h1[l >> 1];
          else t === 4 && ((a = H3), (o = j3), (u = B3), (h = (l) => E[l >> 2]));
          G(e, {
            name: r,
            fromWireType: (l) => {
              for (var p = E[l >> 2], f, v = l + 4, b = 0; b <= p; ++b) {
                var L = l + 4 + b * t;
                (b == p || h(L) == 0) &&
                  ((v = a(v, L - v)), f === void 0 ? (f = v) : ((f += '\0'), (f += v)), (v = L + t));
              }
              return Z(l), f;
            },
            toWireType: (l, p) => {
              if (typeof p != 'string') throw new y(`Cannot pass non-string to C++ string type ${r}`);
              var f = u(p),
                v = p2(4 + f + t);
              return (E[v >> 2] = f / t), o(p, v + 4, f + t), l !== null && l.push(Z, v), v;
            },
            Na: 8,
            readValueFromPointer: m1,
            Oa(l) {
              Z(l);
            },
          });
        },
        x: (e, t, r, a, o, u) => {
          R1[e] = { name: D(t), Za: O(r, a), Pa: O(o, u), bb: [] };
        },
        j: (e, t, r, a, o, u, h, l, p, f) => {
          R1[e].bb.push({ gb: D(t), lb: r, jb: O(a, o), kb: u, rb: h, qb: O(l, p), sb: f });
        },
        ea: (e, t) => {
          (t = D(t)), G(e, { ub: true, name: t, Na: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        P: () => {
          (q1 = false), (l2 = 0);
        },
        K: () => {
          throw 1 / 0;
        },
        ha: (e, t, r, a) => ((e = u2[e]), (t = o2(t)), e(null, t, r, a)),
        G: a2,
        ga: (e, t, r) => {
          var a = G3(e, t),
            o = a.shift();
          e--;
          var u = Array(e);
          return (
            (t = `methodCaller<(${a.map((h) => h.name).join(', ')}) => ${o.name}>`),
            N3(
              L1(t, (h, l, p, f) => {
                for (var v = 0, b = 0; b < e; ++b) (u[b] = a[b].readValueFromPointer(f + v)), (v += a[b].Na);
                return (
                  (l = r === 1 ? V3(l, u) : l.apply(h, u)),
                  (h = []),
                  (l = o.toWireType(h, l)),
                  h.length && (E[p >> 2] = W1(h)),
                  l
                );
              }),
            )
          );
        },
        ia: (e) => {
          9 < e && (X[e + 1] += 1);
        },
        fa: (e) => {
          var t = o2(e);
          Y1(t), a2(e);
        },
        p: (e, t) => ((e = s2(e, '_emval_take_value')), (e = e.readValueFromPointer(t)), W1(e)),
        L: (e, t) => {
          if ((C1[e] && (clearTimeout(C1[e].id), delete C1[e]), !t)) return 0;
          var r = setTimeout(() => {
            delete C1[e], J3(() => n3(e, performance.now()));
          }, t);
          return (C1[e] = { id: r, wb: t }), 0;
        },
        M: (e, t, r, a) => {
          var o = /* @__PURE__ */ new Date().getFullYear(),
            u = new Date(o, 0, 1).getTimezoneOffset();
          (o = new Date(o, 6, 1).getTimezoneOffset()),
            (E[e >> 2] = 60 * Math.max(u, o)),
            (N[t >> 2] = +(u != o)),
            (t = (h) => {
              var l = Math.abs(h);
              return `UTC${0 <= h ? '-' : '+'}${String(Math.floor(l / 60)).padStart(2, '0')}${String(l % 60).padStart(
                2,
                '0',
              )}`;
            }),
            (e = t(u)),
            (t = t(o)),
            o < u ? (v1(e, r, 17), v1(t, a, 17)) : (v1(e, a, 17), v1(t, r, 17));
        },
        O: () => 2147483648,
        ka: () => performance.now(),
        N: (e) => {
          var t = T.length;
          if (((e >>>= 0), 2147483648 < e)) return false;
          for (var r = 1; 4 >= r; r *= 2) {
            var a = t * (1 + 0.2 / r);
            a = Math.min(a, e + 100663296);
            e: {
              a =
                (Math.min(2147483648, 65536 * Math.ceil(Math.max(e, a) / 65536)) - S1.buffer.byteLength + 65535) /
                65536;
              try {
                S1.grow(a), S2();
                var o = 1;
                break e;
              } catch (u) {}
              o = void 0;
            }
            if (o) return true;
          }
          return false;
        },
        $: (e, t) => {
          var r = 0;
          return (
            Z2().forEach((a, o) => {
              var u = t + r;
              for (o = E[(e + 4 * o) >> 2] = u, u = 0; u < a.length; ++u) e1[o++] = a.charCodeAt(u);
              (e1[o] = 0), (r += a.length + 1);
            }),
            0
          );
        },
        aa: (e, t) => {
          var r = Z2();
          E[e >> 2] = r.length;
          var a = 0;
          return r.forEach((o) => (a += o.length + 1)), (E[t >> 2] = a), 0;
        },
        s: () => 52,
        R: (e, t) => {
          var r = 0;
          return (
            e == 0 ? (r = 2) : (e == 1 || e == 2) && (r = 64),
            (e1[t] = 2),
            (t1[(t + 2) >> 1] = 1),
            (s1 = [
              r >>> 0,
              ((j = r),
              1 <= +Math.abs(j)
                ? 0 < j
                  ? +Math.floor(j / 4294967296) >>> 0
                  : ~~+Math.ceil((j - +(~~j >>> 0)) / 4294967296) >>> 0
                : 0),
            ]),
            (N[(t + 8) >> 2] = s1[0]),
            (N[(t + 12) >> 2] = s1[1]),
            (s1 = [
              0,
              ((j = 0),
              1 <= +Math.abs(j)
                ? 0 < j
                  ? +Math.floor(j / 4294967296) >>> 0
                  : ~~+Math.ceil((j - +(~~j >>> 0)) / 4294967296) >>> 0
                : 0),
            ]),
            (N[(t + 16) >> 2] = s1[0]),
            (N[(t + 20) >> 2] = s1[1]),
            0
          );
        },
        B: () => 52,
        I: function () {
          return 70;
        },
        A: (e, t, r, a) => {
          for (var o = 0, u = 0; u < r; u++) {
            var h = E[t >> 2],
              l = E[(t + 4) >> 2];
            t += 8;
            for (var p = 0; p < l; p++) {
              var f = e,
                v = T[h + p],
                b = K3[f];
              v === 0 || v === 10 ? ((f === 1 ? I1 : o1)(f1(b, 0)), (b.length = 0)) : b.push(v);
            }
            o += l;
          }
          return (E[a >> 2] = o), 0;
        },
        ba: (e, t) => (Q2(T.subarray(e, e + t)), 0),
        i: t0,
        d: e0,
        e: Q3,
        q: n0,
        z: a0,
        b: X3,
        a: Z3,
        g: r0,
        o: i0,
        H: o0,
        _: X2,
      },
      P = (function () {
        var r;
        function e(a) {
          var o;
          return (
            (P = a.exports),
            (S1 = P.la),
            S2(),
            (B = P.pa),
            x2.unshift(P.ma),
            n1--,
            (o = s.monitorRunDependencies) == null || o.call(s, n1),
            n1 == 0 && c1 && ((a = c1), (c1 = null), a()),
            P
          );
        }
        var t = { a: Y3 };
        if ((n1++, (r = s.monitorRunDependencies) == null || r.call(s, n1), s.instantiateWasm))
          try {
            return s.instantiateWasm(t, e);
          } catch (a) {
            o1(`Module.instantiateWasm callback failed with error: ${a}`), w(a);
          }
        return (
          p1 != null ||
            (p1 = A2('DotLottiePlayer.wasm')
              ? 'DotLottiePlayer.wasm'
              : s.locateFile
              ? s.locateFile('DotLottiePlayer.wasm', H)
              : H + 'DotLottiePlayer.wasm'),
          w3(t, function (a) {
            e(a.instance);
          }).catch(w),
          {}
        );
      })(),
      p2 = (e) => (p2 = P.na)(e),
      t3 = (e) => (t3 = P.oa)(e),
      Z = (e) => (Z = P.qa)(e),
      n3 = (e, t) => (n3 = P.ra)(e, t),
      V = (e, t) => (V = P.sa)(e, t),
      J = (e) => (J = P.ta)(e),
      K = () => (K = P.ua)();
    (s.dynCall_iijj = (e, t, r, a, o, u) => (s.dynCall_iijj = P.va)(e, t, r, a, o, u)),
      (s.dynCall_vijj = (e, t, r, a, o, u) => (s.dynCall_vijj = P.wa)(e, t, r, a, o, u)),
      (s.dynCall_jiii = (e, t, r, a) => (s.dynCall_jiii = P.xa)(e, t, r, a)),
      (s.dynCall_jii = (e, t, r) => (s.dynCall_jii = P.ya)(e, t, r));
    var i3 = (s.dynCall_vijjj = (e, t, r, a, o, u, h, l) => (i3 = s.dynCall_vijjj = P.za)(e, t, r, a, o, u, h, l));
    (s.dynCall_jiji = (e, t, r, a, o) => (s.dynCall_jiji = P.Aa)(e, t, r, a, o)),
      (s.dynCall_viijii = (e, t, r, a, o, u, h) => (s.dynCall_viijii = P.Ba)(e, t, r, a, o, u, h)),
      (s.dynCall_iiiiij = (e, t, r, a, o, u, h) => (s.dynCall_iiiiij = P.Ca)(e, t, r, a, o, u, h)),
      (s.dynCall_iiiiijj = (e, t, r, a, o, u, h, l, p) => (s.dynCall_iiiiijj = P.Da)(e, t, r, a, o, u, h, l, p)),
      (s.dynCall_iiiiiijj = (e, t, r, a, o, u, h, l, p, f) =>
        (s.dynCall_iiiiiijj = P.Ea)(e, t, r, a, o, u, h, l, p, f));
    function X3(e, t) {
      var r = K();
      try {
        B.get(e)(t);
      } catch (a) {
        if ((J(r), a !== a + 0)) throw a;
        V(1, 0);
      }
    }
    function Z3(e, t, r) {
      var a = K();
      try {
        B.get(e)(t, r);
      } catch (o) {
        if ((J(a), o !== o + 0)) throw o;
        V(1, 0);
      }
    }
    function Q3(e, t, r, a) {
      var o = K();
      try {
        return B.get(e)(t, r, a);
      } catch (u) {
        if ((J(o), u !== u + 0)) throw u;
        V(1, 0);
      }
    }
    function e0(e, t, r) {
      var a = K();
      try {
        return B.get(e)(t, r);
      } catch (o) {
        if ((J(a), o !== o + 0)) throw o;
        V(1, 0);
      }
    }
    function t0(e, t) {
      var r = K();
      try {
        return B.get(e)(t);
      } catch (a) {
        if ((J(r), a !== a + 0)) throw a;
        V(1, 0);
      }
    }
    function n0(e, t, r, a, o, u) {
      var h = K();
      try {
        return B.get(e)(t, r, a, o, u);
      } catch (l) {
        if ((J(h), l !== l + 0)) throw l;
        V(1, 0);
      }
    }
    function i0(e, t, r, a, o) {
      var u = K();
      try {
        B.get(e)(t, r, a, o);
      } catch (h) {
        if ((J(u), h !== h + 0)) throw h;
        V(1, 0);
      }
    }
    function r0(e, t, r, a) {
      var o = K();
      try {
        B.get(e)(t, r, a);
      } catch (u) {
        if ((J(o), u !== u + 0)) throw u;
        V(1, 0);
      }
    }
    function a0(e) {
      var t = K();
      try {
        B.get(e)();
      } catch (r) {
        if ((J(t), r !== r + 0)) throw r;
        V(1, 0);
      }
    }
    function o0(e, t, r, a, o, u, h, l) {
      var p = K();
      try {
        i3(e, t, r, a, o, u, h, l);
      } catch (f) {
        if ((J(p), f !== f + 0)) throw f;
        V(1, 0);
      }
    }
    var z1;
    c1 = function e() {
      z1 || r3(), z1 || (c1 = e);
    };
    function r3() {
      function e() {
        var r;
        if (!z1 && ((z1 = true), (s.calledRun = true), !T1)) {
          if ((K1(x2), m(s), (r = s.onRuntimeInitialized) == null || r.call(s), s.postRun))
            for (typeof s.postRun == 'function' && (s.postRun = [s.postRun]); s.postRun.length; ) {
              var t = s.postRun.shift();
              R2.unshift(t);
            }
          K1(R2);
        }
      }
      if (!(0 < n1)) {
        if (s.preRun) for (typeof s.preRun == 'function' && (s.preRun = [s.preRun]); s.preRun.length; ) y3();
        K1(T2),
          0 < n1 ||
            (s.setStatus
              ? (s.setStatus('Running...'),
                setTimeout(() => {
                  setTimeout(() => s.setStatus(''), 1), e();
                }, 1))
              : e());
      }
    }
    if (s.preInit)
      for (typeof s.preInit == 'function' && (s.preInit = [s.preInit]); 0 < s.preInit.length; ) s.preInit.pop()();
    return r3(), (d = C), d;
  };
})();
var h3 = l0;
var r1 = class {
  constructor() {
    throw new Error('RendererLoader is a static class and cannot be instantiated.');
  }
  static _tryLoad(n) {
    return g(this, null, function* () {
      return yield h3({ locateFile: () => n });
    });
  }
  static _loadWithBackup() {
    return g(this, null, function* () {
      return (
        this._ModulePromise ||
          (this._ModulePromise = this._tryLoad(this._wasmURL).catch((n) =>
            g(this, null, function* () {
              let i = `https://unpkg.com/${y2}@${g2}/dist/dotlottie-player.wasm`;
              console.warn(`Primary WASM load failed from ${this._wasmURL}. Error: ${n.message}`),
                console.warn(`Attempting to load WASM from backup URL: ${i}`);
              try {
                return yield this._tryLoad(i);
              } catch (d) {
                throw (
                  (console.error(`Primary WASM URL failed: ${n.message}`),
                  console.error(`Backup WASM URL failed: ${d.message}`),
                  new Error('WASM loading failed from all sources.'))
                );
              }
            }),
          )),
        this._ModulePromise
      );
    });
  }
  static load() {
    return g(this, null, function* () {
      return this._loadWithBackup();
    });
  }
  static setWasmUrl(n) {
    (this._wasmURL = n), (this._ModulePromise = null);
  }
};
_(r1, '_ModulePromise', null), _(r1, '_wasmURL', `https://cdn.jsdelivr.net/npm/${y2}@${g2}/dist/dotlottie-player.wasm`);
var u1 = class {
  constructor() {
    _(this, '_eventListeners', /* @__PURE__ */ new Map());
  }
  addEventListener(n, i) {
    let d = this._eventListeners.get(n);
    d || ((d = /* @__PURE__ */ new Set()), this._eventListeners.set(n, d)), d.add(i);
  }
  removeEventListener(n, i) {
    let d = this._eventListeners.get(n);
    d && (i ? (d.delete(i), d.size === 0 && this._eventListeners.delete(n)) : this._eventListeners.delete(n));
  }
  dispatch(n) {
    let i = this._eventListeners.get(n.type);
    i == null || i.forEach((d) => d(n));
  }
  removeAllEventListeners() {
    this._eventListeners.clear();
  }
};
var W = class {
  static _initializeObserver() {
    if (this._observer) return;
    let n = (i) => {
      i.forEach((d) => {
        let s = this._observedCanvases.get(d.target);
        s && (d.isIntersecting ? s.unfreeze() : s.freeze());
      });
    };
    this._observer = new IntersectionObserver(n, { threshold: 0 });
  }
  static observe(n, i) {
    var d;
    this._initializeObserver(),
      !this._observedCanvases.has(n) &&
        (this._observedCanvases.set(n, i), (d = this._observer) == null || d.observe(n));
  }
  static unobserve(n) {
    var i, d;
    (i = this._observer) == null || i.unobserve(n),
      this._observedCanvases.delete(n),
      this._observedCanvases.size === 0 && ((d = this._observer) == null || d.disconnect(), (this._observer = null));
  }
};
_(W, '_observer', null), _(W, '_observedCanvases', /* @__PURE__ */ new Map());
var $ = class {
  static _initializeObserver() {
    if (this._observer) return;
    let n = (i) => {
      i.forEach((d) => {
        let s = this._observedCanvases.get(d.target);
        if (!s) return;
        let [m, w] = s;
        clearTimeout(w);
        let C = setTimeout(() => {
          m.resize();
        }, 100);
        this._observedCanvases.set(d.target, [m, C]);
      });
    };
    this._observer = new ResizeObserver(n);
  }
  static observe(n, i) {
    var d;
    this._initializeObserver(),
      !this._observedCanvases.has(n) &&
        (this._observedCanvases.set(n, [i, 0]), (d = this._observer) == null || d.observe(n));
  }
  static unobserve(n) {
    var i, d;
    (i = this._observer) == null || i.unobserve(n),
      this._observedCanvases.delete(n),
      this._observedCanvases.size === 0 && ((d = this._observer) == null || d.disconnect(), (this._observer = null));
  }
};
_($, '_observer', null), _($, '_observedCanvases', /* @__PURE__ */ new Map());
function h0(c) {
  return /^#([\da-f]{6}|[\da-f]{8})$/iu.test(c);
}
function p3(c) {
  if (!h0(c)) return 0;
  let n = c.replace('#', '');
  return (n = n.length === 6 ? `${n}ff` : n), parseInt(n, 16);
}
function b2(c) {
  if (c.byteLength < 4) return false;
  let n = new Uint8Array(c.slice(0, B1.byteLength));
  for (let i = 0; i < B1.length; i += 1) if (B1[i] !== n[i]) return false;
  return true;
}
function c3(c) {
  return u3.every((n) => Object.prototype.hasOwnProperty.call(c, n));
}
function w2(c) {
  if (typeof c == 'string')
    try {
      return c3(JSON.parse(c));
    } catch (n) {
      return false;
    }
  else return c3(c);
}
function a1() {
  return 1 + ((R ? window.devicePixelRatio : 1) - 1) * l3;
}
function N1(c) {
  let n = c.getBoundingClientRect();
  return (
    n.top >= 0 &&
    n.left >= 0 &&
    n.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    n.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
var L2 = (c, n) =>
  c === 'reverse'
    ? n.Mode.Reverse
    : c === 'bounce'
    ? n.Mode.Bounce
    : c === 'reverse-bounce'
    ? n.Mode.ReverseBounce
    : n.Mode.Forward;
var M2 = (c, n) =>
  c === 'contain'
    ? n.Fit.Contain
    : c === 'cover'
    ? n.Fit.Cover
    : c === 'fill'
    ? n.Fit.Fill
    : c === 'fit-height'
    ? n.Fit.FitHeight
    : c === 'fit-width'
    ? n.Fit.FitWidth
    : n.Fit.None;
var C2 = (c, n) => {
  let i = new n.VectorFloat();
  return i.push_back(c[0]), i.push_back(c[1]), i;
};
var E2 = (c, n) => {
  let i = new n.VectorFloat();
  return c.length !== 2 || (i.push_back(c[0]), i.push_back(c[1])), i;
};
var M = class M3 {
  constructor(n) {
    _(this, '_canvas');
    _(this, '_context', null);
    _(this, '_eventManager');
    _(this, '_animationFrameId', null);
    _(this, '_frameManager');
    _(this, '_dotLottieCore', null);
    _(this, '_renderConfig', {});
    _(this, '_isFrozen', false);
    _(this, '_backgroundColor', null);
    _(this, '_pointerUpMethod');
    _(this, '_pointerDownMethod');
    _(this, '_pointerMoveMethod');
    _(this, '_pointerEnterMethod');
    _(this, '_pointerExitMethod');
    var i, d, s;
    (this._canvas = n.canvas),
      (this._context = this._canvas.getContext('2d')),
      (this._eventManager = new u1()),
      (this._frameManager = new j1()),
      (this._renderConfig = k(x({}, n.renderConfig), {
        devicePixelRatio: ((i = n.renderConfig) == null ? void 0 : i.devicePixelRatio) || a1(),
        freezeOnOffscreen: (s = (d = n.renderConfig) == null ? void 0 : d.freezeOnOffscreen) != null ? s : true,
      })),
      r1
        .load()
        .then((m) => {
          var w, C, I, A, H, l1, I1;
          (M3._wasmModule = m),
            (this._dotLottieCore = new m.DotLottiePlayer({
              autoplay: (w = n.autoplay) != null ? w : false,
              backgroundColor: 0,
              loopAnimation: (C = n.loop) != null ? C : false,
              mode: L2((I = n.mode) != null ? I : 'forward', m),
              segment: E2((A = n.segment) != null ? A : [], m),
              speed: (H = n.speed) != null ? H : 1,
              useFrameInterpolation: (l1 = n.useFrameInterpolation) != null ? l1 : true,
              marker: (I1 = n.marker) != null ? I1 : '',
              layout: n.layout ? { align: C2(n.layout.align, m), fit: M2(n.layout.fit, m) } : m.createDefaultLayout(),
            })),
            this._eventManager.dispatch({ type: 'ready' }),
            n.data ? this._loadFromData(n.data) : n.src && this._loadFromSrc(n.src),
            n.backgroundColor && this.setBackgroundColor(n.backgroundColor);
        })
        .catch((m) => {
          this._eventManager.dispatch({ type: 'loadError', error: new Error(`Failed to load wasm module: ${m}`) });
        }),
      (this._pointerUpMethod = this._onPointerUp.bind(this)),
      (this._pointerDownMethod = this._onPointerDown.bind(this)),
      (this._pointerMoveMethod = this._onPointerMove.bind(this)),
      (this._pointerEnterMethod = this._onPointerEnter.bind(this)),
      (this._pointerExitMethod = this._onPointerLeave.bind(this));
  }
  _dispatchError(n) {
    console.error(n), this._eventManager.dispatch({ type: 'loadError', error: new Error(n) });
  }
  _fetchData(n) {
    return g(this, null, function* () {
      let i = yield fetch(n);
      if (!i.ok) throw new Error(`Failed to fetch animation data from URL: ${n}. ${i.status}: ${i.statusText}`);
      let d = yield i.arrayBuffer();
      return b2(d) ? d : new TextDecoder().decode(d);
    });
  }
  _loadFromData(n) {
    if (this._dotLottieCore === null) return;
    let i = this._canvas.width,
      d = this._canvas.height,
      s = false;
    if (typeof n == 'string') {
      if (!w2(n)) {
        this._dispatchError(
          'Invalid Lottie JSON string: The provided string does not conform to the Lottie JSON format.',
        );
        return;
      }
      s = this._dotLottieCore.loadAnimationData(n, i, d);
    } else if (n instanceof ArrayBuffer) {
      if (!b2(n)) {
        this._dispatchError(
          'Invalid dotLottie ArrayBuffer: The provided ArrayBuffer does not conform to the dotLottie format.',
        );
        return;
      }
      s = this._dotLottieCore.loadDotLottieData(n, i, d);
    } else if (typeof n == 'object') {
      if (!w2(n)) {
        this._dispatchError(
          'Invalid Lottie JSON object: The provided object does not conform to the Lottie JSON format.',
        );
        return;
      }
      s = this._dotLottieCore.loadAnimationData(JSON.stringify(n), i, d);
    } else {
      this._dispatchError(`Unsupported data type for animation data. Expected: 
          - string (Lottie JSON),
          - ArrayBuffer (dotLottie),
          - object (Lottie JSON). 
          Received: ${typeof n}`);
      return;
    }
    s
      ? (this._eventManager.dispatch({ type: 'load' }),
        R && this.resize(),
        this._eventManager.dispatch({ type: 'frame', currentFrame: this._dotLottieCore.currentFrame() }),
        this._render(),
        this._dotLottieCore.config().autoplay &&
          (this._dotLottieCore.play(),
          this._dotLottieCore.isPlaying()
            ? (this._eventManager.dispatch({ type: 'play' }),
              (this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this))))
            : console.error('something went wrong, the animation was suppose to autoplay')),
        R &&
          this._canvas instanceof HTMLCanvasElement &&
          (this._renderConfig.freezeOnOffscreen && W.observe(this._canvas, this),
          this._renderConfig.autoResize && $.observe(this._canvas, this)))
      : this._dispatchError('Failed to load animation data');
  }
  _loadFromSrc(n) {
    this._fetchData(n)
      .then((i) => this._loadFromData(i))
      .catch((i) => this._dispatchError(`Failed to load animation data from URL: ${n}. ${i}`));
  }
  get activeAnimationId() {
    var n;
    return (n = this._dotLottieCore) == null ? void 0 : n.activeAnimationId();
  }
  get activeThemeId() {
    var n;
    return (n = this._dotLottieCore) == null ? void 0 : n.activeThemeId();
  }
  get layout() {
    var i;
    let n = (i = this._dotLottieCore) == null ? void 0 : i.config().layout;
    if (n)
      return {
        align: [n.align.get(0), n.align.get(1)],
        fit: (() => {
          var d, s, m, w, C, I;
          switch (n.fit) {
            case (d = M3._wasmModule) == null ? void 0 : d.Fit.Contain:
              return 'contain';
            case (s = M3._wasmModule) == null ? void 0 : s.Fit.Cover:
              return 'cover';
            case (m = M3._wasmModule) == null ? void 0 : m.Fit.Fill:
              return 'fill';
            case (w = M3._wasmModule) == null ? void 0 : w.Fit.FitHeight:
              return 'fit-height';
            case (C = M3._wasmModule) == null ? void 0 : C.Fit.FitWidth:
              return 'fit-width';
            case (I = M3._wasmModule) == null ? void 0 : I.Fit.None:
              return 'none';
            default:
              return 'contain';
          }
        })(),
      };
  }
  get marker() {
    var i;
    return (i = this._dotLottieCore) == null ? void 0 : i.config().marker;
  }
  get manifest() {
    var n;
    try {
      let i = (n = this._dotLottieCore) == null ? void 0 : n.manifestString();
      if (this._dotLottieCore === null || !i) return null;
      let d = JSON.parse(i);
      return Object.keys(d).length === 0 ? null : d;
    } catch (i) {
      return null;
    }
  }
  get renderConfig() {
    return this._renderConfig;
  }
  get segment() {
    var i;
    let n = (i = this._dotLottieCore) == null ? void 0 : i.config().segment;
    if (n && n.size() === 2) return [n.get(0), n.get(1)];
  }
  get loop() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.config().loopAnimation) != null ? i : false;
  }
  get mode() {
    var i, d, s, m;
    let n = (i = this._dotLottieCore) == null ? void 0 : i.config().mode;
    return n === ((d = M3._wasmModule) == null ? void 0 : d.Mode.Reverse)
      ? 'reverse'
      : n === ((s = M3._wasmModule) == null ? void 0 : s.Mode.Bounce)
      ? 'bounce'
      : n === ((m = M3._wasmModule) == null ? void 0 : m.Mode.ReverseBounce)
      ? 'reverse-bounce'
      : 'forward';
  }
  get isFrozen() {
    return this._isFrozen;
  }
  get backgroundColor() {
    var n;
    return (n = this._backgroundColor) != null ? n : '';
  }
  get autoplay() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.config().autoplay) != null ? i : false;
  }
  get useFrameInterpolation() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.config().useFrameInterpolation) != null ? i : false;
  }
  get speed() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.config().speed) != null ? i : 0;
  }
  get isReady() {
    return this._dotLottieCore !== null;
  }
  get isLoaded() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.isLoaded()) != null ? i : false;
  }
  get isPlaying() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.isPlaying()) != null ? i : false;
  }
  get isPaused() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.isPaused()) != null ? i : false;
  }
  get isStopped() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.isStopped()) != null ? i : false;
  }
  get currentFrame() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.currentFrame()) != null ? i : 0;
  }
  get loopCount() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.loopCount()) != null ? i : 0;
  }
  get totalFrames() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.totalFrames()) != null ? i : 0;
  }
  get duration() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.duration()) != null ? i : 0;
  }
  get segmentDuration() {
    var n, i;
    return (i = (n = this._dotLottieCore) == null ? void 0 : n.segmentDuration()) != null ? i : 0;
  }
  get canvas() {
    return this._canvas;
  }
  load(n) {
    var i, d, s, m, w, C, I, A;
    this._dotLottieCore === null ||
      M3._wasmModule === null ||
      (this._dotLottieCore.setConfig({
        autoplay: (i = n.autoplay) != null ? i : false,
        backgroundColor: 0,
        loopAnimation: (d = n.loop) != null ? d : false,
        mode: L2((s = n.mode) != null ? s : 'forward', M3._wasmModule),
        segment: E2((m = n.segment) != null ? m : [], M3._wasmModule),
        speed: (w = n.speed) != null ? w : 1,
        useFrameInterpolation: (C = n.useFrameInterpolation) != null ? C : true,
        marker: (I = n.marker) != null ? I : '',
        layout: n.layout
          ? { align: C2(n.layout.align, M3._wasmModule), fit: M2(n.layout.fit, M3._wasmModule) }
          : M3._wasmModule.createDefaultLayout(),
      }),
      n.data ? this._loadFromData(n.data) : n.src && this._loadFromSrc(n.src),
      this.setBackgroundColor((A = n.backgroundColor) != null ? A : ''));
  }
  _render() {
    if (this._dotLottieCore === null || this._context === null) return false;
    if (this._dotLottieCore.render()) {
      let i = this._dotLottieCore.buffer(),
        d = new Uint8ClampedArray(i, 0, this._canvas.width * this._canvas.height * 4),
        s = null;
      return (
        typeof ImageData == 'undefined'
          ? ((s = this._context.createImageData(this._canvas.width, this._canvas.height)), s.data.set(d))
          : (s = new ImageData(d, this._canvas.width, this._canvas.height)),
        this._context.putImageData(s, 0, 0),
        this._eventManager.dispatch({ type: 'render', currentFrame: this._dotLottieCore.currentFrame() }),
        true
      );
    }
    return false;
  }
  _draw() {
    if (this._dotLottieCore === null || this._context === null || !this._dotLottieCore.isPlaying()) return;
    let n = this._dotLottieCore.requestFrame();
    this._dotLottieCore.setFrame(n) &&
      (this._eventManager.dispatch({ type: 'frame', currentFrame: this._dotLottieCore.currentFrame() }),
      this._render() &&
        this._dotLottieCore.isComplete() &&
        (this._dotLottieCore.config().loopAnimation
          ? this._eventManager.dispatch({ type: 'loop', loopCount: this._dotLottieCore.loopCount() })
          : this._eventManager.dispatch({ type: 'complete' }))),
      (this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this)));
  }
  play() {
    if (this._dotLottieCore === null) return;
    (this._dotLottieCore.play() || this._dotLottieCore.isPlaying()) &&
      ((this._isFrozen = false),
      this._eventManager.dispatch({ type: 'play' }),
      (this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this)))),
      R &&
        this._canvas instanceof HTMLCanvasElement &&
        this._renderConfig.freezeOnOffscreen &&
        !N1(this._canvas) &&
        this.freeze();
  }
  pause() {
    if (this._dotLottieCore === null) return;
    (this._dotLottieCore.pause() || this._dotLottieCore.isPaused()) && this._eventManager.dispatch({ type: 'pause' });
  }
  stop() {
    if (this._dotLottieCore === null) return;
    this._dotLottieCore.stop() &&
      (this._eventManager.dispatch({ type: 'frame', currentFrame: this._dotLottieCore.currentFrame() }),
      this._render(),
      this._eventManager.dispatch({ type: 'stop' }));
  }
  setFrame(n) {
    if (this._dotLottieCore === null || n < 0 || n > this._dotLottieCore.totalFrames()) return;
    this._dotLottieCore.seek(n) &&
      (this._eventManager.dispatch({ type: 'frame', currentFrame: this._dotLottieCore.currentFrame() }),
      this._render());
  }
  setSpeed(n) {
    this._dotLottieCore !== null && this._dotLottieCore.setConfig(k(x({}, this._dotLottieCore.config()), { speed: n }));
  }
  setBackgroundColor(n) {
    this._dotLottieCore !== null &&
      (R && this._canvas instanceof HTMLCanvasElement
        ? (this._canvas.style.backgroundColor = n)
        : this._dotLottieCore.setConfig(k(x({}, this._dotLottieCore.config()), { backgroundColor: p3(n) })),
      (this._backgroundColor = n));
  }
  setLoop(n) {
    this._dotLottieCore !== null &&
      this._dotLottieCore.setConfig(k(x({}, this._dotLottieCore.config()), { loopAnimation: n }));
  }
  setUseFrameInterpolation(n) {
    this._dotLottieCore !== null &&
      this._dotLottieCore.setConfig(k(x({}, this._dotLottieCore.config()), { useFrameInterpolation: n }));
  }
  addEventListener(n, i) {
    this._eventManager.addEventListener(n, i);
  }
  removeEventListener(n, i) {
    this._eventManager.removeEventListener(n, i);
  }
  destroy() {
    var n;
    R && this._canvas instanceof HTMLCanvasElement && (W.unobserve(this._canvas), $.unobserve(this._canvas)),
      (n = this._dotLottieCore) == null || n.delete(),
      (this._dotLottieCore = null),
      (this._context = null),
      this._eventManager.dispatch({ type: 'destroy' }),
      this._eventManager.removeAllEventListeners(),
      this._cleanupStateMachineListeners();
  }
  freeze() {
    this._animationFrameId !== null &&
      (this._frameManager.cancelAnimationFrame(this._animationFrameId),
      (this._animationFrameId = null),
      (this._isFrozen = true),
      this._eventManager.dispatch({ type: 'freeze' }));
  }
  unfreeze() {
    this._animationFrameId === null &&
      ((this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this))),
      (this._isFrozen = false),
      this._eventManager.dispatch({ type: 'unfreeze' }));
  }
  resize() {
    if (!this._dotLottieCore || !this.isLoaded) return;
    if (R && this._canvas instanceof HTMLCanvasElement) {
      let i = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1,
        { height: d, width: s } = this._canvas.getBoundingClientRect();
      (this._canvas.width = s * i), (this._canvas.height = d * i);
    }
    this._dotLottieCore.resize(this._canvas.width, this._canvas.height) && this._render();
  }
  setSegment(n, i) {
    this._dotLottieCore === null ||
      M3._wasmModule === null ||
      this._dotLottieCore.setConfig(k(x({}, this._dotLottieCore.config()), { segment: E2([n, i], M3._wasmModule) }));
  }
  setMode(n) {
    this._dotLottieCore === null ||
      M3._wasmModule === null ||
      this._dotLottieCore.setConfig(k(x({}, this._dotLottieCore.config()), { mode: L2(n, M3._wasmModule) }));
  }
  setRenderConfig(n) {
    let m = n,
      { devicePixelRatio: i, freezeOnOffscreen: d } = m,
      s = H1(m, ['devicePixelRatio', 'freezeOnOffscreen']);
    (this._renderConfig = k(x(x({}, this._renderConfig), s), {
      devicePixelRatio: i || a1(),
      freezeOnOffscreen: d != null ? d : true,
    })),
      R &&
        this._canvas instanceof HTMLCanvasElement &&
        (this._renderConfig.autoResize ? $.observe(this._canvas, this) : $.unobserve(this._canvas),
        this._renderConfig.freezeOnOffscreen
          ? W.observe(this._canvas, this)
          : (W.unobserve(this._canvas), this._isFrozen && this.unfreeze()));
  }
  loadAnimation(n) {
    if (this._dotLottieCore === null || this._dotLottieCore.activeAnimationId() === n) return;
    this._dotLottieCore.loadAnimation(n, this._canvas.width, this._canvas.height)
      ? (this._eventManager.dispatch({ type: 'load' }), this.resize())
      : this._eventManager.dispatch({ type: 'loadError', error: new Error(`Failed to animation :${n}`) });
  }
  setMarker(n) {
    this._dotLottieCore !== null &&
      this._dotLottieCore.setConfig(k(x({}, this._dotLottieCore.config()), { marker: n }));
  }
  markers() {
    var i;
    let n = (i = this._dotLottieCore) == null ? void 0 : i.markers();
    if (n) {
      let d = [];
      for (let s = 0; s < n.size(); s += 1) {
        let m = n.get(s);
        d.push({ name: m.name, time: m.time, duration: m.duration });
      }
      return d;
    }
    return [];
  }
  setTheme(n) {
    if (this._dotLottieCore === null) return false;
    let i = this._dotLottieCore.loadTheme(n);
    return this._render(), i;
  }
  resetTheme() {
    return this._dotLottieCore === null, false;
  }
  setThemeData(n) {
    if (this._dotLottieCore === null) return false;
    let i = this._dotLottieCore.loadThemeData(n);
    return this._render(), i;
  }
  setSlots(n) {}
  setLayout(n) {
    this._dotLottieCore === null ||
      M3._wasmModule === null ||
      this._dotLottieCore.setConfig(
        k(x({}, this._dotLottieCore.config()), {
          layout: { align: C2(n.align, M3._wasmModule), fit: M2(n.fit, M3._wasmModule) },
        }),
      );
  }
  setViewport(n, i, d, s) {
    return this._dotLottieCore === null ? false : this._dotLottieCore.setViewport(n, i, d, s);
  }
  static setWasmUrl(n) {
    r1.setWasmUrl(n);
  }
  loadStateMachine(n) {
    var i, d;
    return (d = (i = this._dotLottieCore) == null ? void 0 : i.stateMachineLoad(n)) != null ? d : false;
  }
  startStateMachine() {
    var i, d;
    let n = (d = (i = this._dotLottieCore) == null ? void 0 : i.stateMachineStart()) != null ? d : false;
    return n && (this._setupStateMachineListeners(), this.isPlaying && this.play()), n;
  }
  stopStateMachine() {
    var i, d;
    let n = (d = (i = this._dotLottieCore) == null ? void 0 : i.stateMachineStop()) != null ? d : false;
    return n && this._cleanupStateMachineListeners(), n;
  }
  _getPointerPosition(n) {
    let i = this._canvas.getBoundingClientRect(),
      d = this._canvas.width / i.width,
      s = this._canvas.height / i.height,
      m = (n.clientX - i.left) * d,
      w = (n.clientY - i.top) * s;
    return { x: m, y: w };
  }
  _onPointerUp(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this.postPointerUpEvent(i, d);
  }
  _onPointerDown(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this.postPointerDownEvent(i, d), this.play();
  }
  _onPointerMove(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this.postPointerMoveEvent(i, d);
  }
  _onPointerEnter(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this.postPointerEnterEvent(i, d);
  }
  _onPointerLeave(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this.postPointerExitEvent(i, d);
  }
  postPointerDownEvent(n, i) {
    var d;
    return (d = this._dotLottieCore) == null ? void 0 : d.stateMachinePostPointerDownEvent(n, i);
  }
  postPointerUpEvent(n, i) {
    var d;
    return (d = this._dotLottieCore) == null ? void 0 : d.stateMachinePostPointerUpEvent(n, i);
  }
  postPointerMoveEvent(n, i) {
    var d;
    return (d = this._dotLottieCore) == null ? void 0 : d.stateMachinePostPointerMoveEvent(n, i);
  }
  postPointerEnterEvent(n, i) {
    var d;
    return (d = this._dotLottieCore) == null ? void 0 : d.stateMachinePostPointerEnterEvent(n, i);
  }
  postPointerExitEvent(n, i) {
    var d;
    return (d = this._dotLottieCore) == null ? void 0 : d.stateMachinePostPointerExitEvent(n, i);
  }
  getStateMachineListeners() {
    if (!this._dotLottieCore) return [];
    let n = this._dotLottieCore.stateMachineFrameworkSetup(),
      i = [];
    for (let d = 0; d < n.size(); d += 1) i.push(n.get(d));
    return i;
  }
  _setupStateMachineListeners() {
    if (R && this._canvas instanceof HTMLCanvasElement && this._dotLottieCore !== null && this.isLoaded) {
      let n = this.getStateMachineListeners();
      n.includes('PointerUp') && this._canvas.addEventListener('pointerup', this._pointerUpMethod),
        n.includes('PointerDown') && this._canvas.addEventListener('pointerdown', this._pointerDownMethod),
        n.includes('PointerMove') && this._canvas.addEventListener('pointermove', this._pointerMoveMethod),
        n.includes('PointerEnter') && this._canvas.addEventListener('pointerenter', this._pointerEnterMethod),
        n.includes('PointerExit') && this._canvas.addEventListener('pointerleave', this._pointerExitMethod);
    }
  }
  _cleanupStateMachineListeners() {
    R &&
      this._canvas instanceof HTMLCanvasElement &&
      (this._canvas.removeEventListener('pointerup', this._pointerUpMethod),
      this._canvas.removeEventListener('pointerdown', this._pointerDownMethod),
      this._canvas.removeEventListener('pointermove', this._pointerMoveMethod),
      this._canvas.removeEventListener('pointerenter', this._pointerEnterMethod),
      this._canvas.removeEventListener('pointerleave', this._pointerExitMethod));
  }
  loadStateMachineData(n) {
    var i, d;
    return (d = (i = this._dotLottieCore) == null ? void 0 : i.stateMachineLoadData(n)) != null ? d : false;
  }
  animationSize() {
    var d, s, m, w;
    let n = (s = (d = this._dotLottieCore) == null ? void 0 : d.animationSize().get(0)) != null ? s : 0,
      i = (w = (m = this._dotLottieCore) == null ? void 0 : m.animationSize().get(1)) != null ? w : 0;
    return { width: n, height: i };
  }
  setStateMachineBooleanContext(n, i) {
    var d, s;
    return (s = (d = this._dotLottieCore) == null ? void 0 : d.stateMachineSetBooleanTrigger(n, i)) != null ? s : false;
  }
  setStateMachineNumericContext(n, i) {
    var d, s;
    return (s = (d = this._dotLottieCore) == null ? void 0 : d.stateMachineSetNumericTrigger(n, i)) != null ? s : false;
  }
  setStateMachineStringContext(n, i) {
    var d, s;
    return (s = (d = this._dotLottieCore) == null ? void 0 : d.stateMachineSetStringTrigger(n, i)) != null ? s : false;
  }
  getLayerBoundingBox(n) {
    var C;
    let i = (C = this._dotLottieCore) == null ? void 0 : C.getLayerBounds(n);
    if (!i || i.size() !== 4) return;
    let d = i.get(0),
      s = i.get(1),
      m = i.get(2),
      w = i.get(3);
    return { x: d, y: s, width: m, height: w };
  }
  static transformThemeToLottieSlots(n, i) {
    return '';
  }
};
_(M, '_wasmModule', null);
var f3 = M;
var P2 = class {
  constructor() {
    if (typeof Worker == 'undefined') throw new Error('Worker is not supported in this environment.');
    let n = new Blob(
        [
          new Uint8Array([
            34, 117, 115, 101, 32, 115, 116, 114, 105, 99, 116, 34, 59, 10, 40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32,
            118, 97, 114, 32, 95, 95, 100, 101, 102, 80, 114, 111, 112, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 100,
            101, 102, 105, 110, 101, 80, 114, 111, 112, 101, 114, 116, 121, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95,
            100, 101, 102, 80, 114, 111, 112, 115, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 100, 101, 102, 105, 110,
            101, 80, 114, 111, 112, 101, 114, 116, 105, 101, 115, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95, 103, 101,
            116, 79, 119, 110, 80, 114, 111, 112, 68, 101, 115, 99, 115, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 103,
            101, 116, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 68, 101, 115, 99, 114, 105, 112, 116, 111,
            114, 115, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95, 103, 101, 116, 79, 119, 110, 80, 114, 111, 112, 83, 121,
            109, 98, 111, 108, 115, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 103, 101, 116, 79, 119, 110, 80, 114,
            111, 112, 101, 114, 116, 121, 83, 121, 109, 98, 111, 108, 115, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95,
            104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 112, 114, 111,
            116, 111, 116, 121, 112, 101, 46, 104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 59, 10,
            32, 32, 118, 97, 114, 32, 95, 95, 112, 114, 111, 112, 73, 115, 69, 110, 117, 109, 32, 61, 32, 79, 98, 106,
            101, 99, 116, 46, 112, 114, 111, 116, 111, 116, 121, 112, 101, 46, 112, 114, 111, 112, 101, 114, 116, 121,
            73, 115, 69, 110, 117, 109, 101, 114, 97, 98, 108, 101, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95, 100, 101,
            102, 78, 111, 114, 109, 97, 108, 80, 114, 111, 112, 32, 61, 32, 40, 111, 98, 106, 44, 32, 107, 101, 121, 44,
            32, 118, 97, 108, 117, 101, 41, 32, 61, 62, 32, 107, 101, 121, 32, 105, 110, 32, 111, 98, 106, 32, 63, 32,
            95, 95, 100, 101, 102, 80, 114, 111, 112, 40, 111, 98, 106, 44, 32, 107, 101, 121, 44, 32, 123, 32, 101,
            110, 117, 109, 101, 114, 97, 98, 108, 101, 58, 32, 116, 114, 117, 101, 44, 32, 99, 111, 110, 102, 105, 103,
            117, 114, 97, 98, 108, 101, 58, 32, 116, 114, 117, 101, 44, 32, 119, 114, 105, 116, 97, 98, 108, 101, 58,
            32, 116, 114, 117, 101, 44, 32, 118, 97, 108, 117, 101, 32, 125, 41, 32, 58, 32, 111, 98, 106, 91, 107, 101,
            121, 93, 32, 61, 32, 118, 97, 108, 117, 101, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95, 115, 112, 114, 101,
            97, 100, 86, 97, 108, 117, 101, 115, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32,
            32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 112, 114, 111, 112, 32, 105, 110, 32, 98, 32, 124, 124, 32,
            40, 98, 32, 61, 32, 123, 125, 41, 41, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 95, 95, 104, 97, 115,
            79, 119, 110, 80, 114, 111, 112, 46, 99, 97, 108, 108, 40, 98, 44, 32, 112, 114, 111, 112, 41, 41, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 95, 95, 100, 101, 102, 78, 111, 114, 109, 97, 108, 80, 114, 111, 112, 40, 97,
            44, 32, 112, 114, 111, 112, 44, 32, 98, 91, 112, 114, 111, 112, 93, 41, 59, 10, 32, 32, 32, 32, 105, 102,
            32, 40, 95, 95, 103, 101, 116, 79, 119, 110, 80, 114, 111, 112, 83, 121, 109, 98, 111, 108, 115, 41, 10, 32,
            32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 112, 114, 111, 112, 32, 111, 102, 32, 95, 95,
            103, 101, 116, 79, 119, 110, 80, 114, 111, 112, 83, 121, 109, 98, 111, 108, 115, 40, 98, 41, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 95, 95, 112, 114, 111, 112, 73, 115, 69, 110, 117,
            109, 46, 99, 97, 108, 108, 40, 98, 44, 32, 112, 114, 111, 112, 41, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 95, 95, 100, 101, 102, 78, 111, 114, 109, 97, 108, 80, 114, 111, 112, 40, 97, 44, 32, 112, 114, 111,
            112, 44, 32, 98, 91, 112, 114, 111, 112, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 97, 59, 10, 32, 32, 125, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95, 115,
            112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 95, 95,
            100, 101, 102, 80, 114, 111, 112, 115, 40, 97, 44, 32, 95, 95, 103, 101, 116, 79, 119, 110, 80, 114, 111,
            112, 68, 101, 115, 99, 115, 40, 98, 41, 41, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95, 111, 98, 106, 82, 101,
            115, 116, 32, 61, 32, 40, 115, 111, 117, 114, 99, 101, 44, 32, 101, 120, 99, 108, 117, 100, 101, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 118, 97, 114, 32, 116, 97, 114, 103, 101, 116, 32, 61, 32, 123, 125, 59,
            10, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 112, 114, 111, 112, 32, 105, 110, 32, 115, 111,
            117, 114, 99, 101, 41, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 95, 95, 104, 97, 115, 79, 119, 110, 80,
            114, 111, 112, 46, 99, 97, 108, 108, 40, 115, 111, 117, 114, 99, 101, 44, 32, 112, 114, 111, 112, 41, 32,
            38, 38, 32, 101, 120, 99, 108, 117, 100, 101, 46, 105, 110, 100, 101, 120, 79, 102, 40, 112, 114, 111, 112,
            41, 32, 60, 32, 48, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 97, 114, 103, 101, 116, 91, 112, 114, 111,
            112, 93, 32, 61, 32, 115, 111, 117, 114, 99, 101, 91, 112, 114, 111, 112, 93, 59, 10, 32, 32, 32, 32, 105,
            102, 32, 40, 115, 111, 117, 114, 99, 101, 32, 33, 61, 32, 110, 117, 108, 108, 32, 38, 38, 32, 95, 95, 103,
            101, 116, 79, 119, 110, 80, 114, 111, 112, 83, 121, 109, 98, 111, 108, 115, 41, 10, 32, 32, 32, 32, 32, 32,
            102, 111, 114, 32, 40, 118, 97, 114, 32, 112, 114, 111, 112, 32, 111, 102, 32, 95, 95, 103, 101, 116, 79,
            119, 110, 80, 114, 111, 112, 83, 121, 109, 98, 111, 108, 115, 40, 115, 111, 117, 114, 99, 101, 41, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 101, 120, 99, 108, 117, 100, 101, 46, 105, 110,
            100, 101, 120, 79, 102, 40, 112, 114, 111, 112, 41, 32, 60, 32, 48, 32, 38, 38, 32, 95, 95, 112, 114, 111,
            112, 73, 115, 69, 110, 117, 109, 46, 99, 97, 108, 108, 40, 115, 111, 117, 114, 99, 101, 44, 32, 112, 114,
            111, 112, 41, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 97, 114, 103, 101, 116, 91, 112, 114,
            111, 112, 93, 32, 61, 32, 115, 111, 117, 114, 99, 101, 91, 112, 114, 111, 112, 93, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 97, 114, 103, 101, 116, 59, 10, 32,
            32, 125, 59, 10, 32, 32, 118, 97, 114, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 32,
            61, 32, 40, 111, 98, 106, 44, 32, 107, 101, 121, 44, 32, 118, 97, 108, 117, 101, 41, 32, 61, 62, 32, 95, 95,
            100, 101, 102, 78, 111, 114, 109, 97, 108, 80, 114, 111, 112, 40, 111, 98, 106, 44, 32, 116, 121, 112, 101,
            111, 102, 32, 107, 101, 121, 32, 33, 61, 61, 32, 34, 115, 121, 109, 98, 111, 108, 34, 32, 63, 32, 107, 101,
            121, 32, 43, 32, 34, 34, 32, 58, 32, 107, 101, 121, 44, 32, 118, 97, 108, 117, 101, 41, 59, 10, 32, 32, 118,
            97, 114, 32, 95, 95, 97, 115, 121, 110, 99, 32, 61, 32, 40, 95, 95, 116, 104, 105, 115, 44, 32, 95, 95, 97,
            114, 103, 117, 109, 101, 110, 116, 115, 44, 32, 103, 101, 110, 101, 114, 97, 116, 111, 114, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 110, 101, 119, 32, 80, 114, 111, 109, 105,
            115, 101, 40, 40, 114, 101, 115, 111, 108, 118, 101, 44, 32, 114, 101, 106, 101, 99, 116, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 117, 108, 102, 105, 108, 108, 101, 100, 32, 61,
            32, 40, 118, 97, 108, 117, 101, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 115, 116, 101, 112, 40, 103, 101, 110, 101, 114, 97,
            116, 111, 114, 46, 110, 101, 120, 116, 40, 118, 97, 108, 117, 101, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 106, 101, 99, 116, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 114, 101, 106, 101, 99, 116, 101, 100, 32,
            61, 32, 40, 118, 97, 108, 117, 101, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114,
            121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 115, 116, 101, 112, 40, 103, 101, 110, 101, 114,
            97, 116, 111, 114, 46, 116, 104, 114, 111, 119, 40, 118, 97, 108, 117, 101, 41, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 114, 101, 106, 101, 99, 116, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 115, 116, 101, 112, 32, 61, 32, 40,
            120, 41, 32, 61, 62, 32, 120, 46, 100, 111, 110, 101, 32, 63, 32, 114, 101, 115, 111, 108, 118, 101, 40,
            120, 46, 118, 97, 108, 117, 101, 41, 32, 58, 32, 80, 114, 111, 109, 105, 115, 101, 46, 114, 101, 115, 111,
            108, 118, 101, 40, 120, 46, 118, 97, 108, 117, 101, 41, 46, 116, 104, 101, 110, 40, 102, 117, 108, 102, 105,
            108, 108, 101, 100, 44, 32, 114, 101, 106, 101, 99, 116, 101, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 115,
            116, 101, 112, 40, 40, 103, 101, 110, 101, 114, 97, 116, 111, 114, 32, 61, 32, 103, 101, 110, 101, 114, 97,
            116, 111, 114, 46, 97, 112, 112, 108, 121, 40, 95, 95, 116, 104, 105, 115, 44, 32, 95, 95, 97, 114, 103,
            117, 109, 101, 110, 116, 115, 41, 41, 46, 110, 101, 120, 116, 40, 41, 41, 59, 10, 32, 32, 32, 32, 125, 41,
            59, 10, 32, 32, 125, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47, 97, 110, 105, 109, 97, 116, 105, 111,
            110, 45, 102, 114, 97, 109, 101, 45, 109, 97, 110, 97, 103, 101, 114, 46, 116, 115, 10, 32, 32, 118, 97,
            114, 32, 87, 101, 98, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 83, 116, 114, 97,
            116, 101, 103, 121, 32, 61, 32, 99, 108, 97, 115, 115, 32, 123, 10, 32, 32, 32, 32, 114, 101, 113, 117, 101,
            115, 116, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 99, 97, 108, 108, 98, 97,
            99, 107, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 114, 101, 113, 117, 101,
            115, 116, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 99, 97, 108, 108, 98, 97,
            99, 107, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 99, 97, 110, 99, 101, 108, 65, 110, 105, 109,
            97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 105, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99,
            97, 110, 99, 101, 108, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 105, 100, 41,
            59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32, 32, 118, 97, 114, 32, 78, 111, 100, 101, 65, 110,
            105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 83, 116, 114, 97, 116, 101, 103, 121, 32, 61, 32,
            99, 108, 97, 115, 115, 32, 123, 10, 32, 32, 32, 32, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 40,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40,
            116, 104, 105, 115, 44, 32, 34, 95, 108, 97, 115, 116, 72, 97, 110, 100, 108, 101, 73, 100, 34, 44, 32, 48,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116,
            104, 105, 115, 44, 32, 34, 95, 108, 97, 115, 116, 73, 109, 109, 101, 100, 105, 97, 116, 101, 34, 44, 32,
            110, 117, 108, 108, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 114, 101, 113, 117, 101, 115, 116,
            65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 99, 97, 108, 108, 98, 97, 99, 107, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 108, 97, 115, 116, 72,
            97, 110, 100, 108, 101, 73, 100, 32, 62, 61, 32, 78, 117, 109, 98, 101, 114, 46, 77, 65, 88, 95, 83, 65, 70,
            69, 95, 73, 78, 84, 69, 71, 69, 82, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46,
            95, 108, 97, 115, 116, 72, 97, 110, 100, 108, 101, 73, 100, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 108, 97, 115, 116, 72, 97, 110, 100, 108, 101,
            73, 100, 32, 43, 61, 32, 49, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 108, 97, 115, 116,
            73, 109, 109, 101, 100, 105, 97, 116, 101, 32, 61, 32, 115, 101, 116, 73, 109, 109, 101, 100, 105, 97, 116,
            101, 40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 108, 108, 98, 97, 99, 107,
            40, 68, 97, 116, 101, 46, 110, 111, 119, 40, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 95, 108, 97, 115, 116, 72, 97,
            110, 100, 108, 101, 73, 100, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 99, 97, 110, 99, 101, 108, 65,
            110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 95, 105, 100, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 108, 97, 115, 116, 73, 109, 109, 101, 100, 105,
            97, 116, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 108, 101, 97, 114, 73, 109, 109, 101,
            100, 105, 97, 116, 101, 40, 116, 104, 105, 115, 46, 95, 108, 97, 115, 116, 73, 109, 109, 101, 100, 105, 97,
            116, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32, 32,
            118, 97, 114, 32, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 77, 97, 110, 97, 103,
            101, 114, 32, 61, 32, 99, 108, 97, 115, 115, 32, 123, 10, 32, 32, 32, 32, 99, 111, 110, 115, 116, 114, 117,
            99, 116, 111, 114, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105,
            101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 115, 116, 114, 97, 116, 101, 103, 121, 34, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 115, 116, 114, 97, 116, 101, 103, 121, 32, 61, 32,
            116, 121, 112, 101, 111, 102, 32, 114, 101, 113, 117, 101, 115, 116, 65, 110, 105, 109, 97, 116, 105, 111,
            110, 70, 114, 97, 109, 101, 32, 61, 61, 61, 32, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32, 63, 32,
            110, 101, 119, 32, 87, 101, 98, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 83, 116,
            114, 97, 116, 101, 103, 121, 40, 41, 32, 58, 32, 110, 101, 119, 32, 78, 111, 100, 101, 65, 110, 105, 109,
            97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 83, 116, 114, 97, 116, 101, 103, 121, 40, 41, 59, 10, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 114, 101, 113, 117, 101, 115, 116, 65, 110, 105, 109, 97, 116, 105, 111,
            110, 70, 114, 97, 109, 101, 40, 99, 97, 108, 108, 98, 97, 99, 107, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 95, 115, 116, 114, 97, 116, 101, 103, 121, 46,
            114, 101, 113, 117, 101, 115, 116, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 99,
            97, 108, 108, 98, 97, 99, 107, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 99, 97, 110, 99, 101,
            108, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 105, 100, 41, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 115, 116, 114, 97, 116, 101, 103, 121, 46, 99, 97, 110, 99,
            101, 108, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 105, 100, 41, 59, 10, 32,
            32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47, 99, 111, 110, 115, 116,
            97, 110, 116, 115, 46, 116, 115, 10, 32, 32, 118, 97, 114, 32, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32,
            61, 32, 116, 121, 112, 101, 111, 102, 32, 119, 105, 110, 100, 111, 119, 32, 33, 61, 61, 32, 34, 117, 110,
            100, 101, 102, 105, 110, 101, 100, 34, 32, 38, 38, 32, 116, 121, 112, 101, 111, 102, 32, 119, 105, 110, 100,
            111, 119, 46, 100, 111, 99, 117, 109, 101, 110, 116, 32, 33, 61, 61, 32, 34, 117, 110, 100, 101, 102, 105,
            110, 101, 100, 34, 59, 10, 32, 32, 118, 97, 114, 32, 90, 73, 80, 95, 83, 73, 71, 78, 65, 84, 85, 82, 69, 32,
            61, 32, 110, 101, 119, 32, 85, 105, 110, 116, 56, 65, 114, 114, 97, 121, 40, 91, 56, 48, 44, 32, 55, 53, 44,
            32, 51, 44, 32, 52, 93, 41, 59, 10, 32, 32, 118, 97, 114, 32, 76, 79, 84, 84, 73, 69, 95, 74, 83, 79, 78,
            95, 77, 65, 78, 68, 65, 84, 79, 82, 89, 95, 70, 73, 69, 76, 68, 83, 32, 61, 32, 91, 34, 118, 34, 44, 32, 34,
            105, 112, 34, 44, 32, 34, 111, 112, 34, 44, 32, 34, 108, 97, 121, 101, 114, 115, 34, 44, 32, 34, 102, 114,
            34, 44, 32, 34, 119, 34, 44, 32, 34, 104, 34, 93, 59, 10, 32, 32, 118, 97, 114, 32, 80, 65, 67, 75, 65, 71,
            69, 95, 86, 69, 82, 83, 73, 79, 78, 32, 61, 32, 34, 48, 46, 51, 55, 46, 48, 45, 98, 101, 116, 97, 46, 55,
            34, 59, 10, 32, 32, 118, 97, 114, 32, 80, 65, 67, 75, 65, 71, 69, 95, 78, 65, 77, 69, 32, 61, 32, 34, 64,
            108, 111, 116, 116, 105, 101, 102, 105, 108, 101, 115, 47, 100, 111, 116, 108, 111, 116, 116, 105, 101, 45,
            119, 101, 98, 34, 59, 10, 32, 32, 118, 97, 114, 32, 68, 69, 70, 65, 85, 76, 84, 95, 68, 80, 82, 95, 70, 65,
            67, 84, 79, 82, 32, 61, 32, 48, 46, 55, 53, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47, 99, 111, 114,
            101, 47, 100, 111, 116, 108, 111, 116, 116, 105, 101, 45, 112, 108, 97, 121, 101, 114, 46, 106, 115, 10, 32,
            32, 118, 97, 114, 32, 99, 114, 101, 97, 116, 101, 68, 111, 116, 76, 111, 116, 116, 105, 101, 80, 108, 97,
            121, 101, 114, 77, 111, 100, 117, 108, 101, 32, 61, 32, 40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 118, 97, 114, 32, 95, 115, 99, 114, 105, 112, 116, 78, 97,
            109, 101, 32, 61, 32, 116, 121, 112, 101, 111, 102, 32, 100, 111, 99, 117, 109, 101, 110, 116, 32, 33, 61,
            32, 34, 117, 110, 100, 101, 102, 105, 110, 101, 100, 34, 32, 63, 32, 40, 95, 97, 32, 61, 32, 100, 111, 99,
            117, 109, 101, 110, 116, 46, 99, 117, 114, 114, 101, 110, 116, 83, 99, 114, 105, 112, 116, 41, 32, 61, 61,
            32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 115, 114, 99, 32,
            58, 32, 118, 111, 105, 100, 32, 48, 59, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 117, 110,
            99, 116, 105, 111, 110, 40, 109, 111, 100, 117, 108, 101, 65, 114, 103, 32, 61, 32, 123, 125, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 109, 111, 100, 117, 108, 101, 82, 116, 110, 59, 10, 32, 32,
            32, 32, 32, 32, 118, 97, 114, 32, 107, 32, 61, 32, 109, 111, 100, 117, 108, 101, 65, 114, 103, 44, 32, 97,
            97, 44, 32, 98, 97, 44, 32, 99, 97, 32, 61, 32, 110, 101, 119, 32, 80, 114, 111, 109, 105, 115, 101, 40, 40,
            97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 97, 32, 61, 32, 97, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 98, 97, 32, 61, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 125, 41, 44, 32,
            100, 97, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 97, 115, 115, 105, 103, 110, 40, 123, 125, 44, 32, 107,
            41, 44, 32, 101, 97, 32, 61, 32, 34, 46, 47, 116, 104, 105, 115, 46, 112, 114, 111, 103, 114, 97, 109, 34,
            44, 32, 112, 32, 61, 32, 34, 34, 44, 32, 102, 97, 59, 10, 32, 32, 32, 32, 32, 32, 34, 117, 110, 100, 101,
            102, 105, 110, 101, 100, 34, 32, 33, 61, 32, 116, 121, 112, 101, 111, 102, 32, 100, 111, 99, 117, 109, 101,
            110, 116, 32, 38, 38, 32, 100, 111, 99, 117, 109, 101, 110, 116, 46, 99, 117, 114, 114, 101, 110, 116, 83,
            99, 114, 105, 112, 116, 32, 38, 38, 32, 40, 112, 32, 61, 32, 100, 111, 99, 117, 109, 101, 110, 116, 46, 99,
            117, 114, 114, 101, 110, 116, 83, 99, 114, 105, 112, 116, 46, 115, 114, 99, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 95, 115, 99, 114, 105, 112, 116, 78, 97, 109, 101, 32, 38, 38, 32, 40, 112, 32, 61, 32, 95, 115, 99,
            114, 105, 112, 116, 78, 97, 109, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 112, 46, 115, 116, 97, 114, 116,
            115, 87, 105, 116, 104, 40, 34, 98, 108, 111, 98, 58, 34, 41, 32, 63, 32, 112, 32, 61, 32, 34, 34, 32, 58,
            32, 112, 32, 61, 32, 112, 46, 115, 117, 98, 115, 116, 114, 40, 48, 44, 32, 112, 46, 114, 101, 112, 108, 97,
            99, 101, 40, 47, 91, 63, 35, 93, 46, 42, 47, 44, 32, 34, 34, 41, 46, 108, 97, 115, 116, 73, 110, 100, 101,
            120, 79, 102, 40, 34, 47, 34, 41, 32, 43, 32, 49, 41, 59, 10, 32, 32, 32, 32, 32, 32, 102, 97, 32, 61, 32,
            40, 97, 41, 32, 61, 62, 32, 102, 101, 116, 99, 104, 40, 97, 44, 32, 123, 32, 99, 114, 101, 100, 101, 110,
            116, 105, 97, 108, 115, 58, 32, 34, 115, 97, 109, 101, 45, 111, 114, 105, 103, 105, 110, 34, 32, 125, 41,
            46, 116, 104, 101, 110, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 40, 98, 41, 32, 61, 62, 32, 98, 46, 111,
            107, 32, 63, 32, 98, 46, 97, 114, 114, 97, 121, 66, 117, 102, 102, 101, 114, 40, 41, 32, 58, 32, 80, 114,
            111, 109, 105, 115, 101, 46, 114, 101, 106, 101, 99, 116, 40, 69, 114, 114, 111, 114, 40, 98, 46, 115, 116,
            97, 116, 117, 115, 32, 43, 32, 34, 32, 58, 32, 34, 32, 43, 32, 98, 46, 117, 114, 108, 41, 41, 10, 32, 32,
            32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 97, 32, 61, 32, 107, 46, 112,
            114, 105, 110, 116, 32, 124, 124, 32, 99, 111, 110, 115, 111, 108, 101, 46, 108, 111, 103, 46, 98, 105, 110,
            100, 40, 99, 111, 110, 115, 111, 108, 101, 41, 44, 32, 116, 32, 61, 32, 107, 46, 112, 114, 105, 110, 116,
            69, 114, 114, 32, 124, 124, 32, 99, 111, 110, 115, 111, 108, 101, 46, 101, 114, 114, 111, 114, 46, 98, 105,
            110, 100, 40, 99, 111, 110, 115, 111, 108, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 79, 98, 106, 101, 99,
            116, 46, 97, 115, 115, 105, 103, 110, 40, 107, 44, 32, 100, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 100, 97,
            32, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 116, 104, 105, 115, 80, 114, 111,
            103, 114, 97, 109, 32, 38, 38, 32, 40, 101, 97, 32, 61, 32, 107, 46, 116, 104, 105, 115, 80, 114, 111, 103,
            114, 97, 109, 41, 59, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 105, 97, 32, 61, 32, 107, 46, 119, 97,
            115, 109, 66, 105, 110, 97, 114, 121, 44, 32, 108, 97, 44, 32, 109, 97, 32, 61, 32, 102, 97, 108, 115, 101,
            44, 32, 110, 97, 44, 32, 117, 44, 32, 120, 44, 32, 121, 44, 32, 122, 44, 32, 67, 44, 32, 68, 44, 32, 111,
            97, 44, 32, 112, 97, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 113, 97, 40,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 97, 32, 61, 32, 108, 97, 46, 98, 117,
            102, 102, 101, 114, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 46, 72, 69, 65, 80, 56, 32, 61, 32, 117,
            32, 61, 32, 110, 101, 119, 32, 73, 110, 116, 56, 65, 114, 114, 97, 121, 40, 97, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 107, 46, 72, 69, 65, 80, 49, 54, 32, 61, 32, 121, 32, 61, 32, 110, 101, 119, 32, 73, 110,
            116, 49, 54, 65, 114, 114, 97, 121, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 46, 72, 69, 65,
            80, 85, 56, 32, 61, 32, 120, 32, 61, 32, 110, 101, 119, 32, 85, 105, 110, 116, 56, 65, 114, 114, 97, 121,
            40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 46, 72, 69, 65, 80, 85, 49, 54, 32, 61, 32, 122,
            32, 61, 32, 110, 101, 119, 32, 85, 105, 110, 116, 49, 54, 65, 114, 114, 97, 121, 40, 97, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 107, 46, 72, 69, 65, 80, 51, 50, 32, 61, 32, 67, 32, 61, 32, 110, 101, 119, 32, 73,
            110, 116, 51, 50, 65, 114, 114, 97, 121, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 46, 72,
            69, 65, 80, 85, 51, 50, 32, 61, 32, 68, 32, 61, 32, 110, 101, 119, 32, 85, 105, 110, 116, 51, 50, 65, 114,
            114, 97, 121, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 46, 72, 69, 65, 80, 70, 51, 50, 32,
            61, 32, 111, 97, 32, 61, 32, 110, 101, 119, 32, 70, 108, 111, 97, 116, 51, 50, 65, 114, 114, 97, 121, 40,
            97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 46, 72, 69, 65, 80, 70, 54, 52, 32, 61, 32, 112, 97,
            32, 61, 32, 110, 101, 119, 32, 70, 108, 111, 97, 116, 54, 52, 65, 114, 114, 97, 121, 40, 97, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 114, 97, 32, 61, 32, 91, 93, 44, 32,
            115, 97, 32, 61, 32, 91, 93, 44, 32, 116, 97, 32, 61, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117,
            110, 99, 116, 105, 111, 110, 32, 117, 97, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114,
            32, 97, 32, 61, 32, 107, 46, 112, 114, 101, 82, 117, 110, 46, 115, 104, 105, 102, 116, 40, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 97, 46, 117, 110, 115, 104, 105, 102, 116, 40, 97, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 69, 32, 61, 32, 48, 44, 32, 118, 97, 32, 61,
            32, 110, 117, 108, 108, 44, 32, 70, 32, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32, 102,
            117, 110, 99, 116, 105, 111, 110, 32, 119, 97, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 95, 97, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 40, 95, 97, 50, 32, 61, 32, 107, 46, 111,
            110, 65, 98, 111, 114, 116, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48,
            32, 58, 32, 95, 97, 50, 46, 99, 97, 108, 108, 40, 107, 44, 32, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 97, 32, 61, 32, 34, 65, 98, 111, 114, 116, 101, 100, 40, 34, 32, 43, 32, 97, 32, 43, 32, 34, 41, 34, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 97, 32,
            61, 32, 116, 114, 117, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 110, 101, 119, 32, 87,
            101, 98, 65, 115, 115, 101, 109, 98, 108, 121, 46, 82, 117, 110, 116, 105, 109, 101, 69, 114, 114, 111, 114,
            40, 97, 32, 43, 32, 34, 46, 32, 66, 117, 105, 108, 100, 32, 119, 105, 116, 104, 32, 45, 115, 65, 83, 83, 69,
            82, 84, 73, 79, 78, 83, 32, 102, 111, 114, 32, 109, 111, 114, 101, 32, 105, 110, 102, 111, 46, 34, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 98, 97, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            114, 111, 119, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32,
            120, 97, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 97, 46, 115, 116, 97, 114, 116, 115, 87, 105, 116, 104, 40,
            34, 100, 97, 116, 97, 58, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 111, 99, 116, 101, 116,
            45, 115, 116, 114, 101, 97, 109, 59, 98, 97, 115, 101, 54, 52, 44, 34, 41, 44, 32, 121, 97, 59, 10, 32, 32,
            32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 122, 97, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 97, 32, 61, 61, 32, 121, 97, 32, 38, 38, 32, 105, 97, 41, 32, 114, 101,
            116, 117, 114, 110, 32, 110, 101, 119, 32, 85, 105, 110, 116, 56, 65, 114, 114, 97, 121, 40, 105, 97, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 34, 98, 111, 116, 104, 32, 97, 115,
            121, 110, 99, 32, 97, 110, 100, 32, 115, 121, 110, 99, 32, 102, 101, 116, 99, 104, 105, 110, 103, 32, 111,
            102, 32, 116, 104, 101, 32, 119, 97, 115, 109, 32, 102, 97, 105, 108, 101, 100, 34, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 65, 97, 40, 97, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 97, 32, 63, 32, 80, 114,
            111, 109, 105, 115, 101, 46, 114, 101, 115, 111, 108, 118, 101, 40, 41, 46, 116, 104, 101, 110, 40, 40, 41,
            32, 61, 62, 32, 122, 97, 40, 97, 41, 41, 32, 58, 32, 102, 97, 40, 97, 41, 46, 116, 104, 101, 110, 40, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 98, 41, 32, 61, 62, 32, 110, 101, 119, 32, 85, 105, 110, 116,
            56, 65, 114, 114, 97, 121, 40, 98, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 41, 32, 61, 62,
            32, 122, 97, 40, 97, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 66, 97, 40, 97, 44, 32, 98, 44, 32, 99,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 65, 97, 40, 97, 41, 46,
            116, 104, 101, 110, 40, 40, 100, 41, 32, 61, 62, 32, 87, 101, 98, 65, 115, 115, 101, 109, 98, 108, 121, 46,
            105, 110, 115, 116, 97, 110, 116, 105, 97, 116, 101, 40, 100, 44, 32, 98, 41, 41, 46, 116, 104, 101, 110,
            40, 99, 44, 32, 40, 100, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 40, 96,
            102, 97, 105, 108, 101, 100, 32, 116, 111, 32, 97, 115, 121, 110, 99, 104, 114, 111, 110, 111, 117, 115,
            108, 121, 32, 112, 114, 101, 112, 97, 114, 101, 32, 119, 97, 115, 109, 58, 32, 36, 123, 100, 125, 96, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 119, 97, 40, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105,
            111, 110, 32, 67, 97, 40, 97, 44, 32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32,
            99, 32, 61, 32, 121, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 97,
            32, 124, 124, 32, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32, 33, 61, 32, 116, 121, 112, 101, 111,
            102, 32, 87, 101, 98, 65, 115, 115, 101, 109, 98, 108, 121, 46, 105, 110, 115, 116, 97, 110, 116, 105, 97,
            116, 101, 83, 116, 114, 101, 97, 109, 105, 110, 103, 32, 124, 124, 32, 120, 97, 40, 99, 41, 32, 124, 124,
            32, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32, 33, 61, 32, 116, 121, 112, 101, 111, 102, 32, 102,
            101, 116, 99, 104, 32, 63, 32, 66, 97, 40, 99, 44, 32, 97, 44, 32, 98, 41, 32, 58, 32, 102, 101, 116, 99,
            104, 40, 99, 44, 32, 123, 32, 99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 115, 58, 32, 34, 115, 97, 109,
            101, 45, 111, 114, 105, 103, 105, 110, 34, 32, 125, 41, 46, 116, 104, 101, 110, 40, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 40, 100, 41, 32, 61, 62, 32, 87, 101, 98, 65, 115, 115, 101, 109, 98, 108, 121, 46, 105,
            110, 115, 116, 97, 110, 116, 105, 97, 116, 101, 83, 116, 114, 101, 97, 109, 105, 110, 103, 40, 100, 44, 32,
            97, 41, 46, 116, 104, 101, 110, 40, 98, 44, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 101, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 40, 96, 119, 97, 115, 109, 32, 115, 116, 114, 101,
            97, 109, 105, 110, 103, 32, 99, 111, 109, 112, 105, 108, 101, 32, 102, 97, 105, 108, 101, 100, 58, 32, 36,
            123, 101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 40, 34, 102, 97, 108,
            108, 105, 110, 103, 32, 98, 97, 99, 107, 32, 116, 111, 32, 65, 114, 114, 97, 121, 66, 117, 102, 102, 101,
            114, 32, 105, 110, 115, 116, 97, 110, 116, 105, 97, 116, 105, 111, 110, 34, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 66, 97, 40, 99, 44, 32, 97, 44, 32, 98, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 72, 44, 32, 73, 59, 10, 32, 32, 32,
            32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 68, 97, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 105, 115, 46, 110, 97, 109, 101, 32, 61, 32, 34, 69, 120, 105, 116, 83, 116, 97, 116,
            117, 115, 34, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 109, 101, 115, 115, 97, 103,
            101, 32, 61, 32, 96, 80, 114, 111, 103, 114, 97, 109, 32, 116, 101, 114, 109, 105, 110, 97, 116, 101, 100,
            32, 119, 105, 116, 104, 32, 101, 120, 105, 116, 40, 36, 123, 97, 125, 41, 96, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 105, 115, 46, 115, 116, 97, 116, 117, 115, 32, 61, 32, 97, 59, 10, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 69, 97, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 59, 32, 48, 32, 60, 32, 97, 46, 108, 101, 110,
            103, 116, 104, 59, 32, 41, 32, 97, 46, 115, 104, 105, 102, 116, 40, 41, 40, 107, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 44, 32, 70, 97, 32, 61, 32, 107, 46, 110, 111, 69, 120, 105, 116, 82, 117, 110, 116, 105, 109,
            101, 32, 124, 124, 32, 116, 114, 117, 101, 44, 32, 71, 97, 32, 61, 32, 34, 117, 110, 100, 101, 102, 105,
            110, 101, 100, 34, 32, 33, 61, 32, 116, 121, 112, 101, 111, 102, 32, 84, 101, 120, 116, 68, 101, 99, 111,
            100, 101, 114, 32, 63, 32, 110, 101, 119, 32, 84, 101, 120, 116, 68, 101, 99, 111, 100, 101, 114, 40, 41,
            32, 58, 32, 118, 111, 105, 100, 32, 48, 44, 32, 74, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 98, 32, 43, 32, 99, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 99, 32, 61, 32, 98, 59, 32, 97, 91, 99, 93, 32,
            38, 38, 32, 33, 40, 99, 32, 62, 61, 32, 100, 41, 59, 32, 41, 32, 43, 43, 99, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 105, 102, 32, 40, 49, 54, 32, 60, 32, 99, 32, 45, 32, 98, 32, 38, 38, 32, 97, 46, 98, 117, 102, 102,
            101, 114, 32, 38, 38, 32, 71, 97, 41, 32, 114, 101, 116, 117, 114, 110, 32, 71, 97, 46, 100, 101, 99, 111,
            100, 101, 40, 97, 46, 115, 117, 98, 97, 114, 114, 97, 121, 40, 98, 44, 32, 99, 41, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 100, 32, 61, 32, 34, 34, 59, 32, 98, 32, 60, 32, 99, 59, 32, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101, 32, 61, 32, 97, 91, 98, 43, 43,
            93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 101, 32, 38, 32, 49, 50, 56, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 32, 61, 32, 97, 91, 98, 43,
            43, 93, 32, 38, 32, 54, 51, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 49,
            57, 50, 32, 61, 61, 32, 40, 101, 32, 38, 32, 50, 50, 52, 41, 41, 32, 100, 32, 43, 61, 32, 83, 116, 114, 105,
            110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 40, 101, 32, 38, 32, 51, 49, 41,
            32, 60, 60, 32, 54, 32, 124, 32, 102, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 108,
            115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 32,
            61, 32, 97, 91, 98, 43, 43, 93, 32, 38, 32, 54, 51, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 101, 32, 61, 32, 50, 50, 52, 32, 61, 61, 32, 40, 101, 32, 38, 32, 50, 52, 48, 41, 32, 63, 32, 40,
            101, 32, 38, 32, 49, 53, 41, 32, 60, 60, 32, 49, 50, 32, 124, 32, 102, 32, 60, 60, 32, 54, 32, 124, 32, 104,
            32, 58, 32, 40, 101, 32, 38, 32, 55, 41, 32, 60, 60, 32, 49, 56, 32, 124, 32, 102, 32, 60, 60, 32, 49, 50,
            32, 124, 32, 104, 32, 60, 60, 32, 54, 32, 124, 32, 97, 91, 98, 43, 43, 93, 32, 38, 32, 54, 51, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 54, 53, 53, 51, 54, 32, 62, 32, 101, 32, 63, 32, 100,
            32, 43, 61, 32, 83, 116, 114, 105, 110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101,
            40, 101, 41, 32, 58, 32, 40, 101, 32, 45, 61, 32, 54, 53, 53, 51, 54, 44, 32, 100, 32, 43, 61, 32, 83, 116,
            114, 105, 110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 53, 53, 50, 57, 54, 32,
            124, 32, 101, 32, 62, 62, 32, 49, 48, 44, 32, 53, 54, 51, 50, 48, 32, 124, 32, 101, 32, 38, 32, 49, 48, 50,
            51, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 125, 32, 101, 108, 115, 101, 32, 100, 32, 43, 61, 32, 83, 116, 114, 105, 110, 103, 46, 102, 114,
            111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            59, 10, 32, 32, 32, 32, 32, 32, 99, 108, 97, 115, 115, 32, 72, 97, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 116, 104, 105, 115, 46, 72, 97, 32, 61, 32, 97, 32, 45, 32, 50, 52, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 73, 97,
            32, 61, 32, 48, 44, 32, 74, 97, 32, 61, 32, 48, 44, 32, 75, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41,
            32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 120, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 48, 32, 60, 32, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 99, 32, 61, 32, 98, 32, 43, 32, 99, 32, 45, 32, 49, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 101, 32, 61, 32, 48, 59, 32, 101, 32, 60, 32, 97, 46, 108,
            101, 110, 103, 116, 104, 59, 32, 43, 43, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 102, 32, 61, 32, 97, 46, 99, 104, 97, 114, 67, 111, 100, 101, 65, 116, 40, 101, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 53, 53, 50, 57, 54, 32, 60, 61,
            32, 102, 32, 38, 38, 32, 53, 55, 51, 52, 51, 32, 62, 61, 32, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 32, 61, 32, 97, 46, 99, 104, 97, 114, 67, 111, 100,
            101, 65, 116, 40, 43, 43, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 32,
            61, 32, 54, 53, 53, 51, 54, 32, 43, 32, 40, 40, 102, 32, 38, 32, 49, 48, 50, 51, 41, 32, 60, 60, 32, 49, 48,
            41, 32, 124, 32, 104, 32, 38, 32, 49, 48, 50, 51, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 49, 50, 55, 32, 62, 61, 32, 102,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 98, 32, 62, 61,
            32, 99, 41, 32, 98, 114, 101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100,
            91, 98, 43, 43, 93, 32, 61, 32, 102, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101,
            108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 50,
            48, 52, 55, 32, 62, 61, 32, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 105, 102, 32, 40, 98, 32, 43, 32, 49, 32, 62, 61, 32, 99, 41, 32, 98, 114, 101, 97, 107, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 91, 98, 43, 43, 93, 32, 61, 32, 49, 57, 50,
            32, 124, 32, 102, 32, 62, 62, 32, 54, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 54, 53, 53, 51, 53, 32, 62, 61, 32, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 98, 32, 43, 32, 50, 32, 62, 61, 32, 99, 41, 32, 98,
            114, 101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 91,
            98, 43, 43, 93, 32, 61, 32, 50, 50, 52, 32, 124, 32, 102, 32, 62, 62, 32, 49, 50, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 98, 32, 43, 32, 51, 32, 62, 61,
            32, 99, 41, 32, 98, 114, 101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 100, 91, 98, 43, 43, 93, 32, 61, 32, 50, 52, 48, 32, 124, 32, 102, 32, 62, 62, 32, 49, 56, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 91, 98, 43, 43, 93, 32, 61,
            32, 49, 50, 56, 32, 124, 32, 102, 32, 62, 62, 32, 49, 50, 32, 38, 32, 54, 51, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 100, 91, 98, 43, 43, 93, 32, 61, 32, 49, 50, 56, 32, 124, 32, 102, 32, 62, 62, 32, 54, 32, 38, 32,
            54, 51, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 100, 91, 98, 43, 43, 93, 32, 61, 32, 49, 50, 56, 32, 124, 32, 102, 32, 38, 32,
            54, 51, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 91, 98, 93, 32, 61, 32, 48, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 75, 97, 32, 61, 32, 123, 125, 44, 32, 76,
            97, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40,
            59, 32, 97, 46, 108, 101, 110, 103, 116, 104, 59, 32, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 98, 32, 61, 32, 97, 46, 112, 111, 112, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 97, 46, 112, 111, 112, 40, 41, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 76, 40, 97,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46,
            102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 40, 68, 91, 97, 32, 62, 62, 32, 50, 93, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 77, 32, 61, 32, 123, 125, 44,
            32, 78, 32, 61, 32, 123, 125, 44, 32, 77, 97, 32, 61, 32, 123, 125, 44, 32, 78, 97, 44, 32, 80, 32, 61, 32,
            40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 117, 110,
            99, 116, 105, 111, 110, 32, 100, 40, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 32,
            61, 32, 99, 40, 103, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 103, 46, 108,
            101, 110, 103, 116, 104, 32, 33, 61, 61, 32, 97, 46, 108, 101, 110, 103, 116, 104, 41, 32, 116, 104, 114,
            111, 119, 32, 110, 101, 119, 32, 78, 97, 40, 34, 77, 105, 115, 109, 97, 116, 99, 104, 101, 100, 32, 116,
            121, 112, 101, 32, 99, 111, 110, 118, 101, 114, 116, 101, 114, 32, 99, 111, 117, 110, 116, 34, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 108, 32, 61, 32, 48, 59,
            32, 108, 32, 60, 32, 97, 46, 108, 101, 110, 103, 116, 104, 59, 32, 43, 43, 108, 41, 32, 79, 40, 97, 91, 108,
            93, 44, 32, 103, 91, 108, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 97, 46, 102, 111, 114, 69, 97, 99, 104, 40, 40, 103, 41, 32, 61, 62, 32, 77, 97, 91, 103, 93, 32,
            61, 32, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101, 32, 61, 32, 65, 114, 114, 97,
            121, 40, 98, 46, 108, 101, 110, 103, 116, 104, 41, 44, 32, 102, 32, 61, 32, 91, 93, 44, 32, 104, 32, 61, 32,
            48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 98, 46, 102, 111, 114, 69, 97, 99, 104, 40, 40, 103, 44, 32,
            108, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 78, 46, 104, 97, 115, 79, 119,
            110, 80, 114, 111, 112, 101, 114, 116, 121, 40, 103, 41, 32, 63, 32, 101, 91, 108, 93, 32, 61, 32, 78, 91,
            103, 93, 32, 58, 32, 40, 102, 46, 112, 117, 115, 104, 40, 103, 41, 44, 32, 77, 46, 104, 97, 115, 79, 119,
            110, 80, 114, 111, 112, 101, 114, 116, 121, 40, 103, 41, 32, 124, 124, 32, 40, 77, 91, 103, 93, 32, 61, 32,
            91, 93, 41, 44, 32, 77, 91, 103, 93, 46, 112, 117, 115, 104, 40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 91, 108, 93, 32, 61, 32, 78, 91, 103, 93, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 43, 43, 104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            104, 32, 61, 61, 61, 32, 102, 46, 108, 101, 110, 103, 116, 104, 32, 38, 38, 32, 100, 40, 101, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 48, 32, 61, 61, 61, 32, 102, 46, 108, 101, 110, 103, 116, 104, 32, 38,
            38, 32, 100, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 79, 97, 44, 32, 81, 32, 61, 32, 40,
            97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32,
            98, 32, 61, 32, 34, 34, 59, 32, 120, 91, 97, 93, 59, 32, 41, 32, 98, 32, 43, 61, 32, 79, 97, 91, 120, 91,
            97, 43, 43, 93, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59, 10,
            32, 32, 32, 32, 32, 32, 125, 44, 32, 82, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111,
            110, 32, 80, 97, 40, 97, 44, 32, 98, 44, 32, 99, 32, 61, 32, 123, 125, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 98, 46, 110, 97, 109, 101, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 105, 102, 32, 40, 33, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 116,
            121, 112, 101, 32, 34, 36, 123, 100, 125, 34, 32, 109, 117, 115, 116, 32, 104, 97, 118, 101, 32, 97, 32,
            112, 111, 115, 105, 116, 105, 118, 101, 32, 105, 110, 116, 101, 103, 101, 114, 32, 116, 121, 112, 101, 105,
            100, 32, 112, 111, 105, 110, 116, 101, 114, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32,
            40, 78, 46, 104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 40, 97, 41, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 99, 46, 109, 98, 41, 32, 114, 101, 116, 117, 114,
            110, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40,
            96, 67, 97, 110, 110, 111, 116, 32, 114, 101, 103, 105, 115, 116, 101, 114, 32, 116, 121, 112, 101, 32, 39,
            36, 123, 100, 125, 39, 32, 116, 119, 105, 99, 101, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 78, 91, 97, 93, 32, 61, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 100,
            101, 108, 101, 116, 101, 32, 77, 97, 91, 97, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 77, 46, 104, 97,
            115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 40, 97, 41, 32, 38, 38, 32, 40, 98, 32, 61, 32,
            77, 91, 97, 93, 44, 32, 100, 101, 108, 101, 116, 101, 32, 77, 91, 97, 93, 44, 32, 98, 46, 102, 111, 114, 69,
            97, 99, 104, 40, 40, 101, 41, 32, 61, 62, 32, 101, 40, 41, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 79, 40, 97, 44, 32, 98, 44, 32, 99, 32,
            61, 32, 123, 125, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 80, 97,
            40, 97, 44, 32, 98, 44, 32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 81, 97, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 97, 46, 70, 97, 46, 73, 97, 46, 71, 97, 46, 110, 97, 109,
            101, 32, 43, 32, 34, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 97, 108, 114, 101, 97, 100, 121, 32, 100,
            101, 108, 101, 116, 101, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 82, 97, 32, 61, 32, 102,
            97, 108, 115, 101, 44, 32, 83, 97, 32, 61, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 125,
            44, 32, 84, 97, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 98, 32, 61, 61, 61, 32, 99, 41, 32, 114, 101, 116, 117, 114, 110, 32, 97, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 99,
            46, 76, 97, 41, 32, 114, 101, 116, 117, 114, 110, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 97, 32, 61, 32, 84, 97, 40, 97, 44, 32, 98, 44, 32, 99, 46, 76, 97, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 110, 117, 108, 108, 32, 61, 61, 61, 32, 97, 32, 63, 32, 110,
            117, 108, 108, 32, 58, 32, 99, 46, 102, 98, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 86, 97,
            32, 61, 32, 123, 125, 44, 32, 87, 97, 32, 61, 32, 91, 93, 44, 32, 88, 97, 32, 61, 32, 40, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 59, 32, 87, 97, 46, 108, 101, 110, 103,
            116, 104, 59, 32, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 97, 32, 61, 32,
            87, 97, 46, 112, 111, 112, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 46, 70, 97, 46, 82,
            97, 32, 61, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 91, 34, 100,
            101, 108, 101, 116, 101, 34, 93, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            32, 32, 125, 44, 32, 89, 97, 44, 32, 90, 97, 32, 61, 32, 123, 125, 44, 32, 36, 97, 32, 61, 32, 40, 97, 44,
            32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100,
            32, 48, 32, 61, 61, 61, 32, 98, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 34, 112,
            116, 114, 32, 115, 104, 111, 117, 108, 100, 32, 110, 111, 116, 32, 98, 101, 32, 117, 110, 100, 101, 102,
            105, 110, 101, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 59, 32, 97, 46,
            76, 97, 59, 32, 41, 32, 98, 32, 61, 32, 97, 46, 85, 97, 40, 98, 41, 44, 32, 97, 32, 61, 32, 97, 46, 76, 97,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 90, 97, 91, 98, 93, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 44, 32, 98, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 98, 46, 73, 97, 32, 124, 124, 32, 33, 98, 46, 72, 97, 41,
            32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 78, 97, 40, 34, 109, 97, 107, 101, 67, 108, 97, 115,
            115, 72, 97, 110, 100, 108, 101, 32, 114, 101, 113, 117, 105, 114, 101, 115, 32, 112, 116, 114, 32, 97, 110,
            100, 32, 112, 116, 114, 84, 121, 112, 101, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40,
            33, 33, 98, 46, 77, 97, 32, 33, 61, 61, 32, 33, 33, 98, 46, 74, 97, 41, 32, 116, 104, 114, 111, 119, 32,
            110, 101, 119, 32, 78, 97, 40, 34, 66, 111, 116, 104, 32, 115, 109, 97, 114, 116, 80, 116, 114, 84, 121,
            112, 101, 32, 97, 110, 100, 32, 115, 109, 97, 114, 116, 80, 116, 114, 32, 109, 117, 115, 116, 32, 98, 101,
            32, 115, 112, 101, 99, 105, 102, 105, 101, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 98, 46, 99,
            111, 117, 110, 116, 32, 61, 32, 123, 32, 118, 97, 108, 117, 101, 58, 32, 49, 32, 125, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 97, 98, 40, 79, 98, 106, 101, 99, 116, 46, 99, 114,
            101, 97, 116, 101, 40, 97, 44, 32, 123, 32, 70, 97, 58, 32, 123, 32, 118, 97, 108, 117, 101, 58, 32, 98, 44,
            32, 119, 114, 105, 116, 97, 98, 108, 101, 58, 32, 116, 114, 117, 101, 32, 125, 32, 125, 41, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 44, 32, 97, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 34, 117, 110, 100, 101, 102, 105, 110, 101, 100, 34, 32, 61, 61, 61, 32,
            116, 121, 112, 101, 111, 102, 32, 70, 105, 110, 97, 108, 105, 122, 97, 116, 105, 111, 110, 82, 101, 103,
            105, 115, 116, 114, 121, 41, 32, 114, 101, 116, 117, 114, 110, 32, 97, 98, 32, 61, 32, 40, 98, 41, 32, 61,
            62, 32, 98, 44, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 82, 97, 32, 61, 32, 110, 101, 119, 32, 70,
            105, 110, 97, 108, 105, 122, 97, 116, 105, 111, 110, 82, 101, 103, 105, 115, 116, 114, 121, 40, 40, 98, 41,
            32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 98, 46, 70, 97, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 45, 45, 98, 46, 99, 111, 117, 110, 116, 46, 118, 97, 108, 117, 101, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48, 32, 61, 61, 61, 32, 98, 46, 99, 111, 117, 110, 116, 46, 118,
            97, 108, 117, 101, 32, 38, 38, 32, 40, 98, 46, 74, 97, 32, 63, 32, 98, 46, 77, 97, 46, 80, 97, 40, 98, 46,
            74, 97, 41, 32, 58, 32, 98, 46, 73, 97, 46, 71, 97, 46, 80, 97, 40, 98, 46, 72, 97, 41, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 98, 32, 61, 32, 40, 98, 41, 32,
            61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 98, 46, 70,
            97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 46, 74, 97, 32, 38, 38, 32, 82, 97, 46, 114, 101,
            103, 105, 115, 116, 101, 114, 40, 98, 44, 32, 123, 32, 70, 97, 58, 32, 99, 32, 125, 44, 32, 98, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 83, 97, 32, 61, 32, 40, 98, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 82, 97, 46, 117, 110, 114, 101, 103, 105, 115, 116, 101,
            114, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 97, 98, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32,
            32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 99, 98, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62,
            32, 79, 98, 106, 101, 99, 116, 46, 100, 101, 102, 105, 110, 101, 80, 114, 111, 112, 101, 114, 116, 121, 40,
            98, 44, 32, 34, 110, 97, 109, 101, 34, 44, 32, 123, 32, 118, 97, 108, 117, 101, 58, 32, 97, 32, 125, 41, 44,
            32, 101, 98, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 97, 91, 98, 93, 46, 75, 97,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 97, 91, 98, 93,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 91, 98, 93, 32, 61, 32, 102, 117, 110, 99, 116, 105,
            111, 110, 40, 46, 46, 46, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 33, 97, 91, 98, 93, 46, 75, 97, 46, 104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116,
            121, 40, 101, 46, 108, 101, 110, 103, 116, 104, 41, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 96, 70, 117, 110, 99, 116, 105, 111, 110, 32, 39, 36, 123, 99, 125, 39, 32, 99, 97,
            108, 108, 101, 100, 32, 119, 105, 116, 104, 32, 97, 110, 32, 105, 110, 118, 97, 108, 105, 100, 32, 110, 117,
            109, 98, 101, 114, 32, 111, 102, 32, 97, 114, 103, 117, 109, 101, 110, 116, 115, 32, 40, 36, 123, 101, 46,
            108, 101, 110, 103, 116, 104, 125, 41, 32, 45, 32, 101, 120, 112, 101, 99, 116, 115, 32, 111, 110, 101, 32,
            111, 102, 32, 40, 36, 123, 97, 91, 98, 93, 46, 75, 97, 125, 41, 33, 96, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114,
            110, 32, 97, 91, 98, 93, 46, 75, 97, 91, 101, 46, 108, 101, 110, 103, 116, 104, 93, 46, 97, 112, 112, 108,
            121, 40, 116, 104, 105, 115, 44, 32, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 91, 98, 93, 46, 75, 97, 32, 61, 32, 91, 93, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 97, 91, 98, 93, 46, 75, 97, 91, 100, 46, 86, 97, 93, 32, 61, 32, 100, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 102, 98, 32, 61, 32, 40, 97,
            44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 107,
            46, 104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 40, 97, 41, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 99, 32,
            124, 124, 32, 118, 111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 107, 91, 97, 93, 46, 75, 97, 32, 38, 38, 32,
            118, 111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 107, 91, 97, 93, 46, 75, 97, 91, 99, 93, 41, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 67, 97, 110,
            110, 111, 116, 32, 114, 101, 103, 105, 115, 116, 101, 114, 32, 112, 117, 98, 108, 105, 99, 32, 110, 97, 109,
            101, 32, 39, 36, 123, 97, 125, 39, 32, 116, 119, 105, 99, 101, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 101, 98, 40, 107, 44, 32, 97, 44, 32, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 107, 46, 104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 40, 99, 41,
            41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82,
            40, 96, 67, 97, 110, 110, 111, 116, 32, 114, 101, 103, 105, 115, 116, 101, 114, 32, 109, 117, 108, 116, 105,
            112, 108, 101, 32, 111, 118, 101, 114, 108, 111, 97, 100, 115, 32, 111, 102, 32, 97, 32, 102, 117, 110, 99,
            116, 105, 111, 110, 32, 119, 105, 116, 104, 32, 116, 104, 101, 32, 115, 97, 109, 101, 32, 110, 117, 109, 98,
            101, 114, 32, 111, 102, 32, 97, 114, 103, 117, 109, 101, 110, 116, 115, 32, 40, 36, 123, 99, 125, 41, 33,
            96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 107, 91, 97, 93, 46, 75, 97, 91, 99, 93, 32, 61, 32,
            98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 107, 91, 97, 93, 32, 61, 32,
            98, 44, 32, 118, 111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 99, 32, 38, 38, 32, 40, 107, 91, 97, 93, 46,
            118, 98, 32, 61, 32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 103, 98, 32, 61, 32, 40, 97, 41,
            32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100, 32, 48, 32,
            61, 61, 61, 32, 97, 41, 32, 114, 101, 116, 117, 114, 110, 32, 34, 95, 117, 110, 107, 110, 111, 119, 110, 34,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 97, 46, 114, 101, 112, 108, 97, 99, 101, 40, 47, 91,
            94, 97, 45, 122, 65, 45, 90, 48, 45, 57, 95, 93, 47, 103, 44, 32, 34, 36, 34, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 97, 46, 99, 104, 97, 114, 67, 111, 100, 101, 65, 116, 40,
            48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 52, 56, 32, 60, 61, 32,
            98, 32, 38, 38, 32, 53, 55, 32, 62, 61, 32, 98, 32, 63, 32, 96, 95, 36, 123, 97, 125, 96, 32, 58, 32, 97,
            59, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110,
            32, 104, 98, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32,
            103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 110, 97, 109, 101, 32, 61, 32,
            97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 99, 111, 110, 115, 116, 114, 117, 99,
            116, 111, 114, 32, 61, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 83, 97, 32,
            61, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 80, 97, 32, 61, 32, 100, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 76, 97, 32, 61, 32, 101, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 105, 115, 46, 104, 98, 32, 61, 32, 102, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 85, 97, 32, 61, 32, 104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46,
            102, 98, 32, 61, 32, 103, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 111, 98, 32, 61,
            32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 105, 98, 32,
            61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102,
            111, 114, 32, 40, 59, 32, 98, 32, 33, 61, 61, 32, 99, 59, 32, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 33, 98, 46, 85, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32,
            82, 40, 96, 69, 120, 112, 101, 99, 116, 101, 100, 32, 110, 117, 108, 108, 32, 111, 114, 32, 105, 110, 115,
            116, 97, 110, 99, 101, 32, 111, 102, 32, 36, 123, 99, 46, 110, 97, 109, 101, 125, 44, 32, 103, 111, 116, 32,
            97, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 111, 102, 32, 36, 123, 98, 46, 110, 97, 109, 101,
            125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 98, 46, 85, 97, 40, 97, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 98, 46, 76, 97, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 97, 59, 10, 32, 32, 32,
            32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 106, 98, 40, 97,
            44, 32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 110, 117, 108, 108, 32, 61,
            61, 61, 32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105,
            115, 46, 89, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 110, 117, 108, 108, 32,
            105, 115, 32, 110, 111, 116, 32, 97, 32, 118, 97, 108, 105, 100, 32, 36, 123, 116, 104, 105, 115, 46, 110,
            97, 109, 101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            98, 46, 70, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 67, 97, 110, 110, 111,
            116, 32, 112, 97, 115, 115, 32, 34, 36, 123, 107, 98, 40, 98, 41, 125, 34, 32, 97, 115, 32, 97, 32, 36, 123,
            116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 33, 98, 46, 70, 97, 46, 72, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96,
            67, 97, 110, 110, 111, 116, 32, 112, 97, 115, 115, 32, 100, 101, 108, 101, 116, 101, 100, 32, 111, 98, 106,
            101, 99, 116, 32, 97, 115, 32, 97, 32, 112, 111, 105, 110, 116, 101, 114, 32, 111, 102, 32, 116, 121, 112,
            101, 32, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 98, 40, 98, 46, 70, 97, 46, 72, 97, 44, 32, 98, 46, 70, 97,
            46, 73, 97, 46, 71, 97, 44, 32, 116, 104, 105, 115, 46, 71, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 108, 98, 40, 97, 44, 32, 98, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 110, 117, 108, 108, 32, 61, 61, 61, 32, 98, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 89, 97, 41, 32,
            116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 110, 117, 108, 108, 32, 105, 115, 32, 110, 111,
            116, 32, 97, 32, 118, 97, 108, 105, 100, 32, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 88, 97, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 116, 104,
            105, 115, 46, 90, 97, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 117, 108, 108,
            32, 33, 61, 61, 32, 97, 32, 38, 38, 32, 97, 46, 112, 117, 115, 104, 40, 116, 104, 105, 115, 46, 80, 97, 44,
            32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 33, 98, 32, 124, 124, 32, 33, 98, 46, 70, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110,
            101, 119, 32, 82, 40, 96, 67, 97, 110, 110, 111, 116, 32, 112, 97, 115, 115, 32, 34, 36, 123, 107, 98, 40,
            98, 41, 125, 34, 32, 97, 115, 32, 97, 32, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 98, 46, 70, 97, 46, 72, 97, 41, 32, 116, 104,
            114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 67, 97, 110, 110, 111, 116, 32, 112, 97, 115, 115, 32,
            100, 101, 108, 101, 116, 101, 100, 32, 111, 98, 106, 101, 99, 116, 32, 97, 115, 32, 97, 32, 112, 111, 105,
            110, 116, 101, 114, 32, 111, 102, 32, 116, 121, 112, 101, 32, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109,
            101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 116, 104, 105, 115, 46, 87,
            97, 32, 38, 38, 32, 98, 46, 70, 97, 46, 73, 97, 46, 87, 97, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            96, 67, 97, 110, 110, 111, 116, 32, 99, 111, 110, 118, 101, 114, 116, 32, 97, 114, 103, 117, 109, 101, 110,
            116, 32, 111, 102, 32, 116, 121, 112, 101, 32, 36, 123, 98, 46, 70, 97, 46, 77, 97, 32, 63, 32, 98, 46, 70,
            97, 46, 77, 97, 46, 110, 97, 109, 101, 32, 58, 32, 98, 46, 70, 97, 46, 73, 97, 46, 110, 97, 109, 101, 125,
            32, 116, 111, 32, 112, 97, 114, 97, 109, 101, 116, 101, 114, 32, 116, 121, 112, 101, 32, 36, 123, 116, 104,
            105, 115, 46, 110, 97, 109, 101, 125, 96, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 99, 32, 61, 32, 105, 98, 40, 98, 46, 70, 97, 46, 72, 97, 44, 32, 98, 46, 70, 97, 46,
            73, 97, 46, 71, 97, 44, 32, 116, 104, 105, 115, 46, 71, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 116, 104, 105, 115, 46, 88, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 118, 111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 98, 46, 70, 97, 46, 74, 97, 41, 32, 116, 104,
            114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 34, 80, 97, 115, 115, 105, 110, 103, 32, 114, 97, 119, 32,
            112, 111, 105, 110, 116, 101, 114, 32, 116, 111, 32, 115, 109, 97, 114, 116, 32, 112, 111, 105, 110, 116,
            101, 114, 32, 105, 115, 32, 105, 108, 108, 101, 103, 97, 108, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 115, 119, 105, 116, 99, 104, 32, 40, 116, 104, 105, 115, 46, 116, 98, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 48, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 98, 46, 70, 97, 46, 77, 97, 32, 61, 61, 61, 32, 116, 104, 105,
            115, 41, 32, 99, 32, 61, 32, 98, 46, 70, 97, 46, 74, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 101, 108, 115, 101, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 96, 67, 97, 110, 110, 111, 116, 32, 99, 111, 110, 118, 101, 114, 116, 32, 97, 114, 103,
            117, 109, 101, 110, 116, 32, 111, 102, 32, 116, 121, 112, 101, 32, 36, 123, 98, 46, 70, 97, 46, 77, 97, 32,
            63, 32, 98, 46, 70, 97, 46, 77, 97, 46, 110, 97, 109, 101, 32, 58, 32, 98, 46, 70, 97, 46, 73, 97, 46, 110,
            97, 109, 101, 125, 32, 116, 111, 32, 112, 97, 114, 97, 109, 101, 116, 101, 114, 32, 116, 121, 112, 101, 32,
            36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 114, 101, 97,
            107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 49, 58, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 61, 32, 98, 46, 70, 97, 46, 74, 97, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 114, 101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 99, 97, 115, 101, 32, 50, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 98, 46, 70, 97, 46, 77, 97, 32, 61, 61, 61, 32, 116, 104, 105, 115, 41, 32, 99, 32, 61,
            32, 98, 46, 70, 97, 46, 74, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 108,
            115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32,
            100, 32, 61, 32, 98, 46, 99, 108, 111, 110, 101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 99, 32, 61, 32, 116, 104, 105, 115, 46, 112, 98, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 109, 98, 40, 40, 41, 32, 61, 62, 32, 100, 91, 34, 100, 101, 108, 101, 116, 101, 34, 93, 40,
            41, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 117, 108, 108, 32, 33, 61, 61, 32, 97, 32, 38, 38, 32, 97,
            46, 112, 117, 115, 104, 40, 116, 104, 105, 115, 46, 80, 97, 44, 32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 114,
            101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 102, 97, 117, 108, 116, 58,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32,
            82, 40, 34, 85, 110, 115, 117, 112, 112, 111, 114, 116, 105, 110, 103, 32, 115, 104, 97, 114, 105, 110, 103,
            32, 112, 111, 108, 105, 99, 121, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 110,
            98, 40, 97, 44, 32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 110, 117, 108,
            108, 32, 61, 61, 61, 32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116,
            104, 105, 115, 46, 89, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 110, 117,
            108, 108, 32, 105, 115, 32, 110, 111, 116, 32, 97, 32, 118, 97, 108, 105, 100, 32, 36, 123, 116, 104, 105,
            115, 46, 110, 97, 109, 101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 33, 98, 46, 70, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 96, 67, 97, 110,
            110, 111, 116, 32, 112, 97, 115, 115, 32, 34, 36, 123, 107, 98, 40, 98, 41, 125, 34, 32, 97, 115, 32, 97,
            32, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 33, 98, 46, 70, 97, 46, 72, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32,
            82, 40, 96, 67, 97, 110, 110, 111, 116, 32, 112, 97, 115, 115, 32, 100, 101, 108, 101, 116, 101, 100, 32,
            111, 98, 106, 101, 99, 116, 32, 97, 115, 32, 97, 32, 112, 111, 105, 110, 116, 101, 114, 32, 111, 102, 32,
            116, 121, 112, 101, 32, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 98, 46, 70, 97, 46, 73, 97, 46, 87, 97, 41, 32, 116, 104, 114, 111,
            119, 32, 110, 101, 119, 32, 82, 40, 96, 67, 97, 110, 110, 111, 116, 32, 99, 111, 110, 118, 101, 114, 116,
            32, 97, 114, 103, 117, 109, 101, 110, 116, 32, 111, 102, 32, 116, 121, 112, 101, 32, 36, 123, 98, 46, 70,
            97, 46, 73, 97, 46, 110, 97, 109, 101, 125, 32, 116, 111, 32, 112, 97, 114, 97, 109, 101, 116, 101, 114, 32,
            116, 121, 112, 101, 32, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 96, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 98, 40, 98, 46, 70, 97, 46, 72, 97, 44, 32, 98,
            46, 70, 97, 46, 73, 97, 46, 71, 97, 44, 32, 116, 104, 105, 115, 46, 71, 97, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 40, 97, 44, 32, 98,
            44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103, 44, 32, 108, 44, 32, 109, 44,
            32, 110, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 110, 97, 109, 101, 32, 61,
            32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 71, 97, 32, 61, 32, 98, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 89, 97, 32, 61, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 116, 104, 105, 115, 46, 87, 97, 32, 61, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            105, 115, 46, 88, 97, 32, 61, 32, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 110,
            98, 32, 61, 32, 102, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 116, 98, 32, 61, 32,
            104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 99, 98, 32, 61, 32, 103, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 90, 97, 32, 61, 32, 108, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 116, 104, 105, 115, 46, 112, 98, 32, 61, 32, 109, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            105, 115, 46, 80, 97, 32, 61, 32, 110, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 101, 32, 124, 124, 32, 118,
            111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 98, 46, 76, 97, 32, 63, 32, 116, 104, 105, 115, 46, 116, 111, 87,
            105, 114, 101, 84, 121, 112, 101, 32, 61, 32, 108, 98, 32, 58, 32, 40, 116, 104, 105, 115, 46, 116, 111, 87,
            105, 114, 101, 84, 121, 112, 101, 32, 61, 32, 100, 32, 63, 32, 106, 98, 32, 58, 32, 110, 98, 44, 32, 116,
            104, 105, 115, 46, 79, 97, 32, 61, 32, 110, 117, 108, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 32, 32, 118, 97, 114, 32, 112, 98, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 107, 46, 104, 97, 115, 79, 119, 110, 80,
            114, 111, 112, 101, 114, 116, 121, 40, 97, 41, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 78,
            97, 40, 34, 82, 101, 112, 108, 97, 99, 105, 110, 103, 32, 110, 111, 110, 101, 120, 105, 115, 116, 101, 110,
            116, 32, 112, 117, 98, 108, 105, 99, 32, 115, 121, 109, 98, 111, 108, 34, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 118, 111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 107, 91, 97, 93, 46, 75, 97, 32, 38, 38, 32,
            118, 111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 99, 32, 63, 32, 107, 91, 97, 93, 46, 75, 97, 91, 99, 93, 32,
            61, 32, 98, 32, 58, 32, 40, 107, 91, 97, 93, 32, 61, 32, 98, 44, 32, 107, 91, 97, 93, 46, 86, 97, 32, 61,
            32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 83, 44, 32, 113, 98, 32, 61, 32, 40, 97, 44, 32,
            98, 44, 32, 99, 32, 61, 32, 91, 93, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 46,
            105, 110, 99, 108, 117, 100, 101, 115, 40, 34, 106, 34, 41, 32, 63, 32, 40, 97, 32, 61, 32, 97, 46, 114,
            101, 112, 108, 97, 99, 101, 40, 47, 112, 47, 103, 44, 32, 34, 105, 34, 41, 44, 32, 98, 32, 61, 32, 40, 48,
            44, 32, 107, 91, 34, 100, 121, 110, 67, 97, 108, 108, 95, 34, 32, 43, 32, 97, 93, 41, 40, 98, 44, 32, 46,
            46, 46, 99, 41, 41, 32, 58, 32, 98, 32, 61, 32, 83, 46, 103, 101, 116, 40, 98, 41, 40, 46, 46, 46, 99, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59, 10, 32, 32, 32, 32, 32,
            32, 125, 44, 32, 114, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 40, 46, 46, 46, 99, 41, 32,
            61, 62, 32, 113, 98, 40, 97, 44, 32, 98, 44, 32, 99, 41, 44, 32, 84, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32,
            61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 81, 40, 97, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 97, 46, 105, 110, 99, 108, 117, 100, 101, 115, 40, 34,
            106, 34, 41, 32, 63, 32, 114, 98, 40, 97, 44, 32, 98, 41, 32, 58, 32, 83, 46, 103, 101, 116, 40, 98, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32, 33,
            61, 32, 116, 121, 112, 101, 111, 102, 32, 99, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82,
            40, 96, 117, 110, 107, 110, 111, 119, 110, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 111, 105,
            110, 116, 101, 114, 32, 119, 105, 116, 104, 32, 115, 105, 103, 110, 97, 116, 117, 114, 101, 32, 36, 123, 97,
            125, 58, 32, 36, 123, 98, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110,
            32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 115, 98, 44, 32, 117, 98, 32, 61, 32, 40, 97, 41, 32,
            61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 116, 98, 40, 97, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 81, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 85, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 118, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 99, 40, 102, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 91, 102, 93, 32, 124, 124, 32, 78, 91, 102, 93, 32, 124, 124,
            32, 40, 77, 97, 91, 102, 93, 32, 63, 32, 77, 97, 91, 102, 93, 46, 102, 111, 114, 69, 97, 99, 104, 40, 99,
            41, 32, 58, 32, 40, 100, 46, 112, 117, 115, 104, 40, 102, 41, 44, 32, 101, 91, 102, 93, 32, 61, 32, 116,
            114, 117, 101, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 100, 32, 61, 32, 91, 93, 44, 32, 101, 32, 61, 32, 123, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 98, 46, 102, 111, 114, 69, 97, 99, 104, 40, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            114, 111, 119, 32, 110, 101, 119, 32, 115, 98, 40, 96, 36, 123, 97, 125, 58, 32, 96, 32, 43, 32, 100, 46,
            109, 97, 112, 40, 117, 98, 41, 46, 106, 111, 105, 110, 40, 91, 34, 44, 32, 34, 93, 41, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 125, 44, 32, 119, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 99, 32, 61, 32, 91, 93, 44, 32, 100, 32,
            61, 32, 48, 59, 32, 100, 32, 60, 32, 97, 59, 32, 100, 43, 43, 41, 32, 99, 46, 112, 117, 115, 104, 40, 68,
            91, 98, 32, 43, 32, 52, 32, 42, 32, 100, 32, 62, 62, 32, 50, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32,
            102, 117, 110, 99, 116, 105, 111, 110, 32, 120, 98, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            102, 111, 114, 32, 40, 118, 97, 114, 32, 98, 32, 61, 32, 49, 59, 32, 98, 32, 60, 32, 97, 46, 108, 101, 110,
            103, 116, 104, 59, 32, 43, 43, 98, 41, 32, 105, 102, 32, 40, 110, 117, 108, 108, 32, 33, 61, 61, 32, 97, 91,
            98, 93, 32, 38, 38, 32, 118, 111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 97, 91, 98, 93, 46, 79, 97, 41, 32,
            114, 101, 116, 117, 114, 110, 32, 116, 114, 117, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            102, 117, 110, 99, 116, 105, 111, 110, 32, 121, 98, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32,
            101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 32, 61, 32, 98, 46, 108, 101,
            110, 103, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 50, 32, 62, 32, 102, 41, 32,
            116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 34, 97, 114, 103, 84, 121, 112, 101, 115, 32, 97,
            114, 114, 97, 121, 32, 115, 105, 122, 101, 32, 109, 105, 115, 109, 97, 116, 99, 104, 33, 32, 77, 117, 115,
            116, 32, 97, 116, 32, 108, 101, 97, 115, 116, 32, 103, 101, 116, 32, 114, 101, 116, 117, 114, 110, 32, 118,
            97, 108, 117, 101, 32, 97, 110, 100, 32, 39, 116, 104, 105, 115, 39, 32, 116, 121, 112, 101, 115, 33, 34,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 32, 61, 32, 110, 117, 108, 108, 32, 33,
            61, 61, 32, 98, 91, 49, 93, 32, 38, 38, 32, 110, 117, 108, 108, 32, 33, 61, 61, 32, 99, 44, 32, 103, 32, 61,
            32, 120, 98, 40, 98, 41, 44, 32, 108, 32, 61, 32, 34, 118, 111, 105, 100, 34, 32, 33, 61, 61, 32, 98, 91,
            48, 93, 46, 110, 97, 109, 101, 44, 32, 109, 32, 61, 32, 102, 32, 45, 32, 50, 44, 32, 110, 32, 61, 32, 65,
            114, 114, 97, 121, 40, 109, 41, 44, 32, 113, 32, 61, 32, 91, 93, 44, 32, 114, 32, 61, 32, 91, 93, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 100, 98, 40, 97, 44, 32, 102, 117, 110,
            99, 116, 105, 111, 110, 40, 46, 46, 46, 65, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114,
            46, 108, 101, 110, 103, 116, 104, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 113, 46,
            108, 101, 110, 103, 116, 104, 32, 61, 32, 104, 32, 63, 32, 50, 32, 58, 32, 49, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 113, 91, 48, 93, 32, 61, 32, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 104, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 118,
            32, 61, 32, 98, 91, 49, 93, 46, 116, 111, 87, 105, 114, 101, 84, 121, 112, 101, 40, 114, 44, 32, 116, 104,
            105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 113, 91, 49, 93, 32, 61, 32, 118, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114,
            32, 40, 118, 97, 114, 32, 119, 32, 61, 32, 48, 59, 32, 119, 32, 60, 32, 109, 59, 32, 43, 43, 119, 41, 32,
            110, 91, 119, 93, 32, 61, 32, 98, 91, 119, 32, 43, 32, 50, 93, 46, 116, 111, 87, 105, 114, 101, 84, 121,
            112, 101, 40, 114, 44, 32, 65, 91, 119, 93, 41, 44, 32, 113, 46, 112, 117, 115, 104, 40, 110, 91, 119, 93,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 65, 32, 61, 32, 100, 40, 46, 46, 46, 113, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 103, 41, 32, 76, 97, 40, 114, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 101, 108, 115, 101, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102,
            111, 114, 32, 40, 119, 32, 61, 32, 104, 32, 63, 32, 49, 32, 58, 32, 50, 59, 32, 119, 32, 60, 32, 98, 46,
            108, 101, 110, 103, 116, 104, 59, 32, 119, 43, 43, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 118, 97, 114, 32, 71, 32, 61, 32, 49, 32, 61, 61, 61, 32, 119, 32, 63, 32, 118, 32, 58, 32,
            110, 91, 119, 32, 45, 32, 50, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 117,
            108, 108, 32, 33, 61, 61, 32, 98, 91, 119, 93, 46, 79, 97, 32, 38, 38, 32, 98, 91, 119, 93, 46, 79, 97, 40,
            71, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 118, 32, 61, 32, 108, 32, 63, 32, 98, 91, 48, 93, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121,
            112, 101, 40, 65, 41, 32, 58, 32, 118, 111, 105, 100, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 118, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 122, 98, 32, 61, 32, 40, 97, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 97, 46, 116, 114, 105, 109, 40, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 98, 32, 61, 32, 97, 46, 105, 110, 100, 101, 120,
            79, 102, 40, 34, 40, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 45,
            49, 32, 33, 61, 61, 32, 98, 32, 63, 32, 97, 46, 115, 117, 98, 115, 116, 114, 40, 48, 44, 32, 98, 41, 32, 58,
            32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 65, 98, 32, 61, 32, 91, 93, 44, 32, 86, 32, 61, 32, 91,
            93, 44, 32, 66, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 57, 32,
            60, 32, 97, 32, 38, 38, 32, 48, 32, 61, 61, 61, 32, 45, 45, 86, 91, 97, 32, 43, 32, 49, 93, 32, 38, 38, 32,
            40, 86, 91, 97, 93, 32, 61, 32, 118, 111, 105, 100, 32, 48, 44, 32, 65, 98, 46, 112, 117, 115, 104, 40, 97,
            41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 68, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101,
            119, 32, 82, 40, 34, 67, 97, 110, 110, 111, 116, 32, 117, 115, 101, 32, 100, 101, 108, 101, 116, 101, 100,
            32, 118, 97, 108, 46, 32, 104, 97, 110, 100, 108, 101, 32, 61, 32, 34, 32, 43, 32, 97, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 86, 91, 97, 93, 59, 10, 32, 32, 32, 32, 32, 32,
            125, 44, 32, 109, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115,
            119, 105, 116, 99, 104, 32, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115,
            101, 32, 118, 111, 105, 100, 32, 48, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 110, 117, 108,
            108, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 52, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 116, 114, 117, 101, 58, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 54, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 99, 97, 115, 101, 32, 102, 97, 108, 115, 101, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 114, 101, 116, 117, 114, 110, 32, 56, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 102,
            97, 117, 108, 116, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 98,
            32, 61, 32, 65, 98, 46, 112, 111, 112, 40, 41, 32, 124, 124, 32, 86, 46, 108, 101, 110, 103, 116, 104, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 86, 91, 98, 93, 32, 61, 32, 97, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 86, 91, 98, 32, 43, 32, 49, 93, 32, 61, 32, 49, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 69, 98, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            110, 97, 109, 101, 58, 32, 34, 101, 109, 115, 99, 114, 105, 112, 116, 101, 110, 58, 58, 118, 97, 108, 34,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32,
            40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61,
            32, 68, 98, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 66, 98, 40, 97, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 40,
            97, 44, 32, 98, 41, 32, 61, 62, 32, 109, 98, 40, 98, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 78, 97, 58,
            32, 56, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109,
            80, 111, 105, 110, 116, 101, 114, 58, 32, 76, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 79, 97, 58, 32, 110,
            117, 108, 108, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 70, 98, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99,
            41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 119, 105, 116, 99, 104, 32, 40, 98, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 49, 58, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99, 32, 63, 32, 102, 117, 110, 99, 116, 105,
            111, 110, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 40,
            117, 91, 100, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 58, 32, 102, 117,
            110, 99, 116, 105, 111, 110, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84,
            121, 112, 101, 40, 120, 91, 100, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 50, 58, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99, 32, 63, 32, 102, 117, 110, 99, 116, 105, 111, 110,
            40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114,
            110, 32, 116, 104, 105, 115, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 40, 121, 91, 100,
            32, 62, 62, 32, 49, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 58, 32, 102,
            117, 110, 99, 116, 105, 111, 110, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84,
            121, 112, 101, 40, 122, 91, 100, 32, 62, 62, 32, 49, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 52, 58, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99, 32, 63, 32, 102, 117, 110, 99,
            116, 105, 111, 110, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112,
            101, 40, 67, 91, 100, 32, 62, 62, 32, 50, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 32, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111,
            109, 87, 105, 114, 101, 84, 121, 112, 101, 40, 68, 91, 100, 32, 62, 62, 32, 50, 93, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 102, 97,
            117, 108, 116, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110,
            101, 119, 32, 84, 121, 112, 101, 69, 114, 114, 111, 114, 40, 96, 105, 110, 118, 97, 108, 105, 100, 32, 105,
            110, 116, 101, 103, 101, 114, 32, 119, 105, 100, 116, 104, 32, 40, 36, 123, 98, 125, 41, 58, 32, 36, 123,
            97, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 71,
            98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97,
            114, 32, 99, 32, 61, 32, 78, 91, 97, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111,
            105, 100, 32, 48, 32, 61, 61, 61, 32, 99, 41, 32, 116, 104, 114, 111, 119, 32, 97, 32, 61, 32, 96, 36, 123,
            98, 125, 32, 104, 97, 115, 32, 117, 110, 107, 110, 111, 119, 110, 32, 116, 121, 112, 101, 32, 36, 123, 117,
            98, 40, 97, 41, 125, 96, 44, 32, 110, 101, 119, 32, 82, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 107, 98, 32, 61, 32, 40,
            97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 110, 117, 108, 108, 32,
            61, 61, 61, 32, 97, 41, 32, 114, 101, 116, 117, 114, 110, 32, 34, 110, 117, 108, 108, 34, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 116, 121, 112, 101, 111, 102, 32, 97, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 111, 98, 106, 101, 99, 116, 34, 32, 61,
            61, 61, 32, 98, 32, 124, 124, 32, 34, 97, 114, 114, 97, 121, 34, 32, 61, 61, 61, 32, 98, 32, 124, 124, 32,
            34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32, 61, 61, 61, 32, 98, 32, 63, 32, 97, 46, 116, 111, 83,
            116, 114, 105, 110, 103, 40, 41, 32, 58, 32, 34, 34, 32, 43, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            44, 32, 72, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            115, 119, 105, 116, 99, 104, 32, 40, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97,
            115, 101, 32, 52, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            102, 117, 110, 99, 116, 105, 111, 110, 40, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111, 109, 87, 105, 114, 101,
            84, 121, 112, 101, 40, 111, 97, 91, 99, 32, 62, 62, 32, 50, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 56, 58, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 117, 110, 99, 116, 105,
            111, 110, 40, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 40,
            112, 97, 91, 99, 32, 62, 62, 32, 51, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 102, 97, 117, 108, 116, 58, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 84, 121, 112, 101, 69, 114,
            114, 111, 114, 40, 96, 105, 110, 118, 97, 108, 105, 100, 32, 102, 108, 111, 97, 116, 32, 119, 105, 100, 116,
            104, 32, 40, 36, 123, 98, 125, 41, 58, 32, 36, 123, 97, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 73, 98, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32,
            61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 119, 105, 116, 99, 104, 32, 40, 98, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 49, 58, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99, 32, 63, 32, 40, 100, 41, 32, 61, 62, 32, 117, 91,
            100, 93, 32, 58, 32, 40, 100, 41, 32, 61, 62, 32, 120, 91, 100, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 99, 97, 115, 101, 32, 50, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 99, 32, 63, 32, 40, 100, 41, 32, 61, 62, 32, 121, 91, 100, 32, 62, 62, 32, 49, 93, 32,
            58, 32, 40, 100, 41, 32, 61, 62, 32, 122, 91, 100, 32, 62, 62, 32, 49, 93, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 99, 97, 115, 101, 32, 52, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 99, 32, 63, 32, 40, 100, 41, 32, 61, 62, 32, 67, 91, 100, 32, 62, 62, 32, 50, 93,
            32, 58, 32, 40, 100, 41, 32, 61, 62, 32, 68, 91, 100, 32, 62, 62, 32, 50, 93, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 100, 101, 102, 97, 117, 108, 116, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 84, 121, 112, 101, 69, 114, 114, 111, 114, 40, 96, 105,
            110, 118, 97, 108, 105, 100, 32, 105, 110, 116, 101, 103, 101, 114, 32, 119, 105, 100, 116, 104, 32, 40, 36,
            123, 98, 125, 41, 58, 32, 36, 123, 97, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 125, 44, 32, 74, 98, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 97, 115, 115, 105, 103, 110,
            40, 123, 32, 111, 112, 116, 105, 111, 110, 97, 108, 58, 32, 116, 114, 117, 101, 32, 125, 44, 32, 69, 98, 41,
            44, 32, 75, 98, 32, 61, 32, 34, 117, 110, 100, 101, 102, 105, 110, 101, 100, 34, 32, 33, 61, 32, 116, 121,
            112, 101, 111, 102, 32, 84, 101, 120, 116, 68, 101, 99, 111, 100, 101, 114, 32, 63, 32, 110, 101, 119, 32,
            84, 101, 120, 116, 68, 101, 99, 111, 100, 101, 114, 40, 34, 117, 116, 102, 45, 49, 54, 108, 101, 34, 41, 32,
            58, 32, 118, 111, 105, 100, 32, 48, 44, 32, 76, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 97, 32, 62, 62, 32, 49, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 100, 32, 61, 32, 99, 32, 43, 32, 98,
            32, 47, 32, 50, 59, 32, 33, 40, 99, 32, 62, 61, 32, 100, 41, 32, 38, 38, 32, 122, 91, 99, 93, 59, 32, 41,
            32, 43, 43, 99, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 60, 60, 61, 32, 49, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 51, 50, 32, 60, 32, 99, 32, 45, 32, 97, 32, 38, 38, 32, 75, 98, 41, 32,
            114, 101, 116, 117, 114, 110, 32, 75, 98, 46, 100, 101, 99, 111, 100, 101, 40, 120, 46, 115, 117, 98, 97,
            114, 114, 97, 121, 40, 97, 44, 32, 99, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 61, 32, 34,
            34, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 100, 32, 61, 32, 48, 59, 32, 33, 40, 100,
            32, 62, 61, 32, 98, 32, 47, 32, 50, 41, 59, 32, 43, 43, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 118, 97, 114, 32, 101, 32, 61, 32, 121, 91, 97, 32, 43, 32, 50, 32, 42, 32, 100, 32, 62, 62, 32,
            49, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 48, 32, 61, 61, 32, 101, 41, 32,
            98, 114, 101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 43, 61, 32, 83, 116, 114,
            105, 110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 101, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99, 59, 10,
            32, 32, 32, 32, 32, 32, 125, 44, 32, 77, 98, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 99, 32, 58, 32,
            99, 32, 61, 32, 50, 49, 52, 55, 52, 56, 51, 54, 52, 55, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 50, 32, 62, 32, 99, 41, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 99, 32, 45, 61, 32, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32,
            98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 61, 32, 99, 32, 60, 32, 50, 32, 42, 32, 97, 46, 108,
            101, 110, 103, 116, 104, 32, 63, 32, 99, 32, 47, 32, 50, 32, 58, 32, 97, 46, 108, 101, 110, 103, 116, 104,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 101, 32, 61, 32, 48, 59,
            32, 101, 32, 60, 32, 99, 59, 32, 43, 43, 101, 41, 32, 121, 91, 98, 32, 62, 62, 32, 49, 93, 32, 61, 32, 97,
            46, 99, 104, 97, 114, 67, 111, 100, 101, 65, 116, 40, 101, 41, 44, 32, 98, 32, 43, 61, 32, 50, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 121, 91, 98, 32, 62, 62, 32, 49, 93, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 32, 45, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44,
            32, 78, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 50, 32, 42, 32, 97, 46, 108, 101, 110, 103, 116, 104,
            44, 32, 79, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            102, 111, 114, 32, 40, 118, 97, 114, 32, 99, 32, 61, 32, 48, 44, 32, 100, 32, 61, 32, 34, 34, 59, 32, 33,
            40, 99, 32, 62, 61, 32, 98, 32, 47, 32, 52, 41, 59, 32, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 101, 32, 61, 32, 67, 91, 97, 32, 43, 32, 52, 32, 42, 32, 99, 32, 62, 62, 32, 50, 93,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 48, 32, 61, 61, 32, 101, 41, 32, 98, 114,
            101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 43, 43, 99, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 54, 53, 53, 51, 54, 32, 60, 61, 32, 101, 32, 63, 32, 40, 101, 32, 45, 61, 32, 54, 53, 53,
            51, 54, 44, 32, 100, 32, 43, 61, 32, 83, 116, 114, 105, 110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114,
            67, 111, 100, 101, 40, 53, 53, 50, 57, 54, 32, 124, 32, 101, 32, 62, 62, 32, 49, 48, 44, 32, 53, 54, 51, 50,
            48, 32, 124, 32, 101, 32, 38, 32, 49, 48, 50, 51, 41, 41, 32, 58, 32, 100, 32, 43, 61, 32, 83, 116, 114,
            105, 110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 101, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 100, 59, 10,
            32, 32, 32, 32, 32, 32, 125, 44, 32, 80, 98, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 99, 32, 58, 32,
            99, 32, 61, 32, 50, 49, 52, 55, 52, 56, 51, 54, 52, 55, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 52, 32, 62, 32, 99, 41, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 61, 32, 100,
            32, 43, 32, 99, 32, 45, 32, 52, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114,
            32, 101, 32, 61, 32, 48, 59, 32, 101, 32, 60, 32, 97, 46, 108, 101, 110, 103, 116, 104, 59, 32, 43, 43, 101,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 32, 61, 32, 97, 46, 99, 104,
            97, 114, 67, 111, 100, 101, 65, 116, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 53, 53, 50, 57, 54, 32, 60, 61, 32, 102, 32, 38, 38, 32, 53, 55, 51, 52, 51, 32, 62, 61, 32, 102,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 32, 61, 32, 97, 46,
            99, 104, 97, 114, 67, 111, 100, 101, 65, 116, 40, 43, 43, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 102, 32, 61, 32, 54, 53, 53, 51, 54, 32, 43, 32, 40, 40, 102, 32, 38, 32, 49, 48, 50, 51,
            41, 32, 60, 60, 32, 49, 48, 41, 32, 124, 32, 104, 32, 38, 32, 49, 48, 50, 51, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 67, 91, 98, 32, 62, 62, 32, 50, 93, 32,
            61, 32, 102, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 43, 61, 32, 52, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 98, 32, 43, 32, 52, 32, 62, 32, 99, 41, 32, 98, 114, 101, 97, 107,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 67, 91, 98, 32, 62, 62, 32,
            50, 93, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 32,
            45, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 81, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 98, 32, 61, 32, 48, 44,
            32, 99, 32, 61, 32, 48, 59, 32, 99, 32, 60, 32, 97, 46, 108, 101, 110, 103, 116, 104, 59, 32, 43, 43, 99,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 97, 46, 99, 104,
            97, 114, 67, 111, 100, 101, 65, 116, 40, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 53, 53, 50,
            57, 54, 32, 60, 61, 32, 100, 32, 38, 38, 32, 53, 55, 51, 52, 51, 32, 62, 61, 32, 100, 32, 38, 38, 32, 43,
            43, 99, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 43, 61, 32, 52, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59, 10, 32, 32,
            32, 32, 32, 32, 125, 44, 32, 82, 98, 32, 61, 32, 91, 93, 44, 32, 83, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 82, 98, 46, 108, 101, 110,
            103, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 82, 98, 46, 112, 117, 115, 104, 40, 97, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            44, 32, 84, 98, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            102, 111, 114, 32, 40, 118, 97, 114, 32, 99, 32, 61, 32, 65, 114, 114, 97, 121, 40, 97, 41, 44, 32, 100, 32,
            61, 32, 48, 59, 32, 100, 32, 60, 32, 97, 59, 32, 43, 43, 100, 41, 32, 99, 91, 100, 93, 32, 61, 32, 71, 98,
            40, 68, 91, 98, 32, 43, 32, 52, 32, 42, 32, 100, 32, 62, 62, 32, 50, 93, 44, 32, 34, 112, 97, 114, 97, 109,
            101, 116, 101, 114, 32, 34, 32, 43, 32, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 85, 98, 32, 61, 32, 82, 101, 102, 108, 101,
            99, 116, 46, 99, 111, 110, 115, 116, 114, 117, 99, 116, 44, 32, 86, 98, 32, 61, 32, 123, 125, 44, 32, 87,
            98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            40, 97, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 68, 97, 32, 124, 124, 32, 34, 117, 110, 119,
            105, 110, 100, 34, 32, 61, 61, 32, 97, 41, 41, 32, 116, 104, 114, 111, 119, 32, 97, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 44, 32, 88, 98, 32, 61, 32, 48, 44, 32, 89, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            110, 97, 32, 61, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 70, 97, 32, 124, 124, 32, 48, 32, 60, 32,
            88, 98, 32, 124, 124, 32, 40, 40, 95, 97, 50, 32, 61, 32, 107, 46, 111, 110, 69, 120, 105, 116, 41, 32, 61,
            61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 50, 46, 99, 97, 108,
            108, 40, 107, 44, 32, 97, 41, 44, 32, 109, 97, 32, 61, 32, 116, 114, 117, 101, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 68, 97, 40, 97, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 44, 32, 90, 98, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 33, 109, 97, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 97, 40, 41, 44, 32, 33, 40, 70, 97,
            32, 124, 124, 32, 48, 32, 60, 32, 88, 98, 41, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 97, 32,
            61, 32, 97, 32, 61, 32, 110, 97, 44, 32, 89, 98, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 87, 98, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 98, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 87, 98, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 36, 98, 32, 61, 32, 123, 125, 44, 32, 98, 99,
            32, 61, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 97, 99,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 97, 32, 61, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 85, 83, 69, 82, 58, 32, 34, 119, 101, 98, 95, 117, 115, 101, 114,
            34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 76, 79, 71, 78, 65, 77, 69, 58, 32, 34, 119,
            101, 98, 95, 117, 115, 101, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 65, 84, 72,
            58, 32, 34, 47, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 87, 68, 58, 32, 34, 47, 34,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 72, 79, 77, 69, 58, 32, 34, 47, 104, 111, 109, 101,
            47, 119, 101, 98, 95, 117, 115, 101, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 76,
            65, 78, 71, 58, 32, 40, 34, 111, 98, 106, 101, 99, 116, 34, 32, 61, 61, 32, 116, 121, 112, 101, 111, 102,
            32, 110, 97, 118, 105, 103, 97, 116, 111, 114, 32, 38, 38, 32, 110, 97, 118, 105, 103, 97, 116, 111, 114,
            46, 108, 97, 110, 103, 117, 97, 103, 101, 115, 32, 38, 38, 32, 110, 97, 118, 105, 103, 97, 116, 111, 114,
            46, 108, 97, 110, 103, 117, 97, 103, 101, 115, 91, 48, 93, 32, 124, 124, 32, 34, 67, 34, 41, 46, 114, 101,
            112, 108, 97, 99, 101, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 34, 45, 34, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 34, 95, 34, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 41, 32, 43, 32, 34, 46, 85, 84, 70, 45, 56, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 95, 58, 32, 101, 97, 32, 124, 124, 32, 34, 46, 47, 116, 104, 105, 115, 46, 112, 114, 111, 103, 114,
            97, 109, 34, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 102, 111, 114, 32, 40, 98, 32, 105, 110, 32, 36, 98, 41, 32, 118, 111, 105, 100, 32, 48, 32,
            61, 61, 61, 32, 36, 98, 91, 98, 93, 32, 63, 32, 100, 101, 108, 101, 116, 101, 32, 97, 91, 98, 93, 32, 58,
            32, 97, 91, 98, 93, 32, 61, 32, 36, 98, 91, 98, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97,
            114, 32, 99, 32, 61, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 98,
            32, 105, 110, 32, 97, 41, 32, 99, 46, 112, 117, 115, 104, 40, 96, 36, 123, 98, 125, 61, 36, 123, 97, 91, 98,
            93, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 99, 32, 61, 32, 99, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 97, 99, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 44, 32, 97, 99, 44, 32, 99, 99, 32, 61, 32, 91, 110, 117, 108, 108, 44, 32,
            91, 93, 44, 32, 91, 93, 93, 44, 32, 100, 99, 32, 61, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 34, 111, 98, 106, 101, 99, 116, 34, 32, 61, 61, 32, 116, 121, 112, 101,
            111, 102, 32, 99, 114, 121, 112, 116, 111, 32, 38, 38, 32, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34,
            32, 61, 61, 32, 116, 121, 112, 101, 111, 102, 32, 99, 114, 121, 112, 116, 111, 46, 103, 101, 116, 82, 97,
            110, 100, 111, 109, 86, 97, 108, 117, 101, 115, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 40, 97, 41, 32, 61, 62, 32, 99, 114, 121, 112, 116, 111, 46, 103, 101, 116, 82, 97,
            110, 100, 111, 109, 86, 97, 108, 117, 101, 115, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 119, 97,
            40, 34, 105, 110, 105, 116, 82, 97, 110, 100, 111, 109, 68, 101, 118, 105, 99, 101, 34, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 125, 44, 32, 101, 99, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 40, 101, 99, 32, 61, 32, 100,
            99, 40, 41, 41, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 78, 97, 32, 61, 32, 107, 46, 73, 110, 116, 101,
            114, 110, 97, 108, 69, 114, 114, 111, 114, 32, 61, 32, 99, 108, 97, 115, 115, 32, 101, 120, 116, 101, 110,
            100, 115, 32, 69, 114, 114, 111, 114, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            114, 117, 99, 116, 111, 114, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 115, 117, 112,
            101, 114, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 110, 97, 109,
            101, 32, 61, 32, 34, 73, 110, 116, 101, 114, 110, 97, 108, 69, 114, 114, 111, 114, 34, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32,
            40, 118, 97, 114, 32, 102, 99, 32, 61, 32, 65, 114, 114, 97, 121, 40, 50, 53, 54, 41, 44, 32, 103, 99, 32,
            61, 32, 48, 59, 32, 50, 53, 54, 32, 62, 32, 103, 99, 59, 32, 43, 43, 103, 99, 41, 32, 102, 99, 91, 103, 99,
            93, 32, 61, 32, 83, 116, 114, 105, 110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101,
            40, 103, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 79, 97, 32, 61, 32, 102, 99, 59, 10, 32, 32, 32, 32, 32,
            32, 82, 32, 61, 32, 107, 46, 66, 105, 110, 100, 105, 110, 103, 69, 114, 114, 111, 114, 32, 61, 32, 99, 108,
            97, 115, 115, 32, 101, 120, 116, 101, 110, 100, 115, 32, 69, 114, 114, 111, 114, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 40, 97, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 115, 117, 112, 101, 114, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 116, 104, 105, 115, 46, 110, 97, 109, 101, 32, 61, 32, 34, 66, 105, 110, 100, 105, 110, 103, 69,
            114, 114, 111, 114, 34, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59,
            10, 32, 32, 32, 32, 32, 32, 79, 98, 106, 101, 99, 116, 46, 97, 115, 115, 105, 103, 110, 40, 99, 98, 46, 112,
            114, 111, 116, 111, 116, 121, 112, 101, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 115, 65, 108,
            105, 97, 115, 79, 102, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 97, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 40, 116, 104, 105, 115, 32, 105, 110, 115, 116, 97, 110,
            99, 101, 111, 102, 32, 99, 98, 32, 38, 38, 32, 97, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32,
            99, 98, 41, 41, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 116, 104, 105, 115, 46, 70, 97, 46, 73, 97, 46, 71,
            97, 44, 32, 99, 32, 61, 32, 116, 104, 105, 115, 46, 70, 97, 46, 72, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 97, 46, 70, 97, 32, 61, 32, 97, 46, 70, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 100, 32, 61, 32, 97, 46, 70, 97, 46, 73, 97, 46, 71, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 102, 111, 114, 32, 40, 97, 32, 61, 32, 97, 46, 70, 97, 46, 72, 97, 59, 32, 98, 46, 76, 97, 59,
            32, 41, 32, 99, 32, 61, 32, 98, 46, 85, 97, 40, 99, 41, 44, 32, 98, 32, 61, 32, 98, 46, 76, 97, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 59, 32, 100, 46, 76, 97, 59, 32, 41, 32, 97, 32,
            61, 32, 100, 46, 85, 97, 40, 97, 41, 44, 32, 100, 32, 61, 32, 100, 46, 76, 97, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 32, 61, 61, 61, 32, 100, 32, 38, 38, 32, 99, 32,
            61, 61, 61, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99,
            108, 111, 110, 101, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 70, 97, 46, 72, 97, 32, 124, 124, 32, 81, 97, 40, 116, 104, 105,
            115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 70, 97,
            46, 84, 97, 41, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 70, 97, 46, 99, 111, 117, 110,
            116, 46, 118, 97, 108, 117, 101, 32, 43, 61, 32, 49, 44, 32, 116, 104, 105, 115, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 118, 97, 114, 32, 97, 32, 61, 32, 97, 98, 44, 32, 98, 32, 61, 32, 79, 98, 106, 101, 99,
            116, 44, 32, 99, 32, 61, 32, 98, 46, 99, 114, 101, 97, 116, 101, 44, 32, 100, 32, 61, 32, 79, 98, 106, 101,
            99, 116, 46, 103, 101, 116, 80, 114, 111, 116, 111, 116, 121, 112, 101, 79, 102, 40, 116, 104, 105, 115, 41,
            44, 32, 101, 32, 61, 32, 116, 104, 105, 115, 46, 70, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97,
            32, 61, 32, 97, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 46, 99, 97, 108, 108, 40, 98,
            44, 32, 100, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 70, 97, 58, 32, 123,
            32, 118, 97, 108, 117, 101, 58, 32, 123, 32, 99, 111, 117, 110, 116, 58, 32, 101, 46, 99, 111, 117, 110,
            116, 44, 32, 82, 97, 58, 32, 101, 46, 82, 97, 44, 32, 84, 97, 58, 32, 101, 46, 84, 97, 44, 32, 72, 97, 58,
            32, 101, 46, 72, 97, 44, 32, 73, 97, 58, 32, 101, 46, 73, 97, 44, 32, 74, 97, 58, 32, 101, 46, 74, 97, 44,
            32, 77, 97, 58, 32, 101, 46, 77, 97, 32, 125, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97,
            46, 70, 97, 46, 99, 111, 117, 110, 116, 46, 118, 97, 108, 117, 101, 32, 43, 61, 32, 49, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 97, 46, 70, 97, 46, 82, 97, 32, 61, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 91, 34, 100, 101, 108, 101, 116, 101, 34, 93, 40, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 70, 97, 46, 72, 97, 32, 124, 124,
            32, 81, 97, 40, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40,
            116, 104, 105, 115, 46, 70, 97, 46, 82, 97, 32, 38, 38, 32, 33, 116, 104, 105, 115, 46, 70, 97, 46, 84, 97,
            41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 34, 79, 98, 106, 101, 99, 116, 32, 97, 108,
            114, 101, 97, 100, 121, 32, 115, 99, 104, 101, 100, 117, 108, 101, 100, 32, 102, 111, 114, 32, 100, 101,
            108, 101, 116, 105, 111, 110, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 83, 97, 40, 116, 104,
            105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 97, 32, 61, 32, 116, 104,
            105, 115, 46, 70, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 45, 45, 97, 46, 99, 111, 117, 110,
            116, 46, 118, 97, 108, 117, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48, 32, 61, 61, 61, 32, 97,
            46, 99, 111, 117, 110, 116, 46, 118, 97, 108, 117, 101, 32, 38, 38, 32, 40, 97, 46, 74, 97, 32, 63, 32, 97,
            46, 77, 97, 46, 80, 97, 40, 97, 46, 74, 97, 41, 32, 58, 32, 97, 46, 73, 97, 46, 71, 97, 46, 80, 97, 40, 97,
            46, 72, 97, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 70, 97, 46, 84,
            97, 32, 124, 124, 32, 40, 116, 104, 105, 115, 46, 70, 97, 46, 74, 97, 32, 61, 32, 118, 111, 105, 100, 32,
            48, 44, 32, 116, 104, 105, 115, 46, 70, 97, 46, 72, 97, 32, 61, 32, 118, 111, 105, 100, 32, 48, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 115, 68, 101, 108, 101,
            116, 101, 100, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 33, 116, 104, 105, 115, 46, 70, 97, 46, 72, 97, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 108, 101, 116, 101,
            76, 97, 116, 101, 114, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 70, 97, 46, 72, 97, 32, 124, 124, 32, 81, 97, 40, 116, 104,
            105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 70,
            97, 46, 82, 97, 32, 38, 38, 32, 33, 116, 104, 105, 115, 46, 70, 97, 46, 84, 97, 41, 32, 116, 104, 114, 111,
            119, 32, 110, 101, 119, 32, 82, 40, 34, 79, 98, 106, 101, 99, 116, 32, 97, 108, 114, 101, 97, 100, 121, 32,
            115, 99, 104, 101, 100, 117, 108, 101, 100, 32, 102, 111, 114, 32, 100, 101, 108, 101, 116, 105, 111, 110,
            34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 87, 97, 46, 112, 117, 115, 104, 40, 116, 104, 105,
            115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 49, 32, 61, 61, 61, 32, 87, 97, 46, 108, 101, 110,
            103, 116, 104, 32, 38, 38, 32, 89, 97, 32, 38, 38, 32, 89, 97, 40, 88, 97, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 70, 97, 46, 82, 97, 32, 61, 32, 116, 114, 117, 101, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46,
            103, 101, 116, 73, 110, 104, 101, 114, 105, 116, 101, 100, 73, 110, 115, 116, 97, 110, 99, 101, 67, 111,
            117, 110, 116, 32, 61, 32, 40, 41, 32, 61, 62, 32, 79, 98, 106, 101, 99, 116, 46, 107, 101, 121, 115, 40,
            90, 97, 41, 46, 108, 101, 110, 103, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 103, 101, 116, 76,
            105, 118, 101, 73, 110, 104, 101, 114, 105, 116, 101, 100, 73, 110, 115, 116, 97, 110, 99, 101, 115, 32, 61,
            32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 97, 32, 61, 32, 91,
            93, 44, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 98, 32, 105, 110, 32, 90, 97,
            41, 32, 90, 97, 46, 104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 40, 98, 41, 32, 38,
            38, 32, 97, 46, 112, 117, 115, 104, 40, 90, 97, 91, 98, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 107,
            46, 102, 108, 117, 115, 104, 80, 101, 110, 100, 105, 110, 103, 68, 101, 108, 101, 116, 101, 115, 32, 61, 32,
            88, 97, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 115, 101, 116, 68, 101, 108, 97, 121, 70, 117, 110, 99,
            116, 105, 111, 110, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 89, 97,
            32, 61, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 87, 97, 46, 108, 101, 110, 103, 116, 104, 32, 38,
            38, 32, 89, 97, 32, 38, 38, 32, 89, 97, 40, 88, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32,
            32, 32, 32, 32, 79, 98, 106, 101, 99, 116, 46, 97, 115, 115, 105, 103, 110, 40, 111, 98, 46, 112, 114, 111,
            116, 111, 116, 121, 112, 101, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 98, 40, 97, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 99, 98, 32, 38, 38, 32, 40, 97, 32, 61,
            32, 116, 104, 105, 115, 46, 99, 98, 40, 97, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 97, 98, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95,
            97, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 95, 97, 50, 32, 61, 32, 116, 104, 105, 115, 46,
            80, 97, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97,
            50, 46, 99, 97, 108, 108, 40, 116, 104, 105, 115, 44, 32, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 78, 97, 58, 32, 56, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110, 116, 101, 114, 58, 32, 76,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32,
            102, 117, 110, 99, 116, 105, 111, 110, 40, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102,
            117, 110, 99, 116, 105, 111, 110, 32, 98, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 88, 97, 32, 63, 32, 98, 98, 40, 116, 104, 105,
            115, 46, 71, 97, 46, 83, 97, 44, 32, 123, 32, 73, 97, 58, 32, 116, 104, 105, 115, 46, 110, 98, 44, 32, 72,
            97, 58, 32, 99, 44, 32, 77, 97, 58, 32, 116, 104, 105, 115, 44, 32, 74, 97, 58, 32, 97, 32, 125, 41, 32, 58,
            32, 98, 98, 40, 116, 104, 105, 115, 46, 71, 97, 46, 83, 97, 44, 32, 123, 32, 73, 97, 58, 32, 116, 104, 105,
            115, 44, 32, 72, 97, 58, 32, 97, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 116, 104, 105, 115, 46, 105, 98, 40,
            97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 99, 41, 32, 114, 101, 116,
            117, 114, 110, 32, 116, 104, 105, 115, 46, 97, 98, 40, 97, 41, 44, 32, 110, 117, 108, 108, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 36, 97, 40, 116, 104, 105, 115, 46, 71,
            97, 44, 32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100,
            32, 48, 32, 33, 61, 61, 32, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 48, 32, 61, 61, 61, 32, 100, 46, 70, 97, 46, 99, 111, 117, 110, 116, 46, 118, 97, 108, 117, 101, 41,
            32, 114, 101, 116, 117, 114, 110, 32, 100, 46, 70, 97, 46, 72, 97, 32, 61, 32, 99, 44, 32, 100, 46, 70, 97,
            46, 74, 97, 32, 61, 32, 97, 44, 32, 100, 46, 99, 108, 111, 110, 101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 100, 32, 61, 32, 100, 46, 99, 108, 111, 110, 101, 40, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 97, 98, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 32, 61, 32, 116, 104, 105, 115, 46, 71, 97, 46,
            104, 98, 40, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 32, 61, 32, 86, 97, 91, 100, 93,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 100, 41, 32, 114, 101, 116, 117, 114,
            110, 32, 98, 46, 99, 97, 108, 108, 40, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 100, 32, 61, 32, 116, 104, 105, 115, 46, 87, 97, 32, 63, 32, 100, 46, 101, 98, 32, 58, 32, 100, 46, 112,
            111, 105, 110, 116, 101, 114, 84, 121, 112, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97,
            114, 32, 101, 32, 61, 32, 84, 97, 40, 99, 44, 32, 116, 104, 105, 115, 46, 71, 97, 44, 32, 100, 46, 71, 97,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 110, 117, 108, 108,
            32, 61, 61, 61, 32, 101, 32, 63, 32, 98, 46, 99, 97, 108, 108, 40, 116, 104, 105, 115, 41, 32, 58, 32, 116,
            104, 105, 115, 46, 88, 97, 32, 63, 32, 98, 98, 40, 100, 46, 71, 97, 46, 83, 97, 44, 32, 123, 32, 73, 97, 58,
            32, 100, 44, 32, 72, 97, 58, 32, 101, 44, 32, 77, 97, 58, 32, 116, 104, 105, 115, 44, 32, 74, 97, 58, 32,
            97, 32, 125, 41, 32, 58, 32, 98, 98, 40, 100, 46, 71, 97, 46, 83, 97, 44, 32, 123, 32, 73, 97, 58, 32, 100,
            44, 32, 72, 97, 58, 32, 101, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 115, 98, 32, 61, 32, 107, 46, 85, 110, 98, 111, 117, 110,
            100, 84, 121, 112, 101, 69, 114, 114, 111, 114, 32, 61, 32, 40, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 100, 98, 40, 98, 44, 32, 102, 117,
            110, 99, 116, 105, 111, 110, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            105, 115, 46, 110, 97, 109, 101, 32, 61, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            105, 115, 46, 109, 101, 115, 115, 97, 103, 101, 32, 61, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 100, 32, 61, 32, 69, 114, 114, 111, 114, 40, 100, 41, 46, 115, 116, 97, 99, 107, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 118, 111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 100, 32, 38, 38, 32, 40, 116, 104,
            105, 115, 46, 115, 116, 97, 99, 107, 32, 61, 32, 116, 104, 105, 115, 46, 116, 111, 83, 116, 114, 105, 110,
            103, 40, 41, 32, 43, 32, 34, 92, 110, 34, 32, 43, 32, 100, 46, 114, 101, 112, 108, 97, 99, 101, 40, 47, 94,
            69, 114, 114, 111, 114, 40, 58, 91, 94, 92, 110, 93, 42, 41, 63, 92, 110, 47, 44, 32, 34, 34, 41, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 46, 112, 114, 111,
            116, 111, 116, 121, 112, 101, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 99, 114, 101, 97, 116, 101, 40, 97,
            46, 112, 114, 111, 116, 111, 116, 121, 112, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 46, 112,
            114, 111, 116, 111, 116, 121, 112, 101, 46, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 32, 61, 32,
            99, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 46, 112, 114, 111, 116, 111, 116, 121, 112, 101, 46, 116,
            111, 83, 116, 114, 105, 110, 103, 32, 61, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 118, 111, 105, 100, 32, 48, 32,
            61, 61, 61, 32, 116, 104, 105, 115, 46, 109, 101, 115, 115, 97, 103, 101, 32, 63, 32, 116, 104, 105, 115,
            46, 110, 97, 109, 101, 32, 58, 32, 96, 36, 123, 116, 104, 105, 115, 46, 110, 97, 109, 101, 125, 58, 32, 36,
            123, 116, 104, 105, 115, 46, 109, 101, 115, 115, 97, 103, 101, 125, 96, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 99, 59, 10, 32, 32, 32,
            32, 32, 32, 125, 41, 40, 69, 114, 114, 111, 114, 44, 32, 34, 85, 110, 98, 111, 117, 110, 100, 84, 121, 112,
            101, 69, 114, 114, 111, 114, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 86, 46, 112, 117, 115, 104, 40, 48, 44,
            32, 49, 44, 32, 118, 111, 105, 100, 32, 48, 44, 32, 49, 44, 32, 110, 117, 108, 108, 44, 32, 49, 44, 32, 116,
            114, 117, 101, 44, 32, 49, 44, 32, 102, 97, 108, 115, 101, 44, 32, 49, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            107, 46, 99, 111, 117, 110, 116, 95, 101, 109, 118, 97, 108, 95, 104, 97, 110, 100, 108, 101, 115, 32, 61,
            32, 40, 41, 32, 61, 62, 32, 86, 46, 108, 101, 110, 103, 116, 104, 32, 47, 32, 50, 32, 45, 32, 53, 32, 45,
            32, 65, 98, 46, 108, 101, 110, 103, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 116, 99, 32,
            61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100,
            41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 119, 97, 40, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 96, 65, 115, 115, 101, 114, 116, 105, 111, 110, 32, 102, 97, 105, 108, 101, 100,
            58, 32, 36, 123, 97, 32, 63, 32, 74, 40, 120, 44, 32, 97, 41, 32, 58, 32, 34, 34, 125, 44, 32, 97, 116, 58,
            32, 96, 32, 43, 32, 91, 98, 32, 63, 32, 98, 32, 63, 32, 74, 40, 120, 44, 32, 98, 41, 32, 58, 32, 34, 34, 32,
            58, 32, 34, 117, 110, 107, 110, 111, 119, 110, 32, 102, 105, 108, 101, 110, 97, 109, 101, 34, 44, 32, 99,
            44, 32, 100, 32, 63, 32, 100, 32, 63, 32, 74, 40, 120, 44, 32, 100, 41, 32, 58, 32, 34, 34, 32, 58, 32, 34,
            117, 110, 107, 110, 111, 119, 110, 32, 102, 117, 110, 99, 116, 105, 111, 110, 34, 93, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 110, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 110, 101, 119, 32, 72, 97, 40, 97, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 68, 91, 100, 46, 72, 97, 32, 43, 32, 49, 54, 32, 62, 62, 32, 50, 93, 32, 61, 32,
            48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 68, 91, 100, 46, 72, 97, 32, 43, 32, 52, 32, 62, 62, 32,
            50, 93, 32, 61, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 68, 91, 100, 46, 72, 97, 32, 43, 32,
            56, 32, 62, 62, 32, 50, 93, 32, 61, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 73, 97, 32, 61,
            32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 74, 97, 43, 43, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 114, 111, 119, 32, 73, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 89, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 88, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 58, 32, 102, 117, 110, 99, 116, 105, 111,
            110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 86, 58, 32, 40, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 83, 58, 32,
            40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 87, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 84, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 67, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 81, 58, 32, 40, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 85, 58, 32,
            40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 90, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 119, 97, 40, 34,
            34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 119, 58, 32,
            40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61,
            32, 75, 97, 91, 97, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 108, 101, 116, 101, 32,
            75, 97, 91, 97, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 98,
            46, 90, 97, 44, 32, 100, 32, 61, 32, 98, 46, 80, 97, 44, 32, 101, 32, 61, 32, 98, 46, 98, 98, 44, 32, 102,
            32, 61, 32, 101, 46, 109, 97, 112, 40, 40, 104, 41, 32, 61, 62, 32, 104, 46, 108, 98, 41, 46, 99, 111, 110,
            99, 97, 116, 40, 101, 46, 109, 97, 112, 40, 40, 104, 41, 32, 61, 62, 32, 104, 46, 114, 98, 41, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 40, 91, 97, 93, 44, 32, 102, 44, 32, 40, 104, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 103, 32, 61, 32, 123, 125,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 46, 102, 111, 114, 69, 97, 99, 104, 40, 40,
            108, 44, 32, 109, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 110, 32, 61, 32, 104, 91, 109, 93, 44, 32, 113, 32, 61, 32, 108, 46, 106, 98, 44, 32, 114, 32,
            61, 32, 108, 46, 107, 98, 44, 32, 65, 32, 61, 32, 104, 91, 109, 32, 43, 32, 101, 46, 108, 101, 110, 103,
            116, 104, 93, 44, 32, 118, 32, 61, 32, 108, 46, 113, 98, 44, 32, 119, 32, 61, 32, 108, 46, 115, 98, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 91, 108, 46, 103, 98, 93, 32, 61, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 97, 100, 58, 32, 40, 71, 41, 32,
            61, 62, 32, 110, 46, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 40, 113, 40, 114, 44, 32, 71,
            41, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 119, 114, 105, 116, 101, 58,
            32, 40, 71, 44, 32, 106, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 66, 32, 61, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 40, 119, 44, 32, 71, 44, 32, 65, 46, 116, 111, 87, 105, 114,
            101, 84, 121, 112, 101, 40, 66, 44, 32, 106, 97, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 76, 97, 40, 66, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 91, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 97, 109, 101, 58, 32, 98, 46, 110, 97, 109, 101,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 111, 109, 87, 105, 114,
            101, 84, 121, 112, 101, 58, 32, 40, 108, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 109, 32, 61, 32, 123, 125, 44, 32, 110, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 110, 32, 105,
            110, 32, 103, 41, 32, 109, 91, 110, 93, 32, 61, 32, 103, 91, 110, 93, 46, 114, 101, 97, 100, 40, 108, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 40, 108, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            109, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 40,
            108, 44, 32, 109, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 110, 32, 105, 110, 32, 103, 41, 32, 105, 102, 32, 40,
            33, 40, 110, 32, 105, 110, 32, 109, 41, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 84, 121,
            112, 101, 69, 114, 114, 111, 114, 40, 96, 77, 105, 115, 115, 105, 110, 103, 32, 102, 105, 101, 108, 100, 58,
            32, 34, 36, 123, 110, 125, 34, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 118, 97, 114, 32, 113, 32, 61, 32, 99, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 110, 32, 105, 110, 32, 103, 41, 32, 103, 91, 110, 93,
            46, 119, 114, 105, 116, 101, 40, 113, 44, 32, 109, 91, 110, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 117, 108, 108, 32, 33, 61, 61, 32, 108, 32, 38, 38, 32, 108,
            46, 112, 117, 115, 104, 40, 100, 44, 32, 113, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 113, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 78,
            97, 58, 32, 56, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 97, 100,
            86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110, 116, 101, 114, 58, 32, 76, 44, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 97, 58, 32, 100, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 93, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 74, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 100, 97, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 81, 40, 98, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110,
            97, 109, 101, 58, 32, 98, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 111, 109, 87,
            105, 114, 101, 84, 121, 112, 101, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 101, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 33, 33, 101, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 101,
            44, 32, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 102, 32, 63, 32, 99, 32, 58, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 78, 97, 58, 32, 56, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110,
            116, 101, 114, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 102, 114, 111,
            109, 87, 105, 114, 101, 84, 121, 112, 101, 40, 120, 91, 101, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 97, 58, 32, 110, 117, 108,
            108, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101,
            44, 32, 102, 44, 32, 104, 44, 32, 103, 44, 32, 108, 44, 32, 109, 44, 32, 110, 44, 32, 113, 44, 32, 114, 41,
            32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 32, 61, 32, 81, 40, 110, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 32, 61, 32, 84, 40, 101, 44, 32, 102, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 103, 32, 38, 38, 32, 40, 103, 32, 61, 32, 84, 40, 104, 44, 32, 103, 41, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 109, 32, 38, 38, 32, 40, 109, 32, 61, 32, 84, 40, 108, 44, 32,
            109, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 32, 61, 32, 84, 40, 113, 44, 32, 114, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 65, 32, 61, 32, 103, 98, 40, 110, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 98, 40, 65, 44, 32, 102, 117, 110, 99, 116, 105, 111, 110,
            40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 98, 40, 96, 67, 97, 110, 110, 111,
            116, 32, 99, 111, 110, 115, 116, 114, 117, 99, 116, 32, 36, 123, 110, 125, 32, 100, 117, 101, 32, 116, 111,
            32, 117, 110, 98, 111, 117, 110, 100, 32, 116, 121, 112, 101, 115, 96, 44, 32, 91, 100, 93, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 40, 91, 97,
            44, 32, 98, 44, 32, 99, 93, 44, 32, 100, 32, 63, 32, 91, 100, 93, 32, 58, 32, 91, 93, 44, 32, 40, 118, 41,
            32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 50, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 32, 61, 32, 118, 91, 48, 93, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 119, 32, 61, 32, 118, 46, 71, 97, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 71, 32, 61, 32, 119, 46, 83, 97, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 71, 32, 61, 32, 99, 98, 46, 112, 114, 111,
            116, 111, 116, 121, 112, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 32, 61, 32, 100,
            98, 40, 110, 44, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 46, 46, 46, 85, 97, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 79, 98, 106, 101, 99, 116, 46, 103, 101,
            116, 80, 114, 111, 116, 111, 116, 121, 112, 101, 79, 102, 40, 116, 104, 105, 115, 41, 32, 33, 61, 61, 32,
            106, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 34, 85, 115, 101, 32, 39, 110, 101,
            119, 39, 32, 116, 111, 32, 99, 111, 110, 115, 116, 114, 117, 99, 116, 32, 34, 32, 43, 32, 110, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100, 32, 48, 32,
            61, 61, 61, 32, 66, 46, 81, 97, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 110, 32, 43,
            32, 34, 32, 104, 97, 115, 32, 110, 111, 32, 97, 99, 99, 101, 115, 115, 105, 98, 108, 101, 32, 99, 111, 110,
            115, 116, 114, 117, 99, 116, 111, 114, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 67, 98, 32, 61, 32, 66, 46, 81, 97, 91, 85, 97, 46, 108, 101, 110, 103, 116, 104, 93,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100, 32,
            48, 32, 61, 61, 61, 32, 67, 98, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 114, 111, 119, 32, 110, 101, 119, 32, 82, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 96, 84, 114, 105, 101, 100, 32, 116, 111, 32, 105, 110, 118, 111, 107, 101, 32, 99, 116,
            111, 114, 32, 111, 102, 32, 36, 123, 110, 125, 32, 119, 105, 116, 104, 32, 105, 110, 118, 97, 108, 105, 100,
            32, 110, 117, 109, 98, 101, 114, 32, 111, 102, 32, 112, 97, 114, 97, 109, 101, 116, 101, 114, 115, 32, 40,
            36, 123, 85, 97, 46, 108, 101, 110, 103, 116, 104, 125, 41, 32, 45, 32, 101, 120, 112, 101, 99, 116, 101,
            100, 32, 40, 36, 123, 79, 98, 106, 101, 99, 116, 46, 107, 101, 121, 115, 40, 66, 46, 81, 97, 41, 46, 116,
            111, 83, 116, 114, 105, 110, 103, 40, 41, 125, 41, 32, 112, 97, 114, 97, 109, 101, 116, 101, 114, 115, 32,
            105, 110, 115, 116, 101, 97, 100, 33, 96, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            67, 98, 46, 97, 112, 112, 108, 121, 40, 116, 104, 105, 115, 44, 32, 85, 97, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114,
            32, 106, 97, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 99, 114, 101, 97, 116, 101, 40, 71, 44, 32, 123, 32,
            99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 58, 32, 123, 32, 118, 97, 108, 117, 101, 58, 32, 118,
            32, 125, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 46, 112, 114, 111, 116,
            111, 116, 121, 112, 101, 32, 61, 32, 106, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 66, 32, 61, 32, 110, 101, 119, 32, 104, 98, 40, 110, 44, 32, 118, 44, 32, 106, 97, 44, 32, 114,
            44, 32, 119, 44, 32, 102, 44, 32, 103, 44, 32, 109, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 66, 46, 76, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 107, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 95, 97,
            50, 32, 61, 32, 40, 107, 97, 32, 61, 32, 66, 46, 76, 97, 41, 46, 36, 97, 41, 32, 33, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 95, 97, 50, 32, 58, 32, 107, 97, 46, 36, 97, 32, 61, 32, 91, 93, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 66, 46, 76, 97, 46, 36, 97, 46, 112, 117, 115, 104, 40, 66, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            119, 32, 61, 32, 110, 101, 119, 32, 111, 98, 40, 110, 44, 32, 66, 44, 32, 116, 114, 117, 101, 44, 32, 102,
            97, 108, 115, 101, 44, 32, 102, 97, 108, 115, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 107, 97, 32, 61, 32, 110, 101, 119, 32, 111, 98, 40, 110, 32, 43, 32, 34, 42, 34, 44, 32, 66, 44, 32,
            102, 97, 108, 115, 101, 44, 32, 102, 97, 108, 115, 101, 44, 32, 102, 97, 108, 115, 101, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 71, 32, 61, 32, 110, 101, 119, 32, 111, 98, 40, 110, 32, 43, 32, 34,
            32, 99, 111, 110, 115, 116, 42, 34, 44, 32, 66, 44, 32, 102, 97, 108, 115, 101, 44, 32, 116, 114, 117, 101,
            44, 32, 102, 97, 108, 115, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 86, 97, 91, 97,
            93, 32, 61, 32, 123, 32, 112, 111, 105, 110, 116, 101, 114, 84, 121, 112, 101, 58, 32, 107, 97, 44, 32, 101,
            98, 58, 32, 71, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 112, 98, 40, 65, 44, 32,
            118, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 91, 119,
            44, 32, 107, 97, 44, 32, 71, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 58, 32, 40, 97, 44, 32, 98, 44,
            32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 118, 97, 114, 32, 104, 32, 61, 32, 119, 98, 40, 98, 44, 32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 101, 32, 61, 32, 84, 40, 100, 44, 32, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 80, 40, 91, 93, 44, 32, 91, 97, 93, 44, 32, 40, 103, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 103, 32, 61, 32, 103, 91, 48, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 118, 97, 114, 32, 108, 32, 61, 32, 96, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 32,
            36, 123, 103, 46, 110, 97, 109, 101, 125, 96, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118,
            111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 103, 46, 71, 97, 46, 81, 97, 32, 38, 38, 32, 40, 103, 46, 71, 97,
            46, 81, 97, 32, 61, 32, 91, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32,
            40, 118, 111, 105, 100, 32, 48, 32, 33, 61, 61, 32, 103, 46, 71, 97, 46, 81, 97, 91, 98, 32, 45, 32, 49, 93,
            41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119,
            32, 82, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 96, 67, 97, 110, 110, 111,
            116, 32, 114, 101, 103, 105, 115, 116, 101, 114, 32, 109, 117, 108, 116, 105, 112, 108, 101, 32, 99, 111,
            110, 115, 116, 114, 117, 99, 116, 111, 114, 115, 32, 119, 105, 116, 104, 32, 105, 100, 101, 110, 116, 105,
            99, 97, 108, 32, 110, 117, 109, 98, 101, 114, 32, 111, 102, 32, 112, 97, 114, 97, 109, 101, 116, 101, 114,
            115, 32, 40, 36, 123, 98, 32, 45, 32, 49, 125, 41, 32, 102, 111, 114, 32, 99, 108, 97, 115, 115, 32, 39, 36,
            123, 103, 46, 110, 97, 109, 101, 125, 39, 33, 32, 79, 118, 101, 114, 108, 111, 97, 100, 32, 114, 101, 115,
            111, 108, 117, 116, 105, 111, 110, 32, 105, 115, 32, 99, 117, 114, 114, 101, 110, 116, 108, 121, 32, 111,
            110, 108, 121, 32, 112, 101, 114, 102, 111, 114, 109, 101, 100, 32, 117, 115, 105, 110, 103, 32, 116, 104,
            101, 32, 112, 97, 114, 97, 109, 101, 116, 101, 114, 32, 99, 111, 117, 110, 116, 44, 32, 110, 111, 116, 32,
            97, 99, 116, 117, 97, 108, 32, 116, 121, 112, 101, 32, 105, 110, 102, 111, 33, 96, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 46, 71,
            97, 46, 81, 97, 91, 98, 32, 45, 32, 49, 93, 32, 61, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 98, 40, 96, 67, 97, 110, 110, 111, 116, 32, 99, 111, 110, 115, 116,
            114, 117, 99, 116, 32, 36, 123, 103, 46, 110, 97, 109, 101, 125, 32, 100, 117, 101, 32, 116, 111, 32, 117,
            110, 98, 111, 117, 110, 100, 32, 116, 121, 112, 101, 115, 96, 44, 32, 104, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 40, 91, 93, 44,
            32, 104, 44, 32, 40, 109, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 109, 46, 115, 112, 108, 105, 99, 101, 40, 49, 44, 32, 48, 44, 32, 110, 117, 108, 108, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 46, 71, 97, 46, 81, 97, 91, 98, 32, 45, 32, 49, 93,
            32, 61, 32, 121, 98, 40, 108, 44, 32, 109, 44, 32, 110, 117, 108, 108, 44, 32, 101, 44, 32, 102, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 91, 93, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 58, 32, 40, 97, 44,
            32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 108, 32, 61, 32, 119, 98, 40, 99, 44, 32,
            100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 81, 40, 98, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 122, 98, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 102, 32, 61, 32, 84, 40, 101, 44, 32, 102, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 40,
            91, 93, 44, 32, 91, 97, 93, 44, 32, 40, 109, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 118, 98, 40, 96, 67, 97, 110, 110, 111, 116, 32, 99, 97, 108, 108, 32, 36,
            123, 113, 125, 32, 100, 117, 101, 32, 116, 111, 32, 117, 110, 98, 111, 117, 110, 100, 32, 116, 121, 112,
            101, 115, 96, 44, 32, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 109, 32, 61, 32, 109, 91, 48, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 118, 97, 114, 32, 113, 32, 61, 32, 96, 36, 123, 109, 46, 110, 97, 109, 101, 125, 46, 36,
            123, 98, 125, 96, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 46, 115, 116, 97, 114, 116,
            115, 87, 105, 116, 104, 40, 34, 64, 64, 34, 41, 32, 38, 38, 32, 40, 98, 32, 61, 32, 83, 121, 109, 98, 111,
            108, 91, 98, 46, 115, 117, 98, 115, 116, 114, 105, 110, 103, 40, 50, 41, 93, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 103, 32, 38, 38, 32, 109, 46, 71, 97, 46, 111, 98, 46, 112, 117, 115, 104, 40,
            98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 114, 32, 61, 32, 109, 46,
            71, 97, 46, 83, 97, 44, 32, 65, 32, 61, 32, 114, 91, 98, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 118, 111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 65, 32, 124, 124, 32, 118, 111, 105, 100, 32, 48,
            32, 61, 61, 61, 32, 65, 46, 75, 97, 32, 38, 38, 32, 65, 46, 99, 108, 97, 115, 115, 78, 97, 109, 101, 32, 33,
            61, 61, 32, 109, 46, 110, 97, 109, 101, 32, 38, 38, 32, 65, 46, 86, 97, 32, 61, 61, 61, 32, 99, 32, 45, 32,
            50, 32, 63, 32, 40, 110, 46, 86, 97, 32, 61, 32, 99, 32, 45, 32, 50, 44, 32, 110, 46, 99, 108, 97, 115, 115,
            78, 97, 109, 101, 32, 61, 32, 109, 46, 110, 97, 109, 101, 44, 32, 114, 91, 98, 93, 32, 61, 32, 110, 41, 32,
            58, 32, 40, 101, 98, 40, 114, 44, 32, 98, 44, 32, 113, 41, 44, 32, 114, 91, 98, 93, 46, 75, 97, 91, 99, 32,
            45, 32, 50, 93, 32, 61, 32, 110, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 40, 91, 93,
            44, 32, 108, 44, 32, 40, 118, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 118, 32, 61, 32, 121, 98, 40, 113, 44, 32, 118, 44, 32, 109, 44, 32, 102, 44, 32, 104, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 111, 105, 100, 32, 48, 32, 61, 61, 61, 32, 114,
            91, 98, 93, 46, 75, 97, 32, 63, 32, 40, 118, 46, 86, 97, 32, 61, 32, 99, 32, 45, 32, 50, 44, 32, 114, 91,
            98, 93, 32, 61, 32, 118, 41, 32, 58, 32, 114, 91, 98, 93, 46, 75, 97, 91, 99, 32, 45, 32, 50, 93, 32, 61,
            32, 118, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97,
            58, 32, 40, 97, 41, 32, 61, 62, 32, 79, 40, 97, 44, 32, 69, 98, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            121, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 101, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 81, 40, 98, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 46, 118, 97, 108, 117, 101, 115, 32, 61, 32, 123, 125, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 110, 97, 109, 101, 58, 32, 98, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 114, 117, 99, 116, 111, 114, 58, 32, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40,
            102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110,
            32, 116, 104, 105, 115, 46, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 46, 118, 97, 108, 117, 101,
            115, 91, 102, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 40, 102, 44, 32, 104,
            41, 32, 61, 62, 32, 104, 46, 118, 97, 108, 117, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            78, 97, 58, 32, 56, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 97, 100, 86, 97, 108,
            117, 101, 70, 114, 111, 109, 80, 111, 105, 110, 116, 101, 114, 58, 32, 70, 98, 40, 98, 44, 32, 99, 44, 32,
            100, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 97, 58, 32, 110, 117, 108, 108, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 98, 40,
            98, 44, 32, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            107, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 71, 98, 40, 97, 44, 32, 34, 101, 110, 117, 109, 34, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 81, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 97, 32, 61, 32, 100, 46, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 100, 32, 61, 32, 79, 98, 106, 101, 99, 116, 46, 99, 114, 101, 97, 116, 101,
            40, 100, 46, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 46, 112, 114, 111, 116, 111, 116, 121,
            112, 101, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 108, 117, 101, 58, 32,
            123, 32, 118, 97, 108, 117, 101, 58, 32, 99, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 58, 32, 123, 32, 118, 97, 108, 117, 101, 58, 32,
            100, 98, 40, 96, 36, 123, 100, 46, 110, 97, 109, 101, 125, 95, 36, 123, 98, 125, 96, 44, 32, 102, 117, 110,
            99, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            97, 46, 118, 97, 108, 117, 101, 115, 91, 99, 93, 32, 61, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 97, 91, 98, 93, 32, 61, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 68, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 81, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79,
            40, 97, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 97, 109, 101, 58, 32, 98, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112,
            101, 58, 32, 40, 100, 41, 32, 61, 62, 32, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 40, 100, 44, 32, 101, 41, 32, 61, 62, 32, 101, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 78, 97, 58, 32, 56, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110, 116, 101,
            114, 58, 32, 72, 98, 40, 98, 44, 32, 99, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 97,
            58, 32, 110, 117, 108, 108, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 70, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32,
            100, 44, 32, 101, 44, 32, 102, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97,
            114, 32, 104, 32, 61, 32, 119, 98, 40, 98, 44, 32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            97, 32, 61, 32, 81, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 122, 98, 40,
            97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 32, 61, 32, 84, 40, 100, 44, 32, 101, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 98, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            97, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 98, 40, 96, 67, 97, 110, 110, 111,
            116, 32, 99, 97, 108, 108, 32, 36, 123, 97, 125, 32, 100, 117, 101, 32, 116, 111, 32, 117, 110, 98, 111,
            117, 110, 100, 32, 116, 121, 112, 101, 115, 96, 44, 32, 104, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 45, 32, 49, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 80, 40, 91, 93, 44, 32, 104,
            44, 32, 40, 103, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 112, 98, 40,
            97, 44, 32, 121, 98, 40, 97, 44, 32, 91, 103, 91, 48, 93, 44, 32, 110, 117, 108, 108, 93, 46, 99, 111, 110,
            99, 97, 116, 40, 103, 46, 115, 108, 105, 99, 101, 40, 49, 41, 41, 44, 32, 110, 117, 108, 108, 44, 32, 101,
            44, 32, 102, 41, 44, 32, 98, 32, 45, 32, 49, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 58, 32, 40, 97, 44, 32,
            98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 98, 32, 61, 32, 81, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 45, 49, 32, 61, 61, 61,
            32, 101, 32, 38, 38, 32, 40, 101, 32, 61, 32, 52, 50, 57, 52, 57, 54, 55, 50, 57, 53, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 101, 32, 61, 32, 40, 103, 41, 32, 61, 62, 32, 103, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 48, 32, 61, 61, 61, 32, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 32, 61, 32, 51, 50, 32, 45, 32, 56, 32, 42, 32, 99, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 32, 61, 32, 40, 103, 41, 32, 61, 62, 32, 103, 32,
            60, 60, 32, 102, 32, 62, 62, 62, 32, 102, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 32, 61, 32, 98, 46, 105, 110, 99, 108, 117, 100, 101,
            115, 40, 34, 117, 110, 115, 105, 103, 110, 101, 100, 34, 41, 32, 63, 32, 102, 117, 110, 99, 116, 105, 111,
            110, 40, 103, 44, 32, 108, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 108, 32, 62, 62, 62, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 58,
            32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 103, 44, 32, 108, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 108, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 123, 32, 110, 97, 109, 101, 58,
            32, 98, 44, 32, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 101, 44, 32, 116, 111, 87,
            105, 114, 101, 84, 121, 112, 101, 58, 32, 104, 44, 32, 78, 97, 58, 32, 56, 44, 32, 114, 101, 97, 100, 86,
            97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110, 116, 101, 114, 58, 32, 73, 98, 40, 98, 44, 32, 99,
            44, 32, 48, 32, 33, 61, 61, 32, 100, 41, 44, 32, 79, 97, 58, 32, 110, 117, 108, 108, 32, 125, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 104, 58, 32, 40, 97, 44, 32,
            98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116,
            105, 111, 110, 32, 100, 40, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 110, 101, 119, 32, 101, 40, 117, 46, 98, 117, 102, 102, 101, 114, 44, 32, 68, 91,
            102, 32, 43, 32, 52, 32, 62, 62, 32, 50, 93, 44, 32, 68, 91, 102, 32, 62, 62, 32, 50, 93, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101,
            32, 61, 32, 91, 73, 110, 116, 56, 65, 114, 114, 97, 121, 44, 32, 85, 105, 110, 116, 56, 65, 114, 114, 97,
            121, 44, 32, 73, 110, 116, 49, 54, 65, 114, 114, 97, 121, 44, 32, 85, 105, 110, 116, 49, 54, 65, 114, 114,
            97, 121, 44, 32, 73, 110, 116, 51, 50, 65, 114, 114, 97, 121, 44, 32, 85, 105, 110, 116, 51, 50, 65, 114,
            114, 97, 121, 44, 32, 70, 108, 111, 97, 116, 51, 50, 65, 114, 114, 97, 121, 44, 32, 70, 108, 111, 97, 116,
            54, 52, 65, 114, 114, 97, 121, 93, 91, 98, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 61,
            32, 81, 40, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 123, 32, 110, 97,
            109, 101, 58, 32, 99, 44, 32, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 100, 44, 32,
            78, 97, 58, 32, 56, 44, 32, 114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110,
            116, 101, 114, 58, 32, 100, 32, 125, 44, 32, 123, 32, 109, 98, 58, 32, 116, 114, 117, 101, 32, 125, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 58, 32, 40, 97, 41,
            32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 74, 98, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 106, 97, 58, 32, 40, 97, 44, 32,
            98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103, 44, 32, 108, 44, 32, 109,
            44, 32, 110, 44, 32, 113, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 61,
            32, 81, 40, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 32, 61, 32, 84, 40, 101, 44, 32,
            102, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 32, 61, 32, 84, 40, 104, 44, 32, 103, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 109, 32, 61, 32, 84, 40, 108, 44, 32, 109, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 113, 32, 61, 32, 84, 40, 110, 44, 32, 113, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 80, 40, 91, 97, 93, 44, 32, 91, 98, 93, 44, 32, 40, 114, 41, 32, 61, 62, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 32, 61, 32, 114, 91, 48, 93, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 91, 110, 101, 119, 32, 111, 98, 40, 99,
            44, 32, 114, 46, 71, 97, 44, 32, 102, 97, 108, 115, 101, 44, 32, 102, 97, 108, 115, 101, 44, 32, 116, 114,
            117, 101, 44, 32, 114, 44, 32, 100, 44, 32, 102, 44, 32, 103, 44, 32, 109, 44, 32, 113, 41, 93, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 69, 58, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 98, 32, 61, 32, 81, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97,
            114, 32, 99, 32, 61, 32, 34, 115, 116, 100, 58, 58, 115, 116, 114, 105, 110, 103, 34, 32, 61, 61, 61, 32,
            98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 110, 97, 109, 101, 58, 32, 98, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40,
            100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101, 32, 61,
            32, 68, 91, 100, 32, 62, 62, 32, 50, 93, 44, 32, 102, 32, 61, 32, 100, 32, 43, 32, 52, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 99, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 104, 32, 61, 32, 102, 44, 32, 103,
            32, 61, 32, 48, 59, 32, 103, 32, 60, 61, 32, 101, 59, 32, 43, 43, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 108, 32, 61, 32, 102, 32, 43, 32, 103,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 103, 32,
            61, 61, 32, 101, 32, 124, 124, 32, 48, 32, 61, 61, 32, 120, 91, 108, 93, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 104, 32, 61, 32, 104, 32, 63, 32, 74, 40,
            120, 44, 32, 104, 44, 32, 108, 32, 45, 32, 104, 41, 32, 58, 32, 34, 34, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 118, 111, 105, 100, 32, 48, 32, 61,
            61, 61, 32, 109, 41, 32, 118, 97, 114, 32, 109, 32, 61, 32, 104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 108, 115, 101, 32, 109, 32, 43, 61, 32, 83, 116, 114, 105,
            110, 103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 48, 41, 44, 32, 109, 32, 43, 61,
            32, 104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 104, 32,
            61, 32, 108, 32, 43, 32, 49, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 109, 32, 61, 32, 65, 114, 114, 97, 121, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 103, 32, 61, 32, 48, 59, 32, 103, 32, 60, 32,
            101, 59, 32, 43, 43, 103, 41, 32, 109, 91, 103, 93, 32, 61, 32, 83, 116, 114, 105, 110, 103, 46, 102, 114,
            111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 120, 91, 102, 32, 43, 32, 103, 93, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 109, 32, 61, 32, 109, 46, 106, 111, 105, 110, 40,
            34, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 85, 40, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 109, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32,
            102, 117, 110, 99, 116, 105, 111, 110, 40, 100, 44, 32, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 101, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 65, 114, 114, 97,
            121, 66, 117, 102, 102, 101, 114, 32, 38, 38, 32, 40, 101, 32, 61, 32, 110, 101, 119, 32, 85, 105, 110, 116,
            56, 65, 114, 114, 97, 121, 40, 101, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            118, 97, 114, 32, 102, 44, 32, 104, 32, 61, 32, 34, 115, 116, 114, 105, 110, 103, 34, 32, 61, 61, 32, 116,
            121, 112, 101, 111, 102, 32, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 33, 40, 104, 32, 124, 124, 32, 101, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 85, 105,
            110, 116, 56, 65, 114, 114, 97, 121, 32, 124, 124, 32, 101, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111,
            102, 32, 85, 105, 110, 116, 56, 67, 108, 97, 109, 112, 101, 100, 65, 114, 114, 97, 121, 32, 124, 124, 32,
            101, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 73, 110, 116, 56, 65, 114, 114, 97, 121, 41,
            41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110,
            101, 119, 32, 82, 40, 34, 67, 97, 110, 110, 111, 116, 32, 112, 97, 115, 115, 32, 110, 111, 110, 45, 115,
            116, 114, 105, 110, 103, 32, 116, 111, 32, 115, 116, 100, 58, 58, 115, 116, 114, 105, 110, 103, 34, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 99, 32, 38, 38, 32, 104, 41,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32,
            103, 32, 61, 32, 102, 32, 61, 32, 48, 59, 32, 103, 32, 60, 32, 101, 46, 108, 101, 110, 103, 116, 104, 59,
            32, 43, 43, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            118, 97, 114, 32, 108, 32, 61, 32, 101, 46, 99, 104, 97, 114, 67, 111, 100, 101, 65, 116, 40, 103, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 49, 50, 55, 32, 62, 61, 32, 108,
            32, 63, 32, 102, 43, 43, 32, 58, 32, 50, 48, 52, 55, 32, 62, 61, 32, 108, 32, 63, 32, 102, 32, 43, 61, 32,
            50, 32, 58, 32, 53, 53, 50, 57, 54, 32, 60, 61, 32, 108, 32, 38, 38, 32, 53, 55, 51, 52, 51, 32, 62, 61, 32,
            108, 32, 63, 32, 40, 102, 32, 43, 61, 32, 52, 44, 32, 43, 43, 103, 41, 32, 58, 32, 102, 32, 43, 61, 32, 51,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 101, 108, 115, 101, 32, 102, 32, 61, 32, 101, 46, 108, 101, 110, 103, 116, 104,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 32, 61, 32, 104, 99, 40, 52, 32, 43,
            32, 102, 32, 43, 32, 49, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 108, 32, 61,
            32, 103, 32, 43, 32, 52, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 68, 91, 103, 32,
            62, 62, 32, 50, 93, 32, 61, 32, 102, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 99, 32, 38, 38, 32, 104, 41, 32, 75, 40, 101, 44, 32, 108, 44, 32, 102, 32, 43, 32, 49, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 104,
            41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 104, 32, 61,
            32, 48, 59, 32, 104, 32, 60, 32, 102, 59, 32, 43, 43, 104, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 109, 32, 61, 32, 101, 46, 99, 104, 97, 114, 67,
            111, 100, 101, 65, 116, 40, 104, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 105, 102, 32, 40, 50, 53, 53, 32, 60, 32, 109, 41, 32, 116, 104, 114, 111, 119, 32, 85, 40, 108, 41,
            44, 32, 110, 101, 119, 32, 82, 40, 34, 83, 116, 114, 105, 110, 103, 32, 104, 97, 115, 32, 85, 84, 70, 45,
            49, 54, 32, 99, 111, 100, 101, 32, 117, 110, 105, 116, 115, 32, 116, 104, 97, 116, 32, 100, 111, 32, 110,
            111, 116, 32, 102, 105, 116, 32, 105, 110, 32, 56, 32, 98, 105, 116, 115, 34, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 120, 91, 108, 32, 43, 32, 104, 93, 32, 61, 32, 109,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 101, 108, 115, 101, 32, 102, 111, 114, 32, 40, 104, 32, 61, 32, 48, 59, 32, 104,
            32, 60, 32, 102, 59, 32, 43, 43, 104, 41, 32, 120, 91, 108, 32, 43, 32, 104, 93, 32, 61, 32, 101, 91, 104,
            93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 117, 108, 108, 32, 33, 61, 61, 32,
            100, 32, 38, 38, 32, 100, 46, 112, 117, 115, 104, 40, 85, 44, 32, 103, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 103, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 78, 97, 58, 32, 56, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109,
            80, 111, 105, 110, 116, 101, 114, 58, 32, 76, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79,
            97, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 85, 40, 100, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 117, 58, 32, 40,
            97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 61,
            32, 81, 40, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 50, 32, 61, 61, 61,
            32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32,
            76, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101, 32, 61, 32, 77, 98,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 32, 61, 32, 78, 98, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 32, 61, 32, 40, 103, 41, 32, 61, 62,
            32, 122, 91, 103, 32, 62, 62, 32, 49, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108,
            115, 101, 32, 52, 32, 61, 61, 61, 32, 98, 32, 38, 38, 32, 40, 100, 32, 61, 32, 79, 98, 44, 32, 101, 32, 61,
            32, 80, 98, 44, 32, 102, 32, 61, 32, 81, 98, 44, 32, 104, 32, 61, 32, 40, 103, 41, 32, 61, 62, 32, 68, 91,
            103, 32, 62, 62, 32, 50, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110, 97, 109, 101, 58, 32, 99, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 111, 109, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 40, 103,
            41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40,
            118, 97, 114, 32, 108, 32, 61, 32, 68, 91, 103, 32, 62, 62, 32, 50, 93, 44, 32, 109, 44, 32, 110, 32, 61,
            32, 103, 32, 43, 32, 52, 44, 32, 113, 32, 61, 32, 48, 59, 32, 113, 32, 60, 61, 32, 108, 59, 32, 43, 43, 113,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 114, 32,
            61, 32, 103, 32, 43, 32, 52, 32, 43, 32, 113, 32, 42, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 113, 32, 61, 61, 32, 108, 32, 124, 124, 32, 48, 32, 61, 61,
            32, 104, 40, 114, 41, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 110,
            32, 61, 32, 100, 40, 110, 44, 32, 114, 32, 45, 32, 110, 41, 44, 32, 118, 111, 105, 100, 32, 48, 32, 61, 61,
            61, 32, 109, 32, 63, 32, 109, 32, 61, 32, 110, 32, 58, 32, 40, 109, 32, 43, 61, 32, 83, 116, 114, 105, 110,
            103, 46, 102, 114, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 40, 48, 41, 44, 32, 109, 32, 43, 61, 32,
            110, 41, 44, 32, 110, 32, 61, 32, 114, 32, 43, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 85, 40, 103, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 40, 103, 44, 32, 108, 41, 32, 61, 62, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 34, 115, 116, 114, 105, 110, 103, 34,
            32, 33, 61, 32, 116, 121, 112, 101, 111, 102, 32, 108, 41, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119,
            32, 82, 40, 96, 67, 97, 110, 110, 111, 116, 32, 112, 97, 115, 115, 32, 110, 111, 110, 45, 115, 116, 114,
            105, 110, 103, 32, 116, 111, 32, 67, 43, 43, 32, 115, 116, 114, 105, 110, 103, 32, 116, 121, 112, 101, 32,
            36, 123, 99, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32,
            109, 32, 61, 32, 102, 40, 108, 41, 44, 32, 110, 32, 61, 32, 104, 99, 40, 52, 32, 43, 32, 109, 32, 43, 32,
            98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 68, 91, 110, 32, 62, 62, 32, 50, 93,
            32, 61, 32, 109, 32, 47, 32, 98, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 40,
            108, 44, 32, 110, 32, 43, 32, 52, 44, 32, 109, 32, 43, 32, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 110, 117, 108, 108, 32, 33, 61, 61, 32, 103, 32, 38, 38, 32, 103, 46, 112, 117, 115,
            104, 40, 85, 44, 32, 110, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 110, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 78, 97, 58, 32, 56, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110, 116, 101, 114, 58, 32, 76,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 97, 40, 103, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 85, 40, 103, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 120, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32,
            101, 44, 32, 102, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 75, 97, 91, 97, 93,
            32, 61, 32, 123, 32, 110, 97, 109, 101, 58, 32, 81, 40, 98, 41, 44, 32, 90, 97, 58, 32, 84, 40, 99, 44, 32,
            100, 41, 44, 32, 80, 97, 58, 32, 84, 40, 101, 44, 32, 102, 41, 44, 32, 98, 98, 58, 32, 91, 93, 32, 125, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 106, 58, 32, 40, 97, 44,
            32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103, 44, 32, 108, 44, 32,
            109, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 75, 97, 91, 97, 93, 46, 98, 98,
            46, 112, 117, 115, 104, 40, 123, 32, 103, 98, 58, 32, 81, 40, 98, 41, 44, 32, 108, 98, 58, 32, 99, 44, 32,
            106, 98, 58, 32, 84, 40, 100, 44, 32, 101, 41, 44, 32, 107, 98, 58, 32, 102, 44, 32, 114, 98, 58, 32, 104,
            44, 32, 113, 98, 58, 32, 84, 40, 103, 44, 32, 108, 41, 44, 32, 115, 98, 58, 32, 109, 32, 125, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 101, 97, 58, 32, 40, 97, 44,
            32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 81, 40, 98, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 40, 97, 44, 32, 123, 32, 117, 98, 58, 32, 116, 114, 117,
            101, 44, 32, 110, 97, 109, 101, 58, 32, 98, 44, 32, 78, 97, 58, 32, 48, 44, 32, 102, 114, 111, 109, 87, 105,
            114, 101, 84, 121, 112, 101, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 44, 32, 116, 111, 87, 105, 114, 101, 84, 121, 112, 101, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 80, 58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 70, 97, 32, 61, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 88,
            98, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 75,
            58, 32, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119,
            32, 73, 110, 102, 105, 110, 105, 116, 121, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 104, 97, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 82, 98, 91, 97, 93, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 98, 32, 61, 32, 68, 98, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 97, 40, 110, 117, 108, 108, 44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 71, 58, 32, 66, 98, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 103, 97, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 84, 98, 40, 97, 44, 32, 98, 41,
            44, 32, 101, 32, 61, 32, 100, 46, 115, 104, 105, 102, 116, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 97, 45, 45, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 32, 61, 32, 65,
            114, 114, 97, 121, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 96, 109, 101,
            116, 104, 111, 100, 67, 97, 108, 108, 101, 114, 60, 40, 36, 123, 100, 46, 109, 97, 112, 40, 40, 104, 41, 32,
            61, 62, 32, 104, 46, 110, 97, 109, 101, 41, 46, 106, 111, 105, 110, 40, 34, 44, 32, 34, 41, 125, 41, 32, 61,
            62, 32, 36, 123, 101, 46, 110, 97, 109, 101, 125, 62, 96, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 83, 98, 40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 98,
            40, 98, 44, 32, 40, 104, 44, 32, 103, 44, 32, 108, 44, 32, 109, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 110, 32, 61, 32, 48, 44,
            32, 113, 32, 61, 32, 48, 59, 32, 113, 32, 60, 32, 97, 59, 32, 43, 43, 113, 41, 32, 102, 91, 113, 93, 32, 61,
            32, 100, 91, 113, 93, 46, 114, 101, 97, 100, 86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110,
            116, 101, 114, 40, 109, 32, 43, 32, 110, 41, 44, 32, 110, 32, 43, 61, 32, 100, 91, 113, 93, 46, 78, 97, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 32, 61, 32, 49, 32, 61, 61, 61, 32, 99, 32,
            63, 32, 85, 98, 40, 103, 44, 32, 102, 41, 32, 58, 32, 103, 46, 97, 112, 112, 108, 121, 40, 104, 44, 32, 102,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 104, 32, 61, 32, 91, 93, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 32, 61, 32, 101, 46, 116, 111, 87, 105, 114, 101, 84,
            121, 112, 101, 40, 104, 44, 32, 103, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            104, 46, 108, 101, 110, 103, 116, 104, 32, 38, 38, 32, 40, 68, 91, 108, 32, 62, 62, 32, 50, 93, 32, 61, 32,
            109, 98, 40, 104, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 103, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 97, 58, 32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 57, 32,
            60, 32, 97, 32, 38, 38, 32, 40, 86, 91, 97, 32, 43, 32, 49, 93, 32, 43, 61, 32, 49, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 97, 58, 32, 40, 97, 41, 32, 61, 62,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 68, 98, 40, 97, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 76, 97, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 66, 98, 40, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 112, 58, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            97, 32, 61, 32, 71, 98, 40, 97, 44, 32, 34, 95, 101, 109, 118, 97, 108, 95, 116, 97, 107, 101, 95, 118, 97,
            108, 117, 101, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 97, 46, 114, 101, 97,
            100, 86, 97, 108, 117, 101, 70, 114, 111, 109, 80, 111, 105, 110, 116, 101, 114, 40, 98, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 98, 40, 97, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 76, 58, 32, 40, 97, 44, 32, 98, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 86, 98, 91, 97, 93, 32, 38, 38, 32, 40, 99, 108,
            101, 97, 114, 84, 105, 109, 101, 111, 117, 116, 40, 86, 98, 91, 97, 93, 46, 105, 100, 41, 44, 32, 100, 101,
            108, 101, 116, 101, 32, 86, 98, 91, 97, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 33, 98, 41, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 99, 32, 61, 32, 115, 101, 116, 84, 105, 109, 101, 111, 117, 116, 40, 40, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 108, 101, 116, 101, 32, 86, 98,
            91, 97, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 90, 98, 40, 40, 41, 32, 61, 62, 32, 105,
            99, 40, 97, 44, 32, 112, 101, 114, 102, 111, 114, 109, 97, 110, 99, 101, 46, 110, 111, 119, 40, 41, 41, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 32, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 86, 98, 91, 97, 93, 32, 61, 32, 123, 32, 105, 100, 58, 32, 99, 44, 32, 119, 98, 58, 32, 98, 32, 125,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 77, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99,
            44, 32, 100, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101, 32,
            61, 32, 40, 47, 42, 32, 64, 95, 95, 80, 85, 82, 69, 95, 95, 32, 42, 47, 32, 110, 101, 119, 32, 68, 97, 116,
            101, 40, 41, 41, 46, 103, 101, 116, 70, 117, 108, 108, 89, 101, 97, 114, 40, 41, 44, 32, 102, 32, 61, 32,
            110, 101, 119, 32, 68, 97, 116, 101, 40, 101, 44, 32, 48, 44, 32, 49, 41, 46, 103, 101, 116, 84, 105, 109,
            101, 122, 111, 110, 101, 79, 102, 102, 115, 101, 116, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 101, 32, 61, 32, 110, 101, 119, 32, 68, 97, 116, 101, 40, 101, 44, 32, 54, 44, 32, 49, 41, 46, 103, 101,
            116, 84, 105, 109, 101, 122, 111, 110, 101, 79, 102, 102, 115, 101, 116, 40, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 68, 91, 97, 32, 62, 62, 32, 50, 93, 32, 61, 32, 54, 48, 32, 42, 32, 77, 97, 116, 104,
            46, 109, 97, 120, 40, 102, 44, 32, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 67, 91, 98, 32,
            62, 62, 32, 50, 93, 32, 61, 32, 78, 117, 109, 98, 101, 114, 40, 102, 32, 33, 61, 32, 101, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 40, 104, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 103, 32, 61, 32, 77, 97, 116, 104, 46, 97, 98, 115, 40,
            104, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 96, 85,
            84, 67, 36, 123, 48, 32, 60, 61, 32, 104, 32, 63, 32, 34, 45, 34, 32, 58, 32, 34, 43, 34, 125, 36, 123, 83,
            116, 114, 105, 110, 103, 40, 77, 97, 116, 104, 46, 102, 108, 111, 111, 114, 40, 103, 32, 47, 32, 54, 48, 41,
            41, 46, 112, 97, 100, 83, 116, 97, 114, 116, 40, 50, 44, 32, 34, 48, 34, 41, 125, 36, 123, 83, 116, 114,
            105, 110, 103, 40, 103, 32, 37, 32, 54, 48, 41, 46, 112, 97, 100, 83, 116, 97, 114, 116, 40, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 50, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 34, 48, 34, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 41, 125, 96, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 61, 32, 98, 40, 102, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 61, 32, 98, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 101, 32, 60, 32, 102, 32, 63, 32, 40, 75, 40, 97, 44, 32, 99, 44, 32, 49, 55, 41, 44,
            32, 75, 40, 98, 44, 32, 100, 44, 32, 49, 55, 41, 41, 32, 58, 32, 40, 75, 40, 97, 44, 32, 100, 44, 32, 49,
            55, 41, 44, 32, 75, 40, 98, 44, 32, 99, 44, 32, 49, 55, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 79, 58, 32, 40, 41, 32, 61, 62, 32, 50, 49, 52, 55, 52, 56, 51, 54,
            52, 56, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 97, 58, 32, 40, 41, 32, 61, 62, 32, 112, 101, 114, 102,
            111, 114, 109, 97, 110, 99, 101, 46, 110, 111, 119, 40, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 78, 58,
            32, 40, 97, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32,
            61, 32, 120, 46, 108, 101, 110, 103, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 32, 62,
            62, 62, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 50, 49, 52, 55, 52,
            56, 51, 54, 52, 56, 32, 60, 32, 97, 41, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108, 115, 101, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 99, 32, 61, 32, 49, 59,
            32, 52, 32, 62, 61, 32, 99, 59, 32, 99, 32, 42, 61, 32, 50, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 98, 32, 42, 32, 40, 49, 32, 43, 32, 48, 46, 50, 32, 47,
            32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 32, 61, 32, 77, 97, 116, 104, 46,
            109, 105, 110, 40, 100, 44, 32, 97, 32, 43, 32, 49, 48, 48, 54, 54, 51, 50, 57, 54, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 100, 32, 61, 32, 40, 77, 97, 116, 104, 46, 109, 105, 110, 40, 50, 49, 52, 55, 52, 56, 51, 54, 52, 56,
            44, 32, 54, 53, 53, 51, 54, 32, 42, 32, 77, 97, 116, 104, 46, 99, 101, 105, 108, 40, 77, 97, 116, 104, 46,
            109, 97, 120, 40, 97, 44, 32, 100, 41, 32, 47, 32, 54, 53, 53, 51, 54, 41, 41, 32, 45, 32, 108, 97, 46, 98,
            117, 102, 102, 101, 114, 46, 98, 121, 116, 101, 76, 101, 110, 103, 116, 104, 32, 43, 32, 54, 53, 53, 51, 53,
            41, 32, 47, 32, 54, 53, 53, 51, 54, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 108, 97, 46, 103,
            114, 111, 119, 40, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 113, 97,
            40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101, 32,
            61, 32, 49, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 114, 101, 97, 107,
            32, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32,
            40, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 32, 61, 32, 118, 111, 105, 100, 32, 48, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40,
            101, 41, 32, 114, 101, 116, 117, 114, 110, 32, 116, 114, 117, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108,
            115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 36, 58, 32,
            40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32,
            99, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 99, 40, 41, 46, 102, 111, 114, 69,
            97, 99, 104, 40, 40, 100, 44, 32, 101, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 118, 97, 114, 32, 102, 32, 61, 32, 98, 32, 43, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 101, 32, 61, 32, 68, 91, 97, 32, 43, 32, 52, 32, 42, 32, 101, 32, 62, 62, 32, 50, 93, 32, 61,
            32, 102, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 102, 32, 61, 32, 48,
            59, 32, 102, 32, 60, 32, 100, 46, 108, 101, 110, 103, 116, 104, 59, 32, 43, 43, 102, 41, 32, 117, 91, 101,
            43, 43, 93, 32, 61, 32, 100, 46, 99, 104, 97, 114, 67, 111, 100, 101, 65, 116, 40, 102, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 117, 91, 101, 93, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 99, 32, 43, 61, 32, 100, 46, 108, 101, 110, 103, 116, 104, 32, 43, 32, 49, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 97, 97, 58, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            118, 97, 114, 32, 99, 32, 61, 32, 98, 99, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 68, 91,
            97, 32, 62, 62, 32, 50, 93, 32, 61, 32, 99, 46, 108, 101, 110, 103, 116, 104, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            99, 46, 102, 111, 114, 69, 97, 99, 104, 40, 40, 101, 41, 32, 61, 62, 32, 100, 32, 43, 61, 32, 101, 46, 108,
            101, 110, 103, 116, 104, 32, 43, 32, 49, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 68, 91, 98, 32,
            62, 62, 32, 50, 93, 32, 61, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115,
            58, 32, 40, 41, 32, 61, 62, 32, 53, 50, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 82, 58, 32, 40, 97, 44, 32,
            98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32,
            48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 48, 32, 61, 61, 32, 97, 41, 32, 99,
            32, 61, 32, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40,
            49, 32, 61, 61, 32, 97, 32, 124, 124, 32, 50, 32, 61, 61, 32, 97, 41, 32, 99, 32, 61, 32, 54, 52, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 117, 91, 98, 93, 32, 61, 32, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 121, 91, 98, 32, 43, 32, 50, 32, 62, 62, 32, 49, 93, 32, 61, 32, 49, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 73, 32, 61, 32, 91, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 32, 62, 62,
            62, 32, 48, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 72, 32, 61, 32, 99, 44, 32, 49, 32,
            60, 61, 32, 43, 77, 97, 116, 104, 46, 97, 98, 115, 40, 72, 41, 32, 63, 32, 48, 32, 60, 32, 72, 32, 63, 32,
            43, 77, 97, 116, 104, 46, 102, 108, 111, 111, 114, 40, 72, 32, 47, 32, 52, 50, 57, 52, 57, 54, 55, 50, 57,
            54, 41, 32, 62, 62, 62, 32, 48, 32, 58, 32, 126, 126, 43, 77, 97, 116, 104, 46, 99, 101, 105, 108, 40, 40,
            72, 32, 45, 32, 43, 40, 126, 126, 72, 32, 62, 62, 62, 32, 48, 41, 41, 32, 47, 32, 52, 50, 57, 52, 57, 54,
            55, 50, 57, 54, 41, 32, 62, 62, 62, 32, 48, 32, 58, 32, 48, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 67, 91, 98, 32, 43, 32, 56, 32, 62, 62, 32, 50, 93, 32,
            61, 32, 73, 91, 48, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 67, 91, 98, 32, 43, 32, 49, 50, 32,
            62, 62, 32, 50, 93, 32, 61, 32, 73, 91, 49, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 73, 32, 61,
            32, 91, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 40, 72, 32, 61, 32, 48, 44, 32, 49, 32, 60, 61, 32, 43, 77, 97, 116, 104, 46, 97, 98, 115, 40,
            72, 41, 32, 63, 32, 48, 32, 60, 32, 72, 32, 63, 32, 43, 77, 97, 116, 104, 46, 102, 108, 111, 111, 114, 40,
            72, 32, 47, 32, 52, 50, 57, 52, 57, 54, 55, 50, 57, 54, 41, 32, 62, 62, 62, 32, 48, 32, 58, 32, 126, 126,
            43, 77, 97, 116, 104, 46, 99, 101, 105, 108, 40, 40, 72, 32, 45, 32, 43, 40, 126, 126, 72, 32, 62, 62, 62,
            32, 48, 41, 41, 32, 47, 32, 52, 50, 57, 52, 57, 54, 55, 50, 57, 54, 41, 32, 62, 62, 62, 32, 48, 32, 58, 32,
            48, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 67,
            91, 98, 32, 43, 32, 49, 54, 32, 62, 62, 32, 50, 93, 32, 61, 32, 73, 91, 48, 93, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 67, 91, 98, 32, 43, 32, 50, 48, 32, 62, 62, 32, 50, 93, 32, 61, 32, 73, 91, 49, 93, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 66, 58, 32, 40, 41, 32, 61, 62, 32, 53, 50, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 73, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 55, 48, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 65, 58, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44,
            32, 100, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118,
            97, 114, 32, 101, 32, 61, 32, 48, 44, 32, 102, 32, 61, 32, 48, 59, 32, 102, 32, 60, 32, 99, 59, 32, 102, 43,
            43, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 104, 32, 61, 32, 68,
            91, 98, 32, 62, 62, 32, 50, 93, 44, 32, 103, 32, 61, 32, 68, 91, 98, 32, 43, 32, 52, 32, 62, 62, 32, 50, 93,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 32, 43, 61, 32, 56, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 118, 97, 114, 32, 108, 32, 61, 32, 48, 59, 32, 108, 32,
            60, 32, 103, 59, 32, 108, 43, 43, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            118, 97, 114, 32, 109, 32, 61, 32, 97, 44, 32, 110, 32, 61, 32, 120, 91, 104, 32, 43, 32, 108, 93, 44, 32,
            113, 32, 61, 32, 99, 99, 91, 109, 93, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48,
            32, 61, 61, 61, 32, 110, 32, 124, 124, 32, 49, 48, 32, 61, 61, 61, 32, 110, 32, 63, 32, 40, 40, 49, 32, 61,
            61, 61, 32, 109, 32, 63, 32, 104, 97, 32, 58, 32, 116, 41, 40, 74, 40, 113, 44, 32, 48, 41, 41, 44, 32, 113,
            46, 108, 101, 110, 103, 116, 104, 32, 61, 32, 48, 41, 32, 58, 32, 113, 46, 112, 117, 115, 104, 40, 110, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 101, 32, 43, 61, 32, 103, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 68, 91, 100, 32, 62, 62, 32, 50, 93, 32, 61, 32, 101, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 98, 97, 58, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 101, 99, 40, 120, 46, 115, 117, 98, 97, 114, 114, 97, 121, 40, 97, 44, 32, 97,
            32, 43, 32, 98, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            48, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 58, 32, 106,
            99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 100, 58, 32, 107, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            101, 58, 32, 108, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 113, 58, 32, 109, 99, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 122, 58, 32, 110, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 98, 58, 32, 111, 99, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 97, 58, 32, 112, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 103, 58, 32,
            113, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 111, 58, 32, 114, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 72, 58, 32, 115, 99, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 95, 58, 32, 89, 98, 10, 32, 32, 32, 32, 32,
            32, 125, 44, 32, 87, 32, 61, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99,
            116, 105, 111, 110, 32, 97, 40, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114,
            32, 95, 97, 51, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 87, 32, 61, 32, 99, 46, 101, 120, 112, 111,
            114, 116, 115, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 108, 97, 32, 61, 32, 87, 46, 108, 97, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 113, 97, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 83,
            32, 61, 32, 87, 46, 112, 97, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 115, 97, 46, 117, 110, 115,
            104, 105, 102, 116, 40, 87, 46, 109, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 69, 45, 45, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 40, 95, 97, 51, 32, 61, 32, 107, 46, 109, 111, 110, 105, 116,
            111, 114, 82, 117, 110, 68, 101, 112, 101, 110, 100, 101, 110, 99, 105, 101, 115, 41, 32, 61, 61, 32, 110,
            117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 51, 46, 99, 97, 108, 108, 40,
            107, 44, 32, 69, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48, 32, 61, 61, 32, 69, 32, 38, 38, 32,
            40, 110, 117, 108, 108, 32, 33, 61, 61, 32, 118, 97, 32, 38, 38, 32, 40, 99, 108, 101, 97, 114, 73, 110,
            116, 101, 114, 118, 97, 108, 40, 118, 97, 41, 44, 32, 118, 97, 32, 61, 32, 110, 117, 108, 108, 41, 44, 32,
            70, 32, 38, 38, 32, 40, 99, 32, 61, 32, 70, 44, 32, 70, 32, 61, 32, 110, 117, 108, 108, 44, 32, 99, 40, 41,
            41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 87, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 123,
            32, 97, 58, 32, 116, 99, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 69, 43, 43, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 40, 95, 97, 50, 32, 61, 32, 107, 46, 109, 111, 110, 105, 116, 111, 114, 82, 117, 110,
            68, 101, 112, 101, 110, 100, 101, 110, 99, 105, 101, 115, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63,
            32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 50, 46, 99, 97, 108, 108, 40, 107, 44, 32, 69, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 107, 46, 105, 110, 115, 116, 97, 110, 116, 105, 97,
            116, 101, 87, 97, 115, 109, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 107, 46, 105, 110, 115, 116,
            97, 110, 116, 105, 97, 116, 101, 87, 97, 115, 109, 40, 98, 44, 32, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 116, 40, 96, 77, 111, 100, 117, 108, 101, 46, 105, 110, 115, 116, 97, 110, 116, 105, 97,
            116, 101, 87, 97, 115, 109, 32, 99, 97, 108, 108, 98, 97, 99, 107, 32, 102, 97, 105, 108, 101, 100, 32, 119,
            105, 116, 104, 32, 101, 114, 114, 111, 114, 58, 32, 36, 123, 99, 125, 96, 41, 44, 32, 98, 97, 40, 99, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 121, 97, 32, 33,
            61, 32, 110, 117, 108, 108, 32, 63, 32, 121, 97, 32, 58, 32, 121, 97, 32, 61, 32, 120, 97, 40, 34, 68, 111,
            116, 76, 111, 116, 116, 105, 101, 80, 108, 97, 121, 101, 114, 46, 119, 97, 115, 109, 34, 41, 32, 63, 32, 34,
            68, 111, 116, 76, 111, 116, 116, 105, 101, 80, 108, 97, 121, 101, 114, 46, 119, 97, 115, 109, 34, 32, 58,
            32, 107, 46, 108, 111, 99, 97, 116, 101, 70, 105, 108, 101, 32, 63, 32, 107, 46, 108, 111, 99, 97, 116, 101,
            70, 105, 108, 101, 40, 34, 68, 111, 116, 76, 111, 116, 116, 105, 101, 80, 108, 97, 121, 101, 114, 46, 119,
            97, 115, 109, 34, 44, 32, 112, 41, 32, 58, 32, 112, 32, 43, 32, 34, 68, 111, 116, 76, 111, 116, 116, 105,
            101, 80, 108, 97, 121, 101, 114, 46, 119, 97, 115, 109, 34, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 67, 97,
            40, 98, 44, 32, 102, 117, 110, 99, 116, 105, 111, 110, 40, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 97, 40, 99, 46, 105, 110, 115, 116, 97, 110, 99, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 41, 46, 99, 97, 116, 99, 104, 40, 98, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 123, 125, 59, 10, 32, 32, 32, 32, 32, 32, 125, 40, 41, 44, 32, 104, 99, 32, 61, 32,
            40, 97, 41, 32, 61, 62, 32, 40, 104, 99, 32, 61, 32, 87, 46, 110, 97, 41, 40, 97, 41, 44, 32, 116, 98, 32,
            61, 32, 40, 97, 41, 32, 61, 62, 32, 40, 116, 98, 32, 61, 32, 87, 46, 111, 97, 41, 40, 97, 41, 44, 32, 85,
            32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 40, 85, 32, 61, 32, 87, 46, 113, 97, 41, 40, 97, 41, 44, 32, 105,
            99, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 40, 105, 99, 32, 61, 32, 87, 46, 114, 97, 41, 40,
            97, 44, 32, 98, 41, 44, 32, 88, 32, 61, 32, 40, 97, 44, 32, 98, 41, 32, 61, 62, 32, 40, 88, 32, 61, 32, 87,
            46, 115, 97, 41, 40, 97, 44, 32, 98, 41, 44, 32, 89, 32, 61, 32, 40, 97, 41, 32, 61, 62, 32, 40, 89, 32, 61,
            32, 87, 46, 116, 97, 41, 40, 97, 41, 44, 32, 90, 32, 61, 32, 40, 41, 32, 61, 62, 32, 40, 90, 32, 61, 32, 87,
            46, 117, 97, 41, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 105,
            105, 106, 106, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 41, 32,
            61, 62, 32, 40, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 105, 105, 106, 106, 32, 61, 32, 87, 46, 118,
            97, 41, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 118, 105, 106, 106, 32, 61, 32, 40, 97, 44, 32, 98,
            44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 41, 32, 61, 62, 32, 40, 107, 46, 100, 121, 110, 67, 97,
            108, 108, 95, 118, 105, 106, 106, 32, 61, 32, 87, 46, 119, 97, 41, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32,
            100, 44, 32, 101, 44, 32, 102, 41, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 100, 121, 110, 67, 97, 108, 108,
            95, 106, 105, 105, 105, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 32, 61, 62, 32, 40,
            107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 106, 105, 105, 105, 32, 61, 32, 87, 46, 120, 97, 41, 40, 97,
            44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 100, 121, 110, 67, 97,
            108, 108, 95, 106, 105, 105, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 41, 32, 61, 62, 32, 40, 107, 46,
            100, 121, 110, 67, 97, 108, 108, 95, 106, 105, 105, 32, 61, 32, 87, 46, 121, 97, 41, 40, 97, 44, 32, 98, 44,
            32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 117, 99, 32, 61, 32, 107, 46, 100, 121, 110,
            67, 97, 108, 108, 95, 118, 105, 106, 106, 106, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44,
            32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103, 41, 32, 61, 62, 32, 40, 117, 99, 32, 61, 32, 107, 46, 100,
            121, 110, 67, 97, 108, 108, 95, 118, 105, 106, 106, 106, 32, 61, 32, 87, 46, 122, 97, 41, 40, 97, 44, 32,
            98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 106, 105, 106, 105, 32, 61, 32, 40, 97, 44, 32, 98,
            44, 32, 99, 44, 32, 100, 44, 32, 101, 41, 32, 61, 62, 32, 40, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95,
            106, 105, 106, 105, 32, 61, 32, 87, 46, 65, 97, 41, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32,
            101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 118, 105, 105, 106,
            105, 105, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104,
            41, 32, 61, 62, 32, 40, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 118, 105, 105, 106, 105, 105, 32, 61,
            32, 87, 46, 66, 97, 41, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 105, 105, 105, 105, 105,
            106, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 41, 32,
            61, 62, 32, 40, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 105, 105, 105, 105, 105, 106, 32, 61, 32, 87,
            46, 67, 97, 41, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 105, 105, 105, 105, 105, 106, 106,
            32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103,
            44, 32, 108, 41, 32, 61, 62, 32, 40, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 105, 105, 105, 105, 105,
            106, 106, 32, 61, 32, 87, 46, 68, 97, 41, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32,
            102, 44, 32, 104, 44, 32, 103, 44, 32, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 107, 46, 100, 121, 110, 67,
            97, 108, 108, 95, 105, 105, 105, 105, 105, 105, 106, 106, 32, 61, 32, 40, 97, 44, 32, 98, 44, 32, 99, 44,
            32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32, 103, 44, 32, 108, 44, 32, 109, 41, 32, 61, 62, 32,
            40, 107, 46, 100, 121, 110, 67, 97, 108, 108, 95, 105, 105, 105, 105, 105, 105, 106, 106, 32, 61, 32, 87,
            46, 69, 97, 41, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44, 32,
            103, 44, 32, 108, 44, 32, 109, 41, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110,
            32, 111, 99, 40, 97, 44, 32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32,
            61, 32, 90, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 83, 46, 103, 101, 116, 40, 97, 41, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 32, 99, 97, 116, 99, 104, 32, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 89, 40,
            99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 100, 32, 33, 61, 61, 32, 100, 32,
            43, 32, 48, 41, 32, 116, 104, 114, 111, 119, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 88,
            40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 99, 40, 97, 44, 32, 98, 44, 32, 99,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 90, 40, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 83, 46, 103,
            101, 116, 40, 97, 41, 40, 98, 44, 32, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116,
            99, 104, 32, 40, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 89, 40, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 101, 32, 33, 61, 61, 32, 101, 32, 43, 32, 48, 41, 32,
            116, 104, 114, 111, 119, 32, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 88, 40, 49, 44, 32, 48,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 108, 99, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101, 32, 61, 32, 90, 40, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 83, 46, 103, 101, 116, 40, 97, 41, 40, 98, 44, 32, 99, 44, 32, 100, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 89, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 102, 32, 33,
            61, 61, 32, 102, 32, 43, 32, 48, 41, 32, 116, 104, 114, 111, 119, 32, 102, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 88, 40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 107, 99, 40, 97, 44, 32,
            98, 44, 32, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 100, 32, 61, 32, 90, 40,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 83, 46, 103, 101, 116, 40, 97, 41, 40, 98, 44, 32, 99, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 89, 40, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 101,
            32, 33, 61, 61, 32, 101, 32, 43, 32, 48, 41, 32, 116, 104, 114, 111, 119, 32, 101, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 88, 40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 106, 99, 40, 97,
            44, 32, 98, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 99, 32, 61, 32, 90, 40, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 83, 46, 103, 101, 116, 40, 97, 41, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 89, 40, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 100, 32, 33, 61, 61,
            32, 100, 32, 43, 32, 48, 41, 32, 116, 104, 114, 111, 119, 32, 100, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 88, 40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 99, 40, 97, 44, 32, 98, 44,
            32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97,
            114, 32, 104, 32, 61, 32, 90, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 83, 46, 103, 101, 116, 40, 97, 41,
            40, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            32, 99, 97, 116, 99, 104, 32, 40, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 89, 40, 104,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 103, 32, 33, 61, 61, 32, 103, 32, 43,
            32, 48, 41, 32, 116, 104, 114, 111, 119, 32, 103, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 88, 40,
            49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 114, 99, 40, 97, 44, 32, 98, 44, 32, 99, 44,
            32, 100, 44, 32, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 102, 32, 61, 32,
            90, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 83, 46, 103, 101, 116, 40, 97, 41, 40, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 104, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 89, 40, 102, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 104,
            32, 33, 61, 61, 32, 104, 32, 43, 32, 48, 41, 32, 116, 104, 114, 111, 119, 32, 104, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 88, 40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 113, 99, 40, 97,
            44, 32, 98, 44, 32, 99, 44, 32, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 101,
            32, 61, 32, 90, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 83, 46, 103, 101, 116, 40, 97, 41, 40, 98, 44, 32, 99, 44, 32, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 102, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 89, 40, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 102,
            32, 33, 61, 61, 32, 102, 32, 43, 32, 48, 41, 32, 116, 104, 114, 111, 119, 32, 102, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 88, 40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 110, 99, 40, 97,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32, 90, 40, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 83, 46, 103,
            101, 116, 40, 97, 41, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40,
            99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 89, 40, 98, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 99, 32, 33, 61, 61, 32, 99, 32, 43, 32, 48, 41, 32, 116, 104, 114, 111,
            119, 32, 99, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 88, 40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99,
            116, 105, 111, 110, 32, 115, 99, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44,
            32, 104, 44, 32, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 108, 32, 61, 32,
            90, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 117, 99, 40, 97, 44, 32, 98, 44, 32, 99, 44, 32, 100, 44, 32, 101, 44, 32, 102, 44, 32, 104, 44,
            32, 103, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 109, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 89, 40, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 105, 102, 32, 40, 109, 32, 33, 61, 61, 32, 109, 32, 43, 32, 48, 41, 32, 116, 104, 114, 111, 119, 32,
            109, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 88, 40, 49, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 118, 99, 59,
            10, 32, 32, 32, 32, 32, 32, 70, 32, 61, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 119, 99, 40, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 118, 99, 32, 124, 124, 32, 120, 99, 40, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 118, 99, 32, 124, 124, 32, 40, 70, 32, 61, 32, 119, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            125, 59, 10, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 120, 99, 40, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 97, 40, 41, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 50, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 105, 102, 32, 40, 33, 118, 99, 32, 38, 38, 32, 40, 118, 99, 32, 61, 32, 116, 114, 117, 101, 44, 32,
            107, 46, 99, 97, 108, 108, 101, 100, 82, 117, 110, 32, 61, 32, 116, 114, 117, 101, 44, 32, 33, 109, 97, 41,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 69, 97, 40, 115, 97, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 97, 40, 107, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 40, 95, 97, 50, 32, 61, 32, 107, 46, 111, 110, 82, 117, 110, 116, 105, 109, 101, 73, 110, 105, 116,
            105, 97, 108, 105, 122, 101, 100, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100,
            32, 48, 32, 58, 32, 95, 97, 50, 46, 99, 97, 108, 108, 40, 107, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 107, 46, 112, 111, 115, 116, 82, 117, 110, 41, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32,
            61, 61, 32, 116, 121, 112, 101, 111, 102, 32, 107, 46, 112, 111, 115, 116, 82, 117, 110, 32, 38, 38, 32, 40,
            107, 46, 112, 111, 115, 116, 82, 117, 110, 32, 61, 32, 91, 107, 46, 112, 111, 115, 116, 82, 117, 110, 93,
            41, 59, 32, 107, 46, 112, 111, 115, 116, 82, 117, 110, 46, 108, 101, 110, 103, 116, 104, 59, 32, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 98, 32, 61, 32,
            107, 46, 112, 111, 115, 116, 82, 117, 110, 46, 115, 104, 105, 102, 116, 40, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 97, 46, 117, 110, 115, 104, 105, 102, 116, 40, 98, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 69, 97, 40, 116, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 40, 48, 32, 60, 32, 69, 41,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 107, 46, 112, 114, 101, 82, 117,
            110, 41, 32, 102, 111, 114, 32, 40, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32, 61, 61, 32, 116, 121,
            112, 101, 111, 102, 32, 107, 46, 112, 114, 101, 82, 117, 110, 32, 38, 38, 32, 40, 107, 46, 112, 114, 101,
            82, 117, 110, 32, 61, 32, 91, 107, 46, 112, 114, 101, 82, 117, 110, 93, 41, 59, 32, 107, 46, 112, 114, 101,
            82, 117, 110, 46, 108, 101, 110, 103, 116, 104, 59, 32, 41, 32, 117, 97, 40, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 69, 97, 40, 114, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48, 32, 60, 32,
            69, 32, 124, 124, 32, 40, 107, 46, 115, 101, 116, 83, 116, 97, 116, 117, 115, 32, 63, 32, 40, 107, 46, 115,
            101, 116, 83, 116, 97, 116, 117, 115, 40, 34, 82, 117, 110, 110, 105, 110, 103, 46, 46, 46, 34, 41, 44, 32,
            115, 101, 116, 84, 105, 109, 101, 111, 117, 116, 40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 115, 101, 116, 84, 105, 109, 101, 111, 117, 116, 40, 40, 41, 32, 61, 62, 32,
            107, 46, 115, 101, 116, 83, 116, 97, 116, 117, 115, 40, 34, 34, 41, 44, 32, 49, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 97, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 32, 49,
            41, 41, 32, 58, 32, 97, 40, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 107, 46, 112, 114, 101, 73, 110, 105, 116, 41, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 102, 111, 114, 32, 40, 34, 102, 117, 110, 99, 116, 105, 111, 110, 34, 32, 61,
            61, 32, 116, 121, 112, 101, 111, 102, 32, 107, 46, 112, 114, 101, 73, 110, 105, 116, 32, 38, 38, 32, 40,
            107, 46, 112, 114, 101, 73, 110, 105, 116, 32, 61, 32, 91, 107, 46, 112, 114, 101, 73, 110, 105, 116, 93,
            41, 59, 32, 48, 32, 60, 32, 107, 46, 112, 114, 101, 73, 110, 105, 116, 46, 108, 101, 110, 103, 116, 104, 59,
            32, 41, 32, 107, 46, 112, 114, 101, 73, 110, 105, 116, 46, 112, 111, 112, 40, 41, 40, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 120, 99, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 109, 111, 100, 117, 108, 101, 82, 116, 110,
            32, 61, 32, 99, 97, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 111, 100, 117,
            108, 101, 82, 116, 110, 59, 10, 32, 32, 32, 32, 125, 59, 10, 32, 32, 125, 41, 40, 41, 59, 10, 32, 32, 118,
            97, 114, 32, 100, 111, 116, 108, 111, 116, 116, 105, 101, 95, 112, 108, 97, 121, 101, 114, 95, 100, 101,
            102, 97, 117, 108, 116, 32, 61, 32, 99, 114, 101, 97, 116, 101, 68, 111, 116, 76, 111, 116, 116, 105, 101,
            80, 108, 97, 121, 101, 114, 77, 111, 100, 117, 108, 101, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47,
            99, 111, 114, 101, 47, 100, 111, 116, 108, 111, 116, 116, 105, 101, 45, 119, 97, 115, 109, 45, 108, 111, 97,
            100, 101, 114, 46, 116, 115, 10, 32, 32, 118, 97, 114, 32, 68, 111, 116, 76, 111, 116, 116, 105, 101, 87,
            97, 115, 109, 76, 111, 97, 100, 101, 114, 32, 61, 32, 99, 108, 97, 115, 115, 32, 123, 10, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 116, 104,
            114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 34, 82, 101, 110, 100, 101, 114, 101, 114,
            76, 111, 97, 100, 101, 114, 32, 105, 115, 32, 97, 32, 115, 116, 97, 116, 105, 99, 32, 99, 108, 97, 115, 115,
            32, 97, 110, 100, 32, 99, 97, 110, 110, 111, 116, 32, 98, 101, 32, 105, 110, 115, 116, 97, 110, 116, 105,
            97, 116, 101, 100, 46, 34, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105, 99,
            32, 95, 116, 114, 121, 76, 111, 97, 100, 40, 117, 114, 108, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 95, 95, 97, 115, 121, 110, 99, 40, 116, 104, 105, 115, 44, 32, 110, 117, 108,
            108, 44, 32, 102, 117, 110, 99, 116, 105, 111, 110, 42, 32, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 32, 109, 111, 100, 117, 108, 101, 32, 61, 32, 121, 105, 101, 108, 100, 32, 100,
            111, 116, 108, 111, 116, 116, 105, 101, 95, 112, 108, 97, 121, 101, 114, 95, 100, 101, 102, 97, 117, 108,
            116, 40, 123, 32, 108, 111, 99, 97, 116, 101, 70, 105, 108, 101, 58, 32, 40, 41, 32, 61, 62, 32, 117, 114,
            108, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 111, 100,
            117, 108, 101, 59, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 47,
            42, 42, 10, 32, 32, 32, 32, 32, 42, 32, 84, 114, 105, 101, 115, 32, 116, 111, 32, 108, 111, 97, 100, 32,
            116, 104, 101, 32, 87, 65, 83, 77, 32, 109, 111, 100, 117, 108, 101, 32, 102, 114, 111, 109, 32, 116, 104,
            101, 32, 112, 114, 105, 109, 97, 114, 121, 32, 85, 82, 76, 44, 32, 102, 97, 108, 108, 105, 110, 103, 32, 98,
            97, 99, 107, 32, 116, 111, 32, 97, 32, 98, 97, 99, 107, 117, 112, 32, 85, 82, 76, 32, 105, 102, 32, 110,
            101, 99, 101, 115, 115, 97, 114, 121, 46, 10, 32, 32, 32, 32, 32, 42, 32, 84, 104, 114, 111, 119, 115, 32,
            97, 110, 32, 101, 114, 114, 111, 114, 32, 105, 102, 32, 98, 111, 116, 104, 32, 85, 82, 76, 115, 32, 102, 97,
            105, 108, 32, 116, 111, 32, 108, 111, 97, 100, 32, 116, 104, 101, 32, 109, 111, 100, 117, 108, 101, 46, 10,
            32, 32, 32, 32, 32, 42, 32, 64, 114, 101, 116, 117, 114, 110, 115, 32, 80, 114, 111, 109, 105, 115, 101, 60,
            77, 111, 100, 117, 108, 101, 62, 32, 45, 32, 65, 32, 112, 114, 111, 109, 105, 115, 101, 32, 116, 104, 97,
            116, 32, 114, 101, 115, 111, 108, 118, 101, 115, 32, 116, 111, 32, 116, 104, 101, 32, 108, 111, 97, 100,
            101, 100, 32, 109, 111, 100, 117, 108, 101, 46, 10, 32, 32, 32, 32, 32, 42, 47, 10, 32, 32, 32, 32, 115,
            116, 97, 116, 105, 99, 32, 95, 108, 111, 97, 100, 87, 105, 116, 104, 66, 97, 99, 107, 117, 112, 40, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 95, 95, 97, 115, 121, 110, 99, 40, 116,
            104, 105, 115, 44, 32, 110, 117, 108, 108, 44, 32, 102, 117, 110, 99, 116, 105, 111, 110, 42, 32, 40, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 116, 104, 105, 115, 46, 95, 77, 111, 100,
            117, 108, 101, 80, 114, 111, 109, 105, 115, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            116, 104, 105, 115, 46, 95, 77, 111, 100, 117, 108, 101, 80, 114, 111, 109, 105, 115, 101, 32, 61, 32, 116,
            104, 105, 115, 46, 95, 116, 114, 121, 76, 111, 97, 100, 40, 116, 104, 105, 115, 46, 95, 119, 97, 115, 109,
            85, 82, 76, 41, 46, 99, 97, 116, 99, 104, 40, 40, 105, 110, 105, 116, 105, 97, 108, 69, 114, 114, 111, 114,
            41, 32, 61, 62, 32, 95, 95, 97, 115, 121, 110, 99, 40, 116, 104, 105, 115, 44, 32, 110, 117, 108, 108, 44,
            32, 102, 117, 110, 99, 116, 105, 111, 110, 42, 32, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 116, 32, 98, 97, 99, 107, 117, 112, 85, 114, 108, 32, 61, 32, 96, 104, 116,
            116, 112, 115, 58, 47, 47, 117, 110, 112, 107, 103, 46, 99, 111, 109, 47, 36, 123, 80, 65, 67, 75, 65, 71,
            69, 95, 78, 65, 77, 69, 125, 64, 36, 123, 80, 65, 67, 75, 65, 71, 69, 95, 86, 69, 82, 83, 73, 79, 78, 125,
            47, 100, 105, 115, 116, 47, 100, 111, 116, 108, 111, 116, 116, 105, 101, 45, 112, 108, 97, 121, 101, 114,
            46, 119, 97, 115, 109, 96, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 111,
            108, 101, 46, 119, 97, 114, 110, 40, 96, 80, 114, 105, 109, 97, 114, 121, 32, 87, 65, 83, 77, 32, 108, 111,
            97, 100, 32, 102, 97, 105, 108, 101, 100, 32, 102, 114, 111, 109, 32, 36, 123, 116, 104, 105, 115, 46, 95,
            119, 97, 115, 109, 85, 82, 76, 125, 46, 32, 69, 114, 114, 111, 114, 58, 32, 36, 123, 105, 110, 105, 116,
            105, 97, 108, 69, 114, 114, 111, 114, 46, 109, 101, 115, 115, 97, 103, 101, 125, 96, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 111, 108, 101, 46, 119, 97, 114, 110, 40, 96, 65,
            116, 116, 101, 109, 112, 116, 105, 110, 103, 32, 116, 111, 32, 108, 111, 97, 100, 32, 87, 65, 83, 77, 32,
            102, 114, 111, 109, 32, 98, 97, 99, 107, 117, 112, 32, 85, 82, 76, 58, 32, 36, 123, 98, 97, 99, 107, 117,
            112, 85, 114, 108, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 121, 105,
            101, 108, 100, 32, 116, 104, 105, 115, 46, 95, 116, 114, 121, 76, 111, 97, 100, 40, 98, 97, 99, 107, 117,
            112, 85, 114, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99,
            104, 32, 40, 98, 97, 99, 107, 117, 112, 69, 114, 114, 111, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 111, 108, 101, 46, 101, 114, 114, 111, 114, 40, 96, 80, 114,
            105, 109, 97, 114, 121, 32, 87, 65, 83, 77, 32, 85, 82, 76, 32, 102, 97, 105, 108, 101, 100, 58, 32, 36,
            123, 105, 110, 105, 116, 105, 97, 108, 69, 114, 114, 111, 114, 46, 109, 101, 115, 115, 97, 103, 101, 125,
            96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 111, 108, 101,
            46, 101, 114, 114, 111, 114, 40, 96, 66, 97, 99, 107, 117, 112, 32, 87, 65, 83, 77, 32, 85, 82, 76, 32, 102,
            97, 105, 108, 101, 100, 58, 32, 36, 123, 98, 97, 99, 107, 117, 112, 69, 114, 114, 111, 114, 46, 109, 101,
            115, 115, 97, 103, 101, 125, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 34, 87, 65, 83, 77, 32, 108, 111, 97,
            100, 105, 110, 103, 32, 102, 97, 105, 108, 101, 100, 32, 102, 114, 111, 109, 32, 97, 108, 108, 32, 115, 111,
            117, 114, 99, 101, 115, 46, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 95, 77, 111, 100, 117, 108,
            101, 80, 114, 111, 109, 105, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 47, 42, 42, 10, 32, 32, 32, 32, 32, 42, 32, 80, 117, 98, 108, 105, 99, 32, 109, 101,
            116, 104, 111, 100, 32, 116, 111, 32, 108, 111, 97, 100, 32, 116, 104, 101, 32, 87, 101, 98, 65, 115, 115,
            101, 109, 98, 108, 121, 32, 109, 111, 100, 117, 108, 101, 46, 10, 32, 32, 32, 32, 32, 42, 32, 85, 116, 105,
            108, 105, 122, 101, 115, 32, 97, 32, 112, 114, 105, 109, 97, 114, 121, 32, 97, 110, 100, 32, 98, 97, 99,
            107, 117, 112, 32, 85, 82, 76, 32, 102, 111, 114, 32, 114, 111, 98, 117, 115, 116, 110, 101, 115, 115, 46,
            10, 32, 32, 32, 32, 32, 42, 32, 64, 114, 101, 116, 117, 114, 110, 115, 32, 80, 114, 111, 109, 105, 115, 101,
            60, 77, 111, 100, 117, 108, 101, 62, 32, 45, 32, 65, 32, 112, 114, 111, 109, 105, 115, 101, 32, 116, 104,
            97, 116, 32, 114, 101, 115, 111, 108, 118, 101, 115, 32, 116, 111, 32, 116, 104, 101, 32, 108, 111, 97, 100,
            101, 100, 32, 109, 111, 100, 117, 108, 101, 46, 10, 32, 32, 32, 32, 32, 42, 47, 10, 32, 32, 32, 32, 115,
            116, 97, 116, 105, 99, 32, 108, 111, 97, 100, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 95, 95, 97, 115, 121, 110, 99, 40, 116, 104, 105, 115, 44, 32, 110, 117, 108, 108, 44,
            32, 102, 117, 110, 99, 116, 105, 111, 110, 42, 32, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 95, 108, 111, 97, 100, 87, 105, 116, 104, 66, 97, 99,
            107, 117, 112, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 47, 42, 42, 10, 32, 32, 32, 32, 32, 42, 32, 83, 101, 116, 115, 32, 97, 32, 110, 101, 119, 32, 85, 82,
            76, 32, 102, 111, 114, 32, 116, 104, 101, 32, 87, 65, 83, 77, 32, 102, 105, 108, 101, 32, 97, 110, 100, 32,
            105, 110, 118, 97, 108, 105, 100, 97, 116, 101, 115, 32, 116, 104, 101, 32, 99, 117, 114, 114, 101, 110,
            116, 32, 109, 111, 100, 117, 108, 101, 32, 112, 114, 111, 109, 105, 115, 101, 46, 10, 32, 32, 32, 32, 32,
            42, 10, 32, 32, 32, 32, 32, 42, 32, 64, 112, 97, 114, 97, 109, 32, 115, 116, 114, 105, 110, 103, 32, 45, 32,
            32, 84, 104, 101, 32, 110, 101, 119, 32, 85, 82, 76, 32, 102, 111, 114, 32, 116, 104, 101, 32, 87, 65, 83,
            77, 32, 102, 105, 108, 101, 46, 10, 32, 32, 32, 32, 32, 42, 47, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105,
            99, 32, 115, 101, 116, 87, 97, 115, 109, 85, 114, 108, 40, 117, 114, 108, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 116, 104, 105, 115, 46, 95, 119, 97, 115, 109, 85, 82, 76, 32, 61, 32, 117, 114, 108, 59, 10, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 77, 111, 100, 117, 108, 101, 80, 114, 111, 109, 105, 115,
            101, 32, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32, 32, 47, 47,
            32, 101, 115, 108, 105, 110, 116, 45, 100, 105, 115, 97, 98, 108, 101, 45, 110, 101, 120, 116, 45, 108, 105,
            110, 101, 32, 64, 116, 121, 112, 101, 115, 99, 114, 105, 112, 116, 45, 101, 115, 108, 105, 110, 116, 47,
            110, 97, 109, 105, 110, 103, 45, 99, 111, 110, 118, 101, 110, 116, 105, 111, 110, 10, 32, 32, 95, 95, 112,
            117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 68, 111, 116, 76, 111, 116, 116, 105, 101, 87, 97, 115,
            109, 76, 111, 97, 100, 101, 114, 44, 32, 34, 95, 77, 111, 100, 117, 108, 101, 80, 114, 111, 109, 105, 115,
            101, 34, 44, 32, 110, 117, 108, 108, 41, 59, 10, 32, 32, 47, 47, 32, 85, 82, 76, 32, 102, 111, 114, 32, 116,
            104, 101, 32, 87, 65, 83, 77, 32, 102, 105, 108, 101, 44, 32, 99, 111, 110, 115, 116, 114, 117, 99, 116,
            101, 100, 32, 117, 115, 105, 110, 103, 32, 112, 97, 99, 107, 97, 103, 101, 32, 105, 110, 102, 111, 114, 109,
            97, 116, 105, 111, 110, 10, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 68, 111,
            116, 76, 111, 116, 116, 105, 101, 87, 97, 115, 109, 76, 111, 97, 100, 101, 114, 44, 32, 34, 95, 119, 97,
            115, 109, 85, 82, 76, 34, 44, 32, 96, 104, 116, 116, 112, 115, 58, 47, 47, 99, 100, 110, 46, 106, 115, 100,
            101, 108, 105, 118, 114, 46, 110, 101, 116, 47, 110, 112, 109, 47, 36, 123, 80, 65, 67, 75, 65, 71, 69, 95,
            78, 65, 77, 69, 125, 64, 36, 123, 80, 65, 67, 75, 65, 71, 69, 95, 86, 69, 82, 83, 73, 79, 78, 125, 47, 100,
            105, 115, 116, 47, 100, 111, 116, 108, 111, 116, 116, 105, 101, 45, 112, 108, 97, 121, 101, 114, 46, 119,
            97, 115, 109, 96, 41, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47, 101, 118, 101, 110, 116, 45, 109,
            97, 110, 97, 103, 101, 114, 46, 116, 115, 10, 32, 32, 118, 97, 114, 32, 69, 118, 101, 110, 116, 77, 97, 110,
            97, 103, 101, 114, 32, 61, 32, 99, 108, 97, 115, 115, 32, 123, 10, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            114, 117, 99, 116, 111, 114, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105,
            99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 101, 118, 101, 110, 116, 76, 105, 115,
            116, 101, 110, 101, 114, 115, 34, 44, 32, 47, 42, 32, 64, 95, 95, 80, 85, 82, 69, 95, 95, 32, 42, 47, 32,
            110, 101, 119, 32, 77, 97, 112, 40, 41, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 97, 100, 100,
            69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 40, 116, 121, 112, 101, 44, 32, 108, 105,
            115, 116, 101, 110, 101, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 108, 101, 116, 32, 108, 105, 115,
            116, 101, 110, 101, 114, 115, 32, 61, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 76, 105, 115,
            116, 101, 110, 101, 114, 115, 46, 103, 101, 116, 40, 116, 121, 112, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 33, 108, 105, 115, 116, 101, 110, 101, 114, 115, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 32, 61, 32, 47, 42, 32, 64, 95, 95, 80, 85, 82, 69, 95,
            95, 32, 42, 47, 32, 110, 101, 119, 32, 83, 101, 116, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 115, 46, 115, 101,
            116, 40, 116, 121, 112, 101, 44, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 46, 97, 100, 100,
            40, 108, 105, 115, 116, 101, 110, 101, 114, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 114, 101,
            109, 111, 118, 101, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 40, 116, 121, 112, 101,
            44, 32, 108, 105, 115, 116, 101, 110, 101, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115,
            116, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 32, 61, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101,
            110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 115, 46, 103, 101, 116, 40, 116, 121, 112, 101, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 108, 105, 115, 116, 101, 110, 101, 114, 115, 41, 32, 114, 101,
            116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 108, 105, 115, 116, 101, 110, 101,
            114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 46, 100,
            101, 108, 101, 116, 101, 40, 108, 105, 115, 116, 101, 110, 101, 114, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 108, 105, 115, 116, 101, 110, 101, 114, 115, 46, 115, 105, 122, 101, 32, 61, 61, 61,
            32, 48, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101,
            110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 115, 46, 100, 101, 108, 101, 116, 101, 40, 116, 121, 112,
            101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115,
            101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 76,
            105, 115, 116, 101, 110, 101, 114, 115, 46, 100, 101, 108, 101, 116, 101, 40, 116, 121, 112, 101, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 100, 105, 115, 112, 97, 116,
            99, 104, 40, 101, 118, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            108, 105, 115, 116, 101, 110, 101, 114, 115, 32, 61, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110,
            116, 76, 105, 115, 116, 101, 110, 101, 114, 115, 46, 103, 101, 116, 40, 101, 118, 101, 110, 116, 46, 116,
            121, 112, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 32, 61, 61,
            32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 108, 105, 115, 116, 101, 110,
            101, 114, 115, 46, 102, 111, 114, 69, 97, 99, 104, 40, 40, 108, 105, 115, 116, 101, 110, 101, 114, 41, 32,
            61, 62, 32, 108, 105, 115, 116, 101, 110, 101, 114, 40, 101, 118, 101, 110, 116, 41, 41, 59, 10, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 114, 101, 109, 111, 118, 101, 65, 108, 108, 69, 118, 101, 110, 116, 76, 105,
            115, 116, 101, 110, 101, 114, 115, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95,
            101, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 115, 46, 99, 108, 101, 97, 114, 40, 41, 59,
            10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47, 111, 102, 102,
            115, 99, 114, 101, 101, 110, 45, 111, 98, 115, 101, 114, 118, 101, 114, 46, 116, 115, 10, 32, 32, 118, 97,
            114, 32, 79, 102, 102, 115, 99, 114, 101, 101, 110, 79, 98, 115, 101, 114, 118, 101, 114, 32, 61, 32, 99,
            108, 97, 115, 115, 32, 123, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105, 99, 32, 95, 105, 110, 105, 116, 105,
            97, 108, 105, 122, 101, 79, 98, 115, 101, 114, 118, 101, 114, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 114, 41, 32, 114, 101, 116,
            117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 116, 101, 114, 115,
            101, 99, 116, 105, 111, 110, 79, 98, 115, 101, 114, 118, 101, 114, 67, 97, 108, 108, 98, 97, 99, 107, 32,
            61, 32, 40, 101, 110, 116, 114, 105, 101, 115, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            101, 110, 116, 114, 105, 101, 115, 46, 102, 111, 114, 69, 97, 99, 104, 40, 40, 101, 110, 116, 114, 121, 41,
            32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115,
            116, 97, 110, 99, 101, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 100, 67,
            97, 110, 118, 97, 115, 101, 115, 46, 103, 101, 116, 40, 101, 110, 116, 114, 121, 46, 116, 97, 114, 103, 101,
            116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 105, 110, 115, 116, 97, 110, 99,
            101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 101, 110, 116, 114,
            121, 46, 105, 115, 73, 110, 116, 101, 114, 115, 101, 99, 116, 105, 110, 103, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 117, 110, 102, 114,
            101, 101, 122, 101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115,
            101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 46, 102, 114, 101, 101, 122, 101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114,
            118, 101, 114, 32, 61, 32, 110, 101, 119, 32, 73, 110, 116, 101, 114, 115, 101, 99, 116, 105, 111, 110, 79,
            98, 115, 101, 114, 118, 101, 114, 40, 105, 110, 116, 101, 114, 115, 101, 99, 116, 105, 111, 110, 79, 98,
            115, 101, 114, 118, 101, 114, 67, 97, 108, 108, 98, 97, 99, 107, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 116, 104, 114, 101, 115, 104, 111, 108, 100, 58, 32, 48, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59,
            10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105, 99, 32, 111, 98, 115, 101, 114, 118,
            101, 40, 99, 97, 110, 118, 97, 115, 44, 32, 100, 111, 116, 76, 111, 116, 116, 105, 101, 73, 110, 115, 116,
            97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32,
            32, 32, 116, 104, 105, 115, 46, 95, 105, 110, 105, 116, 105, 97, 108, 105, 122, 101, 79, 98, 115, 101, 114,
            118, 101, 114, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 111,
            98, 115, 101, 114, 118, 101, 100, 67, 97, 110, 118, 97, 115, 101, 115, 46, 104, 97, 115, 40, 99, 97, 110,
            118, 97, 115, 41, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115,
            46, 95, 111, 98, 115, 101, 114, 118, 101, 100, 67, 97, 110, 118, 97, 115, 101, 115, 46, 115, 101, 116, 40,
            99, 97, 110, 118, 97, 115, 44, 32, 100, 111, 116, 76, 111, 116, 116, 105, 101, 73, 110, 115, 116, 97, 110,
            99, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 98,
            115, 101, 114, 118, 101, 114, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32,
            48, 32, 58, 32, 95, 97, 46, 111, 98, 115, 101, 114, 118, 101, 40, 99, 97, 110, 118, 97, 115, 41, 59, 10, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105, 99, 32, 117, 110, 111, 98, 115, 101, 114, 118,
            101, 40, 99, 97, 110, 118, 97, 115, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44,
            32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 98,
            115, 101, 114, 118, 101, 114, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32,
            48, 32, 58, 32, 95, 97, 46, 117, 110, 111, 98, 115, 101, 114, 118, 101, 40, 99, 97, 110, 118, 97, 115, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 100, 67, 97,
            110, 118, 97, 115, 101, 115, 46, 100, 101, 108, 101, 116, 101, 40, 99, 97, 110, 118, 97, 115, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 100,
            67, 97, 110, 118, 97, 115, 101, 115, 46, 115, 105, 122, 101, 32, 61, 61, 61, 32, 48, 41, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 40, 95, 98, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118,
            101, 114, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95,
            98, 46, 100, 105, 115, 99, 111, 110, 110, 101, 99, 116, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 114, 32, 61, 32, 110, 117, 108, 108, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32, 32, 95, 95, 112, 117, 98,
            108, 105, 99, 70, 105, 101, 108, 100, 40, 79, 102, 102, 115, 99, 114, 101, 101, 110, 79, 98, 115, 101, 114,
            118, 101, 114, 44, 32, 34, 95, 111, 98, 115, 101, 114, 118, 101, 114, 34, 44, 32, 110, 117, 108, 108, 41,
            59, 10, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 79, 102, 102, 115, 99, 114,
            101, 101, 110, 79, 98, 115, 101, 114, 118, 101, 114, 44, 32, 34, 95, 111, 98, 115, 101, 114, 118, 101, 100,
            67, 97, 110, 118, 97, 115, 101, 115, 34, 44, 32, 47, 42, 32, 64, 95, 95, 80, 85, 82, 69, 95, 95, 32, 42, 47,
            32, 110, 101, 119, 32, 77, 97, 112, 40, 41, 41, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47, 114, 101,
            115, 105, 122, 101, 45, 111, 98, 115, 101, 114, 118, 101, 114, 46, 116, 115, 10, 32, 32, 118, 97, 114, 32,
            82, 69, 83, 73, 90, 69, 95, 68, 69, 66, 79, 85, 78, 67, 69, 95, 84, 73, 77, 69, 32, 61, 32, 49, 48, 48, 59,
            10, 32, 32, 118, 97, 114, 32, 67, 97, 110, 118, 97, 115, 82, 101, 115, 105, 122, 101, 79, 98, 115, 101, 114,
            118, 101, 114, 32, 61, 32, 99, 108, 97, 115, 115, 32, 123, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105, 99,
            32, 95, 105, 110, 105, 116, 105, 97, 108, 105, 122, 101, 79, 98, 115, 101, 114, 118, 101, 114, 40, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118,
            101, 114, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            114, 101, 115, 105, 122, 101, 72, 97, 110, 100, 108, 101, 114, 32, 61, 32, 40, 101, 110, 116, 114, 105, 101,
            115, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 101, 110, 116, 114, 105, 101, 115, 46,
            102, 111, 114, 69, 97, 99, 104, 40, 40, 101, 110, 116, 114, 121, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 101, 108, 101, 109, 101, 110, 116, 32, 61, 32, 116,
            104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 100, 67, 97, 110, 118, 97, 115, 101, 115, 46, 103,
            101, 116, 40, 101, 110, 116, 114, 121, 46, 116, 97, 114, 103, 101, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 33, 101, 108, 101, 109, 101, 110, 116, 41, 32, 114, 101, 116, 117, 114,
            110, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 91, 100, 111, 116, 76, 111,
            116, 116, 105, 101, 73, 110, 115, 116, 97, 110, 99, 101, 44, 32, 116, 105, 109, 101, 111, 117, 116, 93, 32,
            61, 32, 101, 108, 101, 109, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 108, 101, 97,
            114, 84, 105, 109, 101, 111, 117, 116, 40, 116, 105, 109, 101, 111, 117, 116, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 110, 101, 119, 84, 105, 109, 101, 111, 117, 116, 32, 61,
            32, 115, 101, 116, 84, 105, 109, 101, 111, 117, 116, 40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 100, 111, 116, 76, 111, 116, 116, 105, 101, 73, 110, 115, 116, 97, 110, 99,
            101, 46, 114, 101, 115, 105, 122, 101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 44, 32,
            82, 69, 83, 73, 90, 69, 95, 68, 69, 66, 79, 85, 78, 67, 69, 95, 84, 73, 77, 69, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 100, 67, 97, 110, 118,
            97, 115, 101, 115, 46, 115, 101, 116, 40, 101, 110, 116, 114, 121, 46, 116, 97, 114, 103, 101, 116, 44, 32,
            91, 100, 111, 116, 76, 111, 116, 116, 105, 101, 73, 110, 115, 116, 97, 110, 99, 101, 44, 32, 110, 101, 119,
            84, 105, 109, 101, 111, 117, 116, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114,
            118, 101, 114, 32, 61, 32, 110, 101, 119, 32, 82, 101, 115, 105, 122, 101, 79, 98, 115, 101, 114, 118, 101,
            114, 40, 114, 101, 115, 105, 122, 101, 72, 97, 110, 100, 108, 101, 114, 41, 59, 10, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 115, 116, 97, 116, 105, 99, 32, 111, 98, 115, 101, 114, 118, 101, 40, 99, 97, 110, 118, 97,
            115, 44, 32, 100, 111, 116, 76, 111, 116, 116, 105, 101, 73, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115,
            46, 95, 105, 110, 105, 116, 105, 97, 108, 105, 122, 101, 79, 98, 115, 101, 114, 118, 101, 114, 40, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101,
            100, 67, 97, 110, 118, 97, 115, 101, 115, 46, 104, 97, 115, 40, 99, 97, 110, 118, 97, 115, 41, 41, 32, 114,
            101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114,
            118, 101, 100, 67, 97, 110, 118, 97, 115, 101, 115, 46, 115, 101, 116, 40, 99, 97, 110, 118, 97, 115, 44,
            32, 91, 100, 111, 116, 76, 111, 116, 116, 105, 101, 73, 110, 115, 116, 97, 110, 99, 101, 44, 32, 48, 93, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114,
            118, 101, 114, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32,
            95, 97, 46, 111, 98, 115, 101, 114, 118, 101, 40, 99, 97, 110, 118, 97, 115, 41, 59, 10, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105, 99, 32, 117, 110, 111, 98, 115, 101, 114, 118, 101, 40, 99,
            97, 110, 118, 97, 115, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98,
            59, 10, 32, 32, 32, 32, 32, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114,
            118, 101, 114, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32,
            95, 97, 46, 117, 110, 111, 98, 115, 101, 114, 118, 101, 40, 99, 97, 110, 118, 97, 115, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 100, 67, 97, 110, 118, 97,
            115, 101, 115, 46, 100, 101, 108, 101, 116, 101, 40, 99, 97, 110, 118, 97, 115, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 100, 67, 97, 110,
            118, 97, 115, 101, 115, 46, 115, 105, 122, 101, 32, 61, 61, 61, 32, 48, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 40, 95, 98, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 114, 41,
            32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 98, 46, 100,
            105, 115, 99, 111, 110, 110, 101, 99, 116, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 111, 98, 115, 101, 114, 118, 101, 114, 32, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99,
            70, 105, 101, 108, 100, 40, 67, 97, 110, 118, 97, 115, 82, 101, 115, 105, 122, 101, 79, 98, 115, 101, 114,
            118, 101, 114, 44, 32, 34, 95, 111, 98, 115, 101, 114, 118, 101, 114, 34, 44, 32, 110, 117, 108, 108, 41,
            59, 10, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 67, 97, 110, 118, 97, 115,
            82, 101, 115, 105, 122, 101, 79, 98, 115, 101, 114, 118, 101, 114, 44, 32, 34, 95, 111, 98, 115, 101, 114,
            118, 101, 100, 67, 97, 110, 118, 97, 115, 101, 115, 34, 44, 32, 47, 42, 32, 64, 95, 95, 80, 85, 82, 69, 95,
            95, 32, 42, 47, 32, 110, 101, 119, 32, 77, 97, 112, 40, 41, 41, 59, 10, 10, 32, 32, 47, 47, 32, 115, 114,
            99, 47, 117, 116, 105, 108, 115, 46, 116, 115, 10, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 105,
            115, 72, 101, 120, 67, 111, 108, 111, 114, 40, 99, 111, 108, 111, 114, 41, 32, 123, 10, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 47, 94, 35, 40, 91, 92, 100, 97, 45, 102, 93, 123, 54, 125, 124, 91, 92, 100,
            97, 45, 102, 93, 123, 56, 125, 41, 36, 47, 105, 117, 46, 116, 101, 115, 116, 40, 99, 111, 108, 111, 114, 41,
            59, 10, 32, 32, 125, 10, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 104, 101, 120, 83, 116, 114,
            105, 110, 103, 84, 111, 82, 71, 66, 65, 73, 110, 116, 40, 99, 111, 108, 111, 114, 72, 101, 120, 41, 32, 123,
            10, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 115, 72, 101, 120, 67, 111, 108, 111, 114, 40, 99, 111, 108,
            111, 114, 72, 101, 120, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 48,
            59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 108, 101, 116, 32, 104, 101, 120, 32, 61, 32, 99, 111, 108,
            111, 114, 72, 101, 120, 46, 114, 101, 112, 108, 97, 99, 101, 40, 34, 35, 34, 44, 32, 34, 34, 41, 59, 10, 32,
            32, 32, 32, 104, 101, 120, 32, 61, 32, 104, 101, 120, 46, 108, 101, 110, 103, 116, 104, 32, 61, 61, 61, 32,
            54, 32, 63, 32, 96, 36, 123, 104, 101, 120, 125, 102, 102, 96, 32, 58, 32, 104, 101, 120, 59, 10, 32, 32,
            32, 32, 114, 101, 116, 117, 114, 110, 32, 112, 97, 114, 115, 101, 73, 110, 116, 40, 104, 101, 120, 44, 32,
            49, 54, 41, 59, 10, 32, 32, 125, 10, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 105, 115, 68, 111,
            116, 76, 111, 116, 116, 105, 101, 40, 102, 105, 108, 101, 68, 97, 116, 97, 41, 32, 123, 10, 32, 32, 32, 32,
            105, 102, 32, 40, 102, 105, 108, 101, 68, 97, 116, 97, 46, 98, 121, 116, 101, 76, 101, 110, 103, 116, 104,
            32, 60, 32, 52, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108,
            115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 102, 105, 108, 101,
            83, 105, 103, 110, 97, 116, 117, 114, 101, 32, 61, 32, 110, 101, 119, 32, 85, 105, 110, 116, 56, 65, 114,
            114, 97, 121, 40, 102, 105, 108, 101, 68, 97, 116, 97, 46, 115, 108, 105, 99, 101, 40, 48, 44, 32, 90, 73,
            80, 95, 83, 73, 71, 78, 65, 84, 85, 82, 69, 46, 98, 121, 116, 101, 76, 101, 110, 103, 116, 104, 41, 41, 59,
            10, 32, 32, 32, 32, 102, 111, 114, 32, 40, 108, 101, 116, 32, 105, 32, 61, 32, 48, 59, 32, 105, 32, 60, 32,
            90, 73, 80, 95, 83, 73, 71, 78, 65, 84, 85, 82, 69, 46, 108, 101, 110, 103, 116, 104, 59, 32, 105, 32, 43,
            61, 32, 49, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 90, 73, 80, 95, 83, 73, 71, 78, 65,
            84, 85, 82, 69, 91, 105, 93, 32, 33, 61, 61, 32, 102, 105, 108, 101, 83, 105, 103, 110, 97, 116, 117, 114,
            101, 91, 105, 93, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102,
            97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 116, 114, 117, 101, 59, 10, 32, 32, 125, 10, 32, 32, 102, 117, 110, 99, 116,
            105, 111, 110, 32, 105, 115, 76, 111, 116, 116, 105, 101, 74, 83, 79, 78, 40, 106, 115, 111, 110, 41, 32,
            123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 76, 79, 84, 84, 73, 69, 95, 74, 83, 79, 78, 95,
            77, 65, 78, 68, 65, 84, 79, 82, 89, 95, 70, 73, 69, 76, 68, 83, 46, 101, 118, 101, 114, 121, 40, 40, 102,
            105, 101, 108, 100, 41, 32, 61, 62, 32, 79, 98, 106, 101, 99, 116, 46, 112, 114, 111, 116, 111, 116, 121,
            112, 101, 46, 104, 97, 115, 79, 119, 110, 80, 114, 111, 112, 101, 114, 116, 121, 46, 99, 97, 108, 108, 40,
            106, 115, 111, 110, 44, 32, 102, 105, 101, 108, 100, 41, 41, 59, 10, 32, 32, 125, 10, 32, 32, 102, 117, 110,
            99, 116, 105, 111, 110, 32, 105, 115, 76, 111, 116, 116, 105, 101, 40, 102, 105, 108, 101, 68, 97, 116, 97,
            41, 32, 123, 10, 32, 32, 32, 32, 105, 102, 32, 40, 116, 121, 112, 101, 111, 102, 32, 102, 105, 108, 101, 68,
            97, 116, 97, 32, 61, 61, 61, 32, 34, 115, 116, 114, 105, 110, 103, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 115,
            76, 111, 116, 116, 105, 101, 74, 83, 79, 78, 40, 74, 83, 79, 78, 46, 112, 97, 114, 115, 101, 40, 102, 105,
            108, 101, 68, 97, 116, 97, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40,
            95, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108,
            115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 115, 76, 111, 116, 116, 105, 101, 74, 83, 79,
            78, 40, 102, 105, 108, 101, 68, 97, 116, 97, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 10, 32, 32,
            102, 117, 110, 99, 116, 105, 111, 110, 32, 103, 101, 116, 68, 101, 102, 97, 117, 108, 116, 68, 80, 82, 40,
            41, 32, 123, 10, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 100, 112, 114, 32, 61, 32, 73, 83, 95, 66, 82,
            79, 87, 83, 69, 82, 32, 63, 32, 119, 105, 110, 100, 111, 119, 46, 100, 101, 118, 105, 99, 101, 80, 105, 120,
            101, 108, 82, 97, 116, 105, 111, 32, 58, 32, 49, 59, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            49, 32, 43, 32, 40, 100, 112, 114, 32, 45, 32, 49, 41, 32, 42, 32, 68, 69, 70, 65, 85, 76, 84, 95, 68, 80,
            82, 95, 70, 65, 67, 84, 79, 82, 59, 10, 32, 32, 125, 10, 32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32,
            105, 115, 69, 108, 101, 109, 101, 110, 116, 73, 110, 86, 105, 101, 119, 112, 111, 114, 116, 40, 101, 108,
            101, 109, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 99, 116, 32,
            61, 32, 101, 108, 101, 109, 101, 110, 116, 46, 103, 101, 116, 66, 111, 117, 110, 100, 105, 110, 103, 67,
            108, 105, 101, 110, 116, 82, 101, 99, 116, 40, 41, 59, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            114, 101, 99, 116, 46, 116, 111, 112, 32, 62, 61, 32, 48, 32, 38, 38, 32, 114, 101, 99, 116, 46, 108, 101,
            102, 116, 32, 62, 61, 32, 48, 32, 38, 38, 32, 114, 101, 99, 116, 46, 98, 111, 116, 116, 111, 109, 32, 60,
            61, 32, 40, 119, 105, 110, 100, 111, 119, 46, 105, 110, 110, 101, 114, 72, 101, 105, 103, 104, 116, 32, 124,
            124, 32, 100, 111, 99, 117, 109, 101, 110, 116, 46, 100, 111, 99, 117, 109, 101, 110, 116, 69, 108, 101,
            109, 101, 110, 116, 46, 99, 108, 105, 101, 110, 116, 72, 101, 105, 103, 104, 116, 41, 32, 38, 38, 32, 114,
            101, 99, 116, 46, 114, 105, 103, 104, 116, 32, 60, 61, 32, 40, 119, 105, 110, 100, 111, 119, 46, 105, 110,
            110, 101, 114, 87, 105, 100, 116, 104, 32, 124, 124, 32, 100, 111, 99, 117, 109, 101, 110, 116, 46, 100,
            111, 99, 117, 109, 101, 110, 116, 69, 108, 101, 109, 101, 110, 116, 46, 99, 108, 105, 101, 110, 116, 87,
            105, 100, 116, 104, 41, 59, 10, 32, 32, 125, 10, 10, 32, 32, 47, 47, 32, 115, 114, 99, 47, 100, 111, 116,
            108, 111, 116, 116, 105, 101, 46, 116, 115, 10, 32, 32, 118, 97, 114, 32, 99, 114, 101, 97, 116, 101, 67,
            111, 114, 101, 77, 111, 100, 101, 32, 61, 32, 40, 109, 111, 100, 101, 44, 32, 109, 111, 100, 117, 108, 101,
            41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 105, 102, 32, 40, 109, 111, 100, 101, 32, 61, 61, 61, 32, 34,
            114, 101, 118, 101, 114, 115, 101, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114,
            110, 32, 109, 111, 100, 117, 108, 101, 46, 77, 111, 100, 101, 46, 82, 101, 118, 101, 114, 115, 101, 59, 10,
            32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 109, 111, 100, 101, 32, 61, 61, 61, 32,
            34, 98, 111, 117, 110, 99, 101, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110,
            32, 109, 111, 100, 117, 108, 101, 46, 77, 111, 100, 101, 46, 66, 111, 117, 110, 99, 101, 59, 10, 32, 32, 32,
            32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 109, 111, 100, 101, 32, 61, 61, 61, 32, 34, 114, 101,
            118, 101, 114, 115, 101, 45, 98, 111, 117, 110, 99, 101, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 109, 111, 100, 117, 108, 101, 46, 77, 111, 100, 101, 46, 82, 101, 118, 101,
            114, 115, 101, 66, 111, 117, 110, 99, 101, 59, 10, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 111, 100, 117, 108, 101, 46, 77, 111, 100,
            101, 46, 70, 111, 114, 119, 97, 114, 100, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32, 32, 118,
            97, 114, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 70, 105, 116, 32, 61, 32, 40, 102, 105, 116, 44,
            32, 109, 111, 100, 117, 108, 101, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 105, 102, 32, 40, 102, 105,
            116, 32, 61, 61, 61, 32, 34, 99, 111, 110, 116, 97, 105, 110, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 109, 111, 100, 117, 108, 101, 46, 70, 105, 116, 46, 67, 111, 110, 116, 97,
            105, 110, 59, 10, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 102, 105, 116, 32, 61,
            61, 61, 32, 34, 99, 111, 118, 101, 114, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 109, 111, 100, 117, 108, 101, 46, 70, 105, 116, 46, 67, 111, 118, 101, 114, 59, 10, 32, 32,
            32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 102, 105, 116, 32, 61, 61, 61, 32, 34, 102, 105,
            108, 108, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 111, 100, 117,
            108, 101, 46, 70, 105, 116, 46, 70, 105, 108, 108, 59, 10, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32,
            105, 102, 32, 40, 102, 105, 116, 32, 61, 61, 61, 32, 34, 102, 105, 116, 45, 104, 101, 105, 103, 104, 116,
            34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 111, 100, 117, 108, 101,
            46, 70, 105, 116, 46, 70, 105, 116, 72, 101, 105, 103, 104, 116, 59, 10, 32, 32, 32, 32, 125, 32, 101, 108,
            115, 101, 32, 105, 102, 32, 40, 102, 105, 116, 32, 61, 61, 61, 32, 34, 102, 105, 116, 45, 119, 105, 100,
            116, 104, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 111, 100, 117,
            108, 101, 46, 70, 105, 116, 46, 70, 105, 116, 87, 105, 100, 116, 104, 59, 10, 32, 32, 32, 32, 125, 32, 101,
            108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 111, 100, 117,
            108, 101, 46, 70, 105, 116, 46, 78, 111, 110, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32,
            32, 118, 97, 114, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 65, 108, 105, 103, 110, 32, 61, 32, 40,
            97, 108, 105, 103, 110, 44, 32, 109, 111, 100, 117, 108, 101, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 99, 111, 114, 101, 65, 108, 105, 103, 110, 32, 61, 32, 110, 101, 119, 32, 109,
            111, 100, 117, 108, 101, 46, 86, 101, 99, 116, 111, 114, 70, 108, 111, 97, 116, 40, 41, 59, 10, 32, 32, 32,
            32, 99, 111, 114, 101, 65, 108, 105, 103, 110, 46, 112, 117, 115, 104, 95, 98, 97, 99, 107, 40, 97, 108,
            105, 103, 110, 91, 48, 93, 41, 59, 10, 32, 32, 32, 32, 99, 111, 114, 101, 65, 108, 105, 103, 110, 46, 112,
            117, 115, 104, 95, 98, 97, 99, 107, 40, 97, 108, 105, 103, 110, 91, 49, 93, 41, 59, 10, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 99, 111, 114, 101, 65, 108, 105, 103, 110, 59, 10, 32, 32, 125, 59, 10, 32, 32,
            118, 97, 114, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 83, 101, 103, 109, 101, 110, 116, 32, 61,
            32, 40, 115, 101, 103, 109, 101, 110, 116, 44, 32, 109, 111, 100, 117, 108, 101, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 99, 111, 114, 101, 115, 101, 103, 109, 101, 110, 116, 32,
            61, 32, 110, 101, 119, 32, 109, 111, 100, 117, 108, 101, 46, 86, 101, 99, 116, 111, 114, 70, 108, 111, 97,
            116, 40, 41, 59, 10, 32, 32, 32, 32, 105, 102, 32, 40, 115, 101, 103, 109, 101, 110, 116, 46, 108, 101, 110,
            103, 116, 104, 32, 33, 61, 61, 32, 50, 41, 32, 114, 101, 116, 117, 114, 110, 32, 99, 111, 114, 101, 115,
            101, 103, 109, 101, 110, 116, 59, 10, 32, 32, 32, 32, 99, 111, 114, 101, 115, 101, 103, 109, 101, 110, 116,
            46, 112, 117, 115, 104, 95, 98, 97, 99, 107, 40, 115, 101, 103, 109, 101, 110, 116, 91, 48, 93, 41, 59, 10,
            32, 32, 32, 32, 99, 111, 114, 101, 115, 101, 103, 109, 101, 110, 116, 46, 112, 117, 115, 104, 95, 98, 97,
            99, 107, 40, 115, 101, 103, 109, 101, 110, 116, 91, 49, 93, 41, 59, 10, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 99, 111, 114, 101, 115, 101, 103, 109, 101, 110, 116, 59, 10, 32, 32, 125, 59, 10, 32, 32,
            118, 97, 114, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 32, 61, 32, 99, 108, 97, 115, 115, 32, 95,
            68, 111, 116, 76, 111, 116, 116, 105, 101, 32, 123, 10, 32, 32, 32, 32, 99, 111, 110, 115, 116, 114, 117,
            99, 116, 111, 114, 40, 99, 111, 110, 102, 105, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112,
            117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 99, 97, 110, 118, 97,
            115, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40,
            116, 104, 105, 115, 44, 32, 34, 95, 99, 111, 110, 116, 101, 120, 116, 34, 44, 32, 110, 117, 108, 108, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116, 104,
            105, 115, 44, 32, 34, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 34, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32,
            34, 95, 97, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 73, 100, 34, 44, 32, 110, 117,
            108, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100,
            40, 116, 104, 105, 115, 44, 32, 34, 95, 102, 114, 97, 109, 101, 77, 97, 110, 97, 103, 101, 114, 34, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105,
            115, 44, 32, 34, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 34, 44, 32, 110, 117,
            108, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100,
            40, 116, 104, 105, 115, 44, 32, 34, 95, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 34, 44,
            32, 123, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108,
            100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 105, 115, 70, 114, 111, 122, 101, 110, 34, 44, 32, 102, 97,
            108, 115, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108,
            100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108,
            111, 114, 34, 44, 32, 110, 117, 108, 108, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108,
            105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 112, 111, 105, 110, 116, 101, 114,
            85, 112, 77, 101, 116, 104, 111, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117, 98, 108,
            105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 112, 111, 105, 110, 116, 101, 114,
            68, 111, 119, 110, 77, 101, 116, 104, 111, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95, 112, 117,
            98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 112, 111, 105, 110, 116,
            101, 114, 77, 111, 118, 101, 77, 101, 116, 104, 111, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 95, 95,
            112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 112, 111, 105,
            110, 116, 101, 114, 69, 110, 116, 101, 114, 77, 101, 116, 104, 111, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 95, 95, 112, 117, 98, 108, 105, 99, 70, 105, 101, 108, 100, 40, 116, 104, 105, 115, 44, 32, 34, 95, 112,
            111, 105, 110, 116, 101, 114, 69, 120, 105, 116, 77, 101, 116, 104, 111, 100, 34, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 44, 32, 95, 99, 59, 10, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 99, 97, 110,
            118, 97, 115, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 99, 111, 110, 116, 101, 120, 116,
            32, 61, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 103, 101, 116, 67, 111, 110, 116,
            101, 120, 116, 40, 34, 50, 100, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101,
            118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 32, 61, 32, 110, 101, 119, 32, 69, 118, 101, 110, 116,
            77, 97, 110, 97, 103, 101, 114, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 102,
            114, 97, 109, 101, 77, 97, 110, 97, 103, 101, 114, 32, 61, 32, 110, 101, 119, 32, 65, 110, 105, 109, 97,
            116, 105, 111, 110, 70, 114, 97, 109, 101, 77, 97, 110, 97, 103, 101, 114, 40, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 32, 61, 32,
            95, 95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97, 100, 86,
            97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 99, 111, 110, 102, 105, 103, 46, 114, 101, 110, 100, 101, 114,
            67, 111, 110, 102, 105, 103, 41, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 100, 101, 118, 105, 99,
            101, 80, 105, 120, 101, 108, 82, 97, 116, 105, 111, 58, 32, 40, 40, 95, 97, 32, 61, 32, 99, 111, 110, 102,
            105, 103, 46, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 41, 32, 61, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 100, 101, 118, 105, 99, 101, 80, 105,
            120, 101, 108, 82, 97, 116, 105, 111, 41, 32, 124, 124, 32, 103, 101, 116, 68, 101, 102, 97, 117, 108, 116,
            68, 80, 82, 40, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 47, 47, 32, 102, 114, 101, 101, 122, 101, 79,
            110, 79, 102, 102, 115, 99, 114, 101, 101, 110, 32, 105, 115, 32, 116, 114, 117, 101, 32, 98, 121, 32, 100,
            101, 102, 97, 117, 108, 116, 32, 116, 111, 32, 112, 114, 101, 118, 101, 110, 116, 32, 117, 110, 110, 101,
            99, 101, 115, 115, 97, 114, 121, 32, 114, 101, 110, 100, 101, 114, 105, 110, 103, 32, 119, 104, 101, 110,
            32, 116, 104, 101, 32, 99, 97, 110, 118, 97, 115, 32, 105, 115, 32, 111, 102, 102, 115, 99, 114, 101, 101,
            110, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102, 115, 99, 114,
            101, 101, 110, 58, 32, 40, 95, 99, 32, 61, 32, 40, 95, 98, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 114,
            101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32,
            118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 98, 46, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102,
            115, 99, 114, 101, 101, 110, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 99, 32, 58, 32, 116,
            114, 117, 101, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 68, 111, 116, 76, 111,
            116, 116, 105, 101, 87, 97, 115, 109, 76, 111, 97, 100, 101, 114, 46, 108, 111, 97, 100, 40, 41, 46, 116,
            104, 101, 110, 40, 40, 109, 111, 100, 117, 108, 101, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 118, 97, 114, 32, 95, 97, 50, 44, 32, 95, 98, 50, 44, 32, 95, 99, 50, 44, 32, 95, 100, 44, 32, 95,
            101, 44, 32, 95, 102, 44, 32, 95, 103, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 95, 68, 111, 116, 76, 111,
            116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 32, 61, 32, 109, 111, 100, 117,
            108, 101, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 32, 61, 32, 110, 101, 119, 32, 109, 111, 100, 117, 108, 101, 46, 68, 111,
            116, 76, 111, 116, 116, 105, 101, 80, 108, 97, 121, 101, 114, 40, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 47, 47, 32, 116, 104, 101, 109, 101, 73, 100, 58, 32, 99, 111, 110, 102, 105, 103, 46, 116, 104,
            101, 109, 101, 73, 100, 32, 63, 63, 32, 39, 39, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 117,
            116, 111, 112, 108, 97, 121, 58, 32, 40, 95, 97, 50, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 97, 117,
            116, 111, 112, 108, 97, 121, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 97, 50, 32, 58, 32,
            102, 97, 108, 115, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 97, 99, 107, 103, 114, 111, 117,
            110, 100, 67, 111, 108, 111, 114, 58, 32, 48, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 108, 111, 111,
            112, 65, 110, 105, 109, 97, 116, 105, 111, 110, 58, 32, 40, 95, 98, 50, 32, 61, 32, 99, 111, 110, 102, 105,
            103, 46, 108, 111, 111, 112, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 50, 32, 58, 32,
            102, 97, 108, 115, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 109, 111, 100, 101, 58, 32, 99, 114,
            101, 97, 116, 101, 67, 111, 114, 101, 77, 111, 100, 101, 40, 40, 95, 99, 50, 32, 61, 32, 99, 111, 110, 102,
            105, 103, 46, 109, 111, 100, 101, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 99, 50, 32, 58,
            32, 34, 102, 111, 114, 119, 97, 114, 100, 34, 44, 32, 109, 111, 100, 117, 108, 101, 41, 44, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 115, 101, 103, 109, 101, 110, 116, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111,
            114, 101, 83, 101, 103, 109, 101, 110, 116, 40, 40, 95, 100, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46,
            115, 101, 103, 109, 101, 110, 116, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 100, 32, 58, 32,
            91, 93, 44, 32, 109, 111, 100, 117, 108, 101, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 115, 112,
            101, 101, 100, 58, 32, 40, 95, 101, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 115, 112, 101, 101, 100,
            41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 101, 32, 58, 32, 49, 44, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105,
            111, 110, 58, 32, 40, 95, 102, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 117, 115, 101, 70, 114, 97, 109,
            101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111, 110, 41, 32, 33, 61, 32, 110, 117, 108, 108,
            32, 63, 32, 95, 102, 32, 58, 32, 116, 114, 117, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 109,
            97, 114, 107, 101, 114, 58, 32, 40, 95, 103, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 109, 97, 114, 107,
            101, 114, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 103, 32, 58, 32, 34, 34, 44, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 108, 97, 121, 111, 117, 116, 58, 32, 99, 111, 110, 102, 105, 103, 46, 108,
            97, 121, 111, 117, 116, 32, 63, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 108, 105,
            103, 110, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 65, 108, 105, 103, 110, 40, 99, 111, 110,
            102, 105, 103, 46, 108, 97, 121, 111, 117, 116, 46, 97, 108, 105, 103, 110, 44, 32, 109, 111, 100, 117, 108,
            101, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 105, 116, 58, 32, 99, 114, 101, 97,
            116, 101, 67, 111, 114, 101, 70, 105, 116, 40, 99, 111, 110, 102, 105, 103, 46, 108, 97, 121, 111, 117, 116,
            46, 102, 105, 116, 44, 32, 109, 111, 100, 117, 108, 101, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 32, 58, 32, 109, 111, 100, 117, 108, 101, 46, 99, 114, 101, 97, 116, 101, 68, 101, 102, 97, 117, 108,
            116, 76, 97, 121, 111, 117, 116, 40, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46,
            100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 114, 101, 97, 100, 121,
            34, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 99, 111, 110, 102, 105, 103, 46,
            100, 97, 116, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 108,
            111, 97, 100, 70, 114, 111, 109, 68, 97, 116, 97, 40, 99, 111, 110, 102, 105, 103, 46, 100, 97, 116, 97, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 99, 111, 110,
            102, 105, 103, 46, 115, 114, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 108, 111, 97, 100, 70, 114, 111, 109, 83, 114, 99, 40, 99, 111, 110, 102, 105, 103, 46, 115,
            114, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32,
            40, 99, 111, 110, 102, 105, 103, 46, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 115, 101, 116, 66, 97, 99,
            107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 40, 99, 111, 110, 102, 105, 103, 46, 98, 97, 99,
            107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 32, 32, 125, 41, 46, 99, 97, 116, 99, 104, 40, 40, 101, 114, 114, 111, 114, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77,
            97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 116, 121, 112, 101, 58, 32, 34, 108, 111, 97, 100, 69, 114, 114, 111, 114, 34, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 114, 114, 111, 114, 58, 32, 110, 101, 119, 32, 69, 114, 114, 111,
            114, 40, 96, 70, 97, 105, 108, 101, 100, 32, 116, 111, 32, 108, 111, 97, 100, 32, 119, 97, 115, 109, 32,
            109, 111, 100, 117, 108, 101, 58, 32, 36, 123, 101, 114, 114, 111, 114, 125, 96, 41, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 85, 112, 77, 101, 116, 104, 111, 100, 32, 61, 32, 116, 104,
            105, 115, 46, 95, 111, 110, 80, 111, 105, 110, 116, 101, 114, 85, 112, 46, 98, 105, 110, 100, 40, 116, 104,
            105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114,
            68, 111, 119, 110, 77, 101, 116, 104, 111, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 110, 80, 111,
            105, 110, 116, 101, 114, 68, 111, 119, 110, 46, 98, 105, 110, 100, 40, 116, 104, 105, 115, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 77, 111, 118, 101, 77,
            101, 116, 104, 111, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 110, 80, 111, 105, 110, 116, 101, 114,
            77, 111, 118, 101, 46, 98, 105, 110, 100, 40, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 69, 110, 116, 101, 114, 77, 101, 116, 104, 111,
            100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 111, 110, 80, 111, 105, 110, 116, 101, 114, 69, 110, 116, 101,
            114, 46, 98, 105, 110, 100, 40, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115,
            46, 95, 112, 111, 105, 110, 116, 101, 114, 69, 120, 105, 116, 77, 101, 116, 104, 111, 100, 32, 61, 32, 116,
            104, 105, 115, 46, 95, 111, 110, 80, 111, 105, 110, 116, 101, 114, 76, 101, 97, 118, 101, 46, 98, 105, 110,
            100, 40, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95, 100, 105, 115, 112,
            97, 116, 99, 104, 69, 114, 114, 111, 114, 40, 109, 101, 115, 115, 97, 103, 101, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 111, 108, 101, 46, 101, 114, 114, 111, 114, 40, 109, 101, 115, 115, 97, 103,
            101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110,
            97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34,
            108, 111, 97, 100, 69, 114, 114, 111, 114, 34, 44, 32, 101, 114, 114, 111, 114, 58, 32, 110, 101, 119, 32,
            69, 114, 114, 111, 114, 40, 109, 101, 115, 115, 97, 103, 101, 41, 32, 125, 41, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 95, 102, 101, 116, 99, 104, 68, 97, 116, 97, 40, 115, 114, 99, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 95, 95, 97, 115, 121, 110, 99, 40, 116, 104, 105, 115, 44,
            32, 110, 117, 108, 108, 44, 32, 102, 117, 110, 99, 116, 105, 111, 110, 42, 32, 40, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 121,
            105, 101, 108, 100, 32, 102, 101, 116, 99, 104, 40, 115, 114, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 33, 114, 101, 115, 112, 111, 110, 115, 101, 46, 111, 107, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96,
            70, 97, 105, 108, 101, 100, 32, 116, 111, 32, 102, 101, 116, 99, 104, 32, 97, 110, 105, 109, 97, 116, 105,
            111, 110, 32, 100, 97, 116, 97, 32, 102, 114, 111, 109, 32, 85, 82, 76, 58, 32, 36, 123, 115, 114, 99, 125,
            46, 32, 36, 123, 114, 101, 115, 112, 111, 110, 115, 101, 46, 115, 116, 97, 116, 117, 115, 125, 58, 32, 36,
            123, 114, 101, 115, 112, 111, 110, 115, 101, 46, 115, 116, 97, 116, 117, 115, 84, 101, 120, 116, 125, 96,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 100, 97, 116, 97, 32, 61, 32, 121, 105, 101, 108, 100, 32, 114, 101, 115, 112, 111, 110, 115, 101, 46,
            97, 114, 114, 97, 121, 66, 117, 102, 102, 101, 114, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 105, 115, 68, 111, 116, 76, 111, 116, 116, 105, 101, 40, 100, 97, 116, 97, 41, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 100, 97, 116, 97, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 110, 101,
            119, 32, 84, 101, 120, 116, 68, 101, 99, 111, 100, 101, 114, 40, 41, 46, 100, 101, 99, 111, 100, 101, 40,
            100, 97, 116, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 95, 108, 111, 97, 100, 70, 114, 111, 109, 68, 97, 116, 97, 40, 100, 97, 116, 97, 41, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105,
            101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59,
            10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 119, 105, 100, 116, 104, 32, 61, 32, 116, 104, 105,
            115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 119, 105, 100, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 104, 101, 105, 103, 104, 116, 32, 61, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110,
            118, 97, 115, 46, 104, 101, 105, 103, 104, 116, 59, 10, 32, 32, 32, 32, 32, 32, 108, 101, 116, 32, 108, 111,
            97, 100, 101, 100, 32, 61, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40,
            116, 121, 112, 101, 111, 102, 32, 100, 97, 116, 97, 32, 61, 61, 61, 32, 34, 115, 116, 114, 105, 110, 103,
            34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 115, 76, 111, 116, 116, 105,
            101, 40, 100, 97, 116, 97, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115,
            46, 95, 100, 105, 115, 112, 97, 116, 99, 104, 69, 114, 114, 111, 114, 40, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 34, 73, 110, 118, 97, 108, 105, 100, 32, 76, 111, 116, 116, 105, 101, 32, 74, 83, 79,
            78, 32, 115, 116, 114, 105, 110, 103, 58, 32, 84, 104, 101, 32, 112, 114, 111, 118, 105, 100, 101, 100, 32,
            115, 116, 114, 105, 110, 103, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 99, 111, 110, 102, 111, 114,
            109, 32, 116, 111, 32, 116, 104, 101, 32, 76, 111, 116, 116, 105, 101, 32, 74, 83, 79, 78, 32, 102, 111,
            114, 109, 97, 116, 46, 34, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 108, 111, 97, 100, 101, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76,
            111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 108, 111, 97, 100, 65, 110, 105, 109, 97, 116, 105, 111,
            110, 68, 97, 116, 97, 40, 100, 97, 116, 97, 44, 32, 119, 105, 100, 116, 104, 44, 32, 104, 101, 105, 103,
            104, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 100, 97,
            116, 97, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 65, 114, 114, 97, 121, 66, 117, 102, 102,
            101, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 115, 68, 111, 116, 76,
            111, 116, 116, 105, 101, 40, 100, 97, 116, 97, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            116, 104, 105, 115, 46, 95, 100, 105, 115, 112, 97, 116, 99, 104, 69, 114, 114, 111, 114, 40, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 34, 73, 110, 118, 97, 108, 105, 100, 32, 100, 111, 116, 76, 111,
            116, 116, 105, 101, 32, 65, 114, 114, 97, 121, 66, 117, 102, 102, 101, 114, 58, 32, 84, 104, 101, 32, 112,
            114, 111, 118, 105, 100, 101, 100, 32, 65, 114, 114, 97, 121, 66, 117, 102, 102, 101, 114, 32, 100, 111,
            101, 115, 32, 110, 111, 116, 32, 99, 111, 110, 102, 111, 114, 109, 32, 116, 111, 32, 116, 104, 101, 32, 100,
            111, 116, 76, 111, 116, 116, 105, 101, 32, 102, 111, 114, 109, 97, 116, 46, 34, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 111, 97, 100, 101, 100, 32,
            61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 108,
            111, 97, 100, 68, 111, 116, 76, 111, 116, 116, 105, 101, 68, 97, 116, 97, 40, 100, 97, 116, 97, 44, 32, 119,
            105, 100, 116, 104, 44, 32, 104, 101, 105, 103, 104, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 32, 101,
            108, 115, 101, 32, 105, 102, 32, 40, 116, 121, 112, 101, 111, 102, 32, 100, 97, 116, 97, 32, 61, 61, 61, 32,
            34, 111, 98, 106, 101, 99, 116, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            105, 115, 76, 111, 116, 116, 105, 101, 40, 100, 97, 116, 97, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 105, 115, 112, 97, 116, 99, 104, 69, 114, 114, 111, 114,
            40, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 34, 73, 110, 118, 97, 108, 105, 100, 32, 76, 111,
            116, 116, 105, 101, 32, 74, 83, 79, 78, 32, 111, 98, 106, 101, 99, 116, 58, 32, 84, 104, 101, 32, 112, 114,
            111, 118, 105, 100, 101, 100, 32, 111, 98, 106, 101, 99, 116, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32,
            99, 111, 110, 102, 111, 114, 109, 32, 116, 111, 32, 116, 104, 101, 32, 76, 111, 116, 116, 105, 101, 32, 74,
            83, 79, 78, 32, 102, 111, 114, 109, 97, 116, 46, 34, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 111, 97, 100, 101, 100, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 108, 111, 97, 100, 65, 110, 105,
            109, 97, 116, 105, 111, 110, 68, 97, 116, 97, 40, 74, 83, 79, 78, 46, 115, 116, 114, 105, 110, 103, 105,
            102, 121, 40, 100, 97, 116, 97, 41, 44, 32, 119, 105, 100, 116, 104, 44, 32, 104, 101, 105, 103, 104, 116,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 104, 105, 115, 46, 95, 100, 105, 115, 112, 97, 116, 99, 104, 69, 114, 114, 111, 114, 40, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 96, 85, 110, 115, 117, 112, 112, 111, 114, 116, 101, 100, 32, 100, 97,
            116, 97, 32, 116, 121, 112, 101, 32, 102, 111, 114, 32, 97, 110, 105, 109, 97, 116, 105, 111, 110, 32, 100,
            97, 116, 97, 46, 32, 69, 120, 112, 101, 99, 116, 101, 100, 58, 32, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 45, 32, 115, 116, 114, 105, 110, 103, 32, 40, 76, 111, 116, 116, 105, 101, 32, 74, 83, 79, 78, 41, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 45, 32, 65, 114, 114, 97, 121, 66, 117, 102, 102, 101, 114, 32,
            40, 100, 111, 116, 76, 111, 116, 116, 105, 101, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 45, 32,
            111, 98, 106, 101, 99, 116, 32, 40, 76, 111, 116, 116, 105, 101, 32, 74, 83, 79, 78, 41, 46, 32, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 82, 101, 99, 101, 105, 118, 101, 100, 58, 32, 36, 123, 116, 121, 112, 101,
            111, 102, 32, 100, 97, 116, 97, 125, 96, 10, 32, 32, 32, 32, 32, 32, 32, 32, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 108, 111, 97, 100, 101, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116,
            99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 108, 111, 97, 100, 34, 32, 125, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 114, 101, 115, 105, 122, 101, 40, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118,
            101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 121, 112, 101, 58, 32, 34, 102, 114, 97, 109, 101, 34, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 58, 32, 116,
            104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 99, 117, 114, 114,
            101, 110, 116, 70, 114, 97, 109, 101, 40, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114, 40, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105,
            101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 46, 97, 117, 116, 111, 112, 108, 97, 121,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111,
            116, 116, 105, 101, 67, 111, 114, 101, 46, 112, 108, 97, 121, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67,
            111, 114, 101, 46, 105, 115, 80, 108, 97, 121, 105, 110, 103, 40, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101,
            114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 112, 108, 97,
            121, 34, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95,
            97, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 73, 100, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 102, 114, 97, 109, 101, 77, 97, 110, 97, 103, 101, 114, 46, 114, 101, 113, 117, 101, 115, 116, 65,
            110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 116, 104, 105, 115, 46, 95, 100, 114, 97,
            119, 46, 98, 105, 110, 100, 40, 116, 104, 105, 115, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115,
            111, 108, 101, 46, 101, 114, 114, 111, 114, 40, 34, 115, 111, 109, 101, 116, 104, 105, 110, 103, 32, 119,
            101, 110, 116, 32, 119, 114, 111, 110, 103, 44, 32, 116, 104, 101, 32, 97, 110, 105, 109, 97, 116, 105, 111,
            110, 32, 119, 97, 115, 32, 115, 117, 112, 112, 111, 115, 101, 32, 116, 111, 32, 97, 117, 116, 111, 112, 108,
            97, 121, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32, 38,
            38, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            111, 102, 32, 72, 84, 77, 76, 67, 97, 110, 118, 97, 115, 69, 108, 101, 109, 101, 110, 116, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100,
            101, 114, 67, 111, 110, 102, 105, 103, 46, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102, 115, 99,
            114, 101, 101, 110, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 102, 102, 115, 99,
            114, 101, 101, 110, 79, 98, 115, 101, 114, 118, 101, 114, 46, 111, 98, 115, 101, 114, 118, 101, 40, 116,
            104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 44, 32, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105,
            115, 46, 95, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 46, 97, 117, 116, 111, 82, 101, 115,
            105, 122, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 67, 97, 110, 118, 97, 115,
            82, 101, 115, 105, 122, 101, 79, 98, 115, 101, 114, 118, 101, 114, 46, 111, 98, 115, 101, 114, 118, 101, 40,
            116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 44, 32, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125,
            32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 105,
            115, 112, 97, 116, 99, 104, 69, 114, 114, 111, 114, 40, 34, 70, 97, 105, 108, 101, 100, 32, 116, 111, 32,
            108, 111, 97, 100, 32, 97, 110, 105, 109, 97, 116, 105, 111, 110, 32, 100, 97, 116, 97, 34, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95, 108, 111, 97, 100, 70, 114, 111,
            109, 83, 114, 99, 40, 115, 114, 99, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95,
            102, 101, 116, 99, 104, 68, 97, 116, 97, 40, 115, 114, 99, 41, 46, 116, 104, 101, 110, 40, 40, 100, 97, 116,
            97, 41, 32, 61, 62, 32, 116, 104, 105, 115, 46, 95, 108, 111, 97, 100, 70, 114, 111, 109, 68, 97, 116, 97,
            40, 100, 97, 116, 97, 41, 41, 46, 99, 97, 116, 99, 104, 40, 40, 101, 114, 114, 111, 114, 41, 32, 61, 62, 32,
            116, 104, 105, 115, 46, 95, 100, 105, 115, 112, 97, 116, 99, 104, 69, 114, 114, 111, 114, 40, 96, 70, 97,
            105, 108, 101, 100, 32, 116, 111, 32, 108, 111, 97, 100, 32, 97, 110, 105, 109, 97, 116, 105, 111, 110, 32,
            100, 97, 116, 97, 32, 102, 114, 111, 109, 32, 85, 82, 76, 58, 32, 36, 123, 115, 114, 99, 125, 46, 32, 36,
            123, 101, 114, 114, 111, 114, 125, 96, 41, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101,
            116, 32, 97, 99, 116, 105, 118, 101, 65, 110, 105, 109, 97, 116, 105, 111, 110, 73, 100, 40, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105,
            101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32,
            58, 32, 95, 97, 46, 97, 99, 116, 105, 118, 101, 65, 110, 105, 109, 97, 116, 105, 111, 110, 73, 100, 40, 41,
            59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 97, 99, 116, 105, 118, 101, 84, 104,
            101, 109, 101, 73, 100, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95,
            100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32,
            63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 97, 99, 116, 105, 118, 101, 84, 104, 101, 109,
            101, 73, 100, 40, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 108, 97, 121, 111,
            117, 116, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 32, 108, 97, 121, 111, 117, 116, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104,
            105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110,
            117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 99, 111, 110, 102, 105, 103,
            40, 41, 46, 108, 97, 121, 111, 117, 116, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 108, 97, 121,
            111, 117, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 97, 108, 105, 103, 110, 58, 32, 91, 108, 97, 121, 111, 117, 116, 46,
            97, 108, 105, 103, 110, 46, 103, 101, 116, 40, 48, 41, 44, 32, 108, 97, 121, 111, 117, 116, 46, 97, 108,
            105, 103, 110, 46, 103, 101, 116, 40, 49, 41, 93, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 105,
            116, 58, 32, 40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 97,
            114, 32, 95, 97, 50, 44, 32, 95, 98, 44, 32, 95, 99, 44, 32, 95, 100, 44, 32, 95, 101, 44, 32, 95, 102, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 115, 119, 105, 116, 99, 104, 32, 40, 108, 97, 121, 111,
            117, 116, 46, 102, 105, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99,
            97, 115, 101, 32, 40, 40, 95, 97, 50, 32, 61, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95,
            119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118,
            111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 50, 46, 70, 105, 116, 46, 67, 111, 110, 116, 97, 105, 110, 41,
            58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            34, 99, 111, 110, 116, 97, 105, 110, 34, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99,
            97, 115, 101, 32, 40, 40, 95, 98, 32, 61, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119,
            97, 115, 109, 77, 111, 100, 117, 108, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111,
            105, 100, 32, 48, 32, 58, 32, 95, 98, 46, 70, 105, 116, 46, 67, 111, 118, 101, 114, 41, 58, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 99, 111, 118, 101,
            114, 34, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 40, 40, 95,
            99, 32, 61, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117,
            108, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95,
            99, 46, 70, 105, 116, 46, 70, 105, 108, 108, 41, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 102, 105, 108, 108, 34, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 40, 40, 95, 100, 32, 61, 32, 95, 68, 111, 116, 76,
            111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 41, 32, 61, 61, 32, 110,
            117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 100, 46, 70, 105, 116, 46, 70, 105,
            116, 72, 101, 105, 103, 104, 116, 41, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 34, 102, 105, 116, 45, 104, 101, 105, 103, 104, 116, 34, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 40, 40, 95, 101, 32, 61, 32, 95,
            68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 41, 32,
            61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 101, 46, 70, 105,
            116, 46, 70, 105, 116, 87, 105, 100, 116, 104, 41, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 102, 105, 116, 45, 119, 105, 100, 116, 104, 34, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 97, 115, 101, 32, 40, 40, 95, 102, 32, 61,
            32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101,
            41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 102, 46, 70,
            105, 116, 46, 78, 111, 110, 101, 41, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 34, 110, 111, 110, 101, 34, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 100, 101, 102, 97, 117, 108, 116, 58, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 99, 111, 110, 116, 97, 105, 110, 34, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 40,
            41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 118, 111, 105, 100, 32, 48, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 103, 101, 116, 32, 109, 97, 114, 107, 101, 114, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 109, 97, 114, 107, 101,
            114, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105,
            101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32,
            58, 32, 95, 97, 46, 99, 111, 110, 102, 105, 103, 40, 41, 46, 109, 97, 114, 107, 101, 114, 59, 10, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 109, 97, 114, 107, 101, 114, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 103, 101, 116, 32, 109, 97, 110, 105, 102, 101, 115, 116, 40, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 116, 114, 121, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 109, 97, 110, 105, 102, 101, 115, 116, 32, 61, 32,
            40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111,
            114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95,
            97, 46, 109, 97, 110, 105, 102, 101, 115, 116, 83, 116, 114, 105, 110, 103, 40, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101,
            67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 32, 124, 124, 32, 33, 109, 97, 110, 105, 102,
            101, 115, 116, 41, 32, 114, 101, 116, 117, 114, 110, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 99, 111, 110, 115, 116, 32, 109, 97, 110, 105, 102, 101, 115, 116, 74, 115, 111, 110, 32, 61, 32,
            74, 83, 79, 78, 46, 112, 97, 114, 115, 101, 40, 109, 97, 110, 105, 102, 101, 115, 116, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 79, 98, 106, 101, 99, 116, 46, 107, 101, 121, 115, 40, 109, 97,
            110, 105, 102, 101, 115, 116, 74, 115, 111, 110, 41, 46, 108, 101, 110, 103, 116, 104, 32, 61, 61, 61, 32,
            48, 41, 32, 114, 101, 116, 117, 114, 110, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            114, 101, 116, 117, 114, 110, 32, 109, 97, 110, 105, 102, 101, 115, 116, 74, 115, 111, 110, 59, 10, 32, 32,
            32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40, 95, 101, 114, 114, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 114, 101, 110, 100, 101, 114, 67, 111, 110,
            102, 105, 103, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105,
            115, 46, 95, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 59, 10, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 103, 101, 116, 32, 115, 101, 103, 109, 101, 110, 116, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 101, 103,
            109, 101, 110, 116, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111,
            116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105,
            100, 32, 48, 32, 58, 32, 95, 97, 46, 99, 111, 110, 102, 105, 103, 40, 41, 46, 115, 101, 103, 109, 101, 110,
            116, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 115, 101, 103, 109, 101, 110, 116, 32, 38, 38, 32,
            115, 101, 103, 109, 101, 110, 116, 46, 115, 105, 122, 101, 40, 41, 32, 61, 61, 61, 32, 50, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 91, 115, 101, 103, 109, 101, 110, 116, 46,
            103, 101, 116, 40, 48, 41, 44, 32, 115, 101, 103, 109, 101, 110, 116, 46, 103, 101, 116, 40, 49, 41, 93, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 118, 111,
            105, 100, 32, 48, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 108, 111, 111, 112,
            40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105,
            115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117,
            108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 99, 111, 110, 102, 105, 103, 40,
            41, 46, 108, 111, 111, 112, 65, 110, 105, 109, 97, 116, 105, 111, 110, 41, 32, 33, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 103, 101, 116, 32, 109, 111, 100, 101, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32,
            95, 97, 44, 32, 95, 98, 44, 32, 95, 99, 44, 32, 95, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115,
            116, 32, 109, 111, 100, 101, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116,
            76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118,
            111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 99, 111, 110, 102, 105, 103, 40, 41, 46, 109, 111, 100, 101,
            59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 109, 111, 100, 101, 32, 61, 61, 61, 32, 40, 40, 95, 98,
            32, 61, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117,
            108, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95,
            98, 46, 77, 111, 100, 101, 46, 82, 101, 118, 101, 114, 115, 101, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 114, 101, 118, 101, 114, 115, 101, 34, 59, 10, 32, 32, 32,
            32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 109, 111, 100, 101, 32, 61, 61, 61, 32, 40,
            40, 95, 99, 32, 61, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111,
            100, 117, 108, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58,
            32, 95, 99, 46, 77, 111, 100, 101, 46, 66, 111, 117, 110, 99, 101, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 98, 111, 117, 110, 99, 101, 34, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 109, 111, 100, 101, 32, 61, 61, 61, 32, 40, 40,
            95, 100, 32, 61, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100,
            117, 108, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32,
            95, 100, 46, 77, 111, 100, 101, 46, 82, 101, 118, 101, 114, 115, 101, 66, 111, 117, 110, 99, 101, 41, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 114, 101, 118, 101, 114,
            115, 101, 45, 98, 111, 117, 110, 99, 101, 34, 59, 10, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34, 102, 111, 114, 119, 97,
            114, 100, 34, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101,
            116, 32, 105, 115, 70, 114, 111, 122, 101, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 116, 104, 105, 115, 46, 95, 105, 115, 70, 114, 111, 122, 101, 110, 59, 10, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108,
            111, 114, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 98, 97, 99, 107,
            103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32,
            95, 97, 32, 58, 32, 34, 34, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 97, 117,
            116, 111, 112, 108, 97, 121, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32,
            95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95,
            97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101,
            41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 99,
            111, 110, 102, 105, 103, 40, 41, 46, 97, 117, 116, 111, 112, 108, 97, 121, 41, 32, 33, 61, 32, 110, 117,
            108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 103, 101, 116, 32, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97,
            116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98,
            59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32,
            61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32,
            61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 99, 111,
            110, 102, 105, 103, 40, 41, 46, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108,
            97, 116, 105, 111, 110, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97,
            108, 115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 115, 112, 101, 101, 100,
            40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105,
            115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117,
            108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 99, 111, 110, 102, 105, 103, 40,
            41, 46, 115, 112, 101, 101, 100, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 48,
            59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 105, 115, 82, 101, 97, 100, 121, 40, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 95, 100, 111,
            116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 33, 61, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 105, 115, 76, 111, 97, 100, 101, 100, 40, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95,
            100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32,
            63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 105, 115, 76, 111, 97, 100, 101, 100, 40, 41,
            41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 105, 115, 80, 108, 97, 121, 105, 110, 103, 40, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 105, 115, 80, 108, 97, 121, 105, 110,
            103, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101,
            59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 105, 115, 80, 97, 117, 115, 101, 100,
            40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105,
            115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117,
            108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 105, 115, 80, 97, 117, 115, 101,
            100, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101,
            59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 105, 115, 83, 116, 111, 112, 112, 101,
            100, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104,
            105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110,
            117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 105, 115, 83, 116, 111, 112,
            112, 101, 100, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108,
            115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 99, 117, 114, 114, 101, 110,
            116, 70, 114, 97, 109, 101, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32,
            95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95,
            97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101,
            41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 99,
            117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63,
            32, 95, 98, 32, 58, 32, 48, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 108, 111,
            111, 112, 67, 111, 117, 110, 116, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44,
            32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40,
            95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46,
            108, 111, 111, 112, 67, 111, 117, 110, 116, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95,
            98, 32, 58, 32, 48, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 116, 111, 116, 97,
            108, 70, 114, 97, 109, 101, 115, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44,
            32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40,
            95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46,
            116, 111, 116, 97, 108, 70, 114, 97, 109, 101, 115, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63,
            32, 95, 98, 32, 58, 32, 48, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 100, 117,
            114, 97, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32,
            95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95,
            97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101,
            41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 100,
            117, 114, 97, 116, 105, 111, 110, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32,
            58, 32, 48, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101, 116, 32, 115, 101, 103, 109, 101,
            110, 116, 68, 117, 114, 97, 116, 105, 111, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114,
            32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98,
            32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101,
            67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58,
            32, 95, 97, 46, 115, 101, 103, 109, 101, 110, 116, 68, 117, 114, 97, 116, 105, 111, 110, 40, 41, 41, 32, 33,
            61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 48, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 103, 101, 116, 32, 99, 97, 110, 118, 97, 115, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 108, 111, 97, 100, 40, 99, 111, 110, 102, 105, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 44, 32, 95, 99, 44, 32, 95, 100, 44, 32, 95, 101, 44, 32, 95,
            102, 44, 32, 95, 103, 44, 32, 95, 104, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108,
            108, 32, 124, 124, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111,
            100, 117, 108, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10,
            32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111,
            114, 101, 46, 115, 101, 116, 67, 111, 110, 102, 105, 103, 40, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 47,
            47, 32, 116, 104, 101, 109, 101, 73, 100, 58, 32, 99, 111, 110, 102, 105, 103, 46, 116, 104, 101, 109, 101,
            73, 100, 32, 63, 63, 32, 39, 39, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 117, 116, 111, 112, 108, 97,
            121, 58, 32, 40, 95, 97, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 97, 117, 116, 111, 112, 108, 97, 121,
            41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 97, 32, 58, 32, 102, 97, 108, 115, 101, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 58, 32,
            48, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 111, 111, 112, 65, 110, 105, 109, 97, 116, 105, 111, 110,
            58, 32, 40, 95, 98, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 108, 111, 111, 112, 41, 32, 33, 61, 32,
            110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 44, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 109, 111, 100, 101, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 77, 111, 100, 101, 40,
            40, 95, 99, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 109, 111, 100, 101, 41, 32, 33, 61, 32, 110, 117,
            108, 108, 32, 63, 32, 95, 99, 32, 58, 32, 34, 102, 111, 114, 119, 97, 114, 100, 34, 44, 32, 95, 68, 111,
            116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 41, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 115, 101, 103, 109, 101, 110, 116, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111,
            114, 101, 83, 101, 103, 109, 101, 110, 116, 40, 40, 95, 100, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46,
            115, 101, 103, 109, 101, 110, 116, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 100, 32, 58, 32,
            91, 93, 44, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117,
            108, 101, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 112, 101, 101, 100, 58, 32, 40, 95, 101, 32, 61,
            32, 99, 111, 110, 102, 105, 103, 46, 115, 112, 101, 101, 100, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32,
            63, 32, 95, 101, 32, 58, 32, 49, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 117, 115, 101, 70, 114, 97, 109,
            101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111, 110, 58, 32, 40, 95, 102, 32, 61, 32, 99,
            111, 110, 102, 105, 103, 46, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108,
            97, 116, 105, 111, 110, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 102, 32, 58, 32, 116, 114,
            117, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 97, 114, 107, 101, 114, 58, 32, 40, 95, 103, 32, 61,
            32, 99, 111, 110, 102, 105, 103, 46, 109, 97, 114, 107, 101, 114, 41, 32, 33, 61, 32, 110, 117, 108, 108,
            32, 63, 32, 95, 103, 32, 58, 32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 97, 121, 111, 117,
            116, 58, 32, 99, 111, 110, 102, 105, 103, 46, 108, 97, 121, 111, 117, 116, 32, 63, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 97, 108, 105, 103, 110, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101,
            65, 108, 105, 103, 110, 40, 99, 111, 110, 102, 105, 103, 46, 108, 97, 121, 111, 117, 116, 46, 97, 108, 105,
            103, 110, 44, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100,
            117, 108, 101, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 105, 116, 58, 32, 99, 114, 101, 97,
            116, 101, 67, 111, 114, 101, 70, 105, 116, 40, 99, 111, 110, 102, 105, 103, 46, 108, 97, 121, 111, 117, 116,
            46, 102, 105, 116, 44, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77,
            111, 100, 117, 108, 101, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 58, 32, 95, 68, 111, 116, 76, 111,
            116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 46, 99, 114, 101, 97, 116, 101,
            68, 101, 102, 97, 117, 108, 116, 76, 97, 121, 111, 117, 116, 40, 41, 10, 32, 32, 32, 32, 32, 32, 125, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 99, 111, 110, 102, 105, 103, 46, 100, 97, 116, 97, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 108, 111, 97, 100, 70, 114, 111, 109,
            68, 97, 116, 97, 40, 99, 111, 110, 102, 105, 103, 46, 100, 97, 116, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 99, 111, 110, 102, 105, 103, 46, 115, 114, 99, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 108, 111, 97, 100, 70, 114, 111, 109,
            83, 114, 99, 40, 99, 111, 110, 102, 105, 103, 46, 115, 114, 99, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 115, 101, 116, 66, 97, 99, 107, 103, 114, 111, 117, 110,
            100, 67, 111, 108, 111, 114, 40, 40, 95, 104, 32, 61, 32, 99, 111, 110, 102, 105, 103, 46, 98, 97, 99, 107,
            103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32,
            95, 104, 32, 58, 32, 34, 34, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95, 114, 101, 110, 100,
            101, 114, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100,
            111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 32, 124,
            124, 32, 116, 104, 105, 115, 46, 95, 99, 111, 110, 116, 101, 120, 116, 32, 61, 61, 61, 32, 110, 117, 108,
            108, 41, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 114, 101, 110, 100, 101, 114, 101, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100,
            111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 114, 101, 110, 100, 101, 114, 40, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 114, 101, 110, 100, 101, 114, 101, 100, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 98, 117, 102, 102, 101, 114, 32, 61, 32, 116, 104, 105,
            115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 98, 117, 102, 102, 101, 114,
            40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 99, 108, 97, 109, 112, 101, 100,
            66, 117, 102, 102, 101, 114, 32, 61, 32, 110, 101, 119, 32, 85, 105, 110, 116, 56, 67, 108, 97, 109, 112,
            101, 100, 65, 114, 114, 97, 121, 40, 98, 117, 102, 102, 101, 114, 44, 32, 48, 44, 32, 116, 104, 105, 115,
            46, 95, 99, 97, 110, 118, 97, 115, 46, 119, 105, 100, 116, 104, 32, 42, 32, 116, 104, 105, 115, 46, 95, 99,
            97, 110, 118, 97, 115, 46, 104, 101, 105, 103, 104, 116, 32, 42, 32, 52, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 108, 101, 116, 32, 105, 109, 97, 103, 101, 68, 97, 116, 97, 32, 61, 32, 110, 117, 108, 108, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 121, 112, 101, 111, 102, 32, 73, 109, 97, 103, 101,
            68, 97, 116, 97, 32, 61, 61, 61, 32, 34, 117, 110, 100, 101, 102, 105, 110, 101, 100, 34, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 109, 97, 103, 101, 68, 97, 116, 97, 32, 61, 32, 116, 104, 105,
            115, 46, 95, 99, 111, 110, 116, 101, 120, 116, 46, 99, 114, 101, 97, 116, 101, 73, 109, 97, 103, 101, 68,
            97, 116, 97, 40, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 119, 105, 100, 116, 104, 44, 32,
            116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 104, 101, 105, 103, 104, 116, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 105, 109, 97, 103, 101, 68, 97, 116, 97, 46, 100, 97, 116, 97, 46, 115, 101,
            116, 40, 99, 108, 97, 109, 112, 101, 100, 66, 117, 102, 102, 101, 114, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 109, 97, 103,
            101, 68, 97, 116, 97, 32, 61, 32, 110, 101, 119, 32, 73, 109, 97, 103, 101, 68, 97, 116, 97, 40, 99, 108,
            97, 109, 112, 101, 100, 66, 117, 102, 102, 101, 114, 44, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118,
            97, 115, 46, 119, 105, 100, 116, 104, 44, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46,
            104, 101, 105, 103, 104, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 116, 104, 105, 115, 46, 95, 99, 111, 110, 116, 101, 120, 116, 46, 112, 117, 116, 73, 109, 97, 103,
            101, 68, 97, 116, 97, 40, 105, 109, 97, 103, 101, 68, 97, 116, 97, 44, 32, 48, 44, 32, 48, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101,
            114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            121, 112, 101, 58, 32, 34, 114, 101, 110, 100, 101, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 58, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116,
            76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101,
            40, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 116, 114, 117, 101, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95,
            100, 114, 97, 119, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46,
            95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108,
            32, 124, 124, 32, 116, 104, 105, 115, 46, 95, 99, 111, 110, 116, 101, 120, 116, 32, 61, 61, 61, 32, 110,
            117, 108, 108, 32, 124, 124, 32, 33, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101,
            67, 111, 114, 101, 46, 105, 115, 80, 108, 97, 121, 105, 110, 103, 40, 41, 41, 32, 114, 101, 116, 117, 114,
            110, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 110, 101, 120, 116, 70, 114, 97, 109, 101,
            32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46,
            114, 101, 113, 117, 101, 115, 116, 70, 114, 97, 109, 101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 117, 112, 100, 97, 116, 101, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116,
            76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 70, 114, 97, 109, 101, 40, 110, 101, 120,
            116, 70, 114, 97, 109, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 117, 112, 100, 97, 116,
            101, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110,
            116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 116, 121, 112, 101, 58, 32, 34, 102, 114, 97, 109, 101, 34, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 58, 32, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 99, 117, 114, 114, 101, 110, 116,
            70, 114, 97, 109, 101, 40, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 110, 100, 101, 114, 101, 100, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 114, 101, 110, 100, 101, 114, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 114,
            101, 110, 100, 101, 114, 101, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32,
            40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 105, 115,
            67, 111, 109, 112, 108, 101, 116, 101, 40, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 46, 108, 111, 111, 112, 65, 110, 105, 109, 97, 116, 105, 111,
            110, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95,
            101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 121, 112, 101, 58, 32, 34, 108,
            111, 111, 112, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 108, 111, 111,
            112, 67, 111, 117, 110, 116, 58, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101,
            67, 111, 114, 101, 46, 108, 111, 111, 112, 67, 111, 117, 110, 116, 40, 41, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101,
            108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46,
            95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40,
            123, 32, 116, 121, 112, 101, 58, 32, 34, 99, 111, 109, 112, 108, 101, 116, 101, 34, 32, 125, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 97, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 73, 100, 32, 61, 32, 116,
            104, 105, 115, 46, 95, 102, 114, 97, 109, 101, 77, 97, 110, 97, 103, 101, 114, 46, 114, 101, 113, 117, 101,
            115, 116, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 116, 104, 105, 115, 46, 95,
            100, 114, 97, 119, 46, 98, 105, 110, 100, 40, 116, 104, 105, 115, 41, 41, 59, 10, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 112, 108, 97, 121, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104,
            105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110,
            117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 111, 107, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111,
            114, 101, 46, 112, 108, 97, 121, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 111, 107, 32,
            124, 124, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46,
            105, 115, 80, 108, 97, 121, 105, 110, 103, 40, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 95, 105, 115, 70, 114, 111, 122, 101, 110, 32, 61, 32, 102, 97, 108, 115, 101, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103,
            101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 112, 108,
            97, 121, 34, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 97, 110, 105,
            109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 73, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 102,
            114, 97, 109, 101, 77, 97, 110, 97, 103, 101, 114, 46, 114, 101, 113, 117, 101, 115, 116, 65, 110, 105, 109,
            97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 116, 104, 105, 115, 46, 95, 100, 114, 97, 119, 46, 98,
            105, 110, 100, 40, 116, 104, 105, 115, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32, 38, 38, 32, 116, 104, 105, 115, 46, 95,
            99, 97, 110, 118, 97, 115, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 72, 84, 77, 76, 67, 97,
            110, 118, 97, 115, 69, 108, 101, 109, 101, 110, 116, 32, 38, 38, 32, 116, 104, 105, 115, 46, 95, 114, 101,
            110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 46, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102,
            115, 99, 114, 101, 101, 110, 32, 38, 38, 32, 33, 105, 115, 69, 108, 101, 109, 101, 110, 116, 73, 110, 86,
            105, 101, 119, 112, 111, 114, 116, 40, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 41, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 102, 114, 101, 101, 122, 101, 40, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 112, 97, 117, 115, 101, 40,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76,
            111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116,
            117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 111, 107, 32, 61, 32, 116, 104,
            105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 112, 97, 117, 115, 101,
            40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 111, 107, 32, 124, 124, 32, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 105, 115, 80, 97, 117, 115, 101,
            100, 40, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101,
            110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116, 121,
            112, 101, 58, 32, 34, 112, 97, 117, 115, 101, 34, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 116, 111, 112, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32,
            61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 111, 107, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 46, 115, 116, 111, 112, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 111, 107, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118,
            101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116,
            121, 112, 101, 58, 32, 34, 102, 114, 97, 109, 101, 34, 44, 32, 99, 117, 114, 114, 101, 110, 116, 70, 114,
            97, 109, 101, 58, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 46, 99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 40, 41, 32, 125, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114, 40, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46,
            100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 115, 116, 111, 112, 34,
            32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101,
            116, 70, 114, 97, 109, 101, 40, 102, 114, 97, 109, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61,
            61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 102, 114, 97, 109, 101, 32, 60, 32, 48, 32, 124, 124, 32, 102, 114, 97, 109, 101, 32, 62, 32,
            116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 116, 111,
            116, 97, 108, 70, 114, 97, 109, 101, 115, 40, 41, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 116, 32, 111, 107, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76,
            111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 101, 107, 40, 102, 114, 97, 109, 101, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 111, 107, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97,
            116, 99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 102, 114, 97, 109, 101, 34, 44, 32, 99, 117, 114,
            114, 101, 110, 116, 70, 114, 97, 109, 101, 58, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 46, 99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 40, 41, 32,
            125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114,
            40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 83,
            112, 101, 101, 100, 40, 115, 112, 101, 101, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40,
            116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61,
            32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110,
            102, 105, 103, 40, 95, 95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114,
            101, 97, 100, 86, 97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116,
            76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 112, 101, 101, 100, 10, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59,
            10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 66, 97, 99, 107, 103, 114, 111, 117, 110, 100,
            67, 111, 108, 111, 114, 40, 99, 111, 108, 111, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32,
            40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61,
            61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32, 38, 38, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110,
            118, 97, 115, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 72, 84, 77, 76, 67, 97, 110, 118, 97,
            115, 69, 108, 101, 109, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115,
            46, 95, 99, 97, 110, 118, 97, 115, 46, 115, 116, 121, 108, 101, 46, 98, 97, 99, 107, 103, 114, 111, 117,
            110, 100, 67, 111, 108, 111, 114, 32, 61, 32, 99, 111, 108, 111, 114, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 111,
            116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110, 102, 105, 103, 40, 95,
            95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97, 100, 86, 97,
            108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105,
            101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 58, 32, 104, 101,
            120, 83, 116, 114, 105, 110, 103, 84, 111, 82, 71, 66, 65, 73, 110, 116, 40, 99, 111, 108, 111, 114, 41, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 116, 104, 105, 115, 46, 95, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 32,
            61, 32, 99, 111, 108, 111, 114, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 76, 111,
            111, 112, 40, 108, 111, 111, 112, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105,
            115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117,
            108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95,
            100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110, 102, 105,
            103, 40, 95, 95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97,
            100, 86, 97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111,
            116, 116, 105, 101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 108, 111, 111, 112, 65, 110, 105, 109, 97, 116, 105, 111, 110, 58, 32, 108, 111,
            111, 112, 10, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115,
            101, 116, 85, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111,
            110, 40, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111,
            110, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116,
            76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101,
            116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110, 102, 105, 103, 40, 95, 95, 115, 112, 114,
            101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97, 100, 86, 97, 108, 117, 101, 115,
            40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 117, 115,
            101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111, 110, 10, 32, 32, 32,
            32, 32, 32, 125, 41, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 97, 100, 100, 69, 118, 101, 110,
            116, 76, 105, 115, 116, 101, 110, 101, 114, 40, 116, 121, 112, 101, 44, 32, 108, 105, 115, 116, 101, 110,
            101, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77,
            97, 110, 97, 103, 101, 114, 46, 97, 100, 100, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114,
            40, 116, 121, 112, 101, 44, 32, 108, 105, 115, 116, 101, 110, 101, 114, 41, 59, 10, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 114, 101, 109, 111, 118, 101, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114,
            40, 116, 121, 112, 101, 44, 32, 108, 105, 115, 116, 101, 110, 101, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 114, 101, 109,
            111, 118, 101, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 40, 116, 121, 112, 101, 44,
            32, 108, 105, 115, 116, 101, 110, 101, 114, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 100, 101,
            115, 116, 114, 111, 121, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32, 38, 38, 32, 116, 104, 105,
            115, 46, 95, 99, 97, 110, 118, 97, 115, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 72, 84, 77,
            76, 67, 97, 110, 118, 97, 115, 69, 108, 101, 109, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 79, 102, 102, 115, 99, 114, 101, 101, 110, 79, 98, 115, 101, 114, 118, 101, 114, 46, 117, 110, 111,
            98, 115, 101, 114, 118, 101, 40, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 67, 97, 110, 118, 97, 115, 82, 101, 115, 105, 122, 101, 79, 98, 115, 101, 114, 118,
            101, 114, 46, 117, 110, 111, 98, 115, 101, 114, 118, 101, 40, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118,
            97, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 40, 95, 97, 32, 61, 32, 116,
            104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32,
            110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 100, 101, 108, 101, 116,
            101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116,
            105, 101, 67, 111, 114, 101, 32, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 99, 111, 110, 116, 101, 120, 116, 32, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32,
            32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115,
            112, 97, 116, 99, 104, 40, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 121, 112, 101, 58, 32, 34, 100,
            101, 115, 116, 114, 111, 121, 34, 10, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 114, 101, 109, 111, 118,
            101, 65, 108, 108, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 115, 40, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 99, 108, 101, 97, 110, 117, 112, 83, 116, 97, 116, 101, 77,
            97, 99, 104, 105, 110, 101, 76, 105, 115, 116, 101, 110, 101, 114, 115, 40, 41, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 102, 114, 101, 101, 122, 101, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32,
            40, 116, 104, 105, 115, 46, 95, 97, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 73, 100,
            32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32,
            32, 116, 104, 105, 115, 46, 95, 102, 114, 97, 109, 101, 77, 97, 110, 97, 103, 101, 114, 46, 99, 97, 110, 99,
            101, 108, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 40, 116, 104, 105, 115, 46, 95,
            97, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 116, 104, 105, 115, 46, 95, 97, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114, 97, 109, 101, 73, 100,
            32, 61, 32, 110, 117, 108, 108, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 105, 115, 70,
            114, 111, 122, 101, 110, 32, 61, 32, 116, 114, 117, 101, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115,
            46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104,
            40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 102, 114, 101, 101, 122, 101, 34, 32, 125, 41, 59, 10, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 117, 110, 102, 114, 101, 101, 122, 101, 40, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 97, 110, 105, 109, 97, 116, 105, 111, 110, 70,
            114, 97, 109, 101, 73, 100, 32, 33, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110,
            59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 97, 110, 105, 109, 97, 116, 105, 111, 110, 70,
            114, 97, 109, 101, 73, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 102, 114, 97, 109, 101, 77, 97, 110, 97,
            103, 101, 114, 46, 114, 101, 113, 117, 101, 115, 116, 65, 110, 105, 109, 97, 116, 105, 111, 110, 70, 114,
            97, 109, 101, 40, 116, 104, 105, 115, 46, 95, 100, 114, 97, 119, 46, 98, 105, 110, 100, 40, 116, 104, 105,
            115, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 105, 115, 70, 114, 111, 122, 101,
            110, 32, 61, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101,
            118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32,
            116, 121, 112, 101, 58, 32, 34, 117, 110, 102, 114, 101, 101, 122, 101, 34, 32, 125, 41, 59, 10, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 114, 101, 115, 105, 122, 101, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 33, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101,
            32, 124, 124, 32, 33, 116, 104, 105, 115, 46, 105, 115, 76, 111, 97, 100, 101, 100, 41, 32, 114, 101, 116,
            117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32,
            38, 38, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            111, 102, 32, 72, 84, 77, 76, 67, 97, 110, 118, 97, 115, 69, 108, 101, 109, 101, 110, 116, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 100, 112, 114, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 46, 100, 101, 118, 105, 99, 101, 80, 105,
            120, 101, 108, 82, 97, 116, 105, 111, 32, 124, 124, 32, 119, 105, 110, 100, 111, 119, 46, 100, 101, 118,
            105, 99, 101, 80, 105, 120, 101, 108, 82, 97, 116, 105, 111, 32, 124, 124, 32, 49, 59, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 123, 32, 104, 101, 105, 103, 104, 116, 58, 32, 99, 108, 105,
            101, 110, 116, 72, 101, 105, 103, 104, 116, 44, 32, 119, 105, 100, 116, 104, 58, 32, 99, 108, 105, 101, 110,
            116, 87, 105, 100, 116, 104, 32, 125, 32, 61, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46,
            103, 101, 116, 66, 111, 117, 110, 100, 105, 110, 103, 67, 108, 105, 101, 110, 116, 82, 101, 99, 116, 40, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 119, 105,
            100, 116, 104, 32, 61, 32, 99, 108, 105, 101, 110, 116, 87, 105, 100, 116, 104, 32, 42, 32, 100, 112, 114,
            59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 104, 101,
            105, 103, 104, 116, 32, 61, 32, 99, 108, 105, 101, 110, 116, 72, 101, 105, 103, 104, 116, 32, 42, 32, 100,
            112, 114, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 111,
            107, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101,
            46, 114, 101, 115, 105, 122, 101, 40, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 119, 105,
            100, 116, 104, 44, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 104, 101, 105, 103, 104,
            116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 111, 107, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114, 40, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 83, 101, 103, 109, 101, 110, 116, 40,
            115, 116, 97, 114, 116, 70, 114, 97, 109, 101, 44, 32, 101, 110, 100, 70, 114, 97, 109, 101, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116,
            105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 32, 124, 124, 32, 95, 68, 111, 116, 76,
            111, 116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 32, 61, 61, 61, 32, 110,
            117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46,
            95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110, 102,
            105, 103, 40, 95, 95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101,
            97, 100, 86, 97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76,
            111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 115, 101, 103, 109, 101, 110, 116, 58, 32, 99, 114, 101, 97, 116, 101, 67,
            111, 114, 101, 83, 101, 103, 109, 101, 110, 116, 40, 91, 115, 116, 97, 114, 116, 70, 114, 97, 109, 101, 44,
            32, 101, 110, 100, 70, 114, 97, 109, 101, 93, 44, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95,
            119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 41, 10, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59, 10, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 77, 111, 100, 101, 40, 109, 111, 100, 101, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105,
            101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 32, 124, 124, 32, 95, 68, 111, 116, 76, 111,
            116, 116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 32, 61, 61, 61, 32, 110, 117,
            108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95,
            100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110, 102, 105,
            103, 40, 95, 95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97,
            100, 86, 97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111,
            116, 116, 105, 101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 109, 111, 100, 101, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 77, 111,
            100, 101, 40, 109, 111, 100, 101, 44, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97,
            115, 109, 77, 111, 100, 117, 108, 101, 41, 10, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59, 10, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 115, 101, 116, 82, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 40, 99,
            111, 110, 102, 105, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 95, 97, 32,
            61, 32, 99, 111, 110, 102, 105, 103, 44, 32, 123, 32, 100, 101, 118, 105, 99, 101, 80, 105, 120, 101, 108,
            82, 97, 116, 105, 111, 44, 32, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102, 115, 99, 114, 101, 101,
            110, 32, 125, 32, 61, 32, 95, 97, 44, 32, 114, 101, 115, 116, 67, 111, 110, 102, 105, 103, 32, 61, 32, 95,
            95, 111, 98, 106, 82, 101, 115, 116, 40, 95, 97, 44, 32, 91, 34, 100, 101, 118, 105, 99, 101, 80, 105, 120,
            101, 108, 82, 97, 116, 105, 111, 34, 44, 32, 34, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102, 115,
            99, 114, 101, 101, 110, 34, 93, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 114, 101,
            110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 32, 61, 32, 95, 95, 115, 112, 114, 101, 97, 100, 80, 114,
            111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97, 100, 86, 97, 108, 117, 101, 115, 40, 95, 95, 115, 112,
            114, 101, 97, 100, 86, 97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 114, 101,
            110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 41, 44, 32, 114, 101, 115, 116, 67, 111, 110, 102, 105,
            103, 41, 44, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 47, 47, 32, 100, 101, 118, 105, 99, 101, 80, 105,
            120, 101, 108, 82, 97, 116, 105, 111, 32, 105, 115, 32, 97, 32, 115, 112, 101, 99, 105, 97, 108, 32, 99, 97,
            115, 101, 44, 32, 105, 116, 32, 115, 104, 111, 117, 108, 100, 32, 98, 101, 32, 115, 101, 116, 32, 116, 111,
            32, 116, 104, 101, 32, 100, 101, 102, 97, 117, 108, 116, 32, 118, 97, 108, 117, 101, 32, 105, 102, 32, 105,
            116, 39, 115, 32, 110, 111, 116, 32, 112, 114, 111, 118, 105, 100, 101, 100, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 100, 101, 118, 105, 99, 101, 80, 105, 120, 101, 108, 82, 97, 116, 105, 111, 58, 32, 100, 101, 118, 105,
            99, 101, 80, 105, 120, 101, 108, 82, 97, 116, 105, 111, 32, 124, 124, 32, 103, 101, 116, 68, 101, 102, 97,
            117, 108, 116, 68, 80, 82, 40, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 101, 101, 122, 101, 79,
            110, 79, 102, 102, 115, 99, 114, 101, 101, 110, 58, 32, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102,
            115, 99, 114, 101, 101, 110, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 102, 114, 101, 101, 122, 101,
            79, 110, 79, 102, 102, 115, 99, 114, 101, 101, 110, 32, 58, 32, 116, 114, 117, 101, 10, 32, 32, 32, 32, 32,
            32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32,
            38, 38, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            111, 102, 32, 72, 84, 77, 76, 67, 97, 110, 118, 97, 115, 69, 108, 101, 109, 101, 110, 116, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114,
            67, 111, 110, 102, 105, 103, 46, 97, 117, 116, 111, 82, 101, 115, 105, 122, 101, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 67, 97, 110, 118, 97, 115, 82, 101, 115, 105, 122, 101, 79, 98, 115, 101,
            114, 118, 101, 114, 46, 111, 98, 115, 101, 114, 118, 101, 40, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118,
            97, 115, 44, 32, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115,
            101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 67, 97, 110, 118, 97, 115, 82, 101, 115, 105, 122,
            101, 79, 98, 115, 101, 114, 118, 101, 114, 46, 117, 110, 111, 98, 115, 101, 114, 118, 101, 40, 116, 104,
            105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114, 67, 111,
            110, 102, 105, 103, 46, 102, 114, 101, 101, 122, 101, 79, 110, 79, 102, 102, 115, 99, 114, 101, 101, 110,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 102, 102, 115, 99, 114, 101, 101, 110, 79, 98,
            115, 101, 114, 118, 101, 114, 46, 111, 98, 115, 101, 114, 118, 101, 40, 116, 104, 105, 115, 46, 95, 99, 97,
            110, 118, 97, 115, 44, 32, 116, 104, 105, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 32, 101,
            108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 102, 102, 115, 99, 114, 101, 101,
            110, 79, 98, 115, 101, 114, 118, 101, 114, 46, 117, 110, 111, 98, 115, 101, 114, 118, 101, 40, 116, 104,
            105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 116, 104, 105, 115, 46, 95, 105, 115, 70, 114, 111, 122, 101, 110, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 117, 110, 102, 114, 101, 101, 122, 101, 40, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 108, 111, 97, 100, 65, 110, 105, 109, 97, 116,
            105, 111, 110, 40, 97, 110, 105, 109, 97, 116, 105, 111, 110, 73, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 32, 124, 124, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116,
            76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 97, 99, 116, 105, 118, 101, 65, 110, 105, 109, 97, 116,
            105, 111, 110, 73, 100, 40, 41, 32, 61, 61, 61, 32, 97, 110, 105, 109, 97, 116, 105, 111, 110, 73, 100, 41,
            32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108, 111, 97,
            100, 101, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111,
            114, 101, 46, 108, 111, 97, 100, 65, 110, 105, 109, 97, 116, 105, 111, 110, 40, 97, 110, 105, 109, 97, 116,
            105, 111, 110, 73, 100, 44, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 119, 105, 100,
            116, 104, 44, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 104, 101, 105, 103, 104, 116,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 108, 111, 97, 100, 101, 100, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114,
            46, 100, 105, 115, 112, 97, 116, 99, 104, 40, 123, 32, 116, 121, 112, 101, 58, 32, 34, 108, 111, 97, 100,
            34, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 114, 101, 115, 105, 122,
            101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 105, 115, 46, 95, 101, 118, 101, 110, 116, 77, 97, 110, 97, 103, 101, 114, 46, 100,
            105, 115, 112, 97, 116, 99, 104, 40, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 121, 112, 101,
            58, 32, 34, 108, 111, 97, 100, 69, 114, 114, 111, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            101, 114, 114, 111, 114, 58, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 70, 97, 105, 108, 101,
            100, 32, 116, 111, 32, 97, 110, 105, 109, 97, 116, 105, 111, 110, 32, 58, 36, 123, 97, 110, 105, 109, 97,
            116, 105, 111, 110, 73, 100, 125, 96, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 77, 97, 114, 107, 101, 114, 40,
            109, 97, 114, 107, 101, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108,
            108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100,
            111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110, 102, 105, 103,
            40, 95, 95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97, 100,
            86, 97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 109, 97, 114, 107, 101, 114, 10, 32, 32, 32, 32, 32, 32, 125, 41, 41, 59, 10, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 109, 97, 114, 107, 101, 114, 115, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 109, 97, 114, 107,
            101, 114, 115, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100,
            32, 48, 32, 58, 32, 95, 97, 46, 109, 97, 114, 107, 101, 114, 115, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 109, 97, 114, 107, 101, 114, 115, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 114, 101, 115, 117, 108, 116, 32, 61, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 102, 111, 114, 32, 40, 108, 101, 116, 32, 105, 32, 61, 32, 48, 59, 32, 105, 32, 60, 32, 109, 97,
            114, 107, 101, 114, 115, 46, 115, 105, 122, 101, 40, 41, 59, 32, 105, 32, 43, 61, 32, 49, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 109, 97, 114, 107, 101, 114, 32, 61, 32,
            109, 97, 114, 107, 101, 114, 115, 46, 103, 101, 116, 40, 105, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 114, 101, 115, 117, 108, 116, 46, 112, 117, 115, 104, 40, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 110, 97, 109, 101, 58, 32, 109, 97, 114, 107, 101, 114, 46, 110, 97, 109, 101, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 105, 109, 101, 58, 32, 109, 97, 114, 107, 101, 114, 46,
            116, 105, 109, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 100, 117, 114, 97, 116, 105,
            111, 110, 58, 32, 109, 97, 114, 107, 101, 114, 46, 100, 117, 114, 97, 116, 105, 111, 110, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 114, 101, 115, 117, 108, 116, 59, 10, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 91, 93, 59, 10, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 115, 101, 116, 84, 104, 101, 109, 101, 40, 116, 104, 101, 109, 101, 73, 100, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116,
            105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110,
            32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108, 111, 97, 100,
            101, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 46, 108, 111, 97, 100, 84, 104, 101, 109, 101, 40, 116, 104, 101, 109, 101, 73, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 114, 101, 110, 100, 101, 114, 40, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 108, 111, 97, 100, 101, 100, 59, 10, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 114, 101, 115, 101, 116, 84, 104, 101, 109, 101, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114,
            101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108, 115,
            101, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108, 115, 101, 59, 10, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 84, 104, 101, 109, 101, 68, 97, 116, 97, 40, 116, 104,
            101, 109, 101, 68, 97, 116, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105,
            115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117,
            108, 108, 41, 32, 114, 101, 116, 117, 114, 110, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 108, 111, 97, 100, 101, 100, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111,
            116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 108, 111, 97, 100, 84, 104, 101, 109, 101, 68, 97,
            116, 97, 40, 116, 104, 101, 109, 101, 68, 97, 116, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 114, 101, 110, 100, 101, 114, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114,
            110, 32, 108, 111, 97, 100, 101, 100, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 83,
            108, 111, 116, 115, 40, 95, 115, 108, 111, 116, 115, 41, 32, 123, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 115, 101, 116, 76, 97, 121, 111, 117, 116, 40, 108, 97, 121, 111, 117, 116, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67,
            111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 32, 124, 124, 32, 95, 68, 111, 116, 76, 111, 116,
            116, 105, 101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 32, 61, 61, 61, 32, 110, 117, 108,
            108, 41, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 100,
            111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101, 116, 67, 111, 110, 102, 105, 103,
            40, 95, 95, 115, 112, 114, 101, 97, 100, 80, 114, 111, 112, 115, 40, 95, 95, 115, 112, 114, 101, 97, 100,
            86, 97, 108, 117, 101, 115, 40, 123, 125, 44, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 46, 99, 111, 110, 102, 105, 103, 40, 41, 41, 44, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 108, 97, 121, 111, 117, 116, 58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            97, 108, 105, 103, 110, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 65, 108, 105, 103, 110, 40,
            108, 97, 121, 111, 117, 116, 46, 97, 108, 105, 103, 110, 44, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105,
            101, 46, 95, 119, 97, 115, 109, 77, 111, 100, 117, 108, 101, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 102, 105, 116, 58, 32, 99, 114, 101, 97, 116, 101, 67, 111, 114, 101, 70, 105, 116, 40, 108, 97, 121,
            111, 117, 116, 46, 102, 105, 116, 44, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 95, 119, 97,
            115, 109, 77, 111, 100, 117, 108, 101, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 125, 41, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 86, 105, 101, 119, 112,
            111, 114, 116, 40, 120, 44, 32, 121, 44, 32, 119, 105, 100, 116, 104, 44, 32, 104, 101, 105, 103, 104, 116,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76,
            111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 61, 61, 61, 32, 110, 117, 108, 108, 41, 32, 114, 101, 116,
            117, 114, 110, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 46, 115, 101,
            116, 86, 105, 101, 119, 112, 111, 114, 116, 40, 120, 44, 32, 121, 44, 32, 119, 105, 100, 116, 104, 44, 32,
            104, 101, 105, 103, 104, 116, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 116, 97, 116, 105,
            99, 32, 115, 101, 116, 87, 97, 115, 109, 85, 114, 108, 40, 117, 114, 108, 41, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 68, 111, 116, 76, 111, 116, 116, 105, 101, 87, 97, 115, 109, 76, 111, 97, 100, 101, 114, 46, 115,
            101, 116, 87, 97, 115, 109, 85, 114, 108, 40, 117, 114, 108, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 108, 111, 97, 100, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 40, 115, 116, 97, 116,
            101, 77, 97, 99, 104, 105, 110, 101, 73, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95,
            97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61,
            32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111,
            114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95,
            97, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 76, 111, 97, 100, 40, 115, 116, 97, 116,
            101, 77, 97, 99, 104, 105, 110, 101, 73, 100, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95,
            98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 116, 97, 114,
            116, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115,
            116, 97, 114, 116, 101, 100, 32, 61, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101, 77, 97, 99,
            104, 105, 110, 101, 83, 116, 97, 114, 116, 40, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95,
            98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 115, 116, 97, 114,
            116, 101, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 115, 101, 116,
            117, 112, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 76, 105, 115, 116, 101, 110, 101, 114, 115,
            40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 116, 104, 105, 115, 46, 105, 115, 80, 108,
            97, 121, 105, 110, 103, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46,
            112, 108, 97, 121, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 115, 116, 97, 114, 116, 101, 100, 59, 10, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 115, 116, 111, 112, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101,
            40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 116, 111, 112, 112, 101, 100, 32, 61, 32, 40, 95, 98, 32, 61,
            32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111,
            114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95,
            97, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 83, 116, 111, 112, 40, 41, 41, 32, 33, 61,
            32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 115, 116, 111, 112, 112, 101, 100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            116, 104, 105, 115, 46, 95, 99, 108, 101, 97, 110, 117, 112, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105,
            110, 101, 76, 105, 115, 116, 101, 110, 101, 114, 115, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 115, 116, 111, 112, 112, 101, 100, 59, 10, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 95, 103, 101, 116, 80, 111, 105, 110, 116, 101, 114, 80, 111, 115, 105, 116,
            105, 111, 110, 40, 101, 118, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 114, 101, 99, 116, 32, 61, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 103, 101, 116,
            66, 111, 117, 110, 100, 105, 110, 103, 67, 108, 105, 101, 110, 116, 82, 101, 99, 116, 40, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 99, 97, 108, 101, 88, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 99, 97, 110, 118, 97, 115, 46, 119, 105, 100, 116, 104, 32, 47, 32, 114, 101, 99, 116, 46, 119, 105,
            100, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 99, 97, 108, 101, 89, 32,
            61, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 104, 101, 105, 103, 104, 116, 32, 47, 32,
            114, 101, 99, 116, 46, 104, 101, 105, 103, 104, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 120, 32, 61, 32, 40, 101, 118, 101, 110, 116, 46, 99, 108, 105, 101, 110, 116, 88, 32, 45, 32, 114, 101,
            99, 116, 46, 108, 101, 102, 116, 41, 32, 42, 32, 115, 99, 97, 108, 101, 88, 59, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 121, 32, 61, 32, 40, 101, 118, 101, 110, 116, 46, 99, 108, 105, 101, 110, 116,
            89, 32, 45, 32, 114, 101, 99, 116, 46, 116, 111, 112, 41, 32, 42, 32, 115, 99, 97, 108, 101, 89, 59, 10, 32,
            32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 120, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 121, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 95, 111, 110, 80, 111, 105, 110, 116, 101, 114, 85, 112, 40, 101, 118, 101, 110, 116, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 123, 32, 120, 44, 32, 121, 32, 125, 32, 61, 32,
            116, 104, 105, 115, 46, 95, 103, 101, 116, 80, 111, 105, 110, 116, 101, 114, 80, 111, 115, 105, 116, 105,
            111, 110, 40, 101, 118, 101, 110, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 112, 111,
            115, 116, 80, 111, 105, 110, 116, 101, 114, 85, 112, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59,
            10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95, 111, 110, 80, 111, 105, 110, 116, 101, 114, 68, 111, 119,
            110, 40, 101, 118, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 123,
            32, 120, 44, 32, 121, 32, 125, 32, 61, 32, 116, 104, 105, 115, 46, 95, 103, 101, 116, 80, 111, 105, 110,
            116, 101, 114, 80, 111, 115, 105, 116, 105, 111, 110, 40, 101, 118, 101, 110, 116, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 116, 104, 105, 115, 46, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 68, 111, 119, 110,
            69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46,
            112, 108, 97, 121, 40, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95, 111, 110, 80, 111, 105, 110,
            116, 101, 114, 77, 111, 118, 101, 40, 101, 118, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 123, 32, 120, 44, 32, 121, 32, 125, 32, 61, 32, 116, 104, 105, 115, 46, 95, 103,
            101, 116, 80, 111, 105, 110, 116, 101, 114, 80, 111, 115, 105, 116, 105, 111, 110, 40, 101, 118, 101, 110,
            116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 112, 111, 115, 116, 80, 111, 105, 110, 116,
            101, 114, 77, 111, 118, 101, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 95, 111, 110, 80, 111, 105, 110, 116, 101, 114, 69, 110, 116, 101, 114, 40, 101, 118,
            101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 123, 32, 120, 44, 32,
            121, 32, 125, 32, 61, 32, 116, 104, 105, 115, 46, 95, 103, 101, 116, 80, 111, 105, 110, 116, 101, 114, 80,
            111, 115, 105, 116, 105, 111, 110, 40, 101, 118, 101, 110, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116,
            104, 105, 115, 46, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 69, 110, 116, 101, 114, 69, 118,
            101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95, 111, 110, 80,
            111, 105, 110, 116, 101, 114, 76, 101, 97, 118, 101, 40, 101, 118, 101, 110, 116, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 123, 32, 120, 44, 32, 121, 32, 125, 32, 61, 32, 116, 104, 105,
            115, 46, 95, 103, 101, 116, 80, 111, 105, 110, 116, 101, 114, 80, 111, 115, 105, 116, 105, 111, 110, 40,
            101, 118, 101, 110, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 112, 111, 115, 116, 80,
            111, 105, 110, 116, 101, 114, 69, 120, 105, 116, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 68, 111, 119,
            110, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114,
            32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 97, 32, 61, 32, 116,
            104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32,
            110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101,
            77, 97, 99, 104, 105, 110, 101, 80, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 68, 111, 119, 110, 69,
            118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 112, 111,
            115, 116, 80, 111, 105, 110, 116, 101, 114, 85, 112, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116,
            105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48,
            32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 80, 111, 115, 116, 80, 111,
            105, 110, 116, 101, 114, 85, 112, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 77, 111, 118, 101, 69, 118,
            101, 110, 116, 40, 120, 44, 32, 121, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59,
            10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101, 77, 97, 99,
            104, 105, 110, 101, 80, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 77, 111, 118, 101, 69, 118, 101,
            110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 112, 111, 115, 116, 80,
            111, 105, 110, 116, 101, 114, 69, 110, 116, 101, 114, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116,
            105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48,
            32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 80, 111, 115, 116, 80, 111,
            105, 110, 116, 101, 114, 69, 110, 116, 101, 114, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 69, 120, 105,
            116, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114,
            32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 97, 32, 61, 32, 116,
            104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32,
            110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101,
            77, 97, 99, 104, 105, 110, 101, 80, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 69, 120, 105, 116, 69,
            118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 103, 101,
            116, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 76, 105, 115, 116, 101, 110, 101, 114, 115, 40,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 116, 104, 105, 115, 46, 95, 100, 111, 116,
            76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 114, 101, 116, 117, 114, 110, 32, 91, 93, 59, 10,
            32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 86, 101,
            99, 116, 111, 114, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67,
            111, 114, 101, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 70, 114, 97, 109, 101, 119, 111,
            114, 107, 83, 101, 116, 117, 112, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108,
            105, 115, 116, 101, 110, 101, 114, 115, 32, 61, 32, 91, 93, 59, 10, 32, 32, 32, 32, 32, 32, 102, 111, 114,
            32, 40, 108, 101, 116, 32, 105, 32, 61, 32, 48, 59, 32, 105, 32, 60, 32, 108, 105, 115, 116, 101, 110, 101,
            114, 115, 86, 101, 99, 116, 111, 114, 46, 115, 105, 122, 101, 40, 41, 59, 32, 105, 32, 43, 61, 32, 49, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 46, 112, 117, 115,
            104, 40, 108, 105, 115, 116, 101, 110, 101, 114, 115, 86, 101, 99, 116, 111, 114, 46, 103, 101, 116, 40,
            105, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110,
            32, 108, 105, 115, 116, 101, 110, 101, 114, 115, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 95, 115,
            101, 116, 117, 112, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 76, 105, 115, 116, 101, 110, 101,
            114, 115, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69,
            82, 32, 38, 38, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 32, 105, 110, 115, 116, 97, 110,
            99, 101, 111, 102, 32, 72, 84, 77, 76, 67, 97, 110, 118, 97, 115, 69, 108, 101, 109, 101, 110, 116, 32, 38,
            38, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 32, 33,
            61, 61, 32, 110, 117, 108, 108, 32, 38, 38, 32, 116, 104, 105, 115, 46, 105, 115, 76, 111, 97, 100, 101,
            100, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108, 105, 115, 116, 101,
            110, 101, 114, 115, 32, 61, 32, 116, 104, 105, 115, 46, 103, 101, 116, 83, 116, 97, 116, 101, 77, 97, 99,
            104, 105, 110, 101, 76, 105, 115, 116, 101, 110, 101, 114, 115, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 108, 105, 115, 116, 101, 110, 101, 114, 115, 46, 105, 110, 99, 108, 117, 100, 101,
            115, 40, 34, 80, 111, 105, 110, 116, 101, 114, 85, 112, 34, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 97, 100, 100, 69, 118, 101, 110, 116,
            76, 105, 115, 116, 101, 110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 117, 112, 34, 44, 32, 116,
            104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 85, 112, 77, 101, 116, 104, 111, 100, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 108, 105, 115,
            116, 101, 110, 101, 114, 115, 46, 105, 110, 99, 108, 117, 100, 101, 115, 40, 34, 80, 111, 105, 110, 116,
            101, 114, 68, 111, 119, 110, 34, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 97, 100, 100, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101,
            110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 100, 111, 119, 110, 34, 44, 32, 116, 104, 105,
            115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 68, 111, 119, 110, 77, 101, 116, 104, 111, 100, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 108, 105, 115,
            116, 101, 110, 101, 114, 115, 46, 105, 110, 99, 108, 117, 100, 101, 115, 40, 34, 80, 111, 105, 110, 116,
            101, 114, 77, 111, 118, 101, 34, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105,
            115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 97, 100, 100, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101,
            110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 109, 111, 118, 101, 34, 44, 32, 116, 104, 105,
            115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 77, 111, 118, 101, 77, 101, 116, 104, 111, 100, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 108, 105, 115,
            116, 101, 110, 101, 114, 115, 46, 105, 110, 99, 108, 117, 100, 101, 115, 40, 34, 80, 111, 105, 110, 116,
            101, 114, 69, 110, 116, 101, 114, 34, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 97, 100, 100, 69, 118, 101, 110, 116, 76, 105, 115, 116,
            101, 110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 101, 110, 116, 101, 114, 34, 44, 32, 116,
            104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 69, 110, 116, 101, 114, 77, 101, 116, 104, 111,
            100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40,
            108, 105, 115, 116, 101, 110, 101, 114, 115, 46, 105, 110, 99, 108, 117, 100, 101, 115, 40, 34, 80, 111,
            105, 110, 116, 101, 114, 69, 120, 105, 116, 34, 41, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 97, 100, 100, 69, 118, 101, 110, 116, 76, 105,
            115, 116, 101, 110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 108, 101, 97, 118, 101, 34, 44, 32,
            116, 104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 69, 120, 105, 116, 77, 101, 116, 104, 111,
            100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 95, 99, 108, 101, 97, 110, 117, 112, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105,
            110, 101, 76, 105, 115, 116, 101, 110, 101, 114, 115, 40, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 105, 102,
            32, 40, 73, 83, 95, 66, 82, 79, 87, 83, 69, 82, 32, 38, 38, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110,
            118, 97, 115, 32, 105, 110, 115, 116, 97, 110, 99, 101, 111, 102, 32, 72, 84, 77, 76, 67, 97, 110, 118, 97,
            115, 69, 108, 101, 109, 101, 110, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115,
            46, 95, 99, 97, 110, 118, 97, 115, 46, 114, 101, 109, 111, 118, 101, 69, 118, 101, 110, 116, 76, 105, 115,
            116, 101, 110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 117, 112, 34, 44, 32, 116, 104, 105,
            115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 85, 112, 77, 101, 116, 104, 111, 100, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 114, 101, 109, 111, 118,
            101, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101,
            114, 100, 111, 119, 110, 34, 44, 32, 116, 104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 68, 111,
            119, 110, 77, 101, 116, 104, 111, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46,
            95, 99, 97, 110, 118, 97, 115, 46, 114, 101, 109, 111, 118, 101, 69, 118, 101, 110, 116, 76, 105, 115, 116,
            101, 110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 109, 111, 118, 101, 34, 44, 32, 116, 104,
            105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 77, 111, 118, 101, 77, 101, 116, 104, 111, 100, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 114, 101,
            109, 111, 118, 101, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 40, 34, 112, 111, 105,
            110, 116, 101, 114, 101, 110, 116, 101, 114, 34, 44, 32, 116, 104, 105, 115, 46, 95, 112, 111, 105, 110,
            116, 101, 114, 69, 110, 116, 101, 114, 77, 101, 116, 104, 111, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 104, 105, 115, 46, 95, 99, 97, 110, 118, 97, 115, 46, 114, 101, 109, 111, 118, 101, 69, 118, 101,
            110, 116, 76, 105, 115, 116, 101, 110, 101, 114, 40, 34, 112, 111, 105, 110, 116, 101, 114, 108, 101, 97,
            118, 101, 34, 44, 32, 116, 104, 105, 115, 46, 95, 112, 111, 105, 110, 116, 101, 114, 69, 120, 105, 116, 77,
            101, 116, 104, 111, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 108, 111, 97, 100, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 68, 97, 116, 97, 40, 115, 116,
            97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 68, 97, 116, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118,
            97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40,
            95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116,
            105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48,
            32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 76, 111, 97, 100, 68, 97,
            116, 97, 40, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 68, 97, 116, 97, 41, 41, 32, 33, 61,
            32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 97, 110, 105, 109, 97, 116, 105, 111, 110, 83, 105, 122, 101, 40, 41, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 44, 32, 95, 99, 44, 32, 95, 100, 59, 10, 32,
            32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 119, 105, 100, 116, 104, 32, 61, 32, 40, 95, 98, 32, 61, 32,
            40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111,
            114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95,
            97, 46, 97, 110, 105, 109, 97, 116, 105, 111, 110, 83, 105, 122, 101, 40, 41, 46, 103, 101, 116, 40, 48, 41,
            41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 104, 101, 105, 103, 104, 116, 32, 61, 32, 40, 95, 100, 32, 61, 32, 40, 95, 99,
            32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41,
            32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 99, 46, 97, 110,
            105, 109, 97, 116, 105, 111, 110, 83, 105, 122, 101, 40, 41, 46, 103, 101, 116, 40, 49, 41, 41, 32, 33, 61,
            32, 110, 117, 108, 108, 32, 63, 32, 95, 100, 32, 58, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 119, 105, 100, 116, 104, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 104, 101, 105, 103, 104, 116, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 115, 101, 116, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 66, 111, 111, 108,
            101, 97, 110, 67, 111, 110, 116, 101, 120, 116, 40, 110, 97, 109, 101, 44, 32, 118, 97, 108, 117, 101, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32,
            32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115,
            46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101, 77, 97, 99,
            104, 105, 110, 101, 83, 101, 116, 66, 111, 111, 108, 101, 97, 110, 84, 114, 105, 103, 103, 101, 114, 40,
            110, 97, 109, 101, 44, 32, 118, 97, 108, 117, 101, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32,
            95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116,
            83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 78, 117, 109, 101, 114, 105, 99, 67, 111, 110, 116,
            101, 120, 116, 40, 110, 97, 109, 101, 44, 32, 118, 97, 108, 117, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110,
            32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116,
            116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100,
            32, 48, 32, 58, 32, 95, 97, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 83, 101, 116, 78,
            117, 109, 101, 114, 105, 99, 84, 114, 105, 103, 103, 101, 114, 40, 110, 97, 109, 101, 44, 32, 118, 97, 108,
            117, 101, 41, 41, 32, 33, 61, 32, 110, 117, 108, 108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115,
            101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 115, 101, 116, 83, 116, 97, 116, 101, 77, 97, 99, 104,
            105, 110, 101, 83, 116, 114, 105, 110, 103, 67, 111, 110, 116, 101, 120, 116, 40, 110, 97, 109, 101, 44, 32,
            118, 97, 108, 117, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 44, 32, 95, 98,
            59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 40, 95, 98, 32, 61, 32, 40, 95, 97, 32,
            61, 32, 116, 104, 105, 115, 46, 95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32,
            61, 61, 32, 110, 117, 108, 108, 32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 115, 116,
            97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 83, 101, 116, 83, 116, 114, 105, 110, 103, 84, 114, 105, 103,
            103, 101, 114, 40, 110, 97, 109, 101, 44, 32, 118, 97, 108, 117, 101, 41, 41, 32, 33, 61, 32, 110, 117, 108,
            108, 32, 63, 32, 95, 98, 32, 58, 32, 102, 97, 108, 115, 101, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 47, 42, 42, 10, 32, 32, 32, 32, 32, 42, 32, 71, 101, 116, 32, 116, 104, 101, 32, 98, 111, 117, 110, 100,
            115, 32, 111, 102, 32, 97, 32, 108, 97, 121, 101, 114, 32, 98, 121, 32, 105, 116, 115, 32, 110, 97, 109,
            101, 10, 32, 32, 32, 32, 32, 42, 32, 64, 112, 97, 114, 97, 109, 32, 108, 97, 121, 101, 114, 78, 97, 109,
            101, 32, 45, 32, 84, 104, 101, 32, 110, 97, 109, 101, 32, 111, 102, 32, 116, 104, 101, 32, 108, 97, 121,
            101, 114, 10, 32, 32, 32, 32, 32, 42, 32, 64, 114, 101, 116, 117, 114, 110, 115, 32, 84, 104, 101, 32, 98,
            111, 117, 110, 100, 115, 32, 111, 102, 32, 116, 104, 101, 32, 108, 97, 121, 101, 114, 10, 32, 32, 32, 32,
            32, 42, 10, 32, 32, 32, 32, 32, 42, 32, 64, 101, 120, 97, 109, 112, 108, 101, 10, 32, 32, 32, 32, 32, 42,
            32, 96, 96, 96, 116, 121, 112, 101, 115, 99, 114, 105, 112, 116, 10, 32, 32, 32, 32, 32, 42, 32, 47, 47, 32,
            68, 114, 97, 119, 32, 97, 32, 114, 101, 99, 116, 97, 110, 103, 108, 101, 32, 97, 114, 111, 117, 110, 100,
            32, 116, 104, 101, 32, 108, 97, 121, 101, 114, 32, 39, 76, 97, 121, 101, 114, 32, 49, 39, 10, 32, 32, 32,
            32, 32, 42, 32, 100, 111, 116, 76, 111, 116, 116, 105, 101, 46, 97, 100, 100, 69, 118, 101, 110, 116, 76,
            105, 115, 116, 101, 110, 101, 114, 40, 39, 114, 101, 110, 100, 101, 114, 39, 44, 32, 40, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 42, 32, 32, 32, 99, 111, 110, 115, 116, 32, 98, 111, 117, 110, 100, 105, 110,
            103, 66, 111, 120, 32, 61, 32, 100, 111, 116, 76, 111, 116, 116, 105, 101, 46, 103, 101, 116, 76, 97, 121,
            101, 114, 66, 111, 117, 110, 100, 105, 110, 103, 66, 111, 120, 40, 39, 76, 97, 121, 101, 114, 32, 49, 39,
            41, 59, 10, 32, 32, 32, 32, 32, 42, 10, 32, 32, 32, 32, 32, 42, 32, 32, 32, 105, 102, 32, 40, 98, 111, 117,
            110, 100, 105, 110, 103, 66, 111, 120, 41, 32, 123, 10, 32, 32, 32, 32, 32, 42, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 123, 32, 120, 44, 32, 121, 44, 32, 119, 105, 100, 116, 104, 44, 32, 104, 101, 105, 103,
            104, 116, 32, 125, 32, 61, 32, 98, 111, 117, 110, 100, 105, 110, 103, 66, 111, 120, 59, 10, 32, 32, 32, 32,
            32, 42, 32, 32, 32, 32, 32, 99, 111, 110, 116, 101, 120, 116, 46, 115, 116, 114, 111, 107, 101, 82, 101, 99,
            116, 40, 120, 44, 32, 121, 44, 32, 119, 105, 100, 116, 104, 44, 32, 104, 101, 105, 103, 104, 116, 41, 59,
            10, 32, 32, 32, 32, 32, 42, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 42, 32, 125, 41, 59, 10, 32, 32, 32,
            32, 32, 42, 32, 96, 96, 96, 10, 32, 32, 32, 32, 32, 42, 47, 10, 32, 32, 32, 32, 103, 101, 116, 76, 97, 121,
            101, 114, 66, 111, 117, 110, 100, 105, 110, 103, 66, 111, 120, 40, 108, 97, 121, 101, 114, 78, 97, 109, 101,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 118, 97, 114, 32, 95, 97, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 98, 111, 117, 110, 100, 115, 32, 61, 32, 40, 95, 97, 32, 61, 32, 116, 104, 105, 115, 46,
            95, 100, 111, 116, 76, 111, 116, 116, 105, 101, 67, 111, 114, 101, 41, 32, 61, 61, 32, 110, 117, 108, 108,
            32, 63, 32, 118, 111, 105, 100, 32, 48, 32, 58, 32, 95, 97, 46, 103, 101, 116, 76, 97, 121, 101, 114, 66,
            111, 117, 110, 100, 115, 40, 108, 97, 121, 101, 114, 78, 97, 109, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            105, 102, 32, 40, 33, 98, 111, 117, 110, 100, 115, 41, 32, 114, 101, 116, 117, 114, 110, 32, 118, 111, 105,
            100, 32, 48, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 98, 111, 117, 110, 100, 115, 46, 115, 105,
            122, 101, 40, 41, 32, 33, 61, 61, 32, 52, 41, 32, 114, 101, 116, 117, 114, 110, 32, 118, 111, 105, 100, 32,
            48, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 120, 32, 61, 32, 98, 111, 117, 110, 100,
            115, 46, 103, 101, 116, 40, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 121, 32, 61,
            32, 98, 111, 117, 110, 100, 115, 46, 103, 101, 116, 40, 49, 41, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 119, 105, 100, 116, 104, 32, 61, 32, 98, 111, 117, 110, 100, 115, 46, 103, 101, 116, 40,
            50, 41, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 104, 101, 105, 103, 104, 116, 32, 61,
            32, 98, 111, 117, 110, 100, 115, 46, 103, 101, 116, 40, 51, 41, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 120, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 121, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 119, 105, 100, 116, 104, 44, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 104, 101, 105, 103, 104, 116, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 125, 10, 32,
            32, 32, 32, 115, 116, 97, 116, 105, 99, 32, 116, 114, 97, 110, 115, 102, 111, 114, 109, 84, 104, 101, 109,
            101, 84, 111, 76, 111, 116, 116, 105, 101, 83, 108, 111, 116, 115, 40, 95, 116, 104, 101, 109, 101, 44, 32,
            95, 115, 108, 111, 116, 115, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 34,
            34, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32, 32, 95, 95, 112, 117, 98, 108, 105, 99, 70,
            105, 101, 108, 100, 40, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 44, 32, 34, 95, 119, 97, 115, 109,
            77, 111, 100, 117, 108, 101, 34, 44, 32, 110, 117, 108, 108, 41, 59, 10, 32, 32, 118, 97, 114, 32, 68, 111,
            116, 76, 111, 116, 116, 105, 101, 32, 61, 32, 95, 68, 111, 116, 76, 111, 116, 116, 105, 101, 59, 10, 10, 32,
            32, 47, 47, 32, 115, 114, 99, 47, 119, 111, 114, 107, 101, 114, 47, 100, 111, 116, 108, 111, 116, 116, 105,
            101, 46, 119, 111, 114, 107, 101, 114, 46, 116, 115, 10, 32, 32, 118, 97, 114, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 115, 77, 97, 112, 32, 61, 32, 47, 42, 32, 64, 95, 95, 80, 85, 82, 69, 95, 95, 32, 42, 47, 32,
            110, 101, 119, 32, 77, 97, 112, 40, 41, 59, 10, 32, 32, 118, 97, 114, 32, 101, 118, 101, 110, 116, 72, 97,
            110, 100, 108, 101, 114, 77, 97, 112, 32, 61, 32, 123, 10, 32, 32, 32, 32, 114, 101, 97, 100, 121, 58, 32,
            40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32,
            61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 112, 111, 110, 115,
            101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 34, 34, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 82, 101, 97, 100, 121, 34, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101,
            118, 101, 110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32,
            32, 32, 32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114,
            101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 99, 111, 109,
            112, 108, 101, 116, 101, 58, 32, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40,
            101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            114, 101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58,
            32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 67,
            111, 109, 112, 108, 101, 116, 101, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116,
            58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115,
            116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32,
            32, 125, 44, 10, 32, 32, 32, 32, 108, 111, 97, 100, 58, 32, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 108, 111, 97, 100, 69, 118, 101, 110, 116, 32, 61, 32, 101, 118, 101, 110, 116,
            59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 112, 111, 110, 115, 101, 32, 61,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 76, 111, 97, 100, 34, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110,
            116, 58, 32, 108, 111, 97, 100, 69, 118, 101, 110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101,
            115, 115, 97, 103, 101, 40, 114, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10,
            32, 32, 32, 32, 108, 111, 97, 100, 69, 114, 114, 111, 114, 58, 32, 40, 105, 110, 115, 116, 97, 110, 99, 101,
            73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 32, 108, 111, 97, 100, 69, 114, 114, 111, 114, 69, 118, 101, 110, 116, 32, 61,
            32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 112,
            111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 34, 34, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 76, 111, 97, 100, 69,
            114, 114, 111, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 58, 32, 108, 111, 97, 100, 69, 114, 114, 111, 114,
            69, 118, 101, 110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10,
            32, 32, 32, 32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40,
            114, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 108, 111,
            111, 112, 58, 32, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101,
            110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108, 111, 111,
            112, 69, 118, 101, 110, 116, 32, 61, 32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 114, 101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 100, 58, 32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32,
            34, 111, 110, 76, 111, 111, 112, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116,
            58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 58, 32, 108, 111, 111, 112, 69, 118,
            101, 110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32,
            32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115,
            112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 112, 108, 97, 121, 58, 32,
            40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32,
            61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 112, 108, 97, 121, 69, 118, 101,
            110, 116, 32, 61, 32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            114, 101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58,
            32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 80,
            108, 97, 121, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 58, 32, 112, 108, 97, 121, 69, 118, 101, 110, 116, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 115, 101,
            108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115, 112, 111, 110, 115,
            101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 112, 97, 117, 115, 101, 58, 32, 40, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 112, 97, 117, 115, 101, 69, 118, 101, 110, 116,
            32, 61, 32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101,
            115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 34, 34,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 80, 97, 117,
            115, 101, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 58, 32, 112, 97, 117, 115, 101, 69, 118, 101, 110, 116, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 115, 101,
            108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115, 112, 111, 110, 115,
            101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 116, 111, 112, 58, 32, 40, 105, 110, 115,
            116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 116, 111, 112, 69, 118, 101, 110, 116, 32, 61,
            32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 112,
            111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 34, 34, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 83, 116, 111, 112, 34,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 101, 118, 101, 110, 116, 58, 32, 115, 116, 111, 112, 69, 118, 101, 110, 116, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 115, 101, 108, 102, 46,
            112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10,
            32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 102, 114, 97, 109, 101, 58, 32, 40, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 102, 114, 97, 109, 101, 69, 118, 101, 110, 116, 32, 61, 32, 101,
            118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 112, 111,
            110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 34, 34, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 70, 114, 97, 109, 101, 34,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 32, 101, 118, 101, 110, 116, 58, 32, 102, 114, 97, 109, 101, 69, 118, 101, 110, 116, 10, 32, 32, 32, 32,
            32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 115, 101, 108, 102,
            46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115, 112, 111, 110, 115, 101, 41, 59,
            10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 114, 101, 110, 100, 101, 114, 58, 32, 40, 105, 110, 115,
            116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 110, 100, 101, 114, 69, 118, 101, 110,
            116, 32, 61, 32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114,
            101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32,
            34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 82, 101,
            110, 100, 101, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 58, 32, 114, 101, 110, 100, 101, 114, 69, 118, 101,
            110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32,
            32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115, 112,
            111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 102, 114, 101, 101, 122, 101,
            58, 32, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116,
            41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 102, 114, 101, 101, 122,
            101, 69, 118, 101, 110, 116, 32, 61, 32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 114, 101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 105, 100, 58, 32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32,
            34, 111, 110, 70, 114, 101, 101, 122, 101, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117,
            108, 116, 58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 58, 32, 102, 114, 101, 101,
            122, 101, 69, 118, 101, 110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125,
            59, 10, 32, 32, 32, 32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101,
            40, 114, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 117,
            110, 102, 114, 101, 101, 122, 101, 58, 32, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61,
            62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115,
            116, 32, 117, 110, 102, 114, 101, 101, 122, 101, 69, 118, 101, 110, 116, 32, 61, 32, 101, 118, 101, 110,
            116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 112, 111, 110, 115, 101, 32,
            61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111, 110, 85, 110, 102, 114, 101, 101, 122, 101, 34, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 58, 32, 123, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32,
            32, 101, 118, 101, 110, 116, 58, 32, 117, 110, 102, 114, 101, 101, 122, 101, 69, 118, 101, 110, 116, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 115, 101,
            108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 114, 101, 115, 112, 111, 110, 115,
            101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 100, 101, 115, 116, 114, 111, 121, 58, 32, 40,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 32, 61, 62, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 100, 101, 115, 116, 114, 111, 121, 69,
            118, 101, 110, 116, 32, 61, 32, 101, 118, 101, 110, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115,
            116, 32, 114, 101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            100, 58, 32, 34, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 34, 111,
            110, 68, 101, 115, 116, 114, 111, 121, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108,
            116, 58, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 58, 32, 100, 101, 115, 116, 114,
            111, 121, 69, 118, 101, 110, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 125,
            59, 10, 32, 32, 32, 32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101,
            40, 114, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32,
            32, 118, 97, 114, 32, 99, 111, 109, 109, 97, 110, 100, 115, 32, 61, 32, 123, 10, 32, 32, 32, 32, 103, 101,
            116, 68, 111, 116, 76, 111, 116, 116, 105, 101, 73, 110, 115, 116, 97, 110, 99, 101, 83, 116, 97, 116, 101,
            40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97,
            114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110,
            115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 116, 97,
            116, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 115, 76, 111, 97, 100, 101, 100, 58, 32,
            105, 110, 115, 116, 97, 110, 99, 101, 46, 105, 115, 76, 111, 97, 100, 101, 100, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 105, 115, 80, 97, 117, 115, 101, 100, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 105,
            115, 80, 97, 117, 115, 101, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 115, 80, 108, 97, 121, 105,
            110, 103, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 105, 115, 80, 108, 97, 121, 105, 110, 103, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 115, 83, 116, 111, 112, 112, 101, 100, 58, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 46, 105, 115, 83, 116, 111, 112, 112, 101, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            105, 115, 70, 114, 111, 122, 101, 110, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 105, 115, 70, 114,
            111, 122, 101, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 111, 111, 112, 58, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 46, 108, 111, 111, 112, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 111, 100, 101, 58,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 109, 111, 100, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            115, 112, 101, 101, 100, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 112, 101, 101, 100, 44, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 58, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 46, 99, 117, 114, 114, 101, 110, 116, 70, 114, 97, 109, 101, 44, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 111, 116, 97, 108, 70, 114, 97, 109, 101, 115, 58, 32, 105, 110, 115, 116, 97, 110,
            99, 101, 46, 116, 111, 116, 97, 108, 70, 114, 97, 109, 101, 115, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            100, 117, 114, 97, 116, 105, 111, 110, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 100, 117, 114, 97,
            116, 105, 111, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110,
            116, 101, 114, 112, 111, 108, 97, 116, 105, 111, 110, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 117,
            115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111, 110, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 58, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 46, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 44, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 109, 97, 114, 107, 101, 114, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 109,
            97, 114, 107, 101, 114, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 98, 97, 99, 107, 103, 114, 111, 117, 110,
            100, 67, 111, 108, 111, 114, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 98, 97, 99, 107, 103, 114,
            111, 117, 110, 100, 67, 111, 108, 111, 114, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 97, 114, 107, 101,
            114, 115, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 109, 97, 114, 107, 101, 114, 115, 40, 41, 44,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 99, 116, 105, 118, 101, 65, 110, 105, 109, 97, 116, 105, 111, 110,
            73, 100, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 97, 99, 116, 105, 118, 101, 65, 110, 105, 109,
            97, 116, 105, 111, 110, 73, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 99, 116, 105, 118, 101, 84,
            104, 101, 109, 101, 73, 100, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 97, 99, 116, 105, 118, 101,
            84, 104, 101, 109, 101, 73, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 97, 117, 116, 111, 112, 108, 97,
            121, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 97, 117, 116, 111, 112, 108, 97, 121, 44, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 115, 101, 103, 109, 101, 110, 116, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46,
            115, 101, 103, 109, 101, 110, 116, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 97, 121, 111, 117, 116, 58,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 108, 97, 121, 111, 117, 116, 44, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 115, 101, 103, 109, 101, 110, 116, 68, 117, 114, 97, 116, 105, 111, 110, 58, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 46, 115, 101, 103, 109, 101, 110, 116, 68, 117, 114, 97, 116, 105, 111, 110, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 105, 115, 82, 101, 97, 100, 121, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            46, 105, 115, 82, 101, 97, 100, 121, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 97, 110, 105, 102, 101,
            115, 116, 58, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 109, 97, 110, 105, 102, 101, 115, 116, 10, 32,
            32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 115, 116, 97, 116, 101, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32,
            125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 76, 97, 121, 111, 117, 116, 40, 114, 101, 113, 117, 101, 115,
            116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108, 97,
            121, 111, 117, 116, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 108,
            97, 121, 111, 117, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111,
            119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119,
            105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111,
            101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 76, 97, 121, 111, 117,
            116, 40, 108, 97, 121, 111, 117, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 117, 99, 99, 101, 115, 115, 58, 32, 116, 114, 117, 101, 10,
            32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 103, 101, 116, 83, 116,
            97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 76, 105, 115, 116, 101, 110, 101, 114, 115, 40, 114, 101, 113,
            117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115,
            46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97,
            112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97,
            110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 46, 103, 101, 116, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 76, 105, 115,
            116, 101, 110, 101, 114, 115, 40, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 112, 111, 115,
            116, 80, 111, 105, 110, 116, 101, 114, 68, 111, 119, 110, 69, 118, 101, 110, 116, 40, 114, 101, 113, 117,
            101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            120, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 120, 59, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 121, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97,
            114, 97, 109, 115, 46, 121, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111,
            119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119,
            105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111,
            101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 112,
            111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 68, 111, 119, 110, 69, 118, 101, 110, 116, 40, 120, 44, 32,
            121, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 112, 111, 115, 116, 80, 111, 105, 110, 116,
            101, 114, 69, 110, 116, 101, 114, 69, 118, 101, 110, 116, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100,
            32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 120, 32, 61, 32, 114,
            101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 120, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 121, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115,
            46, 121, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115,
            116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115,
            116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110,
            101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104,
            32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32,
            110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32,
            32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 112, 111, 115, 116,
            80, 111, 105, 110, 116, 101, 114, 69, 110, 116, 101, 114, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41,
            59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114,
            69, 120, 105, 116, 69, 118, 101, 110, 116, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114,
            101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 120, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 120, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 121, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 121, 59, 10, 32,
            32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101,
            73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114,
            111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120,
            105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116,
            117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 112, 111, 115, 116, 80, 111, 105, 110, 116,
            101, 114, 69, 120, 105, 116, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 125,
            44, 10, 32, 32, 32, 32, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 77, 111, 118, 101, 69, 118,
            101, 110, 116, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116,
            46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32,
            32, 32, 99, 111, 110, 115, 116, 32, 120, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114,
            97, 109, 115, 46, 120, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 121, 32, 61, 32, 114,
            101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 121, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110,
            115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 46, 112, 111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 77, 111, 118, 101, 69,
            118, 101, 110, 116, 40, 120, 44, 32, 121, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 112, 111,
            115, 116, 80, 111, 105, 110, 116, 101, 114, 85, 112, 69, 118, 101, 110, 116, 40, 114, 101, 113, 117, 101,
            115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105,
            110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 120,
            32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 120, 59, 10, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 116, 32, 121, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97,
            114, 97, 109, 115, 46, 121, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111,
            119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119,
            105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111,
            101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 112,
            111, 115, 116, 80, 111, 105, 110, 116, 101, 114, 85, 112, 69, 118, 101, 110, 116, 40, 120, 44, 32, 121, 41,
            59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 116, 97, 114, 116, 83, 116, 97, 116, 101, 77, 97,
            99, 104, 105, 110, 101, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115,
            116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111,
            114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105,
            110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105,
            115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 116, 97, 114, 116, 83, 116, 97, 116, 101, 77,
            97, 99, 104, 105, 110, 101, 40, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 116, 111, 112,
            83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32,
            61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110,
            99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105,
            110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105,
            110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119,
            32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105,
            116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101,
            115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10,
            32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115,
            116, 111, 112, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 40, 41, 59, 10, 32, 32, 32, 32, 125,
            44, 10, 32, 32, 32, 32, 108, 111, 97, 100, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 40, 114,
            101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97,
            109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 73, 100, 32, 61, 32, 114, 101, 113,
            117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110,
            101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110,
            115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32,
            110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116,
            104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115,
            32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32,
            32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 108, 111, 97,
            100, 83, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 40, 115, 116, 97, 116, 101, 77, 97, 99, 104,
            105, 110, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 108, 111, 97, 100, 83, 116,
            97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 68, 97, 116, 97, 40, 114, 101, 113, 117, 101, 115, 116, 41,
            32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116,
            97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 116, 97, 116,
            101, 77, 97, 99, 104, 105, 110, 101, 68, 97, 116, 97, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46,
            112, 97, 114, 97, 109, 115, 46, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110, 101, 68, 97, 116, 97, 59,
            10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32,
            105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99,
            101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69,
            114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32,
            36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32,
            101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 108, 111, 97, 100, 83, 116, 97, 116,
            101, 77, 97, 99, 104, 105, 110, 101, 68, 97, 116, 97, 40, 115, 116, 97, 116, 101, 77, 97, 99, 104, 105, 110,
            101, 68, 97, 116, 97, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 99, 114, 101, 97, 116, 101,
            58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115,
            116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 116, 32, 99, 111, 110, 102, 105, 103, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 99, 111, 110, 102, 105, 103, 59, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 119, 105, 100, 116, 104, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112,
            97, 114, 97, 109, 115, 46, 119, 105, 100, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 104, 101, 105, 103, 104, 116, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109,
            115, 46, 104, 101, 105, 103, 104, 116, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 105, 110, 115, 116,
            97, 110, 99, 101, 115, 77, 97, 112, 46, 104, 97, 115, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41,
            41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114,
            114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36,
            123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 97, 108, 114, 101, 97, 100, 121, 32, 101, 120,
            105, 115, 116, 115, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 110, 101, 119, 32, 68, 111, 116, 76,
            111, 116, 116, 105, 101, 40, 99, 111, 110, 102, 105, 103, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115,
            116, 97, 110, 99, 101, 46, 99, 97, 110, 118, 97, 115, 46, 104, 101, 105, 103, 104, 116, 32, 61, 32, 104,
            101, 105, 103, 104, 116, 59, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 99, 97,
            110, 118, 97, 115, 46, 119, 105, 100, 116, 104, 32, 61, 32, 119, 105, 100, 116, 104, 59, 10, 32, 32, 32, 32,
            32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 115, 101, 116, 40, 105, 110, 115, 116,
            97, 110, 99, 101, 73, 100, 44, 32, 105, 110, 115, 116, 97, 110, 99, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 101, 118, 101, 110, 116, 115, 32, 61, 32, 91, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 34, 99, 111, 109, 112, 108, 101, 116, 101, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 102, 114, 97,
            109, 101, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 108, 111, 97, 100, 34, 44, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 34, 108, 111, 97, 100, 69, 114, 114, 111, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34,
            108, 111, 111, 112, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 112, 97, 117, 115, 101, 34, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 34, 112, 108, 97, 121, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 115, 116,
            111, 112, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 100, 101, 115, 116, 114, 111, 121, 34, 44, 10, 32,
            32, 32, 32, 32, 32, 32, 32, 34, 102, 114, 101, 101, 122, 101, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32,
            34, 117, 110, 102, 114, 101, 101, 122, 101, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 114, 101, 110,
            100, 101, 114, 34, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 114, 101, 97, 100, 121, 34, 10, 32, 32, 32,
            32, 32, 32, 93, 59, 10, 32, 32, 32, 32, 32, 32, 101, 118, 101, 110, 116, 115, 46, 102, 111, 114, 69, 97, 99,
            104, 40, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 46, 97, 100, 100, 69, 118, 101, 110, 116, 76, 105, 115, 116, 101, 110, 101, 114,
            40, 101, 118, 101, 110, 116, 44, 32, 101, 118, 101, 110, 116, 72, 97, 110, 100, 108, 101, 114, 77, 97, 112,
            91, 101, 118, 101, 110, 116, 93, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 41, 59, 10, 32, 32,
            32, 32, 32, 32, 125, 41, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 10, 32, 32, 32, 32, 32, 32, 125, 59,
            10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 100, 101, 115, 116, 114, 111, 121, 58, 32, 40, 114, 101,
            113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97,
            114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 114, 101, 116, 117,
            114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 100, 101, 115, 116, 114,
            111, 121, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112,
            46, 100, 101, 108, 101, 116, 101, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32,
            32, 125, 44, 10, 32, 32, 32, 32, 102, 114, 101, 101, 122, 101, 58, 32, 40, 114, 101, 113, 117, 101, 115,
            116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115,
            46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97,
            112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97,
            110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 102, 114,
            101, 101, 122, 101, 40, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 108, 111, 97, 100, 58, 32,
            40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116,
            46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32,
            32, 32, 99, 111, 110, 115, 116, 32, 99, 111, 110, 102, 105, 103, 32, 61, 32, 114, 101, 113, 117, 101, 115,
            116, 46, 112, 97, 114, 97, 109, 115, 46, 99, 111, 110, 102, 105, 103, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110,
            115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46,
            108, 111, 97, 100, 40, 99, 111, 110, 102, 105, 103, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32,
            108, 111, 97, 100, 65, 110, 105, 109, 97, 116, 105, 111, 110, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116,
            41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            97, 110, 105, 109, 97, 116, 105, 111, 110, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112,
            97, 114, 97, 109, 115, 46, 97, 110, 105, 109, 97, 116, 105, 111, 110, 73, 100, 59, 10, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10,
            32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40,
            96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115,
            116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116,
            46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110,
            99, 101, 46, 108, 111, 97, 100, 65, 110, 105, 109, 97, 116, 105, 111, 110, 40, 97, 110, 105, 109, 97, 116,
            105, 111, 110, 73, 100, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 84, 104,
            101, 109, 101, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32,
            32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101,
            113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100,
            59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 116, 104, 101, 109, 101, 73, 100, 32, 61, 32,
            114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 116, 104, 101, 109, 101, 73, 100, 59,
            10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32,
            105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99,
            101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69,
            114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32,
            36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32,
            101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 84, 104, 101, 109,
            101, 40, 116, 104, 101, 109, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115,
            101, 116, 84, 104, 101, 109, 101, 68, 97, 116, 97, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32,
            61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 116, 104,
            101, 109, 101, 68, 97, 116, 97, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109,
            115, 46, 116, 104, 101, 109, 101, 68, 97, 116, 97, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97,
            112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97,
            110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 46, 115, 101, 116, 84, 104, 101, 109, 101, 68, 97, 116, 97, 40, 116, 104, 101, 109, 101,
            68, 97, 116, 97, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 112, 97, 117, 115, 101, 58, 32,
            40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116,
            46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32,
            32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123,
            10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114,
            40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115,
            116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114,
            110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 112, 97, 117, 115, 101, 40, 41, 59, 10, 32, 32, 32, 32,
            125, 44, 10, 32, 32, 32, 32, 112, 108, 97, 121, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115,
            116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115,
            116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101,
            116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32,
            40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104,
            114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101,
            32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32,
            100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 125, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            46, 112, 108, 97, 121, 40, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 114, 101, 115, 105, 122,
            101, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 119, 105, 100, 116, 104, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 119, 105, 100, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 104, 101, 105, 103, 104, 116, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46,
            112, 97, 114, 97, 109, 115, 46, 104, 101, 105, 103, 104, 116, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115,
            77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115,
            116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99,
            101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 99,
            97, 110, 118, 97, 115, 46, 104, 101, 105, 103, 104, 116, 32, 61, 32, 104, 101, 105, 103, 104, 116, 59, 10,
            32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 99, 97, 110, 118, 97, 115, 46, 119, 105,
            100, 116, 104, 32, 61, 32, 119, 105, 100, 116, 104, 59, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 46, 114, 101, 115, 105, 122, 101, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117,
            114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 117, 99, 99, 101, 115, 115, 58, 32, 116, 114,
            117, 101, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 101,
            116, 66, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 58, 32, 40, 114, 101, 113, 117,
            101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97,
            109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 32, 61, 32, 114, 101,
            113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100,
            67, 111, 108, 111, 114, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111,
            119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119,
            105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111,
            101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 66, 97, 99, 107, 103,
            114, 111, 117, 110, 100, 67, 111, 108, 111, 114, 40, 98, 97, 99, 107, 103, 114, 111, 117, 110, 100, 67, 111,
            108, 111, 114, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 70, 114, 97, 109,
            101, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 102, 114, 97, 109, 101, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 102, 114, 97, 109, 101, 59, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99,
            101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110,
            115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41,
            59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46,
            115, 101, 116, 70, 114, 97, 109, 101, 40, 102, 114, 97, 109, 101, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10,
            32, 32, 32, 32, 115, 101, 116, 77, 111, 100, 101, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61,
            62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115,
            116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 109, 111, 100,
            101, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 109, 111, 100, 101,
            59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97,
            110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119,
            32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105,
            100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111,
            116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 77, 111, 100, 101, 40, 109, 111, 100, 101, 41,
            59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 82, 101, 110, 100, 101, 114, 67, 111,
            110, 102, 105, 103, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101,
            113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100,
            59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102,
            105, 103, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 114, 101, 110,
            100, 101, 114, 67, 111, 110, 102, 105, 103, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105,
            110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46,
            103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105,
            102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116,
            104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99,
            101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125,
            32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32,
            32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 82, 101,
            110, 100, 101, 114, 67, 111, 110, 102, 105, 103, 40, 114, 101, 110, 100, 101, 114, 67, 111, 110, 102, 105,
            103, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 83, 101, 103, 109, 101, 110,
            116, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99,
            111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101,
            115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 115, 101, 103, 109, 101, 110, 116, 32, 61, 32, 114, 101, 113,
            117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 115, 101, 103, 109, 101, 110, 116, 59, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115,
            116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111,
            114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105,
            110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105,
            115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116,
            97, 110, 99, 101, 46, 115, 101, 116, 83, 101, 103, 109, 101, 110, 116, 40, 115, 101, 103, 109, 101, 110,
            116, 91, 48, 93, 44, 32, 115, 101, 103, 109, 101, 110, 116, 91, 49, 93, 41, 59, 10, 32, 32, 32, 32, 125, 44,
            10, 32, 32, 32, 32, 115, 101, 116, 83, 112, 101, 101, 100, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116,
            41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            115, 112, 101, 101, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46,
            115, 112, 101, 101, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33,
            105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111,
            119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119,
            105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111,
            101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125,
            10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 83, 112, 101, 101, 100,
            40, 115, 112, 101, 101, 100, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 85,
            115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111, 110, 58, 32, 40,
            114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115,
            116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46,
            112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 32, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108,
            97, 116, 105, 111, 110, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46,
            117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101, 114, 112, 111, 108, 97, 116, 105, 111, 110, 59, 10,
            32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105,
            110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99,
            101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99,
            101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69,
            114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32,
            36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32,
            101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105,
            110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 85, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101,
            114, 112, 111, 108, 97, 116, 105, 111, 110, 40, 117, 115, 101, 70, 114, 97, 109, 101, 73, 110, 116, 101,
            114, 112, 111, 108, 97, 116, 105, 111, 110, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115,
            101, 116, 87, 97, 115, 109, 85, 114, 108, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32,
            123, 10, 32, 32, 32, 32, 32, 32, 68, 111, 116, 76, 111, 116, 116, 105, 101, 46, 115, 101, 116, 87, 97, 115,
            109, 85, 114, 108, 40, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 117, 114, 108,
            41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 116, 111, 112, 58, 32, 40, 114, 101, 113, 117,
            101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110,
            115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97,
            109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115,
            77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32,
            32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115,
            116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99,
            101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59,
            10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115,
            116, 111, 112, 40, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 117, 110, 102, 114, 101, 101,
            122, 101, 58, 32, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32, 32, 32, 32,
            32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113,
            117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59,
            10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32,
            105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110,
            99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99,
            101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69,
            114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32,
            36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32,
            101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105,
            110, 115, 116, 97, 110, 99, 101, 46, 117, 110, 102, 114, 101, 101, 122, 101, 40, 41, 59, 10, 32, 32, 32, 32,
            125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 86, 105, 101, 119, 112, 111, 114, 116, 40, 114, 101, 113, 117,
            101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46,
            105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32,
            120, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 120, 59, 10, 32, 32,
            32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 121, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97,
            114, 97, 109, 115, 46, 121, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 119, 105, 100, 116,
            104, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 119, 105, 100, 116,
            104, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 104, 101, 105, 103, 104, 116, 32, 61, 32,
            114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 104, 101, 105, 103, 104, 116, 59, 10,
            32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105,
            110, 115, 116, 97, 110, 99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99,
            101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99,
            101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69,
            114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32,
            36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32,
            101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101, 116, 86, 105, 101, 119,
            112, 111, 114, 116, 40, 120, 44, 32, 121, 44, 32, 119, 105, 100, 116, 104, 44, 32, 104, 101, 105, 103, 104,
            116, 41, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32, 32, 115, 101, 116, 77, 97, 114, 107, 101, 114, 40,
            114, 101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 105,
            110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97, 114,
            97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111,
            110, 115, 116, 32, 109, 97, 114, 107, 101, 114, 32, 61, 32, 114, 101, 113, 117, 101, 115, 116, 46, 112, 97,
            114, 97, 109, 115, 46, 109, 97, 114, 107, 101, 114, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116,
            32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110, 99, 101, 115, 77, 97,
            112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10, 32, 32, 32, 32, 32,
            32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32,
            32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73, 110, 115, 116, 97,
            110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97, 110, 99, 101, 73,
            100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96, 41, 59, 10, 32,
            32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101, 46, 115, 101,
            116, 77, 97, 114, 107, 101, 114, 40, 109, 97, 114, 107, 101, 114, 41, 59, 10, 32, 32, 32, 32, 32, 32, 114,
            101, 116, 117, 114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 117, 99, 99, 101, 115, 115, 58,
            32, 116, 114, 117, 101, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 125, 44, 10, 32, 32, 32,
            32, 115, 101, 116, 76, 111, 111, 112, 40, 114, 101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 32, 61, 32, 114, 101,
            113, 117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100,
            59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 108, 111, 111, 112, 32, 61, 32, 114, 101, 113,
            117, 101, 115, 116, 46, 112, 97, 114, 97, 109, 115, 46, 108, 111, 111, 112, 59, 10, 32, 32, 32, 32, 32, 32,
            99, 111, 110, 115, 116, 32, 105, 110, 115, 116, 97, 110, 99, 101, 32, 61, 32, 105, 110, 115, 116, 97, 110,
            99, 101, 115, 77, 97, 112, 46, 103, 101, 116, 40, 105, 110, 115, 116, 97, 110, 99, 101, 73, 100, 41, 59, 10,
            32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 33, 105, 110, 115, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32,
            32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 73,
            110, 115, 116, 97, 110, 99, 101, 32, 119, 105, 116, 104, 32, 105, 100, 32, 36, 123, 105, 110, 115, 116, 97,
            110, 99, 101, 73, 100, 125, 32, 100, 111, 101, 115, 32, 110, 111, 116, 32, 101, 120, 105, 115, 116, 46, 96,
            41, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 32, 32, 105, 110, 115, 116, 97, 110, 99, 101,
            46, 115, 101, 116, 76, 111, 111, 112, 40, 108, 111, 111, 112, 41, 59, 10, 32, 32, 32, 32, 32, 32, 114, 101,
            116, 117, 114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 117, 99, 99, 101, 115, 115, 58, 32,
            116, 114, 117, 101, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10,
            32, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 101, 120, 101, 99, 117, 116, 101, 67, 111, 109, 109, 97,
            110, 100, 40, 114, 112, 99, 82, 101, 113, 117, 101, 115, 116, 41, 32, 123, 10, 32, 32, 32, 32, 99, 111, 110,
            115, 116, 32, 109, 101, 116, 104, 111, 100, 32, 61, 32, 114, 112, 99, 82, 101, 113, 117, 101, 115, 116, 46,
            109, 101, 116, 104, 111, 100, 59, 10, 32, 32, 32, 32, 105, 102, 32, 40, 116, 121, 112, 101, 111, 102, 32,
            99, 111, 109, 109, 97, 110, 100, 115, 91, 109, 101, 116, 104, 111, 100, 93, 32, 61, 61, 61, 32, 34, 102,
            117, 110, 99, 116, 105, 111, 110, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110,
            32, 99, 111, 109, 109, 97, 110, 100, 115, 91, 109, 101, 116, 104, 111, 100, 93, 40, 114, 112, 99, 82, 101,
            113, 117, 101, 115, 116, 41, 59, 10, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32,
            32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 77, 101, 116,
            104, 111, 100, 32, 36, 123, 109, 101, 116, 104, 111, 100, 125, 32, 105, 115, 32, 110, 111, 116, 32, 105,
            109, 112, 108, 101, 109, 101, 110, 116, 101, 100, 32, 105, 110, 32, 99, 111, 109, 109, 97, 110, 100, 115,
            46, 96, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 10, 32, 32, 115, 101, 108, 102, 46, 111, 110, 109,
            101, 115, 115, 97, 103, 101, 32, 61, 32, 40, 101, 118, 101, 110, 116, 41, 32, 61, 62, 32, 123, 10, 32, 32,
            32, 32, 116, 114, 121, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101, 115, 117,
            108, 116, 32, 61, 32, 101, 120, 101, 99, 117, 116, 101, 67, 111, 109, 109, 97, 110, 100, 40, 101, 118, 101,
            110, 116, 46, 100, 97, 116, 97, 41, 59, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 114, 101,
            115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 100, 58, 32, 101,
            118, 101, 110, 116, 46, 100, 97, 116, 97, 46, 105, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 109, 101,
            116, 104, 111, 100, 58, 32, 101, 118, 101, 110, 116, 46, 100, 97, 116, 97, 46, 109, 101, 116, 104, 111, 100,
            44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 115, 117, 108, 116, 10, 32, 32, 32, 32, 32, 32, 125, 59,
            10, 32, 32, 32, 32, 32, 32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40,
            114, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 32, 99, 97, 116, 99, 104, 32, 40,
            101, 114, 114, 111, 114, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 99, 111, 110, 115, 116, 32, 101, 114, 114,
            111, 114, 82, 101, 115, 112, 111, 110, 115, 101, 32, 61, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105,
            100, 58, 32, 101, 118, 101, 110, 116, 46, 100, 97, 116, 97, 46, 105, 100, 44, 10, 32, 32, 32, 32, 32, 32,
            32, 32, 109, 101, 116, 104, 111, 100, 58, 32, 101, 118, 101, 110, 116, 46, 100, 97, 116, 97, 46, 109, 101,
            116, 104, 111, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 101, 114, 114, 111, 114, 58, 32, 101, 114, 114,
            111, 114, 46, 109, 101, 115, 115, 97, 103, 101, 10, 32, 32, 32, 32, 32, 32, 125, 59, 10, 32, 32, 32, 32, 32,
            32, 115, 101, 108, 102, 46, 112, 111, 115, 116, 77, 101, 115, 115, 97, 103, 101, 40, 101, 114, 114, 111,
            114, 82, 101, 115, 112, 111, 110, 115, 101, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 59, 10, 32,
            32, 118, 97, 114, 32, 100, 117, 109, 109, 121, 32, 61, 32, 34, 34, 59, 10, 32, 32, 118, 97, 114, 32, 100,
            111, 116, 108, 111, 116, 116, 105, 101, 95, 119, 111, 114, 107, 101, 114, 95, 100, 101, 102, 97, 117, 108,
            116, 32, 61, 32, 100, 117, 109, 109, 121, 59, 10, 125, 41, 40, 41, 59, 10,
          ]),
        ],
        { type: 'application/javascript' },
      ),
      i = URL.createObjectURL(n),
      d = new Worker(i);
    return URL.revokeObjectURL(i), d;
  }
};
var v3 = P2;
var G1 = class {
  constructor() {
    _(this, '_workers', /* @__PURE__ */ new Map());
    _(this, '_animationWorkerMap', /* @__PURE__ */ new Map());
  }
  getWorker(n) {
    return this._workers.has(n) || this._workers.set(n, new v3()), this._workers.get(n);
  }
  assignAnimationToWorker(n, i) {
    this._animationWorkerMap.set(n, i);
  }
  unassignAnimationFromWorker(n) {
    this._animationWorkerMap.delete(n);
  }
  sendMessage(n, i, d) {
    this.getWorker(n).postMessage(i, d || []);
  }
  terminateWorker(n) {
    let i = this._workers.get(n);
    i && (i.terminate(), this._workers.delete(n));
  }
};
function m3(c) {
  if (c instanceof OffscreenCanvas) return { width: c.width, height: c.height };
  let { height: n, width: i } = c.getBoundingClientRect();
  return { width: i * window.devicePixelRatio, height: n * window.devicePixelRatio };
}
function _3() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
var Y = class Y2 {
  constructor(n) {
    _(this, '_eventManager', new u1());
    _(this, '_id');
    _(this, '_worker');
    _(this, '_canvas');
    _(this, '_dotLottieInstanceState', {
      markers: [],
      autoplay: false,
      backgroundColor: '',
      currentFrame: 0,
      duration: 0,
      loop: false,
      mode: 'forward',
      segment: [0, 0],
      segmentDuration: 0,
      speed: 1,
      totalFrames: 0,
      isLoaded: false,
      isPlaying: false,
      isPaused: false,
      isStopped: true,
      isFrozen: false,
      useFrameInterpolation: false,
      renderConfig: { devicePixelRatio: a1() },
      activeAnimationId: '',
      activeThemeId: '',
      layout: void 0,
      marker: void 0,
      isReady: false,
      manifest: null,
    });
    _(this, '_created', false);
    _(this, '_pointerUpMethod');
    _(this, '_pointerDownMethod');
    _(this, '_pointerMoveMethod');
    _(this, '_pointerEnterMethod');
    _(this, '_pointerExitMethod');
    var d, s, m;
    (this._canvas = n.canvas), (this._id = `dotlottie-${_3()}`);
    let i = n.workerId || 'defaultWorker';
    (this._worker = Y2._workerManager.getWorker(i)),
      Y2._workerManager.assignAnimationToWorker(this._id, i),
      Y2._wasmUrl && this._sendMessage('setWasmUrl', { url: Y2._wasmUrl }),
      this._create(
        k(x({}, n), {
          renderConfig: k(x({}, n.renderConfig), {
            devicePixelRatio: ((d = n.renderConfig) == null ? void 0 : d.devicePixelRatio) || a1(),
            freezeOnOffscreen: (m = (s = n.renderConfig) == null ? void 0 : s.freezeOnOffscreen) != null ? m : true,
          }),
        }),
      ),
      this._worker.addEventListener('message', this._handleWorkerEvent.bind(this)),
      (this._pointerUpMethod = this._onPointerUp.bind(this)),
      (this._pointerDownMethod = this._onPointerDown.bind(this)),
      (this._pointerMoveMethod = this._onPointerMove.bind(this)),
      (this._pointerEnterMethod = this._onPointerEnter.bind(this)),
      (this._pointerExitMethod = this._onPointerLeave.bind(this));
  }
  _handleWorkerEvent(n) {
    return g(this, null, function* () {
      let i = n.data;
      i.id ||
        (i.method === 'onLoad' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(),
          this._eventManager.dispatch(i.result.event),
          R &&
            this._canvas instanceof HTMLCanvasElement &&
            (this._dotLottieInstanceState.renderConfig.freezeOnOffscreen && W.observe(this._canvas, this),
            this._dotLottieInstanceState.renderConfig.autoResize && $.observe(this._canvas, this))),
        i.method === 'onComplete' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(), this._eventManager.dispatch(i.result.event)),
        i.method === 'onDestroy' && i.result.instanceId === this._id && this._eventManager.dispatch(i.result.event),
        i.method === 'onUnfreeze' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(),
          (this._dotLottieInstanceState.isFrozen = false),
          this._eventManager.dispatch(i.result.event)),
        i.method === 'onFrame' &&
          i.result.instanceId === this._id &&
          ((this._dotLottieInstanceState.currentFrame = i.result.event.currentFrame),
          this._eventManager.dispatch(i.result.event)),
        i.method === 'onRender' && i.result.instanceId === this._id && this._eventManager.dispatch(i.result.event),
        i.method === 'onFreeze' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(), this._eventManager.dispatch(i.result.event)),
        i.method === 'onPause' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(), this._eventManager.dispatch(i.result.event)),
        i.method === 'onPlay' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(), this._eventManager.dispatch(i.result.event)),
        i.method === 'onStop' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(), this._eventManager.dispatch(i.result.event)),
        i.method === 'onLoadError' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(), this._eventManager.dispatch(i.result.event)),
        i.method === 'onReady' &&
          i.result.instanceId === this._id &&
          (yield this._updateDotLottieInstanceState(), this._eventManager.dispatch(i.result.event)));
    });
  }
  _create(n) {
    return g(this, null, function* () {
      let i;
      this._canvas instanceof HTMLCanvasElement ? (i = this._canvas.transferControlToOffscreen()) : (i = this._canvas);
      let { instanceId: d } = yield this._sendMessage(
        'create',
        x({ instanceId: this._id, config: k(x({}, n), { canvas: i }) }, m3(this._canvas)),
        [i],
      );
      if (d !== this._id) throw new Error('Instance ID mismatch');
      (this._created = true), yield this._updateDotLottieInstanceState();
    });
  }
  get isLoaded() {
    return this._dotLottieInstanceState.isLoaded;
  }
  get isPlaying() {
    return this._dotLottieInstanceState.isPlaying;
  }
  get isPaused() {
    return this._dotLottieInstanceState.isPaused;
  }
  get isStopped() {
    return this._dotLottieInstanceState.isStopped;
  }
  get currentFrame() {
    return this._dotLottieInstanceState.currentFrame;
  }
  get isFrozen() {
    return this._dotLottieInstanceState.isFrozen;
  }
  get segmentDuration() {
    return this._dotLottieInstanceState.segmentDuration;
  }
  get totalFrames() {
    return this._dotLottieInstanceState.totalFrames;
  }
  get segment() {
    return this._dotLottieInstanceState.segment;
  }
  get speed() {
    return this._dotLottieInstanceState.speed;
  }
  get duration() {
    return this._dotLottieInstanceState.duration;
  }
  get isReady() {
    return this._dotLottieInstanceState.isReady;
  }
  get mode() {
    return this._dotLottieInstanceState.mode;
  }
  get canvas() {
    return this._canvas;
  }
  get autoplay() {
    return this._dotLottieInstanceState.autoplay;
  }
  get backgroundColor() {
    return this._dotLottieInstanceState.backgroundColor;
  }
  get loop() {
    return this._dotLottieInstanceState.loop;
  }
  get useFrameInterpolation() {
    return this._dotLottieInstanceState.useFrameInterpolation;
  }
  get renderConfig() {
    return this._dotLottieInstanceState.renderConfig;
  }
  get manifest() {
    return this._dotLottieInstanceState.manifest;
  }
  get activeAnimationId() {
    return this._dotLottieInstanceState.activeAnimationId;
  }
  get marker() {
    return this._dotLottieInstanceState.marker;
  }
  get activeThemeId() {
    return this._dotLottieInstanceState.activeThemeId;
  }
  get layout() {
    return this._dotLottieInstanceState.layout;
  }
  play() {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('play', { instanceId: this._id }),
        yield this._updateDotLottieInstanceState(),
        R &&
          this._canvas instanceof HTMLCanvasElement &&
          this._dotLottieInstanceState.renderConfig.freezeOnOffscreen &&
          !N1(this._canvas) &&
          (yield this.freeze()));
    });
  }
  pause() {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('pause', { instanceId: this._id }), yield this._updateDotLottieInstanceState());
    });
  }
  stop() {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('stop', { instanceId: this._id }), yield this._updateDotLottieInstanceState());
    });
  }
  setSpeed(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setSpeed', { instanceId: this._id, speed: n }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setMode(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setMode', { instanceId: this._id, mode: n }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setFrame(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setFrame', { frame: n, instanceId: this._id }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setSegment(n, i) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setSegment', { instanceId: this._id, segment: [n, i] }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setRenderConfig(n) {
    return g(this, null, function* () {
      if (!this._created) return;
      let m = n,
        { devicePixelRatio: i, freezeOnOffscreen: d } = m,
        s = H1(m, ['devicePixelRatio', 'freezeOnOffscreen']);
      yield this._sendMessage('setRenderConfig', {
        instanceId: this._id,
        renderConfig: k(x(x({}, this._dotLottieInstanceState.renderConfig), s), {
          devicePixelRatio: i || a1(),
          freezeOnOffscreen: d != null ? d : true,
        }),
      }),
        yield this._updateDotLottieInstanceState(),
        R &&
          this._canvas instanceof HTMLCanvasElement &&
          (this._dotLottieInstanceState.renderConfig.autoResize
            ? $.observe(this._canvas, this)
            : $.unobserve(this._canvas),
          this._dotLottieInstanceState.renderConfig.freezeOnOffscreen
            ? W.observe(this._canvas, this)
            : (W.unobserve(this._canvas), this._dotLottieInstanceState.isFrozen && (yield this.unfreeze())));
    });
  }
  setUseFrameInterpolation(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setUseFrameInterpolation', { instanceId: this._id, useFrameInterpolation: n }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setTheme(n) {
    return g(this, null, function* () {
      if (!this._created) return false;
      let i = this._sendMessage('setTheme', { instanceId: this._id, themeId: n });
      return yield this._updateDotLottieInstanceState(), i;
    });
  }
  load(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('load', { config: n, instanceId: this._id }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setLoop(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setLoop', { instanceId: this._id, loop: n }),
        yield this._updateDotLottieInstanceState());
    });
  }
  resize() {
    return g(this, null, function* () {
      if (!this._created) return;
      let { height: n, width: i } = m3(this._canvas);
      yield this._sendMessage('resize', { height: n, instanceId: this._id, width: i }),
        yield this._updateDotLottieInstanceState();
    });
  }
  destroy() {
    return g(this, null, function* () {
      this._created &&
        ((this._created = false),
        yield this._sendMessage('destroy', { instanceId: this._id }),
        this._cleanupStateMachineListeners(),
        Y2._workerManager.unassignAnimationFromWorker(this._id),
        this._eventManager.removeAllEventListeners(),
        R && this._canvas instanceof HTMLCanvasElement && (W.unobserve(this._canvas), $.unobserve(this._canvas)));
    });
  }
  freeze() {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('freeze', { instanceId: this._id }), yield this._updateDotLottieInstanceState());
    });
  }
  unfreeze() {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('unfreeze', { instanceId: this._id }), yield this._updateDotLottieInstanceState());
    });
  }
  setBackgroundColor(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setBackgroundColor', { instanceId: this._id, backgroundColor: n }),
        yield this._updateDotLottieInstanceState());
    });
  }
  loadAnimation(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('loadAnimation', { animationId: n, instanceId: this._id }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setLayout(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setLayout', { instanceId: this._id, layout: n }),
        yield this._updateDotLottieInstanceState());
    });
  }
  _updateDotLottieInstanceState() {
    return g(this, null, function* () {
      if (!this._created) return;
      let n = yield this._sendMessage('getDotLottieInstanceState', { instanceId: this._id });
      this._dotLottieInstanceState = n.state;
    });
  }
  markers() {
    return this._dotLottieInstanceState.markers;
  }
  setMarker(n) {
    return g(this, null, function* () {
      this._created &&
        (yield this._sendMessage('setMarker', { instanceId: this._id, marker: n }),
        yield this._updateDotLottieInstanceState());
    });
  }
  setThemeData(n) {
    return g(this, null, function* () {
      if (!this._created) return false;
      let i = yield this._sendMessage('setThemeData', { instanceId: this._id, themeData: n });
      return yield this._updateDotLottieInstanceState(), i;
    });
  }
  setViewport(n, i, d, s) {
    return g(this, null, function* () {
      return this._created
        ? this._sendMessage('setViewport', { x: n, y: i, width: d, height: s, instanceId: this._id })
        : false;
    });
  }
  _sendMessage(n, i, d) {
    return g(this, null, function* () {
      let s = { id: `dotlottie-request-${_3()}`, method: n, params: i };
      return (
        this._worker.postMessage(s, d || []),
        new Promise((m, w) => {
          let C = (I) => {
            let A = I.data;
            A.id === s.id &&
              (this._worker.removeEventListener('message', C),
              A.error ? w(new Error(`Failed to execute method ${n}: ${A.error}`)) : m(A.result));
          };
          this._worker.addEventListener('message', C);
        })
      );
    });
  }
  addEventListener(n, i) {
    this._eventManager.addEventListener(n, i);
  }
  removeEventListener(n, i) {
    this._eventManager.removeEventListener(n, i);
  }
  static setWasmUrl(n) {
    Y2._wasmUrl = n;
  }
  loadStateMachine(n) {
    return g(this, null, function* () {
      if (!this._created) return false;
      let i = yield this._sendMessage('loadStateMachine', { instanceId: this._id, stateMachineId: n });
      return yield this._updateDotLottieInstanceState(), i;
    });
  }
  loadStateMachineData(n) {
    return g(this, null, function* () {
      if (!this._created) return false;
      let i = yield this._sendMessage('loadStateMachineData', { instanceId: this._id, stateMachineData: n });
      return yield this._updateDotLottieInstanceState(), i;
    });
  }
  startStateMachine() {
    return g(this, null, function* () {
      if (!this._created) return false;
      this._setupStateMachineListeners();
      let n = yield this._sendMessage('startStateMachine', { instanceId: this._id });
      return yield this._updateDotLottieInstanceState(), n;
    });
  }
  stopStateMachine() {
    return g(this, null, function* () {
      return this._created
        ? (this._cleanupStateMachineListeners(), this._sendMessage('stopStateMachine', { instanceId: this._id }))
        : false;
    });
  }
  getStateMachineListeners() {
    return g(this, null, function* () {
      return this._created ? this._sendMessage('getStateMachineListeners', { instanceId: this._id }) : [];
    });
  }
  _getPointerPosition(n) {
    let i = this._canvas.getBoundingClientRect(),
      d = this._canvas.width / i.width,
      s = this._canvas.height / i.height,
      m = this._dotLottieInstanceState.renderConfig.devicePixelRatio || window.devicePixelRatio || 1,
      w = ((n.clientX - i.left) * d) / m,
      C = ((n.clientY - i.top) * s) / m;
    return { x: w, y: C };
  }
  _onPointerUp(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this._sendMessage('postPointerUpEvent', { instanceId: this._id, x: i, y: d });
  }
  _onPointerDown(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this._sendMessage('postPointerDownEvent', { instanceId: this._id, x: i, y: d });
  }
  _onPointerMove(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this._sendMessage('postPointerMoveEvent', { instanceId: this._id, x: i, y: d });
  }
  _onPointerEnter(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this._sendMessage('postPointerEnterEvent', { instanceId: this._id, x: i, y: d });
  }
  _onPointerLeave(n) {
    let { x: i, y: d } = this._getPointerPosition(n);
    this._sendMessage('postPointerExitEvent', { instanceId: this._id, x: i, y: d });
  }
  _setupStateMachineListeners() {
    return g(this, null, function* () {
      if (R && this._canvas instanceof HTMLCanvasElement && this.isLoaded) {
        let n = yield this._sendMessage('getStateMachineListeners', { instanceId: this._id });
        n.includes('PointerUp') && this._canvas.addEventListener('pointerup', this._pointerUpMethod),
          n.includes('PointerDown') && this._canvas.addEventListener('pointerdown', this._pointerDownMethod),
          n.includes('PointerMove') && this._canvas.addEventListener('pointermove', this._pointerMoveMethod),
          n.includes('PointerEnter') && this._canvas.addEventListener('pointerenter', this._pointerEnterMethod),
          n.includes('PointerExit') && this._canvas.addEventListener('pointerleave', this._pointerExitMethod);
      }
    });
  }
  _cleanupStateMachineListeners() {
    R &&
      this._canvas instanceof HTMLCanvasElement &&
      (this._canvas.removeEventListener('pointerup', this._pointerUpMethod),
      this._canvas.removeEventListener('pointerdown', this._pointerDownMethod),
      this._canvas.removeEventListener('pointermove', this._pointerMoveMethod),
      this._canvas.removeEventListener('pointerenter', this._pointerEnterMethod),
      this._canvas.removeEventListener('pointerleave', this._pointerExitMethod));
  }
};
_(Y, '_workerManager', new G1()), _(Y, '_wasmUrl', '');
var g3 = Y;
function DotLottieComponent(_a) {
  var _b = _a,
    { children, className = '', setCanvasRef, setContainerRef, style } = _b,
    rest = __objRest(_b, ['children', 'className', 'setCanvasRef', 'setContainerRef', 'style']);
  const containerStyle = __spreadValues(
    {
      width: '100%',
      height: '100%',
      lineHeight: 0,
    },
    style,
  );
  return /* @__PURE__ */ React.createElement(
    'div',
    __spreadValues({ ref: setContainerRef, className }, !className && { style: containerStyle }),
    /* @__PURE__ */ React.createElement(
      'canvas',
      __spreadValues(
        {
          ref: setCanvasRef,
          style: {
            width: '100%',
            height: '100%',
          },
        },
        rest,
      ),
      children,
    ),
  );
}
var useDotLottie = (config) => {
  const [dotLottie, setDotLottie] = useState(null);
  const dotLottieRef = useRef(null);
  const configRef = useRef(config);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  dotLottieRef.current = dotLottie;
  configRef.current = config;
  const hoverHandler = useCallback((event) => {
    var _a, _b;
    if (
      !((_a = configRef.current) == null ? void 0 : _a.playOnHover) ||
      !((_b = dotLottieRef.current) == null ? void 0 : _b.isLoaded)
    )
      return;
    if (event.type === 'mouseenter') {
      dotLottieRef.current.play();
    } else if (event.type === 'mouseleave') {
      dotLottieRef.current.pause();
    }
  }, []);
  const setCanvasRef = useCallback((canvas) => {
    canvasRef.current = canvas;
  }, []);
  const setContainerRef = useCallback((container) => {
    containerRef.current = container;
  }, []);
  const Component = useCallback(
    (props) => {
      return /* @__PURE__ */ React.createElement(
        DotLottieComponent,
        __spreadValues({ setContainerRef, setCanvasRef }, props),
      );
    },
    [setCanvasRef, setContainerRef],
  );
  useEffect(() => {
    const canvas = canvasRef.current;
    let dotLottieInstance = null;
    if (canvas) {
      dotLottieInstance = new f3(
        __spreadProps(__spreadValues({}, configRef.current), {
          canvas,
        }),
      );
      canvas.addEventListener('mouseenter', hoverHandler);
      canvas.addEventListener('mouseleave', hoverHandler);
      setDotLottie(dotLottieInstance);
    }
    return () => {
      dotLottieInstance == null ? void 0 : dotLottieInstance.destroy();
      setDotLottie(null);
      canvas == null ? void 0 : canvas.removeEventListener('mouseenter', hoverHandler);
      canvas == null ? void 0 : canvas.removeEventListener('mouseleave', hoverHandler);
    };
  }, [hoverHandler]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.speed) === 'number' && config.speed !== dotLottieRef.current.speed) {
      dotLottieRef.current.setSpeed(config.speed);
    }
  }, [config == null ? void 0 : config.speed]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.mode) === 'string' && config.mode !== dotLottieRef.current.mode) {
      dotLottieRef.current.setMode(config.mode);
    }
  }, [config == null ? void 0 : config.mode]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.loop) === 'boolean' && config.loop !== dotLottieRef.current.loop) {
      dotLottieRef.current.setLoop(config.loop);
    }
  }, [config == null ? void 0 : config.loop]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      typeof (config == null ? void 0 : config.useFrameInterpolation) === 'boolean' &&
      config.useFrameInterpolation !== dotLottieRef.current.useFrameInterpolation
    ) {
      dotLottieRef.current.setUseFrameInterpolation(config.useFrameInterpolation);
    }
  }, [config == null ? void 0 : config.useFrameInterpolation]);
  useEffect(() => {
    var _a, _b;
    if (!dotLottieRef.current) return;
    const startFrame = (_a = config == null ? void 0 : config.segment) == null ? void 0 : _a[0];
    const endFrame = (_b = config == null ? void 0 : config.segment) == null ? void 0 : _b[1];
    if (typeof startFrame === 'number' && typeof endFrame === 'number') {
      dotLottieRef.current.setSegment(startFrame, endFrame);
    }
  }, [config == null ? void 0 : config.segment]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      typeof (config == null ? void 0 : config.backgroundColor) === 'string' &&
      config.backgroundColor !== dotLottieRef.current.backgroundColor
    ) {
      dotLottieRef.current.setBackgroundColor(config.backgroundColor);
    }
  }, [config == null ? void 0 : config.backgroundColor]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.renderConfig) === 'object') {
      dotLottieRef.current.setRenderConfig(config.renderConfig);
    }
  }, [JSON.stringify(config == null ? void 0 : config.renderConfig)]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      typeof (config == null ? void 0 : config.data) === 'string' ||
      (config == null ? void 0 : config.data) instanceof ArrayBuffer
    ) {
      dotLottieRef.current.load(
        __spreadValues(
          {
            data: config.data,
          },
          configRef.current || {},
        ),
      );
    }
  }, [config == null ? void 0 : config.data]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.src) === 'string') {
      dotLottieRef.current.load(
        __spreadValues(
          {
            src: config.src,
          },
          configRef.current || {},
        ),
      );
    }
  }, [config == null ? void 0 : config.src]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.marker) === 'string') {
      dotLottieRef.current.setMarker(config.marker);
    }
  }, [config == null ? void 0 : config.marker]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      dotLottieRef.current.isLoaded &&
      (config == null ? void 0 : config.animationId) &&
      dotLottieRef.current.activeAnimationId !== config.animationId
    ) {
      dotLottieRef.current.loadAnimation(config.animationId);
    }
  }, [config == null ? void 0 : config.animationId]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      dotLottieRef.current.isLoaded &&
      dotLottieRef.current.activeThemeId !== (config == null ? void 0 : config.themeId)
    ) {
      dotLottieRef.current.setTheme((config == null ? void 0 : config.themeId) || '');
    }
  }, [config == null ? void 0 : config.themeId]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (dotLottieRef.current.isLoaded) {
      dotLottieRef.current.setThemeData((config == null ? void 0 : config.themeData) || '');
    }
  }, [config == null ? void 0 : config.themeData]);
  return {
    dotLottie,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef.current,
    container: containerRef.current,
    DotLottieComponent: Component,
  };
};
var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
function useStableCallback(callback) {
  const callbackContainer = useRef(callback);
  useIsomorphicLayoutEffect(() => {
    callbackContainer.current = callback;
  });
  return useCallback((...args) => callbackContainer.current(...args), [callbackContainer]);
}

// src/dotlottie.tsx
var DotLottieReact = (_a) => {
  var _b = _a,
    {
      animationId,
      autoplay,
      backgroundColor,
      data,
      dotLottieRefCallback,
      loop,
      marker,
      mode,
      playOnHover,
      renderConfig,
      segment,
      speed,
      src,
      themeData,
      themeId,
      useFrameInterpolation,
    } = _b,
    props = __objRest(_b, [
      'animationId',
      'autoplay',
      'backgroundColor',
      'data',
      'dotLottieRefCallback',
      'loop',
      'marker',
      'mode',
      'playOnHover',
      'renderConfig',
      'segment',
      'speed',
      'src',
      'themeData',
      'themeId',
      'useFrameInterpolation',
    ]);
  const { DotLottieComponent: DotLottieComponent2, dotLottie } = useDotLottie({
    data,
    mode,
    speed,
    src,
    autoplay,
    loop,
    segment,
    renderConfig,
    backgroundColor,
    useFrameInterpolation,
    playOnHover,
    marker,
    themeId,
    animationId,
    themeData,
  });
  const stableDotLottieRefCallback =
    typeof dotLottieRefCallback === 'function' ? useStableCallback(dotLottieRefCallback) : void 0;
  React.useEffect(() => {
    if (typeof stableDotLottieRefCallback === 'function') {
      stableDotLottieRefCallback(dotLottie);
    }
  }, [stableDotLottieRefCallback, dotLottie]);
  return /* @__PURE__ */ React.createElement(DotLottieComponent2, __spreadValues({}, props));
};
function DotLottieWorkerComponent(_a) {
  var _b = _a,
    { children, className = '', setCanvasRef, setContainerRef, style } = _b,
    rest = __objRest(_b, ['children', 'className', 'setCanvasRef', 'setContainerRef', 'style']);
  const containerStyle = __spreadValues(
    {
      width: '100%',
      height: '100%',
      lineHeight: 0,
    },
    style,
  );
  return /* @__PURE__ */ React.createElement(
    'div',
    __spreadValues({ ref: setContainerRef, className }, !className && { style: containerStyle }),
    /* @__PURE__ */ React.createElement(
      'canvas',
      __spreadValues(
        {
          ref: setCanvasRef,
          style: {
            width: '100%',
            height: '100%',
          },
        },
        rest,
      ),
      children,
    ),
  );
}
var useDotLottieWorker = (config) => {
  const [dotLottie, setDotLottie] = useState(null);
  const dotLottieRef = useRef(null);
  const configRef = useRef(config);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  dotLottieRef.current = dotLottie;
  configRef.current = config;
  const hoverHandler = useCallback((event) => {
    var _a, _b;
    if (
      !((_a = configRef.current) == null ? void 0 : _a.playOnHover) ||
      !((_b = dotLottieRef.current) == null ? void 0 : _b.isLoaded)
    )
      return;
    if (event.type === 'mouseenter') {
      dotLottieRef.current.play();
    } else if (event.type === 'mouseleave') {
      dotLottieRef.current.pause();
    }
  }, []);
  const setCanvasRef = useCallback((canvas) => {
    canvasRef.current = canvas;
  }, []);
  const setContainerRef = useCallback((container) => {
    containerRef.current = container;
  }, []);
  const Component = useCallback(
    (props) => {
      return /* @__PURE__ */ React.createElement(
        DotLottieWorkerComponent,
        __spreadValues({ setContainerRef, setCanvasRef }, props),
      );
    },
    [setCanvasRef, setContainerRef],
  );
  useEffect(() => {
    const canvas = canvasRef.current;
    let dotLottieInstance = null;
    if (canvas) {
      dotLottieInstance = new g3(
        __spreadProps(__spreadValues({}, configRef.current), {
          canvas,
        }),
      );
      canvas.addEventListener('mouseenter', hoverHandler);
      canvas.addEventListener('mouseleave', hoverHandler);
      setDotLottie(dotLottieInstance);
    }
    return () => {
      dotLottieInstance == null ? void 0 : dotLottieInstance.destroy();
      setDotLottie(null);
      canvas == null ? void 0 : canvas.removeEventListener('mouseenter', hoverHandler);
      canvas == null ? void 0 : canvas.removeEventListener('mouseleave', hoverHandler);
    };
  }, [hoverHandler]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.speed) === 'number' && config.speed !== dotLottieRef.current.speed) {
      dotLottieRef.current.setSpeed(config.speed);
    }
  }, [config == null ? void 0 : config.speed]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.mode) === 'string' && config.mode !== dotLottieRef.current.mode) {
      dotLottieRef.current.setMode(config.mode);
    }
  }, [config == null ? void 0 : config.mode]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.loop) === 'boolean' && config.loop !== dotLottieRef.current.loop) {
      dotLottieRef.current.setLoop(config.loop);
    }
  }, [config == null ? void 0 : config.loop]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      typeof (config == null ? void 0 : config.useFrameInterpolation) === 'boolean' &&
      config.useFrameInterpolation !== dotLottieRef.current.useFrameInterpolation
    ) {
      dotLottieRef.current.setUseFrameInterpolation(config.useFrameInterpolation);
    }
  }, [config == null ? void 0 : config.useFrameInterpolation]);
  useEffect(() => {
    var _a, _b;
    if (!dotLottieRef.current) return;
    const startFrame = (_a = config == null ? void 0 : config.segment) == null ? void 0 : _a[0];
    const endFrame = (_b = config == null ? void 0 : config.segment) == null ? void 0 : _b[1];
    if (typeof startFrame === 'number' && typeof endFrame === 'number') {
      dotLottieRef.current.setSegment(startFrame, endFrame);
    }
  }, [config == null ? void 0 : config.segment]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      typeof (config == null ? void 0 : config.backgroundColor) === 'string' &&
      config.backgroundColor !== dotLottieRef.current.backgroundColor
    ) {
      dotLottieRef.current.setBackgroundColor(config.backgroundColor);
    }
  }, [config == null ? void 0 : config.backgroundColor]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.renderConfig) === 'object') {
      dotLottieRef.current.setRenderConfig(config.renderConfig);
    }
  }, [JSON.stringify(config == null ? void 0 : config.renderConfig)]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      typeof (config == null ? void 0 : config.data) === 'string' ||
      (config == null ? void 0 : config.data) instanceof ArrayBuffer
    ) {
      dotLottieRef.current.load(
        __spreadValues(
          {
            data: config.data,
          },
          configRef.current || {},
        ),
      );
    }
  }, [config == null ? void 0 : config.data]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.src) === 'string') {
      dotLottieRef.current.load(
        __spreadValues(
          {
            src: config.src,
          },
          configRef.current || {},
        ),
      );
    }
  }, [config == null ? void 0 : config.src]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (typeof (config == null ? void 0 : config.marker) === 'string') {
      dotLottieRef.current.setMarker(config.marker);
    }
  }, [config == null ? void 0 : config.marker]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      dotLottieRef.current.isLoaded &&
      (config == null ? void 0 : config.animationId) &&
      dotLottieRef.current.activeAnimationId !== config.animationId
    ) {
      dotLottieRef.current.loadAnimation(config.animationId);
    }
  }, [config == null ? void 0 : config.animationId]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (
      dotLottieRef.current.isLoaded &&
      dotLottieRef.current.activeThemeId !== (config == null ? void 0 : config.themeId)
    ) {
      dotLottieRef.current.setTheme((config == null ? void 0 : config.themeId) || '');
    }
  }, [config == null ? void 0 : config.themeId]);
  useEffect(() => {
    if (!dotLottieRef.current) return;
    if (dotLottieRef.current.isLoaded) {
      dotLottieRef.current.setThemeData((config == null ? void 0 : config.themeData) || '');
    }
  }, [config == null ? void 0 : config.themeData]);
  return {
    dotLottie,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef.current,
    container: containerRef.current,
    DotLottieComponent: Component,
  };
};
var DotLottieWorkerReact = (_a) => {
  var _b = _a,
    {
      animationId,
      autoplay,
      backgroundColor,
      data,
      dotLottieRefCallback,
      loop,
      marker,
      mode,
      playOnHover,
      renderConfig,
      segment,
      speed,
      src,
      themeData,
      themeId,
      useFrameInterpolation,
      workerId,
    } = _b,
    props = __objRest(_b, [
      'animationId',
      'autoplay',
      'backgroundColor',
      'data',
      'dotLottieRefCallback',
      'loop',
      'marker',
      'mode',
      'playOnHover',
      'renderConfig',
      'segment',
      'speed',
      'src',
      'themeData',
      'themeId',
      'useFrameInterpolation',
      'workerId',
    ]);
  const { DotLottieComponent: DotLottieComponent2, dotLottie } = useDotLottieWorker({
    workerId,
    data,
    mode,
    speed,
    src,
    autoplay,
    loop,
    segment,
    renderConfig,
    backgroundColor,
    useFrameInterpolation,
    playOnHover,
    marker,
    themeId,
    animationId,
    themeData,
  });
  const stableDotLottieRefCallback =
    typeof dotLottieRefCallback === 'function' ? useStableCallback(dotLottieRefCallback) : void 0;
  React.useEffect(() => {
    if (typeof stableDotLottieRefCallback === 'function') {
      stableDotLottieRefCallback(dotLottie);
    }
  }, [stableDotLottieRefCallback, dotLottie]);
  return /* @__PURE__ */ React.createElement(DotLottieComponent2, __spreadValues({}, props));
};

// src/index.ts
var setWasmUrl = (url) => {
  g3.setWasmUrl(url);
  f3.setWasmUrl(url);
};

export { DotLottieReact, DotLottieWorkerReact, setWasmUrl, useDotLottie, useDotLottieWorker };
