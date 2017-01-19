/* globals jQuery */

/**
 * Adds custom SCEditor buttons below the editor area that,
 * when clicked, adds text to the textarea.
 *
 * @author Luiz~ (http://ajuda.forumeiros.com/u60563)
 * @see <a href="http://ajuda.forumeiros.com">Fórum dos Fóruns</a>
 * @license MIT
 */

(function($) {
  'use strict';

  $(function() {
    var $textarea = $('#text_editor_textarea');
    var sceditor = $textarea.sceditor('instance');

    /** Botão 1 */
    $textarea.after('<div class="button2 fa-button" id="botao1-b">NOME DO BOTÃO 1</div>');
    $('#botao1-b').click(function() {
      sceditor.insertText('TEXTO A SER INSERIDO NO BOTÃO 1')
    });

    /** Botão 2*/
    $textarea.after('<div class="button2 fa-button" id="botao2-b">NOME DO BOTÃO 2</div>');
    $('#botao2-b').click(function() {
      sceditor.insertText('TEXTO A SER INSERIDO NO BOTÃO 2');
    });
  });
}(jQuery));
