var id = 0;
var blocks = {};
var blocksEl, blockTemplate;
function createBlock() {
  id++;

  var blockEl = blockTemplate.cloneNode(true);
  blockEl.id = "block" + id;

  var editorEl = blockEl.getElementsByClassName("text-editor")[0];
  var editor = ace.edit(editorEl);
            editor.session.setMode("ace/mode/python");
            editor.session.setOptions({
              tabSize: 2,
            });

  var runButtonEl = blockEl.getElementsByClassName("run-button")[0];
  runButtonEl.addEventListener("click", runCode);

  var canvasEl = blockEl.getElementsByClassName("p5-canvas-container")[0];
  canvasEl.id = "canvas" + id;

  blocks[blockEl.id] = {
    editor: editor,
    canvasId: "canvas" + id
  };

  blocksEl.appendChild(blockEl);
}

function runCode(e) {
  var runButtonEl = e.target;
  var blockEl = runButtonEl.parentElement;
  var block = blocks[blockEl.id];
  var editor = block.editor;
  
  var sketchCode = editor.getValue();

  var code = createPy5Code(sketchCode, block.canvasId); 

  if (block.p5) {
    block.p5.canvas.remove();
  }

  p5 = pyodide.runPython(code);
  block.p5 = p5;
}

window.onload = function() {
  blocksEl = document.getElementById("blocks");
  blockTemplate = document.getElementById("blockTemplate");

  var addButtonEl = document.getElementsByClassName("add-button")[0];
  addButtonEl.addEventListener("click", createBlock);

  createBlock();
  createBlock();
};