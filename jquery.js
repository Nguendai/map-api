/*!
 * jquery.confirm
 *
 * @version 2.3.1
 *
 * @author My C-Labs
 * @author Matthieu Napoli <matthieu@mnapoli.fr>
 * @author Russel Vela
 * @author Marcus Schwarz <msspamfang@gmx.de>
 *
 * @license MIT
 * @url http://myclabs.github.io/jquery.confirm/
 */
(function ($) {
    /**
     * Confirm a link or a button
     * @param [options] {{title, text, confirm, cancel, confirmButton, cancelButton, post, confirmButtonClass}}
     */
    $.fn.confirm = function (options) {
        if (typeof options === 'undefined') {
            options = {};
        }
        this.click(function (e) {
            e.preventDefault();
            var newOptions = $.extend({
                button: $(this)
            }, options);
            $.confirm(newOptions, e);
        });
        return this;
    };
    /**
     * Show a confirmation dialog
     * @param [options] {{title, text, confirm, cancel, confirmButton, cancelButton, post, confirmButtonClass}}
     * @param [e] {Event}
     */
    $.confirm = function (options, e) {
        // Do nothing when active confirm modal.
        if ($('.confirmation-modal').length > 0)
            return;
        // Parse options defined with "data-" attributes
        var dataOptions = {};
        if (options.button) {
            var dataOptionsMapping = {
                'title': 'title',
                'text': 'text',
                'confirm-button': 'confirmButton',
                'cancel-button': 'cancelButton',
                'confirm-button-class': 'confirmButtonClass'
            };
            $.each(dataOptionsMapping, function (attributeName, optionName) {
                var value = options.button.data(attributeName);
                if (value) {
                    dataOptions[optionName] = value;
                }
            });
        }
        // Default options
        var settings = $.extend({}, $.confirm.options, {
            confirm: function () {
                var url = e && (('string' === typeof e && e) || (e.currentTarget && e.currentTarget.attributes['href'].value));
                if (url) {
                    if (options.post) {
                        var form = $('<form method="post" class="hide" action="' + url + '"></form>');
                        $("body").append(form);
                        form.submit();
                    }
                    else {
                        window.location = url;
                    }
                }
            },
            cancel: function (o) {
            },
            button: null
        }, dataOptions, options);
        // Modal
        var modalHeader = '';
        if (settings.title !== '') {
            modalHeader =
                '<div class=modal-header>' +
                    '<h4 class="modal-title">' + settings.title + '</h4>' +
                    '</div>';
        }
        
        var confirmButtonIcon = settings.confirmButtonIcon;

        if (!confirmButtonIcon) {
            confirmButtonIcon = settings.confirmButtonClass == 'btn-danger' ? 'delete' : 'check';
        }

        var modalHTML = '<div class="confirmation-modal modal fade" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            modalHeader +
            '<div class="modal-body">' + settings.text + '</div>' +
            '<div class="modal-footer">' +
            '<a class="confirm btn btn-custom ' + settings.confirmButtonClass + '" type="button" data-dismiss="modal">' +
            '<i class="agr__icon-' + confirmButtonIcon + ' icon-white"></i>' +
                '<span class="btn-text">' + settings.confirmButton + '</span>' +
            '</a>' +
            '<a class="btn btn-custom btn-gray cancel" type="button" data-dismiss="modal">' +
                '<i class="agr__icon-close icon-white"></i>' +
            '<span class="btn-text">' + settings.cancelButton + '</span>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var modal = $(modalHTML);
        modal.on('shown.bs.modal', function () {
            modal.find(".btn-primary:first").focus();
        });
        modal.on('hidden.bs.modal', function () {
            modal.remove();
        });
        modal.find(".confirm").click(function () {
            settings.confirm(settings.button);
            /*ADDED FOR MULTIPLE CONFIRMS ON SINGLE PAGE*/
            modal.remove();
        });
        modal.find(".cancel").click(function () {
            settings.cancel(settings.button);
            /*ADDED FOR MULTIPLE CONFIRMS ON SINGLE PAGE*/
            modal.modal('hide');
            modal.remove();
        });
        // Show the modal
        $("body").append(modal);
        modal.modal('show');
    };
    /**
     * Globally definable rules
     */
    $.confirm.options = {
        text: "Are you sure?",
        title: "",
        confirmButton: "Yes",
        cancelButton: "Cancel",
        post: false,
        confirmButtonClass: "btn-danger",
        confirmButtonIcon: null
    };
})(jQuery);