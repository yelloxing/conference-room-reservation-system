import Vue from 'vue';
import $$ from 'image2d';
import xhtml from '../services/xhtml';

Vue.directive('toggerView', {
    'bind': function (el) {

        $$(el).bind('click', () => {
            let target = el.parentNode.parentNode;
            if (xhtml.hasClass(target, 'open')) {
                xhtml.removeClass(target, 'open');
            } else {
                xhtml.addClass(target, 'open');
            }
        });
    }
});