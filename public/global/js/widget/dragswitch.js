// Generated by CoffeeScript 1.3.3
(function() {

  KISSY.add("widget/dragswitch", function(S, DOM, Node, Event, UA, SSlog) {
    var $, DragSwitch, defaultConfig;
    $ = KISSY.all;
    defaultConfig = {
      senDistance: 6,
      angle: Math.PI / 4,
      checkvalid: null,
      inertiaMove: false,
      disable: false,
      binds: [
        null, null, null, null, {
          moveSelf: true,
          moveEls: [],
          maxDistance: 99999,
          validDistance: null,
          passCallback: null,
          failCallback: null,
          checkvalid: null
        }
      ]
    };
    return DragSwitch = (function() {

      function DragSwitch(el, config) {
        this.el = el;
        this.config = config;
        S.mix(this, S.EventTarget);
        DOM.addStyleSheet(".dragswitch-dragging, .dragswitch-dragging * {\n  -webkit-transition: none !important;\n  -moz-transition: none !important;\n  -o-transition: none !important;\n  -ms-transition: none !important;\n  transition: none !important;\n}");
        this.init();
      }

      DragSwitch.prototype.init = function() {
        var el, item, _i, _j, _len, _len1, _ref, _ref1;
        this.config = S.merge(defaultConfig, this.config);
        this.disable = this.config.disable;
        if (typeof this.el === "string") {
          this.isSelector = true;
        }
        if (!this.isSelector) {
          this.el = $(this.el);
        }
        this.realEl = $(this.el);
        this.tanAngel = Math.tan(this.config.angle);
        this.effectEls = [];
        _ref = this.config.binds;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (!item) {
            continue;
          }
          if (!(item.moveSelf != null)) {
            item.moveSelf = true;
          }
          _ref1 = item.moveEls;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            el = _ref1[_j];
            this.effectEls.push($(el));
          }
        }
        return this.bindEvents();
      };

      DragSwitch.prototype.bindEvents = function() {
        var _this = this;
        if (this.isSelector) {
          $('body').delegate("touchstart", this.el, function(ev) {
            return _this.touchStart(ev);
          });
          $('body').delegate("touchmove", this.el, function(ev) {
            return _this.touchMove(ev);
          });
          return $('body').delegate("touchend", this.el, function(ev) {
            return _this.touchEnd(ev);
          });
        } else {
          this.el.on("touchstart", function(ev) {
            return _this.touchStart(ev);
          });
          this.el.on("touchmove", function(ev) {
            return _this.touchMove(ev);
          });
          return this.el.on("touchend", function(ev) {
            return _this.touchEnd(ev);
          });
        }
      };

      DragSwitch.prototype.touchStart = function(e) {
        var ev, parent;
        this.stopInertiaMove = true;
        if (this.disable) {
          return;
        }
        this.enabled = this.config.checkvalid ? this.config.checkvalid() : true;
        if (!this.enabled) {
          return;
        }
        e.preventDefault();
        ev = e.originalEvent;
        this.istouchStart = true;
        this.isSendStart = false;
        this.eventType = null;
        this.key = null;
        this.actuMoveEls = [];
        this.startPoint = [ev.touches[0].pageX, ev.touches[0].pageY];
        this.lastPoint = this.startPoint.slice();
        this.yesterPoint = this.lastPoint.slice();
        this.effectEls.push(this.originalEl = this.isSelector && (parent = $(ev.target).parent(this.el)) ? parent : $(ev.target));
        return this.saveMatrixState(this.effectEls);
      };

      DragSwitch.prototype.touchMove = function(e) {
        var angleDelta, distance, ev, oPoint, point;
        if (!this.istouchStart) {
          return;
        }
        if (this.isSendStart && !this.effectBind) {
          return;
        }
        ev = e.originalEvent;
        point = [ev.touches[0].pageX, ev.touches[0].pageY];
        oPoint = this.startPoint;
        angleDelta = Math.abs((oPoint[1] - point[1]) / (point[0] - oPoint[0]));
        distance = [point[0] - oPoint[0], point[1] - oPoint[1]];
        if (!this.isSendStart && angleDelta > this.tanAngel && 1 / angleDelta > this.tanAngel) {
          this.istouchStart = false;
          return;
        } else if (!this.eventType) {
          if (angleDelta <= this.tanAngel && Math.abs(distance[0]) > this.config.senDistance) {
            this.eventType = (distance[0] > 0 ? "dragRight" : "dragLeft");
          } else if (1 / angleDelta <= this.tanAngel && Math.abs(distance[1]) > this.config.senDistance) {
            this.eventType = (distance[1] > 0 ? "dragDown" : "dragUp");
          } else {
            return;
          }
          this.key = (this.eventType === "dragDown" ? 0 : (this.eventType === "dragLeft" ? 1 : (this.eventType === "dragUp" ? 2 : (this.eventType === "dragRight" ? 3 : null))));
          this.isVertical = 1 - this.key % 2;
          this.effectBind = this.config.binds[this.key];
          if (!this.effectBind) {
            return;
          }
          this.effectBind.passed = false;
          this.moveEls = this.effectBind.moveEls;
          this.actuMoveEls = this.moveEls.slice();
          if (this.effectBind.moveSelf) {
            this.actuMoveEls.push(this.originalEl);
          }
          this.saveMatrixState(this.actuMoveEls);
          this.enabled = this.effectBind.checkvalid ? this.effectBind.checkvalid(S.mix(e, {
            self: this
          })) : true;
          this.startTime = new Date;
          $("body").addClass("dragswitch-dragging");
        }
        if (!this.eventType || !this.enabled || !this.effectBind) {
          return;
        }
        e.stopPropagation();
        if (!this.isSendStart) {
          this.isSendStart = true;
          this.fire(this.eventType + "Start", S.mix(e, {
            self: this
          }));
        }
        this.fire(this.eventType, S.mix(e, {
          self: this
        }));
        if (!e.isDefaultPrevented()) {
          this.move(point);
        }
        this.yesterPoint = this.lastPoint.slice();
        this.yesterTime = new Date(this.lastTime);
        this.lastPoint = point.slice();
        return this.lastTime = new Date;
      };

      DragSwitch.prototype.touchEnd = function(e) {
        var deceleration, dir, dist, duration, el, v, _i, _len, _ref,
          _this = this;
        $("body").removeClass("dragswitch-dragging");
        if (!this.eventType || !this.enabled || !this.effectBind) {
          return;
        }
        if (this.istouchStart && this.isSendStart) {
          if (!this.config.inertiaMove) {
            this.touchEndHandler(e);
          } else {
            v = (this.yesterPoint[this.isVertical] - this.lastPoint[this.isVertical]) / (this.yesterTime - this.lastTime);
            dir = (v > 0 ? -1 : 1);
            deceleration = dir * 0.01;
            duration = Math.abs(v / deceleration);
            dist = v * duration;
            this.stopInertiaMove = false;
            _ref = this.actuMoveEls;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              el = _ref[_i];
              this.inertiaMove(el, duration, dist);
            }
            setTimeout(function() {
              return _this.touchEndHandler.call(_this, e);
            }, duration);
          }
        }
        this.istouchStart = false;
        this.isSendStart = false;
        return this.eventType = null;
      };

      DragSwitch.prototype.touchEndHandler = function(e) {
        var obj;
        obj = this.effectBind;
        if (Math.abs(this.distance) >= Math.abs(obj.validDistance)) {
          obj.passed = true;
          if (obj.passCallback) {
            obj.passCallback.call(e.target, S.mix(e, {
              self: this
            }));
          }
        } else {
          this.restoreMatrixState();
        }
        return this.fire(this.eventType + "End", S.mix(e, {
          self: this
        }));
      };

      DragSwitch.prototype.saveMatrixState = function(els) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          _results.push(el.matrixState = this.getMatrix(el));
        }
        return _results;
      };

      DragSwitch.prototype.getMatrix = function(el) {
        return $(el).css("-webkit-transform") || $(el).css("-o-transform") || $(el).css("-moz-transform") || $(el).css("transform");
      };

      DragSwitch.prototype.setMatrix = function(el, matrix) {
        return $(el).css({
          "transform": matrix,
          "-webkit-transform": matrix,
          "-ms-transform": matrix,
          "-o-transform": matrix
        });
      };

      DragSwitch.prototype.restoreMatrixState = function() {
        var el, _i, _len, _ref, _results;
        _ref = this.effectEls;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(this.setMatrix(el, el.matrixState));
        }
        return _results;
      };

      DragSwitch.prototype.move = function(endPoint) {
        var backward, dis, el, lastPoint, positiveDirt, rawDistance, startPoint, _i, _len, _ref, _results;
        startPoint = this.startPoint;
        lastPoint = this.lastPoint;
        rawDistance = this.distance = (this.isVertical ? endPoint[1] - startPoint[1] : endPoint[0] - startPoint[0]);
        positiveDirt = this.key === 0 || this.key === 3;
        backward = positiveDirt ? rawDistance < 0 : rawDistance > 0;
        if (this.effectBind.maxDistance && Math.abs(rawDistance) > Math.abs(this.effectBind.maxDistance)) {
          dis = Math.sqrt(Math.abs(rawDistance - this.effectBind.maxDistance) * 5);
          if (!positiveDirt) {
            dis = -dis;
          }
          rawDistance = this.distance = this.effectBind.maxDistance + dis;
        }
        _ref = this.actuMoveEls;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(this.setMatrix(el, this.translate(el.matrixState, rawDistance, !this.isVertical)));
        }
        return _results;
      };

      DragSwitch.prototype.translate = function(currentMatrix, distance, hori) {
        var matrix;
        matrix = this.parseMartix(currentMatrix);
        matrix[4] += distance * hori;
        matrix[5] += distance * (1 - hori);
        return "matrix(" + matrix.join(',') + ")";
      };

      DragSwitch.prototype.parseMartix = function(currentMatrix) {
        var matrix;
        if (!currentMatrix) {
          currentMatrix = "matrix(1,0,0,1,0,0)";
        }
        matrix = currentMatrix.match(/[0-9\.\-]+/g);
        if (!matrix) {
          matrix = [1, 0, 0, 1, 0, 0];
        }
        matrix.forEach(function(item, key) {
          return matrix[key] = parseFloat(item);
        });
        return matrix;
      };

      DragSwitch.prototype.inertiaMove = function(el, duration, dist) {
        var currentMatrix, newMatrix, transition,
          _this = this;
        currentMatrix = this.getMatrix(el);
        newMatrix = this.translate(currentMatrix, dist, 1 - this.isVertical);
        transition = "-webkit-transform " + duration.toString().slice(0, 4) + "ms cubic-bezier(1, 0, .92, 0)";
        $(el).css("-webkit-transition", transition);
        this.setMatrix(el, newMatrix);
        return setTimeout(function() {
          return $(el)[0].style.webkitTransition = "";
        }, duration);
      };

      return DragSwitch;

    })();
  }, {
    requires: ["dom", "node", "event", "ua", "widget/sslog"]
  });

}).call(this);
