/*globals jQuery, FA, _userdata*/
 
/**
 * Alterar o ícone do tópico com AJAX.
 *
 * @author lffg {@link https://github.com/lffg}
 * @version 1.2
 * @licence MIT
 */
 
(function ($) {
  'use strict';
 
  var config = [
    { name: 'Resolvido', id  : 4, background: '#8b5', onlyForMod: true },
    { name: 'Em Curso', id  : 1, background: '#ebb537' },
    { name: 'Importante', id: 5, background: '#e3493b', onlyForAdmin: true }
  ];
 
  window.FA = window.FA || {};
  FA.Topic = FA.Topic || {};
 
  var MarkIcon;
  FA.Topic.MarkIcon = MarkIcon = function (config) {
    var self = this;
 
    self.userConfig = config;
    self.defaults = {
      name: undefined,
      id: undefined,
      background: undefined,
      onlyForMod: false,
      onlyForAdmin: false
    };
    
    self.config = $.extend({}, self.defaults, self.userConfig);
 
    $.each(self.config, function (key, value) {
      if (key === undefined) {
        throw new Error ('Não foi especificado um: ' + key + ' para o script de botões.');
      }
 
      if (value === undefined) {
        throw new Error ('Não foi especificado um valor: ' + value + ' para o script de botões.');
      }
    });
  };
 
  MarkIcon.prototype.init = function () {
    var self = this;
 
    var $post = $('.post:first');
    var $link = $post.find('a[href$="mode=editpost"]');
 
    if (!$link.length) {
      return false;
    }
 
    if (this.config.onlyForMod && (_userdata.user_level !== 1 && _userdata.user_level !== 2)) {
      return false;
    }
 
    if (this.config.onlyForAdmin && _userdata.user_level !== 1) {
      return false;
    }
 
    self.messageLink = $link.attr('href');
 
    self.$button = $('<button>', {
      'class'  : 'fa-mark-icon-button',
      'data-id': self.config.id,
      'text'   : self.config.name
    });
 
    self.$button
      .css('background-color', self.config.background)
      .on('click', function (event) {
        event.preventDefault();
 
        self.runAjax();
      })
      .insertBefore($post)
    ;
 
    self.appendStyles();
  };
 
  MarkIcon.prototype.runAjax = function () {
    var self = this;
 
    self.changeText('<i class="fa fa-refresh fa-spin"></i> Marcando...');
 
    $.get(self.messageLink)
      .done(function (context) {
        var $form = $('form[action="/post"]', context);
 
        var encode  = document.charset.toLowerCase() === 'utf-8' ? window.encodeURIComponent : window.escape;
 
        var formData = $form.serializeArray();
 
        var data = {};
        $.each(formData, function () {
          var obj = this;
 
          data[obj.name] = obj.value;
        });
 
        data.post_icon = self.config.id;
        data.post = 1;
 
        var encoded = $.map(data, function (value, key) {
          return key + '=' + encode(value);
        }).join('&');
 
        $.post(self.messageLink, encoded)
          .done(self.changeText('<i class="fa fa-check"></i> Marcado!'))
          .fail(self.error)
        ;
      })
      .fail(self.error)
    ;
  };
 
  MarkIcon.prototype.changeText = function (text) {
    var self = this;
 
    self.runAjax = function () {
      return false;
    };
 
    self.$button
      .html(text)
      .prop('disabled', true)
    ;
  };
 
  MarkIcon.prototype.error = function () {
    var self = this;
 
    alert([
      'Houve um erro ao marcar o tópico como "' + self.config.name + '".',
      'Por favor, contate o suporte técnico.'
    ].join('\n'));
  };
 
  MarkIcon.prototype.appendStyles = function () {
    $('<style>', {
      'text': [
        '.fa-mark-icon-button {',
        '  padding: 8px 8px 8px 8px;',
        '  border: none;',
        '  color: #fff;',
        '  margin: 10px 0 10px 6px;',
        '  box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.08);',
        '  border-radius: 3px;',
        '}'
      ].join('\n')
    }).appendTo('head');
  };
 
  $(function () {
    $.each(config, function () {
      var self = this;
 
      (new FA.Topic.MarkIcon(self)).init();
    });
  });
}(jQuery));
