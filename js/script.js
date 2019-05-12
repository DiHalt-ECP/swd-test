
(function(window) {

 'use strict';
  window.addEventListener('load', function() {
    var w = window, d = window.document, msg;
    var form = d.getElementById("request");

    if (!form) {return;}

    form.addEventListener('submit', formSubmitValidate);

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
          mail: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          // +d (ddd)-ddd-dd-dd
          phone: /^\+\d[\s-]\(\d{3}\)-\d{3}-\d{2}-\d{2}/,
          // phone: /^\d{11,12}$/,
        };

        var elemValidated = Array.prototype.filter.call(formItems, checkFieldValidate(validPattern)).map(fieldValidate(validPattern));

        formSubmitShowValid(elemValidated);
        return valid;


        function checkFieldValidate(validPattern) {
          return function (item) {
            // input field doesn't need to validate
            return item.name in validPattern;
          }
        }

        function fieldValidate(validPattern) {
          return function (item) {

            // PHONE input field normalizes to our phone format
            (item.name == 'phone') && (item.value = phoneNormalize(item.value));

            // input field empty or not valid - add elem to error array
            // Not valid
            return ((!item.value || validPattern[item.name] && !validPattern[item.name].test(item.value)) && (valid=false,{item: item,valid: false}))
            // Valid
            || ({item: item,valid: true});
          }
        }

        function phoneNormalize(phone) {
          // 7-999-123-45-67
          var rePhoneFormat = /^(\d)(?:(\d{1,3})(?:(\d{1,3})(?:(\d{1,2})(?:(\d{1,2}))?)?)?)?/,
              // Phone format to output: +7 (999)-123-45-67
              f = ['+', ' (', ')-', '-', '-', '-'];

          // Only Numbers
          phone = phone.replace(/[^\d]/gi, '');

          // Numbers convert to our phone format
          return phone.replace(rePhoneFormat, function () {
            // All matches except for undefined
            var m = Array.prototype.slice.call(arguments, 1, 6).filter(function(i) {return undefined !== i;});
            return m.reduce(function (acc, val, i) {
              return val ? acc + f[i] + val : acc;
            }, '');
          });
        }
      };


      function formSubmitShowValid(elems) {
        var errLabels = elems.filter(elemProcess).map(getElemLabel);
        return errLabels.length && showErrMsg(errLabels);


        function showErrMsg(labels) {
          var body = d.body || d.getElementsByTagName('body')[0];

          msg = msg || createTag('div', 'overlay message error');
          msg.innerHTML = '';

          // Create CLOSE button
          var closeElem = createTag('div', 'remove', 'x');

          var closeEvent = function (e) {
            if (e.target !== closeElem && e.target !== this) {return}
            this.removeEventListener('click', closeEvent);
            msg.parentNode.removeChild(msg);
          }

          msg.addEventListener('click', closeEvent);

          var msgContent = createTag('div', 'content');
          msgContent.appendChild(createTag('h6', 'title', 'Следующие поля пустые или неправильно заполнены:'));

          // List of invalid field Labels
          labels.forEach( function(label) {
            msgContent.appendChild(createTag('p', 'label-err', label))
          });

          msg.appendChild(createTag('div', 'wrapper')).appendChild(msgContent);
          msg.firstChild.insertBefore(closeElem, msgContent);

          body.appendChild(msg);
        }

        function elemProcess(elem) {
          if (!elem || 'object' !== typeof elem) {return false};

          setElemClasses(elem.item, elem.valid);
          return !elem.valid;
        }

        function getElemLabel(elem) {
          elem = elem.item || elem;
          return elem.parentNode && elem.parentNode.querySelector('label') && elem.parentNode.querySelector('label').textContent || elem.name;
        }

        function setElemClasses(elem, valid) {
          elem.classList.remove('error', 'pass');
          elem.classList.add(valid ? 'pass' : 'error');
        }
      }

    }




    /*
     *  Helper functions
     **********************************/

    // Create TAG Element with class attribute and content
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
