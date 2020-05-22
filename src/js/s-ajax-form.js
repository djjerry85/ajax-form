(function ($) {
    $.fn.sAjaxForm = function (options) {
        let defaults = {
                url: '/include/ajax/call.php',
            },
            settings = $.extend(defaults, options);

        if (typeof showPopup != 'function') {
            console.error("sAjaxForm: Function 'showPopup' is not defined");
        }

        function getFormValues($form) {
            let res = {};
            $form.find('input,textarea').each(function () {
                res[$(this).attr('name')] = $(this).val();
            });
            return res;
        }

        function disposeValidation($form) {
            $form.find('.bad').removeClass('bad');
        }

        function setValidation($form, res) {
            $.each(res, function (index, item) {
                $form.find('[name=' + item.name + ']').addClass('bad');
                if (item.name == 'user-consent') {
                    $form.find('[name=' + item.name + ']').closest('.input_item').addClass('bad');
                }
            });
        }

        function initForm(form) {
            let $el = $(form);
            let meta = {
                method: $el.attr('method') || 'POST',
                hashtag: $el.data('hashtag'),
                endpoint: $el.data('endpoint'),
                popup: $el.data('popup')
            };

            $el.on('submit', function (e) {

                $el.find('button, input[type="submit"]').attr("disabled", true);
                e.preventDefault();
                disposeValidation($el);


                let data = {};
                let dataRaw = $el.serializeArray();

                data = dataRaw;


                let options = {
                    url: settings.url,
                    type: 'POST',
                    dataType: 'json',
                    data: data
                };

                if ($el.find('input[type="file"]').length) {
                    data = {};
                    $.each(dataRaw, function (index, item) {
                        data[item.name] = item.value;
                    });
                    let files = $el.find('input[type="file"]').get(0).files;
                    let dataF = new FormData();
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i];

                        // Check the file type.
                        /* if (!file.type.match('image.*')) {
                         continue;
                         }*/

                        // Add the file to the request.
                        dataF.append('files[]', file, file.name);
                    }
                    $.each(dataRaw, function (index, item) {
                        dataF.append(item.name, item.value);
                    });
                    options.data = dataF;
                    options.processData = false;
                    options.contentType = false;
                }

                $.ajax(
                    $.extend(options, {
                        error: function () {
                            $el.find('button, input[type="submit"]').attr("disabled", false);
                            alert("Во время отправки формы произошла ошибка... Попробуйте еще раз, либо свяжитесь с нами по телефону");
                            console.log('Error while submit form');
                            console.log(arguments);
                        },
                        success: function (res) {
                            $el.find('button, input[type="submit"]').attr("disabled", false);
                            if (res.errors) {
                                setValidation($el, res.fields);
                                $el.trigger('submit-error');
                            } else {
                                if (meta.hashtag) {
                                    window.location.hash = '#' + meta.hashtag;
                                }
                                if (meta.popup) {
                                    closePopup();
                                    setTimeout(function () {
                                        showPopup(meta.popup);
                                    }, 500);
                                }

                                $el.trigger('submit-success');
                            }
                        }
                    })); //
            });


            $el.find('[data-role=submit]').on('click', function (e) {
                e.preventDefault();
                $el.trigger('submit');
            });
            $el.on('submit-success', function () {
                $el.find('textarea, input[type="text"], input[type="email"]').val('');
            })
        }


        return this.each(function () {
            initForm(this);
        });
    };
})(jQuery);