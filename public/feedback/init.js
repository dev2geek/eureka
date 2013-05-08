/**
 * @fileoverview 初始化统计反馈逻辑（管理者界面）
 * @author 剑平（明河）<minghe36@126.com>
 **/
KISSY.add(function(S, Node,Count,CountImage,saveCount) {
    return function(){
        var count = new Count('.J_StarCount');
        var countImage = new CountImage('.J_CountImg');
        count.on('afterValueChange',function(ev){
            var n = ev.newVal - ev.prevVal;
            countImage.change(n);
        })
        var socket = io.connect('http://localhost');
        socket.on('feedbackCount', function (data) {
            S.log(data);
            var starNum = data.num;
            //触发统计
            count.count(starNum);
        });

        saveCount(100);
    }
}, {requires : ['node','./star-count','./count-image','./save-count']});