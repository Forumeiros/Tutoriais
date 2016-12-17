/* globals jQuery, _userdata*/

/**
 * Adds payment methods to ForumActif ads page
 *
 * @see <a href="http://ajuda.forumeiros.com">Fórum dos Fóruns</a>
 * @license MIT
 */

var FA = FA || {};

FA.Advertisement = FA.Advertisement || {};

FA.Advertisement.Payment = (function($, settings) {
  var built = false;
  var methods = [];
  var product = {};
  var ready = false;
  var seller = {};

  var version;
  var $list;

  /**
   * Initialization function
   */
  function Payment() {
    $(function() {
      var matches = location.pathname.match(/\/d(\d+)(p\d+)?-(.*)/i);

      if (matches === null) {
        return;
      }

      product.id = matches[1];

      if (_userdata.user_id === -1) {
        return;
      }

      version = getForumVersion();

      if (!version || !parsePrice() || !parseName() || !getSellerData()) {
        return;
      }
    });
  }

  Payment.prototype.getMethods = function() {
    return methods;
  };

  Payment.prototype.addMethod = function(data) {
    methods.push(data);
    if (ready) {
      buildMethod(data);
    }
  };

  var buildBlockHTML = function() {
    switch (version) {

      case 'phpbb2':
        return [
          '<table id="AD_BlockOptions" width="100%" class="forumline AD_Block module">',
          '  <tbody>',
          '    <tr>',
          '      <td class="catLeft">',
          '        <div class="AD_BlockTitle h3">',
          '          <p>' + settings.title + '</p>',
          '        </div>',
          '      </td>',
          '    </tr>',
          '    <tr>',
          '      <td class="row1">',
          '        <div class="AD_BlockContent">',
          '          <ul class="AD_ListInline AD_ListOptions AD_ListPayment"></ul>',
          '        </div>',
          '      </td>',
          '    </tr>',
          '  </tbody>',
          '</table>',
        ].join('\n');

      case 'phpbb3':
        return [
          '<div id="AD_BlockOptions" class="AD_Block module">',
          '  <div class="inner">',
          '    <span class="corners-top"><span></span></span>',
          '    <div class="AD_BlockTitle h3">',
          '      <p>' + settings.title + '</p>',
          '    </div>',
          '    <div class="AD_BlockContent">',
          '      <ul class="AD_ListInline AD_ListOptions AD_ListPayment"></ul>',
          '    </div>',
          '    <span class="corners-bottom"><span></span></span>',
          '  </div>',
          '</div>',
        ].join('\n');

      case 'punbb':
        return [
          '<div id="AD_BlockOptions" class="AD_Block module main" style="margin-bottom: 4px !important;">',
          '  <div class="AD_BlockTitle main-head">',
          '    <p>' + settings.title + '</p>',
          '  </div>',
          '  <div class="AD_BlockContent main-content clearfix">',
          '    <ul class="AD_ListInline AD_ListOptions AD_ListPayment"></ul>',
          '  </div>',
          '</div>',
        ].join('\n');

      case 'invision':
        return [
          '<div id="AD_BlockOptions" class="AD_Block box-content">',
          '  <div class="maintitle">',
          '    <h3>' + settings.title + '</h3>',
          '  </div>',
          '  <div class="AD_BlockContent">',
          '    <ul class="AD_ListInline AD_ListOptions AD_ListPayment"></ul>',
          '  </div>',
          '</div>',
        ].join('\n');

      case 'mobile-modern':
        return [
          '<div id="ad-block-options">',
          '  <h2>' + settings.title + '</h2>',
          '  <ul class="ad-mod-options box-subtle AD_ListPayment"></ul>',
          '</div>',
        ].join('\n');

      default:
        return false;
    }
  };

  var buildFontAwesome = function() {
    return [
      '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />',
      '<style>',
      '  .AD_ListOption a span.fa {',
      '    color: #666666;',
      '    font-size: 30px;',
      '    line-height: 30px;',
      '    box-sizing: initial;',
      '  }',
      '',
      '  .AD_ListOption a span.fa:before {',
      '    display: inline-block;',
      '  }',
      '',
      '  #ad-block-options h2 {',
      '    text-align: center;',
      '  }',
      '</style>',
    ].join('\n');
  };

  var buildForm = function(data) {
    var list;

    list = [];

    $.each(data, function(key, value) {
      list.push('<input type="hidden" name="' + key + '" value="' + value + '" />');
    });

    return list.join('\n');
  };

  var buildHTML = function() {
    if (version === 'mobile-modern') {
      $('.box:eq(0)').after(buildBlockHTML());
    } else {
      $('#AD_BlockSeller').after(buildBlockHTML());
    }

    $('head').append(buildStyle());

    if (settings.fontawesome) {
      $('head').append(buildFontAwesome());
    }

    $list = $('.AD_ListPayment');
    built = true;
  };

  var buildMethod = function(data) {
    var email = seller[data.profileFieldId];

    if (!email || email === '-') {
      return;
    }

    if (!built) {
      buildHTML();
    }

    $list.append([
      '<li class="AD_ListOption ' + data.methodClass + '">',
      '  <a href="#"><span class="' + data.methodIconClass + '"></span>' + data.title + '</a>',
      '</li>',
    ].join('\n'));

    $list.on('click', 'li.' + data.methodClass + ' a', function(event) {
      event.preventDefault();

      $('<form>', {
        action: data.endpointUrl,
        method: 'POST',
        target: '_blank',
        html: buildForm(data.formData({
          email: email,
          price: product.price,
          name: product.name,
          id: product.id,
        })),
      }).submit();
    });
  };

  var buildMethods = function() {
    $.each(methods, function(key, data) {
      buildMethod(data);
    });
  };

  var buildStyle = function() {
    return [
      '<style>',
      '  .AD_ListOption a span {',
      '    display: block;',
      '    margin: auto;',
      '    padding: 10px 0;',
      '    width: 30px;',
      '    height: 30px;',
      '  }',
      '</style>',
    ].join('\n');
  };

  var getForumVersion = function() {
    if ($('table.bodylinewidth').length !== 0) {
      return 'phpbb2';
    }

    if ($('body#phpbb').length !== 0) {
      return 'phpbb3';
    }

    if ($('div.pun').length !== 0) {
      return 'punbb';
    }

    if ($('div#ipbwrapper').length !== 0) {
      return 'invision';
    }

    if ($('body#mpage-body-modern').length !== 0) {
      return 'mobile-modern';
    }

    return false;
  };

  var getSellerData = function() {
    var $element;

    if (version === 'mobile-modern') {
      $element = $('p.profile-username a');
    } else {
      $element = $('#AD_BlockSeller a[href^="/u"]');
    }

    if ($element.length === 0) {
      return false;
    }

    return $.get($element.attr('href'), function(html) {
      var $fields;

      if (version === 'mobile-modern') {
        $fields = $('[id^="field_custom"]', html);
      } else {
        $fields = $('[id^="field"]', html);
      }

      if ($fields.length === 0) {
        return;
      }

      $fields.each(function() {
        var $self = $(this);
        var id = $self.attr('id').replace(/[^\d-]+/g, '');

        if (version === 'mobile-modern') {
          seller[id] = $self.text().split(' : ').pop();
        } else {
          seller[id] = $self.find('.field_uneditable').text().trim();
        }
      });

      buildMethods();

      ready = true;
    });
  };

  var parseName = function() {
    var $element;

    if (version === 'mobile-modern') {
      $element = $('.box > h2');
    } else {
      $element = $('.AD_SectionTitle h1');
    }

    if ($element.length === 0) {
      return false;
    }

    product.name = $element.text().trim();

    return true;
  };

  var parsePrice = function() {
    var $element;

    if (version === 'mobile-modern') {
      $element = $('.ad-details .AD_ListDescValue:eq(0)');
    } else {
      $element = $('.AD_ListDesc li:eq(0) .AD_ListDescValue');
    }

    if ($element.length === 0) {
      return false;
    }

    product.price = parseFloat(
      $element
        .text()
        .trim()
        .split(/\s/i)
        .shift()
        .replace(',', '.')
    );

    if (!$.isNumeric(product.price)) {
      return false;
    }

    return true;
  };

  return new Payment();
}(jQuery, {
  title: 'Métodos de pagamento',
  fontawesome: true,
}));
