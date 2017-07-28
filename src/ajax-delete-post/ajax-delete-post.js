/**
 *! Delete post with AJAX.
 *
 *  @author Luiz
 *  @licence MIT
 *
 *  Copyright (c) Luiz Felipe | All rights reserved.
 */
(function ($) {
  'use strict';
 
  $(function () {
 
    $('.post a[href$="mode=delete"]')
      .on('click', function (event) {
 
        event.preventDefault();
 
        var $this = $(this);
        var $post = $this.parents('.post');
        var $pid  = $this.attr('href').replace(/^\/post\?p=(\d+)&.+/gi, '$1');
 
        var conf  = confirm('Você deseja realmente excluir esta postagem?');
        
        if (!conf) {
          console.info('A postagem de ID ' + $pid + ' não foi deletada.');
          return false;
        }
 
        $.post('/post', {
          mode: 'delete',
          p: $pid,
          confirm: 1
        })
          .done(function () {
            $post.slideUp();
          })
          .fail(function () {
            alert([
              '[AJAX ERROR] Houve um erro ao tentar excluir a postagem de número ' + $pid,
              'Atualize a página e tente novamente.'
            ].join('\n'));
          })
        ;
      })
    ;
  });
}(jQuery));
