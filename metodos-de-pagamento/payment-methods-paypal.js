/* globals FA */

/**
 * Adds the PayPal payment method to ForumActif ads page.
 * Requires payment methods plugin to be installed.
 *
 * @see {@link http://ajuda.forumeiros.com Fórum dos Fóruns}
 * @license MIT
 */

; FA.Advertisement.Payment.addMethod({
  profileFieldId: 2,
  title: 'PayPal',
  methodClass: 'AD_PayPalPaymentMethod',
  methodIconClass: 'fa fa-paypal fa-2x',
  endpointUrl: 'https://www.paypal.com/cgi-bin/webscr',
  formData: function (args) {
    return {
      cmd: '_xclick',
      business: args.email,
      return: 'http://' + location.host + '/h1-paypal-return',
      cancel: 'http://' + location.host + '/h2-paypal-cancel',
      notify_url: '',
      charset: 'uft-8',
      lc: 'BR',
      country_code: 'BR',
      currency_code: 'BRL',
      amount: args.price,
      item_name: args.name,
      quantity: 1
    };
  }
});
