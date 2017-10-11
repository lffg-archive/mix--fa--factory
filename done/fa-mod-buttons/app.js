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
      topics    : ['*'],
      img       : 'https://i.imgur.com/z5lPhgz.png',
      onlyForMod: true
    }, {
      name        : 'Lista de Ações',
      id          : 'topic-actions-list',
      topics      : ['*'],
      img         : 'https://i.imgur.com/oAGWDdG.png',
      inGroup     : false,
      onlyForAdmin: false,
      children    : [
        { name: 'Ação 1', text: 'Texto da ação 1.', img : 'https://i.imgur.com/oAGWDdG.png' },
        { name: 'Ação 2', text: 'Texto da ação 2.', img : 'https://i.imgur.com/oAGWDdG.png' },
        { name: 'Ação 3', text: 'Texto da ação 3.', img : 'https://i.imgur.com/oAGWDdG.png' }
      ]
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
      inGroup     : true,
      topics      : ['*'],
      text        : '',
      children    : false,
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
    var self = this;
    
    if (self.config.onlyForMod && (_userdata.user_level !== 1 && _userdata.user_level !== 2)) {
      return false;
    }
    
    if (self.config.onlyForAdmin && _userdata.user_level !== 1) {
      return false;
    }
    
    if (self.config.topics.indexOf('*') === -1) {
      var topicId = parseInt(location.href.replace(/.*\/t(\d+).*|.*\/post\?t=(\d+)&.*/gi, function (string, match1, match2) {
        if (match1 === undefined) {
          return match2;
        }
    
        return match1;
      }));
    
      if (self.config.topics.indexOf(topicId) === -1) {
        return false;
      }
    }

    if (Array.isArray(self.config.children) && self.config.children.length >= 1) {
      self.createButton(true);
    } else {
      self.createButton(false);
    }
  };

  /**
   * @param {boolean} isDrop Se for true, significa que o botão tem filhos. 
   *                         Caso contrário, o botão não tem filhos.
   */
  ModButtons.prototype.createButton = function (isDrop) {
    var self = this;
    
    if (!$.sceditor) {
      return false;
    }
    
    self.$group = $('.sceditor-group:last');
    self.$element = $('<a>', {
      'class'       : 'sceditor-button fa-mod-buttons-prototype-listen',
      'unselectable': 'on',
      'title'       : self.config.name,
      'data-id'     : self.config.id,
      'html'        : $('<div>', { 'unselectable': 'on' }).css('background-image', 'url(' + self.config.img + ')').prop('outerHTML')
    });

    switch (isDrop) {
      case true:
        self.$element
          .attr('data-dropdown', 'true')
        ;

        var dropdownId = self.createChildren();
        
        break;

      case false:
        self.$element
          .attr('data-dropdown', 'false')
          .attr('data-text', self.config.text)
        ;
        
        break;
    }

    if (self.config.inGroup) {
      self.$group.append(self.$element);
    } else {
      $('<div>', { 'class': 'sceditor-group' })
        .insertBefore(self.$group)
          .append(self.$element)
      ;
    }

    self.listen(isDrop);
    console.log(self.end());
  };
  
  ModButtons.prototype.createChildren = function () {
    
  };

  ModButtons.prototype.listen = function () {
    $('.fa-mod-buttons-prototype-listen').on('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      var $this = $(this);

      var $textarea = $('#text_editor_textarea');
      var $sceditor = $textarea.sceditor('instance');

      $sceditor.insertText($this.attr('data-text'));
    });
  };

  ModButtons.prototype.end = function () {
    var self = this;
    
    return 'Botão cujo nome é: `' + self.config.name + '` criado com sucesso.';
  };

  $(function () {
    $.each(buttons, function () {
      var self = this;

      (new FA.Topics.ModButtons(self)).init();
    });
  });
}(jQuery));
