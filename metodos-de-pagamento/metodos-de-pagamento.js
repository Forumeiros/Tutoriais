/*global jQuery, _userdata*/

/**
 * Adiciona métodos de pagamentos às páginas de anúncio
 * 
 * @author Kyo Panda (ajuda.forumeiros.com)
 * @author Hancki (ajuda.forumeiros.com)
 * @author Shek Crowley (ajuda.forumeiros.com)
 * 
 * @license MIT
 */

; (function($) {
    'use strict';

    var page, options, html, style;

    /**
     * Verifica se é uma página de anúncio, caso contrário não executa o script
     */
    page = location.pathname.match(/\/d(\d+)(p\d+)?-(.*)/i);

    if (page === null) {
        return;
    }

    /**
     * Opções do script
     */
    options = {

        /**
         * Configurações dos métodos de pagamento
         */
        methods: {

            /**
             * Opções do PagSeguro
             */

            pagseguro: {
                /**
                 * Se a opção de pagamento pelo PagSeguro está ativo ou não
                 *      true  : ativo
                 *      false : inativo
                 */
                active: true,

                /**
                 * ID do campo de perfil
                 */
                id: 1,

                /**
                 * Opções relativas ao idioma da página no fórum 
                 */
                i18n: {

                    /**
                     * Título do PagSeguro
                     */
                    title: 'PagSeguro',

                    /**
                     * Título do campo de formulário do PagSeguro
                     */
                    formLabel: 'E-mail do PagSeguro',
                },

                /**
                 * Opções do HTML
                 */
                html: {

                    /**
                     * Classe da opção do PagSeguro
                     */
                    optionClass: 'AD_ListPagSeguroOption',

                    /**
                     * Classe do ícone da opção do PagSeguro
                     */
                    optionIconClass: 'fa fa-shopping-bag fa-2x',

                    /**
                     * ID dos campos no formulário de postagem para o PagSeguro
                     */
                    formId: 'AD_PagSeguroEmail'
                },

                /**
                 * Gera os dados do formulário para envio
                 *      data: dados do produto
                 */
                generateFormData: function(data) {
                    return {
                        receiverEmail: data.email,
                        currency: data.currency,
                        itemId1: data.id,
                        itemDescription1: data.name,
                        itemAmount1: data.price,
                        itemQuantity1: 1,
                        itemWeight1: '0000',
                        reference: 'REF' + data.id,
                        senderName: _userdata.username,
                        encoding: 'UTF-8'
                    };
                },

                /**
                 * URL para a página de pagamento do PayPal
                 *      Padrão : https://pagseguro.uol.com.br/v2/checkout/payment.html
                 */
                paymentUrl: 'https://pagseguro.uol.com.br/v2/checkout/payment.html'
            },

            /**
             * Opções do PayPal
             */
            paypal: {

                /**
                 * Se a opção de pagamento pelo PayPal está ativo ou não
                 *      true  : ativo
                 *      false : inativo
                 */
                active: true,

                /**
                 * ID do campo de perfil
                 */
                id: 2,

                /**
                 * Opções relativas ao idioma da página no fórum 
                 */
                i18n: {

                    /**
                     * Título do PayPal
                     */
                    title: 'PayPal',

                    /**
                    * Título do campo de formulário do PayPal
                    */
                    formLabel: 'E-mail do PayPal',
                },

                /**
                 * Opções do HTML
                 */
                html: {

                    /**
                     * Classe da opção do PayPal
                     */
                    optionClass: 'AD_ListPayPalOption',

                    /**
                     * Classe do ícone da opção do PayPal
                     */
                    optionIconClass: 'fa fa-paypal fa-2x',

                    /**
                     * ID dos campos no formulário de postagem para o PayPal
                     */
                    formId: 'AD_PayPalEmail'
                },

                /**
                 * Idioma da tela de pagamento no PayPal
                 */
                countryCode: 'BR',

                /**
                 * Página de retorno após a confirmação de pagamento pelo usuário
                 */
                return: 'http://' + location.host + '/h1-confirmacao-de-pagamento',

                /**
                 * Página de retorno após o cancelamento de pagamento pelo usuário
                 */
                cancel: 'http://' + location.host + '/h2-cancelamento-de-pagamento',

                /**
                 * Página de notificação do status da transação pelo usuário
                 */
                notify: 'http://' + location.host + '/h3-notificacao-de-pagamento',

                /**
                 * Gera os dados do formulário para envio
                 *      data: dados do produto
                 */
                generateFormData: function(data) {
                    return {
                        cmd: '_xclick',
                        business: data.email,
                        return: options.methods.paypal.return,
                        cancel: options.methods.paypal.cancel,
                        notify_url: options.methods.paypal.notify,
                        charset: 'uft-8',
                        lc: options.methods.paypal.countryCode,
                        country_code: options.methods.paypal.countryCode,
                        currency_code: data.currency,
                        amount: data.price,
                        item_name: data.name,
                        quantity: 1
                    };
                },

                /**
                 * URL para a página de pagamento do PayPal
                 *      Padrão : https://www.paypal.com/cgi-bin/webscr
                 */
                paymentUrl: 'https://www.paypal.com/cgi-bin/webscr'
            }
        },

        /**
         * Determina se o FontAwesome deve ser adicionado ao fórum.
         *      true  : será adicionado
         *      false : não será adicionado
         */
        fontawesome: true,

        /**
         * Opções relativas ao idioma da página no fórum 
         */
        i18n: {

            /**
             * Título da caixa de métodos de pagamento
             */
            paymentMethods: 'Métodos de pagamento',

            /**
             * Descrição da tag de preço
             */
            price: 'Preço',

            /**
             * Descrição da tag de país
             */
            country: 'País',

            /**
             * Descrição da tag de cidade
             */
            city: 'Cidade',

            /**
             * Mensagens de erro
             */
            errors: {

                /**
                 * Erro na captura do preço do produto
                 */
                price: 'Não foi possível recuperar o preço do produto',

                /**
                 * Erro na captura do nome do produto
                 */
                name: 'Não foi possível recuperar o nome do produto'
            }
        },

        /**
         * Dados do produto
         */
        product: {}
    };

    /**
     * Executa funções de alteração e busca de HTML
     */
    html = {

        /**
         * Retorna a atual versão do fórum
         */
        version: function() {

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

            return 'unknown';
        },

        /**
         * Recupera os e-mails de venda do vendedor
         */
        getSellerEmails: function() {
            var url;

            url = $('#AD_BlockSeller').find('a[href^="/u"]').eq(0).attr('href');

            return $.get(url, function(data) {
                var email;

                $.each(options.methods, function(env, method) {
                    if (method.active) {
                        email = $('#profile_field_13_' + method.id, data).val().trim();

                        if (email.length) {
                            options.methods[env].email = email;
                        }
                    }
                });
            });
        },

        /**
         * Adiciona um erro ao bloco de métodos de pagamento
         *      message: mensagem de erro
         */
        addError: function(message) {
            $('.AD_ListPaymentOptions').closest('.AD_BlockContent').append($('<div>', {
                class: 'AD_BlockContent AD_BlockError',
                text: message
            }));
        },

        /**
         * Recupera as informações de preço da página html
         */
        getPriceAndCurrency: function() {
            var result, element, parts, price, currency;

            result = {
                price: -1,
                currency: ''
            };

            element = $('.AD_ListDescLabel:contains(' + options.i18n.price + ') + .AD_ListDescValue');

            if (element.length !== 1) {
                html.addError(options.i18n.errors.price);
                return result;
            }

            parts = element.text().split(/\s/i);

            currency = parts.pop();
            price = parseFloat(parts.join('').replace(',', '.')).toFixed(2);

            if (isNaN(price) || price < 0 || currency.length !== 3) {
                html.addError(options.i18n.errors.price);
                return result;
            }

            result.price = price;
            result.currency = currency;

            return result;
        },

        /**
         * Recupera as informações do nome do produto da página HTML
         */
        getProductName: function() {
            var result, element;

            result = {
                name: ''
            };

            element = $('.AD_SectionTitle h1');

            if (element.length !== 1) {
                html.addError(options.i18n.errors.name);
                return result;
            }

            result.name = element.text();

            return result;
        },

        /**
         * Cria uma lista de entradas de formulário, dado um objeto de dados
         *      data : dados para a lista de entrada
         */
        generateFormInputList: function(data) {
            var list;

            list = [];

            $.each(data, function(key, value) {
                list.push($('<input>', {
                    type: 'hidden',
                    name: key,
                    value: value
                }).prop('outerHTML'));
            });

            return list.join('');
        },

        /**
         * Cria uma opção na lista de método de pagamento
         *      data : objeto contendo os dados para a criação da opção
         */
        generatePaymentOption: function(data) {
            return $('<li>', {
                class: 'AD_ListOption ' + data.class,
                html: $('<a>', {
                    href: 'javascript:void(0)',
                    target: '_blank',
                    html: [
                        $('<i>', {
                            class: data.icon
                        }).prop('outerHTML'),
                        data.title
                    ].join('')
                }).prop('outerHTML'),
            });
        },

        /**
         * Constrói o bloco HTML dos métodos de pagamento
         */
        generatePaymentOptionsBlock: function() {
            var result;

            switch (html.version()) {
                case 'phpbb2':
                    result = $('<table>', {
                        id: 'AD_BlockOptions',
                        width: '100%',
                        cellspacing: '1',
                        cellpadding: '0',
                        border: '0',
                        class: 'forumline AD_Block module',
                        html: $('<tbody>', {
                            html: [
                                $('<tr>', {
                                    html: $('<td>', {
                                        class: 'catLeft',
                                        html: $('<div>', {
                                            class: 'AD_BlockTitle h3',
                                            html: $('<p>', {
                                                text: options.i18n.paymentMethods
                                            }).prop('outerHTML')
                                        }).prop('outerHTML')
                                    })
                                }).prop('outerHTML'),
                                $('<tr>', {
                                    html: $('<td>', {
                                        class: 'row1',
                                        html: $('<div>', {
                                            class: 'AD_BlockContent',
                                            html: $('<ul>', {
                                                class: 'AD_ListInline AD_ListOptions AD_ListPaymentOptions'
                                            }).prop('outerHTML')
                                        }).prop('outerHTML')
                                    })
                                }).prop('outerHTML')
                            ].join('')
                        }).prop('outerHTML')
                    });
                    break;
                case 'phpbb3':
                    result = $('<div>', {
                        id: 'AD_BlockOptions',
                        class: 'AD_Block module',
                        html: $('<div>', {
                            class: 'inner',
                            html: [
                                $('<span>', {
                                    class: 'corners-top',
                                    html: $('<span>').prop('outerHTML')
                                }).prop('outerHTML'),
                                $('<div>', {
                                    class: 'AD_BlockTitle h3',
                                    html: $('<p>', {
                                        text: options.i18n.paymentMethods
                                    }).prop('outerHTML')
                                }).prop('outerHTML'),
                                $('<div>', {
                                    class: 'AD_BlockContent',
                                    html: $('<ul>', {
                                        class: 'AD_ListInline AD_ListOptions AD_ListPaymentOptions'
                                    }).prop('outerHTML')
                                }).prop('outerHTML'),
                                $('<span>', {
                                    class: 'corners-bottom',
                                    html: $('<span>').prop('outerHTML')
                                }).prop('outerHTML')
                            ].join('')
                        }).prop('outerHTML')
                    });
                    break;
                case 'punbb':
                    result = $('<div>', {
                        id: 'AD_BlockOptions',
                        class: 'AD_Block module main',
                        style: 'margin-bottom: 4px !important;',
                        html: [
                            $('<div>', {
                                class: 'AD_BlockTitle main-head',
                                html: $('<p>', {
                                    text: options.i18n.paymentMethods
                                }).prop('outerHTML')
                            }).prop('outerHTML'),
                            $('<div>', {
                                class: 'AD_BlockContent main-content clearfix',
                                html: $('<ul>', {
                                    class: 'AD_ListInline AD_ListOptions AD_ListPaymentOptions'
                                }).prop('outerHTML')
                            }).prop('outerHTML')
                        ].join('')
                    });
                    break;
                case 'invision':
                    result = $('<div>', {
                        id: 'AD_BlockOptions',
                        class: 'AD_Block box-content',
                        html: [
                            $('<div>', {
                                class: 'maintitle',
                                html: $('<h3>', {
                                    text: options.i18n.paymentMethods
                                }).prop('outerHTML')
                            }).prop('outerHTML'),
                            $('<div>', {
                                class: 'AD_BlockContent',
                                html: $('<ul>', {
                                    class: 'AD_ListInline AD_ListOptions AD_ListPaymentOptions'
                                }).prop('outerHTML')
                            }).prop('outerHTML')
                        ].join('')
                    });
                    break;
            }

            return result;
        }
    };

    $(function() {
        /**
         * Se o usuário não estiver logado, não exibe opções de e-mail
         */
        if (_userdata.user_id === -1) {
            return;
        }

        /**
         * Popula os dados de e-mail do vendedor
         */
        html.getSellerEmails().then(function() {
            var emails;

            emails = false;

            /**
             * Se não houver nenhum e-mail de vendedor, retorn
             */
            $.each(options.methods, function (env, method) {
                if (method.email) {
                    emails = true;
                }
            });

            if (!emails) {
                return false;
            }

            /**
             * Constrói o estilo das opções de pagamento
             */
            style = $('<style>', {
                type: 'text/css',
                text: [
                    '.AD_ListOption .fa {',
                    [
                        'display: block',
                        'margin: auto',
                        'padding: 10px 0',
                        'width: 30px'
                    ].join(';'),
                    '}',
                    '.AD_BlockError {',
                    [
                        'color: #f00'
                    ].join(';'),
                    '}'
                ].join('')
            });

            /**
             * Insere a tag de estilo
             */
            style.appendTo('head');

            /**
             * Insere o FontAwesome, caso definido nas opções
             */
            if (options.fontawesome) {
                $('<link>', {
                    href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
                    rel: 'stylesheet',
                    type: 'text/css'
                }).appendTo('head');
            }

            /**
             * Captura as informações do produto do HTML
             */
            $.extend(options.product, html.getPriceAndCurrency());
            $.extend(options.product, html.getProductName());

            /**
             * Constrói o bloco HTML dos métodos de pagamento
             */
            $('#AD_BlockSeller').after(html.generatePaymentOptionsBlock());

            /**
             * Constrói as opções do menu
             */
            $.each(options.methods, function(env, method) {
                if (method.active && method.email) {
                    html.generatePaymentOption({
                        class: method.html.optionClass,
                        icon: method.html.optionIconClass,
                        title: method.i18n.title
                    }).appendTo('.AD_ListPaymentOptions');

                    $('.' + method.html.optionClass).on('click', function() {
                        $('<form>', {
                            action: method.paymentUrl,
                            method: 'POST',
                            html: html.generateFormInputList(method.generateFormData({
                                email: method.email,
                                price: options.product.price,
                                name: options.product.name,
                                currency: options.product.currency,
                                id: page[1]
                            }))
                        }).submit();
                    });
                }
            });
        });
    });
})(jQuery);