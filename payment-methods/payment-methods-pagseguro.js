/* globals FA, _userdata */

/**
 * Adds the PagSeguro payment method to ForumActif ads page.
 * Requires payment methods plugin to be installed.
 *
 * @see <a href="http://ajuda.forumeiros.com">Fórum dos Fóruns</a>
 * @license MIT
 */

; FA.Advertisement.Payment.addMethod({
  profileFieldId: 1,
  title: 'PagSeguro',
  methodClass: 'AD_PagSeguroPaymentMethod',
  methodIconClass: 'fa fa-shopping-bag fa-2x',
  endpointUrl: 'https://pagseguro.uol.com.br/v2/checkout/payment.html',
  formData: function (args) {
    return {
      receiverEmail: args.email,
      currency: 'BRL',
      itemId1: args.id,
      itemDescription1: args.name,
      itemAmount1: args.price,
      itemQuantity1: 1,
      itemWeight1: '0000',
      reference: 'REF' + args.id,
      senderName: _userdata.username,
      encoding: 'UTF-8'
    };
  }
});
