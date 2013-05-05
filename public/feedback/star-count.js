/**
 * @fileoverview 反馈星数统计器
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name StarCount
     * @class 反馈星数统计器
     * @constructor
     * @extends Base
     */
    function StarCount(target,config) {
        var self = this;
        //调用父类构造函数
        StarCount.superclass.constructor.call(self, config);
        self.set('target',$(target));
        self._init();
    }
    S.extend(StarCount, Base, /** @lends StarCount.prototype*/{
        _init:function(){
            var self = this;
            // setInterval(function(){
            //     self.count(3);
            // },200);
        },
        count:function(starNum){
            if(!starNum) return false;
            starNum = Number(starNum);
            var self = this;
            var value = self.get('value');
            self.set('value',value + starNum);
        }
    }, {ATTRS : /** @lends StarCount*/{
        target:{
            value:EMPTY,
            getter:function(v){
                return $(v);
            }
        },
        nums:{
            value:[]
        },
        value:{
            value:0,
            setter:function(v){
                var self = this;
                var target = self.get('target');
                if(!target.length) return v;

                target.text(v);
                return v;
            }
        }
    }});
    return StarCount;
}, {requires : ['node','base']});