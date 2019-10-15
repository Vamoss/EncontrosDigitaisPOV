var id = 0;
var blocks = {};
var blocksEl, blockTemplate;
function createBlock() {
  id++;

  var blockEl = blockTemplate.cloneNode(true);
  blockEl.id = "block" + id;

  var runButtonEl = blockEl.getElementsByClassName("run-button")[0];
  runButtonEl.addEventListener("click", runCode);

  var canvasEl = blockEl.getElementsByClassName("canvas-container")[0];
  canvasEl.id = "canvas" + id;

  var editorEl = blockEl.getElementsByClassName("text-editor")[0];
  var editor = ace.edit(editorEl);
            editor.session.setMode("ace/mode/python");
            editor.setOptions({
              maxLines: Infinity
            });

  editor.commands.addCommand({
    name: "runCode",
    bindKey: {win: "Shift-Enter", mac: "Shift-Enter"},
    exec: function(editor) {
      runButtonEl.click();
    }
  });

  blocks[blockEl.id] = {
    id: id,
    editor: editor,
    canvasId: "canvas" + id
  };

  blocksEl.appendChild(blockEl);

  //auto run
  runButtonEl.click();
}

function runCode(e) {
  var runButtonEl = e.target;
  var blockEl = runButtonEl.closest(".block");
  var block = blocks[blockEl.id];
  var editor = block.editor;
  
  var sketchCode = editor.getValue();

  var code = createPy5Code(sketchCode, block.id, block.canvasId); 

  if (block.p5) {
    block.p5.canvas.remove();
  }

  p5 = pyodide.runPython(code);
  console.log(p5)
  block.p5 = p5;
}

// Initialize Pyodide, import document, py, window, into python's scope.
languagePluginLoader.then(() => {
  pyodide.runPython(`
    import io, code, sys
    from js import pyodide, p5, window, document
  `);

  blocksEl = document.getElementById("blocks");
  blockTemplate = document.getElementById("blockTemplate");

  var addButtonEl = document.getElementsByClassName("add-button")[0];
  addButtonEl.addEventListener("click", createBlock);

  createBlock();

  document.body.classList.remove("loading");
});