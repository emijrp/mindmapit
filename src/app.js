import TreeNode from './js/TreeNode.js';
import * as utils from './js/Util.js';
import parseList from './js/Parser.js';

var vm = new Vue({
    el: '.content',
    data: {
        sourceCode: '',
        currentTree: undefined
    },
    methods: {
        parseSource: function () {
            console.log("Parsing...");

            try {
                var parsed = parseList(this.sourceCode);
            } catch (err) {
                console.log("Woops! Error parsing");

                return;
            }


            if (parsed.length == 0) return;
            parsed = parsed.children[0];

            vm.currentTree = this.parseObjectBranch(parsed, true);
            vm.regenerateDiagram();
        },

        parseObjectBranch: function (branch, isRoot = false) {
            var branchLabel = branch.label;
            var branchChildren = branch.children;

            var node = new TreeNode(branchLabel, isRoot);

            for (var child of branchChildren) {
                node.addChild(this.parseObjectBranch(child, false));
            }

            return node;
        },

        regenerateDiagram: function () {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");

            // Resize canvas to the available size
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            if (!(this.currentTree instanceof TreeNode)) {
                console.log("Not a valid tree", this.currentTree);
                return;
            }

            var beautifulDrawing = this.currentTree.draw();
            canvas.width = beautifulDrawing.width + 25;
            canvas.height = beautifulDrawing.height + 25;

            ctx.drawImage(beautifulDrawing, 25, 25);
        }
    }
});

vm.sourceCode =
    `- Programming
something I love
  - Web Development
    - Front-end development
(stuff for the browsers)
      - Languages
        - HTML
        - CSS
        - JavaScript
      - Tools
        - Bootstrap
    - Back-end development
(stuff for the server)
      - Languages
        - PHP
        - Python
      - Frameworks
        - Django
        - Symphony
  - Desktop development,
which is something pretty hard that
most web developers can't do
  - Mobile development
    - Android
    - iOS
    - Some other stuff
no one cares about
    - LOLWAT
`;

vm.$watch('sourceCode', function (sourceCode) {
    vm.parseSource();
});

vm.parseSource();