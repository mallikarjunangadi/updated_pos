angular.module('draggable', []) 
 .directive('ngDraggable', function($document, $window){
  function makeDraggable(scope, element, attr) {
    var startX = 0;
    var startY = 0;
    console.log("inside ngDraggable");

    // Start with a random pos
    var x = Math.floor((Math.random() * 500) + 40);
    var y = Math.floor((Math.random() * 360) + 40);

    element.css({
      position: 'absolute',
      cursor: 'pointer',
      top: y + 'px',
      left: x + 'px'
    });


    element.on('mousedown', function(event) {
        event.stopPropagation();
        console.log("mouse down occured");
      event.preventDefault();
      
      startX = event.pageX - x;
      startY = event.pageY - y;

      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {
           event.stopPropagation();
           console.log("mousemove occured");
      y = event.pageY - startY;
      x = event.pageX - startX;

      element.css({
        top: y + 'px',
        left: x + 'px'
      });
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  }
  return {
    link: makeDraggable
  };
});