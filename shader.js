"use strict";
// 从这里开始
function getGl2() {
    const canvas = document.createElement('canvas');
    document.getElementsByTagName('body')[0].appendChild(canvas);
    canvas.width = 400;
    canvas.height = 300;
    // const canvas = document.querySelector("#glcanvas");
    // 初始化WebGL上下文
    const gl = canvas.getContext("webgl2");

    // 确认WebGL支持性
    if (!gl) {
        alert("无法初始化WebGL2，你的浏览器、操作系统或硬件等可能不支持WebGL。");
        return;
    }

    // 使用完全不透明的黑色清除所有图像
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 用上面指定的颜色清除缓冲区
    // gl.clear(gl.COLOR_BUFFER_BIT);
    console.log(gl, "gl2");
    return gl;
}

function createVertexShaderSource() {
    var vertexShaderSource = `#version 300 es
 
    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;

    // all shaders have a main function
    void main() {
     
      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }
    `;
    return vertexShaderSource;
}

function createFragmentShaderSource() {
    var fragmentShaderSource = `#version 300 es
 
    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;
     
    uniform vec4 u_color;

    // we need to declare an output for the fragment shader
    out vec4 outColor;
     
    void main() {
      // Just set the output to a constant reddish-purple
    //   outColor = vec4(1, 0, 0.5, 1);
        outColor = u_color;
    }
    `;
    return fragmentShaderSource;
}



function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

function createProgram(gl) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, createVertexShaderSource());
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, createFragmentShaderSource());


    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}


function main() {
    let gl = getGl2();
    let program = createProgram(gl);
    if (!program) {
        debugger;
        return;
    }
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let positions = [
        0, 0,
        0, 0.5,
        -1, 0,
        -1, 0,
        -1, 0.5,
        0, 0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);



    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);


    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    var offset = 0;

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(vao);



    let colorLocation = gl.getUniformLocation(program, "u_color");

    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);


    let primitiveType = gl.TRIANGLES;
    var offset = 0;
    let count = 6;
    gl.drawArrays(primitiveType, offset, count);

    for (var ii = 0; ii < 50; ++ii) {
        // Put a rectangle in the position buffer
        setRectangle(gl, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        // Set a random color.
        gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        // Draw the rectangle.
        var primitiveType1 = gl.TRIANGLES;
        var offse1t = 0;
        var count1 = 3;
        gl.drawArrays(primitiveType1, offse1t, count1);
    }
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
    ]), gl.STATIC_DRAW);

}
main();