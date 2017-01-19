/* global jQuery */

var FA = FA || {};

FA.Topic = FA.Topic || {};

FA.Topic.Tabs = (function($, config) {
  'use strict';

  /**
   * Object initialization
   */
  function Tabs() {
    var self = this;

    if (!/^\/t\d+-.*$/.test(location.pathname)) {
      return;
    }

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
          self.version = key;
          return false;
        }
      });

      if (!self.version) {
        return;
      }

      self.init();
    });
  }

  Tabs.prototype.init = function() {
    var $post = this.post();

    if (!$post.length) {
      return;
    }

    var $title = this.title($post);

    if (!$title.length) {
      return;
    }

    var $tabs = this.tabs($post);

    if (!$tabs) {
      return;
    }

    $title.before($tabs);
  };

  Tabs.prototype.post = function() {
    var selector;

    switch (this.version) {
      case 'phpbb2':
        selector = '.postbody:first > div:first-child';
        break;
      case 'phpbb3':
        selector = '.postbody:first > .content > div';
        break;
      case 'punbb':
        selector = '.entry-content:first > div > div:first-child';
        break;
      case 'invision':
        selector = '.post-entry:first > div:first-child';
        break;
      case 'mobile':
        selector = '.postbody:first > .content > div';
        break;
      default:
        selector = '.post-content:first';
    }

    return $(selector);
  };

  Tabs.prototype.tabs = function($post) {
    var regex = /\[tabs\](.*)\[\/tabs\]/i;
    var matches = $post.html().match(regex);

    if (matches.length !== 2) {
      return null;
    }

    $post.html($post.html().replace(regex, ''));

    var tabs = [];

    $(matches[1]).filter('a').each(function(index, elem) {
      tabs.push(['<li>', elem.outerHTML, '</li>'].join(''));
    });

    if (!tabs.length) {
      return null;
    }

    return $('<ul id="fa-topic-tabs"></ul>')
      .append(tabs.join(''));
  };

  Tabs.prototype.title = function($post) {
    var selector;

    switch (this.version) {
      case 'phpbb2':
        selector = '.forumline';
        break;
      case 'phpbb3':
        selector = '.post';
        break;
      case 'punbb':
        selector = '.main';
        break;
      case 'invision':
        selector = '.borderwrap';
        break;
      case 'mobile':
        selector = '.post';
        break;
      default:
        selector = '.topic';
    }

    return $post.closest(selector);
  };

  return new Tabs;
}(jQuery, {}));
