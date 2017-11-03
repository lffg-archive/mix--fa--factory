/*globals jQuery, FA*/

/**
 * Criar inputs na criação do tópico.
 *
 * @author lffg <https://github.com/lffg>
 * @version 1.0
 */

(function ($) {
  'use strict';

  var inputs = [{
    label: 'Label do Input 1',
    placeholder: 'Placeholder do Input 1',
    insert: '[b]Valor do Input 1:[/b] {{CONTENT}}. \n\n', // {{CONTENT}} = O que o usuário colocou.
    required: true
  }, {
    label: 'Label do Input 2',
    placeholder: 'Placeholder do Input 2',
    insert: '[b]Valor do Input 2:[/b] {{CONTENT}}. \n\n', // O caractere especial \n é o mesmo que uma quebra de linha.
    required: true
  }, {
    label: 'Label do Input 3',
    insert: '[b]Valor do Input 3:[/b] {{CONTENT}}. \n\n',
    required: false
  }];

  inputs.reverse();

  window.FA = window.FA || {};
  FA.Posting = FA.Posting || {};

  var Inputs;
  FA.Posting.Inputs = Inputs = function (userConfig) {
    var self = this;
    
    self.defaults = {
      label: undefined,
      placeholder: undefined,
      insert: undefined,
      forums: ['*'],
      required: false
    };

    self.userConfig = userConfig;

    self.config = $.extend({}, self.defaults, self.userConfig);
  };

  Inputs.prototype.init = function () {
    var self = this;

    if (!$.sceditor) {
      return false;
    }

    if (self.config.forums.indexOf('*') === -1) {
      var hrefId = parseInt(location.href.replace(/^.*\/post\?f=(\d+)&.*$/g, '$1'));
      
      if (self.config.forums.indexOf(hrefId) === -1) {
        return false;
      }
    }

    self.generate();
    self.listen(function () {
      self.parse();
    });
  };

  Inputs.prototype.generate = function () {
    var self = this;

    self.$wrapper = $([
      '<dl>',
      '  <dt>',
      '    ' + $('<label>', { 'text': self.config.label }).prop('outerHTML'),
      '  </dt>',
      '  <dd>',
      '    ' + $('<input />', { 'type': 'text' }).prop('outerHTML'),
      '  </dd>',
      '</dl>'
    ].join('\n'));

    self.$input = self.$wrapper.find('input');

    self.$input
      .attr('class', 'inputbox medium fa-generated-input')
      .attr('data-content', self.config.insert)
      .attr('placeholder', self.config.placeholder || '')
    ;

    if (self.config.required) {
      self.$input.attr('required', 'required');
    }

    $('input[name="subject"]')
      .parents('dl')
      .after(self.$wrapper)
    ;
  };

  Inputs.prototype.listen = function (fn) {
    var selectors = [
      '[required]',
      '[required="required"]',
      '[name="subject"]'
    ];

    $('[type="submit"]').on('click', function () {
      if ($(selectors.join(',')).val() === '') {
        return;
      }

      fn();
    });
  };

  Inputs.prototype.parse = function () {
    var self = this;

    var $sceditor = $('#text_editor_textarea').sceditor('instance');

    var content = self.config.insert;
    var value = $.trim(self.$input.val());

    content = content.replace(/{{CONTENT}}/gi, value);

    $sceditor.val(content + $sceditor.val());
  };

  $(function () {
    $.each(inputs, function () {
      var self = this;

      (new FA.Posting.Inputs(self)).init();
    });
  });
}(jQuery));
