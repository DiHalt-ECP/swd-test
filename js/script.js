
(function(window) {

 'use strict';
  window.addEventListener('load', function() {
    var w = window, d = window.document;
    var form = d.getElementById("request");

    if (!form) {return;}

    // Form submit processing.
    form.addEventListener('submit', formSubmitValidate);

    // Validate the form and show error messages if necessary.
    function formSubmitValidate(e) {
      e.target.querySelector("input[type=button], input[type=submit]").blur();
      var formItems = form && form.querySelectorAll("input[type=text]");

      if (!formItems) {
        e.preventDefault();
        return false;
      }

      if (validateForm(formItems)) {
        // e.preventDefault();
        return true;
      } else {
        e.preventDefault();
        return false;
      }


      function validateForm(formItems) {
        var valid = true;
        var validPattern = {
          name: /.{2,}/,
          mail: /^[A-ZА-Яа-я0-9._%+-]+@[A-ZА-Яа-я0-9.-]+\.[А-Яа-яA-Z]{2,}$/i,
          // +d (ddd)-ddd-dd-dd
          phone: /^\+\d[\s-]\(\d{3}\)-\d{3}-\d{2}-\d{2}/,
          // phone: /^\d{11,12}$/,
        };

        var messages = Array.prototype.reduce.call(formItems, fieldValidate, []);

        messages.length && showMessage(messages);

        return !messages.length;


        // item - input element.
        function fieldValidate(acc, item, i) {

          // input field doesn't need to validate.
          if (!(item.name in validPattern)) {return acc};

          // PHONE input field normalizes to our phone format.
          (item.name == 'phone') && (item.value = phoneNormalize(item.value));

          var msg = undefined;

          // input field empty or not valid - add message to error array.
          if (!item.value || !item.value.length) {
            msg = {
              label: getFieldLabel(item) + ': ',
              text:  'поле обязательно для заполнения.'
            };
          } else if (!validPattern[item.name].test(item.value)) {
            msg = {
              label: getFieldLabel(item) + ': ',
              text:  'введите корректное значение.'
            };
          }

          setFieldValidClasses(item, !msg);
          msg && acc.push(msg);

          return acc;
        }
        function phoneNormalize(phone) {
          // 7-999-123-45-67
          var rePhoneFormat = /^(\d)(?:(\d{1,3})(?:(\d{1,3})(?:(\d{1,2})(?:(\d{1,2}))?)?)?)?/,
              // Phone format to output: +7 (999)-123-45-67
              f = ['+', ' (', ')-', '-', '-', '-'];

          // Only Numbers.
          phone = phone.replace(/[^\d]/gi, '');

          // Numbers convert to our phone format.
          return phone.replace(rePhoneFormat, function () {
            // All matches except for undefined
            var m = Array.prototype.slice.call(arguments, 1, 6);
            return m.reduce(function (acc, val, i) {
              return val ? acc + f[i] + val : acc;
            }, '');
          });
        }
        function getFieldLabel(elem) {
          // elem = elem.item || elem;
          return elem && (elem.parentNode && elem.parentNode.querySelector('label') && elem.parentNode.querySelector('label').textContent || elem.name) || '?';
        }
        function setFieldValidClasses(elem, valid) {
          elem.classList.remove('error', 'pass');
          elem.classList.add(valid ? 'pass' : 'error');
        }
      }
    }


    // Show message for User.
    function showMessage(messages) {
      var messageBox = document.getElementById("message-user");
      var messageContent = messageBox.querySelector('.message__item-messages');
      messageContent.innerHTML = '';

      // List of messages.
      messages = messages.filter(function(msg) {
        if (typeof msg !== 'string') {
          msg.label && messageContent.appendChild(createTag('p', 'label', msg.label));
          msg = msg.text || '';
        }
        messageContent.appendChild(createTag('p', 'msg', msg));
        return false;
      });
      messageBox.classList.add('show');

      // Close message popup.
      messageBox.addEventListener('click', close);

      function close(e) {
        if (e.target !== this.querySelector('.button-close') && e.target !== this) {return}
        this.removeEventListener('click', close);
        this.classList.remove('show');
      }
    }

    /*
     *  Helper functions
     **********************************/

    // Create TAG Element with class attribute and content.
    function createTag(tag, className, text) {
      var newTag = document.createElement(tag);
      if (className) {
        newTag.setAttribute('class', className);
      }
      if (text) {
        newTag.textContent = text;
      }
      return newTag;
    }

  });


})(window);
