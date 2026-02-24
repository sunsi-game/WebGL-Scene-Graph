"use strict";
var canvas;
var gl;
var program;
var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

var texture;
var texcoordBuffer;
var vTexCoord;

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var torsoId = 0;
var headId  = 1;
var mouthId = 2; 
var backId = 3; 
var leftId = 4;   
var leftId2 = 4;  
var leftId3 = 4;    
var rightId = 5;    
var rightId2 = 5;   
var rightId3 = 5;  
var tailupperId = 6;   
var taillowwerId = 7;   

var torsoHeight = 5;
var torsoWidth_x = 8;
var torsoWidth_z = 4;
var headHeight = 5;
var headWidth = 5;
var mouthHeight = 1;
var mouthWidth_x = 2;
var mouthWidth_z = 2;
var Height = 3.5;
var Width_x = 2.5;
var Width_z  = 1;
var tailupperHeight  = 3;
var tailupperWidth_x  = 4;
var tailupperWidth_z  = 3;
var taillowwerHeight  = 1;
var taillowwerWidth_x  = 4;
var taillowwerWidth_z  = 8;

var numNodes = 8;
var theta = [0, 0, 0, -45, -45, 45, 0, 0];
var numVertices = 36;
var numAngles = 11;
var angle = 0;
var upsin = 0.0;
var n = 0.0;      
var move_scale = [0, 0.25, 0.5, 0.25, 1]; 

var stack = [];
var animation = [];

for( var i=0; i<numNodes; i++) animation[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;
var pointsArray = [];


function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function Texture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA,
         gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


    function HeadTexcoords(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
              [
                15/64 , 1-7/64, 15/64 , 1-13/64, 20/64 , 1-13/64, 15/64 , 1-7/64,20/64 , 1-13/64, 20/64 , 1-7/64,

                21/64 , 1-7/64,21/64 , 1-13/64,28/64 , 1-13/64,21/64 , 1-7/64,28/64 , 1-13/64,28/64 , 1-7/64,
                
                15/64 , 1-0,15/64 , 1-6/64,22/64 , 1-6/64,15/64 , 1-0, 22/64 , 1-6/64,22/64 , 1-0,
            
                7/64  , 1-0,7/64   , 1-6/64  ,14/64 , 1-6/64 ,7/64   , 1-0,14/64  , 1-6/64, 14/64  , 1-0  ,
                
                6/64, 1-13/64,6/64, 1-7/64,0   , 1-7/64,6/64, 1-13/64,0   , 1-7/64 ,0   , 1-13/64,

                7/64   , 1-7/64,7/64   , 1-13/64,14/64  , 1-13/64, 7/64   , 1-7/64 ,14/64  , 1-13/64,14/64  , 1-7/64,                                           
            ]),
            gl.STATIC_DRAW);
      }
    
    function torsoTexcoords(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
              [
             44/64 , 1-14/64,44/64 , 1-20/64 ,51/64 , 1-20/64,44/64 , 1-14/64,51/64 , 1-20/64  ,51/64 , 1-14/64,

             57/64 , 1-14/64,57/64 , 1-20/64,64/64 , 1-20/64,57/64 , 1-14/64,64/64 , 1-20/64,64/64 , 1-14/64,

             44/64 , 1-0,44/64 , 1-13/64,51/64 , 1-13/64,44/64 , 1-0,51/64 , 1-13/64,51/64 , 1-0,

             36/64 , 1-0,36/64 , 1-13/64 ,43/64 , 1-13/64 ,36/64   , 1-0,43/64  , 1-13/64,43/64  , 1-0  ,
             
             35/64 , 1-20/64,35/64 , 1-14/64,23/64 , 1-14/64,35/64 , 1-20/64,23/64 , 1-14/64,23/64 , 1-20/64,
                
             36/64   , 1-14/64,36/64   , 1-20/64,43/64  , 1-20/64, 36/64   , 1-14/64 ,43/64  , 1-20/64,43/64  , 1-14/64,
            ]),
            gl.STATIC_DRAW);
      }
    
    
    function Texcoords(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
              [
             56, 1-20/64 ,56/64 , 1-26/64 , 56, 1-26/64,56/64, 1-20/64,56/64, 1-26/64,56/64 , 1-20/64,
    
             62/64, 1-28/64,63/64 , 1-30/64,62/64 , 1-30/64,63/64 , 1-28/64,62/64 , 1-30/64,63/64 , 1-28/64,
                     
             56/64 , 1-28/64, 56/64 , 1-30/64,64/64 , 1-30/64,56/64 , 1-28/64,64/64 , 1-30/64,64/64 , 1-28/64,
         
             48/64, 1-28/64,49/64 , 1-30/64,54/64 , 1-30/64  , 49/64 , 1-28/64,54/64 , 1-30/64,55/64 , 1-28/64,
             
             56/64 , 1-20/64,56/64 , 1-27/64,56/64 , 1-26/64,56/64 , 1-21/64,56/64 , 1-26/64,56/64 , 1-21/64,
    
             56/64, 1-28/64, 56/64 , 1-31/64,56/64 , 1-31/64, 56/64 , 1-28/64,56/64 , 1-31/64,56/64  , 1-28/64,
            ]),
            gl.STATIC_DRAW);
      }
    
function initNodes(Id) {

    var m = mat4();
    switch(Id) {
    
    case torsoId:
        m = rotate(theta[torsoId], 0, 1, 0 );
        animation[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
        m = translate(-torsoWidth_x+3.0, 0.0, 0.0);
        m = mult(m, rotate(theta[headId], 0, 1, 0))
        animation[headId] = createNode( m, head, backId, mouthId);
    break;

    case backId:
        m = translate(-0.3*torsoWidth_x, 0.8*torsoHeight, 0.0);
        m = mult(m, rotate(theta[backId], 0, 0, 1));
        animation[backId] = createNode( m, back, leftId, null );
    break;

    case leftId:
    case leftId2:
    case leftId3:
        m = translate(-0.1*torsoWidth_x, 0.1*torsoHeight, 0.5*torsoWidth_z);
        m = mult(m , rotate(theta[leftId], 0, 1, 0));
        m = mult(m , rotate(-theta[leftId2], 1, 0, 0));
        m = mult(m , rotate(theta[leftId3], 0, 0, 1));
        m = mult(m , rotate(theta[leftId3], 0, 0, 1));
        m = mult(m, translate(0.0, -0.5*Width_z, 0.0));
        animation[leftId] = createNode( m, left, rightId, null );
    break;

    case rightId:
    case rightId2:
    case rightId3:
        m = translate(-0.1*torsoWidth_x, 0.1*torsoHeight, -0.5*torsoWidth_z);
        m = mult(m , rotate(theta[rightId], 0, 1, 0));
        m = mult(m , rotate(-theta[rightId2], 1, 0, 0));
        m = mult(m , rotate(-theta[rightId3], 0, 0, 1));
        m = mult(m, translate(0.0, -0.5*Width_z, 0.0));
        animation[rightId] = createNode( m, right, tailupperId, null );
    break;

    case tailupperId:
        m = translate(torsoWidth_x-3, 0.2*torsoHeight, 0.0);
        m = mult(m, rotate(theta[tailupperId], 1, 0, 0));
        animation[tailupperId] = createNode( m, tailupper, null, taillowwerId);
    break;

    case taillowwerId:
        m = translate(tailupperWidth_x, 0.3*tailupperHeight, 0.0);
        m = mult(m, rotate(theta[taillowwerId], 1, 0, 0));
        animation[taillowwerId] = createNode( m, taillowwer, null, null );
    break;

    case mouthId:
        m = translate(-(headWidth-2.0), 0.1*headHeight, 0.0);
        m = mult(m, rotate(theta[mouthId], 0, 1, 0));
        animation[mouthId] = createNode( m, mouth, null, null );
    break;

    }

    
}

function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, animation[Id].transform);
   animation[Id].transform = mult(animation[Id].transform, translate(0,0.0125*Math.cos(radians(n)),0.007*Math.sin(radians(n))))
   animation[Id].render();
   
   if(animation[Id].child != null) traverse(animation[Id].child);
    modelViewMatrix = stack.pop();
   if(animation[Id].sibling != null) traverse(animation[Id].sibling);
}

function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth_x, torsoHeight, torsoWidth_z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    torsoTexcoords(gl)
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    HeadTexcoords(gl)
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}


function back() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(Width_x, Height, Width_z) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    Texcoords(gl);
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function left() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * Width_z, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(Height, Width_z, Width_x) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    Texcoords(gl);
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function right() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * Width_z, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(Height, Width_z, Width_x) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    Texcoords(gl);
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function  tailupper() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailupperHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tailupperWidth_x, tailupperHeight, tailupperWidth_z) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    Texcoords(gl);
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function taillowwer() {
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * taillowwerHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(taillowwerWidth_x, taillowwerHeight, taillowwerWidth_z) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    Texcoords(gl);
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function mouth() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * mouthHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(mouthWidth_x, mouthHeight, mouthWidth_z) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    Texcoords(gl);
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    //  Load shaders and initialize attribute buffers
    gl.enable(gl.DEPTH_TEST);
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-20.0,20.0,-20.0, 20.0,-20.0,20.0);
    modelViewMatrix = mat4();

    modelViewMatrix = rotate(55, 0, 1, 0); 

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    var image = document.getElementById("Shark");
    Texture(image);
        document.getElementById("slider0").onchange = function(event) {
        theta[torsoId] = event.target.value;
        initNodes(torsoId);
    };
    Texture(image);
        document.getElementById("slider1").onchange = function(event) {
        theta[headId] = (event.target.value);
        initNodes(headId);
    };
    Texture(image);
    document.getElementById("slider2").onchange = function(event) {
    theta[taillowwerId] = (event.target.value);
    initNodes(taillowwerId);
};

    for(i=0; i<numNodes; i++) initNodes(i);
    render();
}

var render = function() {
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
   if(n < 360) n += 4;
   if( n >= 360) n = 0;
   traverse(torsoId);
   requestAnimFrame(render);
}
