/*globals jQuery, FA, _userdata*/
 
/**
 * Botões de moderação para o SCEditor.
 *
 * @author lffg <https://github.com/lffg>
 * @version 1.0
 */

(function ($) {
  'use strict';

  var buttons = [
    {
      name      : 'Tópico Bloqueado',
      id        : 'topic-block-button',
      text      : 'Olá, o tópico foi bloqueado... [...]',
      topics    : ['*'], // Se você quiser que apareça em todos, basta remover essa linha.
      img       : 'http://i.imgur.com/z5lPhgz.png',
      onlyForMod: true,
    }
  ];

  window.FA = window.FA || {};
  FA.Topics = FA.Topics || {};

  var ModButtons;
  FA.Topics.ModButtons = ModButtons = function (userConfig) {
    var self = this;

    self.userConfig = userConfig;
    self.defaults = {
      name        : undefined,
      id          : '',
      topics      : ['*'],
      text        : undefined,
      img         : undefined,
      onlyForMod  : false,
      onlyForAdmin: false
    };

    self.config = $.extend({}, self.defaults, self.userConfig);

    $.each(self.config, function (key, value) {
      if (key === undefined) {
        throw new Error ('Não foi especificado um: ' + key + ' para o script de botões de moderação.');
      }
 
      if (value === undefined) {
        throw new Error ('Não foi especificado um valor: ' + value + ' para o script de botões de moderação.');
      }
    });
  };

  ModButtons.prototype.init = function () {
    if (this.config.onlyForMod && (_userdata.user_level !== 1 && _userdata.user_level !== 2)) {
      return false;
    }
 
    if (this.config.onlyForAdmin && _userdata.user_level !== 1) {
      return false;
    }
    
    if (this.config.topics.indexOf('*') === -1) {
      var topicId = parseInt(location.href.replace(/.*\/t(\d+).*|.*\/post\?t=(\d+)&.*/gi, function (string, match1, match2) {
        if (match1 === undefined) {
          return match2;
        }

        return match1;
      }));

      if (this.config.topics.indexOf(topicId) === -1) {
        return false;
      }
    }

    console.log('ok');
  };

  $(function () {
    $.each(buttons, function () {
      var self = this;

      (new FA.Topics.ModButtons(self)).init();
    });
  });
}(jQuery));
