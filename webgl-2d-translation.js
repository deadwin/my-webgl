"use strict";
var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

uniform vec2 u_translation;

// all shaders have a main function
void main() {

  // convert the position from pixels to 0.0 to 1.0
  vec2 position = a_position + u_translation;
  vec2 zeroToOne = position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;
var fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;
function main() {
    console.log("main")
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        debugger
        return;
    }
    console.log(gl, "this is gl");
    var program = webglUtils.createProgramFromSources(gl,
        [vertexShaderSource, fragmentShaderSource]);
    console.log(program, "program");


    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    let colorLocation = gl.getUniformLocation(program, "u_color");
    let translationLocation = gl.getUniformLocation(program, "u_translation");

    let positionBuffer = gl.createBuffer();
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);


    let translation = [0, 0];
    let width = 100;
    let height = 30;
    let color = [Math.random(), Math.random(), Math.random(), 1];


    let maxWidth = gl.canvas.width;
    let maxHeight = gl.canvas.height;



    window.updatePosition = (x, y) => {
        translation[0] = x;
        translation[1] = y;
        drawScene();
    }

    setRectangle(gl, 0, 0, width, height);

    drawScene();
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, maxWidth, maxHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniform2f(resolutionUniformLocation, maxWidth, maxHeight);


        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


        gl.uniform4fv(colorLocation, color);

        gl.uniform2fv(translationLocation, translation);
        let primitiveType = gl.TRIANGLES;
        let offset = 0;
        let count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    function setRectangle(gl, x, y, width, height) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x, y,
            x + width, y,
            x, y + height,
            x, y + height,
            x + width, y,
            x + width, y + height
        ]), gl.STATIC_DRAW);
    }


}
main();