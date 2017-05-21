/*
 * Collapse plugin for jQuery
 */
 (function ($) {
   $.fn.collapse = function(options) {
     var defaults = {
       accordion: undefined,
       onOpen: undefined,
       onClose: undefined
     };

     options = $.extend(defaults, options);

     return this.each(function() {

       var $this = $(this);

       var $panel_headers = $(this).find('> li > .header');

       var collapse_type = $this.data("collapse");

       $this.off('click.collapse', '> li > .header');
       $panel_headers.off('click.collapse');

       function accordionOpen(object) {
         $panel_headers = $this.find('> li > .header');
         if (object.hasClass('active')) {
           object.parent().addClass('active');
         }
         else {
           object.parent().removeClass('active');
         }
         if (object.parent().hasClass('active')){
           object.siblings('.content').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
         }
         else{
           object.siblings('.content').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
         }

         $panel_headers.not(object).removeClass('active').parent().removeClass('active');

         $panel_headers.not(object).parent().children('.content').stop(true,false).each(function() {
           if ($(this).is(':visible')) {
             $(this).slideUp({
               duration: 350,
               easing: "easeOutQuart",
               queue: false,
               complete:
                 function() {
                   $(this).css('height', '');
                   execCallbacks($(this).siblings('.header'));
                 }
             });
           }
         });
       }

       function expandableOpen(object) {
         if (object.hasClass('active')) {
           object.parent().addClass('active');
         }
         else {
           object.parent().removeClass('active');
         }
         if (object.parent().hasClass('active')){
           object.siblings('.content').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
         }
         else {
           object.siblings('.content').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
         }
       }

       function collapseOpen(object) {
         if (options.accordion || collapse_type === "accordion" || collapse_type === undefined) { // Handle Accordion
           accordionOpen(object);
         } else {
           expandableOpen(object);
         }

         execCallbacks(object);
       }

       function execCallbacks(object) {
         if (object.hasClass('active')) {
           if (typeof(options.onOpen) === "function") {
             options.onOpen.call(this, object.parent());
           }
         } else {
           if (typeof(options.onClose) === "function") {
             options.onClose.call(this, object.parent());
           }
         }
       }

       /**
        * Check if object is children of panel header
        * @param  {Object}  object Jquery object
        * @return {Boolean} true if it is children
        */
       function isChildrenOfPanelHeader(object) {

         var panelHeader = getPanelHeader(object);

         return panelHeader.length > 0;
       }

       /**
        * Get panel header from a children element
        * @param  {Object} object Jquery object
        * @return {Object} panel header object
        */
       function getPanelHeader(object) {

         return object.closest('li > .header');
       }

       $this.on('click.collapse', '> li > .header', function(e) {
         var element = $(e.target);

         if (isChildrenOfPanelHeader(element)) {
           element = getPanelHeader(element);
         }
         element.toggleClass('active');
         collapseOpen(element);
       });

       if (options.accordion || collapse_type === "accordion" || collapse_type === undefined) {
         collapseOpen($panel_headers.filter('.active').first());
       } else {
         $panel_headers.filter('.active').each(function() {
           collapseOpen($(this));
         });
       }

     });
   };
 }( jQuery ));
