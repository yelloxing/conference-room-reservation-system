import Vue from 'vue';
import $$ from 'image2d';

Vue.directive('title', {
    'bind': function (el, binding) {
        if (!binding.value) return;
        let titleStr = binding.value.split('#');
        let div = $$(`<div>
        <div>${titleStr[0]}</div>
        <div>${titleStr[1]}</div>
        </div>`).appendTo(el).css({
            "line-height": "2em",
            "background-color": "white",
            "position": "absolute",
            "font-size": "14px",
            "padding": "10px",
            "margin-top": "24px",
            "width": "230px",
            "height": "76px",
            "margin-left": "-194px",
            "border": "1px solid #9E9E9E",
            "border-radius": "10px",
            "display": "none"
        });
        $$(el).bind('mouseenter', () => {
            div.css('display', 'block');
        }).bind('mouseleave', () => {
            div.css('display', 'none');
        });
    }
});