/*global jQuery: true*/
 
/**
 * An easy access button that allows a quick return to the top of the page.
 * 
 * @author Kyo Panda (ajuda.forumeiros.com)
 * @license MIT
 */
 
(function($) {
    'use strict';
 
    $(function() {
        var $body = $('html, body');
 
        var $link = $('<a>', {
            href: 'javascript:void(0)',
            id: 'fa-scrolltop',
            text: '˄'
        })
        .on('click', function() {
            $body.stop().animate({ scrollTop: 0 }, 'fast');
        })
        .appendTo('body');
 
        $(window).on('scroll', function() {
            $link.toggleClass('fa-scrolltop-visible', $(this).scrollTop() !== 0);
        });
    });
}(jQuery));
