(function () {
    'use strict';

    angular
        .module('<your-module>')
        .directive('contenteditable', contenteditable);

    /* @ngInject */
    function contenteditable($window) {
        return {
          restrict: 'A', // only activate on element attribute
          require: '?ngModel', // get a hold of NgModelController
          link: link
        };

        //////////////

        /* @ngInject */
        function link($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            $ngModel.$render = function () {
                $element.html($ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            $element.on('keyup change', function () {
                $scope.$apply(readViewText);
            });

            // save selection on blur and restore it on focus
            var position;
            $element.on('blur', function () {
                if ($window.getSelection().rangeCount) {
                    var range = $window.getSelection().getRangeAt(0);

                    position = {
                        startContainer: range.startContainer,
                        startOffset: range.startOffset,
                        endContainer: range.endContainer,
                        endOffset: range.endOffset
                    };
                }
            });

            $element.on('focus', function () {
                if (position) {
                    var range = new Range(this);

                    range.setStart(position.startContainer, position.startOffset);
                    range.setEnd(position.endContainer, position.endOffset);

                    $window.getSelection().removeAllRanges();
                    $window.getSelection().addRange(range);

                    position = null;
                }
            });

            // No need to initialize, AngularJS will initialize the text based on ng-model attribute

            //////////////////

            // Write data to the model
            function readViewText() {
                var html = $element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if ($attrs.stripBr && html == '<br>') {
                    html = '';
                }
                $ngModel.$setViewValue(html);
            }
        }
    }
} ());
