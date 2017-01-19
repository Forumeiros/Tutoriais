/* globals jQuery */

/**
 * Make tall quotes on topics collapsed.
 *
 * @see <a href="http://ajuda.forumeiros.com">Fórum dos Fóruns</a>
 * @license MIT
 */

var FA = FA || {};

FA.Topic = FA.Topic || {};

FA.Topic.QuoteCollapse = (function($, settings) {
  'use strict';

  var $quotes;
  var version;

  /**
   * Initialization function
   */
  function QuoteCollapse() {
    var self = this;

    $(function() {
      $.each({
        'phpbb2': 'table.bodylinewidth',
        'phpbb3': 'body#phpbb',
        'punbb': 'div.pun',
        'invision': 'div#ipbwrapper',
        'mobile': 'div#mpage-body',
        'mobile-modern': 'body#mpage-body-modern',
      }, function(key, selector) {
        if ($(selector).length !== 0) {
          version = key;
          return false;
        }
      });

      if (!version) {
        return;
      }

      self.init();
      self.collapse();
    });
  }

  QuoteCollapse.prototype.init = function() {
    switch (version) {
      case 'phpbb2':
        $quotes = $('.postbody dl.codebox > dd');
        break;
      case 'phpbb3':
        $quotes = $('.postbody blockquote');
        break;
      case 'punbb':
        $quotes = $('.postbody blockquote');
        break;
      case 'invision':
        $quotes = $('.postbody blockquote');
        break;
      case 'mobile':
        $quotes = $('.content blockquote .quote_content');
        break;
      case 'mobile-modern':
        $quotes = $('.post-content blockquote .quote_content');
        break;
      default:
        return;
    }

    $quotes
      .addClass('fa-quote')
      .append($('<a>', {
        href: '#',
        class: 'fa-quote-expand',
        text: settings.label,
      }));

    $quotes.on('click', '.fa-quote-expand', function(event) {
      event.preventDefault();

      $(this)
        .closest('.fa-quote')
        .removeClass('fa-quote-collapsed');
    });
  };

  QuoteCollapse.prototype.collapse = function() {
    $quotes.each(function() {
      var $self = $(this);

      if ($self.height() > settings.height) {
        $self.addClass('fa-quote-collapsed');
      }
    });
  };

  return new QuoteCollapse();
}(jQuery, {
  height: 400,
  label: 'Continuar lendo',
}));
