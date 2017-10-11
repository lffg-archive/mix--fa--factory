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
        { name: 'Ação 1', text: 'Texto da ação 1.', icon: 'fa fa-cog' },
        { name: 'Ação 2', text: 'Texto da ação 2.', icon: 'fa fa-cog' },
        { name: 'Ação 3', text: 'Texto da ação 3.', icon: 'fa fa-cog' }
      ]
    }
  ];

  window.FA = window.FA || {};
  FA.Topic = FA.Topic || {};

  var ModButtons;
  FA.Topic.ModButtons = ModButtons = function (userConfig) {
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

    self.createStyles();
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
      'class'       : 'sceditor-button',
      'unselectable': 'on',
      'title'       : self.config.name,
      'data-id'     : self.config.id,
      'html'        : $('<div>', { 'unselectable': 'on' }).css('background-image', 'url(' + self.config.img + ')').prop('outerHTML')
    });

    switch (isDrop) {
      case true:
        self.$element.attr('data-dropdown', 'true');

        self.createChildren();
        self.documentListen();

        self.$element.on('click', function (event) {
          event.preventDefault();
          event.stopPropagation();

          var $this = $(this);

          var offset = $this.offset();
          var height = $this.height();

          self.$dropdown
            .css('position', 'absolute')
            .css('top', offset.top + height)
            .css('left', offset.left)
            .toggle()
          ;
        });
        
        break;

      case false:
        self.$element
          .attr('data-dropdown', 'false')
            .attr('data-text', self.config.text)
              .on('click', function (event) {
                self.insertText($(this), event);
              })
        ;
        
        break;
    }

    if (self.config.inGroup) {
      self.$group.append(self.$element);

      return;
    }
    
    $('<div>', { 'class': 'sceditor-group' })
      .insertBefore(self.$group)
        .append(self.$element)
    ;
  };
  
  ModButtons.prototype.createChildren = function () {
    var self = this;
    
    self.$dropdown = $('<div>', { 'class': 'sceditor-dropdown fa-mod-buttons-prototype-dropdown' });
    
    $.each(self.config.children, function (index, child) {
      $('<a>', {
        'data-text': child.text,
        'title'    : child.name,
        'html'     : [
          $('<i>', { 'class': child.icon }).prop('outerHTML'),
          $('<span>', { 'text': child.name }).prop('outerHTML')
        ].join('\n')
      })
        .appendTo(self.$dropdown)
          .on('click', function (event) {
            self.insertText($(this), event);

            self.$dropdown.hide();
          })
      ;
    });

    self.$dropdown
      .hide()
        .appendTo('body')
    ;
  };

  /**
   * @param {string} text - Corresponde ao texto que será inserido no editor.
   */
  ModButtons.prototype.insertText = function (context, contextEvent) {
    contextEvent.preventDefault();
    contextEvent.stopPropagation();

    var $this = $(context);

    var $textarea = $('#text_editor_textarea');
    var $sceditor = $textarea.sceditor('instance');

    $sceditor.insertText($this.attr('data-text'));
  };

  ModButtons.prototype.documentListen = function () {
    var self = this;
    
    self.$dropdown.on('click', function (event) {
      event.stopPropagation();
    });
    
    $(document).on('click', function (event) {
      self.$dropdown.hide();
    });
  };

  ModButtons.prototype.createStyles = function () {
    $('<style>', {
      'text': [
        '.fa-mod-buttons-prototype-dropdown {',
        '  padding: 0px !important;',
        '  margin-top: 5px !important;',
        '  min-width: 120px;',
        '  max-height: 200px;',
        '  overflow-y: auto;',
        '}',
        '',
        '.fa-mod-buttons-prototype-dropdown > a {',
        '  display: block;',
        '  padding: 8px 10px;',
        '  border-bottom: solid 1px #ddd;',
        '  font-size: 10px;',
        '  cursor: pointer;',
        '}',
        '',
        '.fa-mod-buttons-prototype-dropdown > a:last-child {',
        '  border-bottom: none;',
        '}',
        '',
        '.fa-mod-buttons-prototype-dropdown > a > i {',
        '  font-size: 12px;',
        '  vertical-align: middle;',
        '}'
      ].join('\n')
    }).appendTo('head');
  };

  $(window).on('load', function () {
    $.each(buttons, function () {
      var self = this;

      (new FA.Topic.ModButtons(self)).init();
    });
  });
}(jQuery));
