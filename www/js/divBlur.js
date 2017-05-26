angular.module('divBlur', [])

 .directive('detectOutsideClick', function($document){
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            console.log("in divBlurFunc");
          elem.bind('click', function(e) {
            // this part keeps it from firing the click on the document.
            e.stopPropagation();
          });
          $document.bind('click', function() {
            // magic here.
              scope[attr.perform]();
            scope.$apply(attr.detectOutsideClick);
            console.log('clicked outside2');
          })
        }
      }
    });

 