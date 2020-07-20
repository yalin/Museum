var canvas;
var program;
var gl;
var vBuffer, nBuffer;
const keys = {};


var vertices = [];
var wallcolors = [];
var normals = [];

var lookatMatrix, projectionMatrix, transformationMatrix;
var lookatMatrixLoc, projectionMatrixLoc, transformationMatrixLoc;

var at = vec3(0, 0.5, -100);
const up = vec3(0.0, 1.0, 0.0);
var lookatradius = 1.0;
var lookattheta = 0;
var lookatphi = 0;
var kamera = 1.0

var ileri = 0

// orthographic values
var near = 0.01;
var far = 100.0;
var fovy = 60; // Field-of-view in Y direction angle (in degrees)
var aspect = 1.0; // Viewport aspect ratio

var theta = 0

var now = 0
var deltaTime
var then = 0
var movex = 0
var movey = 0
var movez = 0
var moveang = 0
const speed = 0.3
const turnSpeed = 100
const firstCameraPosition = [-0.6, 0.4, 0.90]
// const firstCameraPosition = [0.3, 0.4, 0.80] // table position


//#region LIGHTING

var flatShading = false
const redLight = vec4(1.0, 0.0, 0.0, 1.0)
const blueLight = vec4(0.0, 0.0, 1.0, 1.0)
const greenLight = vec4(0.0, 1.0, 0.0, 1.0)
const whiteLight = vec4(1.0, 1.0, 1.0, 1.0)
var lightPositionInside = vec4(-0.3, 0.5, 0.1, 1.0); // inside room light
var lightPositionLeftHall = vec4(-10.0, 10.0, 10.0, 1.0); // left hall
var lightColorInside, lightColorLeftHall

var ambientInside = 0.7 // light ambient default value
var diffuseInside = 1 // light diffuse default value
var ambientLeft = 0.2 // light ambient default value
var diffuseLeft = 0.5 // light diffuse default value
//#endregion

var floor = new Wall()
var leftwall = new Wall()
var frontWall = new Wall()
var backWall = new Wall()
var rightwall = new Wall()
var lhrf = new Wall() // left hall right first wall
var lhrs = new Wall() // left hall right second wall
var rhrf = new Wall() // turned right hall right first wall
var rhrs = new Wall() // turned right hall right second wall
var ceiling = new Wall()

class Part {
    constructor(startIndex, endIndex, totalIndex) {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.totalIndex = totalIndex;
    }
}

var floorsPart = new Part()
var wallsPart = new Part()
var ceilingsPart = new Part()
var paintingsPart = new Part()
var tablePart = new Part()
var bookPart = new Part()
var statuePart = new Part()

var monaLisa = new Wall()
var vangogh = new Wall()
var pearlearring = new Wall()
var magritte = new Wall()
var greatwave = new Wall()
var godadam = new Wall()
var babel = new Wall()
var uk = new Wall()
var door = new Wall()
var welcome = new Wall()
var buttons = new Wall()

//#region  textures
// TEXTURES
var textureCoords = []
var textures = []
var images = []
var imageLocation
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
]
var textureImages = [
    'https://i.imgur.com/tMlELX6.png', // wall - 0
    'https://i.imgur.com/QHi0JK6.jpg', // floor - 1
    'https://i.imgur.com/6onw4hO.png', // ceiling - 2
    'https://i.imgur.com/12G2Kem.jpg', // mona lisa - 3
    'https://i.imgur.com/6JgELqJ.jpg', // vangogh - 4
    'https://i.imgur.com/eu3DWIW.jpg', // pearl earring - 5
    'https://i.imgur.com/vMaJt6q.jpg', // magritte - 6
    'https://i.imgur.com/lbIp0Nj.jpg', // great wave - 7
    'https://i.imgur.com/RoZoiif.jpg', // god adam - 8
    'https://i.imgur.com/ZT6O5UO.jpg', // tower of babel - 9
    'https://i.imgur.com/Yi2wBZ9.jpg', // uk - 10
    'https://i.imgur.com/NWhzdgU.jpg', // door - 11
    'https://i.imgur.com/z6PwGYt.jpg', // welcome - 12
    'https://i.imgur.com/aHu1adC.jpg', // buttons - 13
    'https://i.imgur.com/6PxLOJs.jpg', // table - 14
    'https://i.imgur.com/oT0ekVj.png', // book - 15
    'https://i.imgur.com/l8gePlf.png', // statue - 16
]
//#endregion

function buildWalls() {
    // floor 
    floor.createWall(0, 100, 0, 10, 0, 100, 0, 'floor', flatShading)
    vertices = vertices.concat(floor.wallVertices)
    wallcolors = wallcolors.concat(floor.colors)
    textureCoords = textureCoords.concat(floor.textureCoords)
    normals = normals.concat(floor.normals)

    // WALL properties
    leftwall.createWall(0, 10, 10, 40, 0, 100, 0, 'wall', flatShading)
    vertices = vertices.concat(leftwall.wallVertices)
    wallcolors = wallcolors.concat(leftwall.colors)
    textureCoords = textureCoords.concat(leftwall.textureCoords)
    normals = normals.concat(leftwall.normals)

    frontWall.createWall(10, 90, 0, 40, 90, 100, 0, null, flatShading)
    vertices = vertices.concat(frontWall.wallVertices)
    wallcolors = wallcolors.concat(frontWall.colors)
    textureCoords = textureCoords.concat(frontWall.textureCoords)
    normals = normals.concat(frontWall.normals)

    backWall.createWall(0, 90, 0, 40, 0, 10, 0, null, flatShading)
    vertices = vertices.concat(backWall.wallVertices)
    wallcolors = wallcolors.concat(backWall.colors)
    textureCoords = textureCoords.concat(backWall.textureCoords)
    normals = normals.concat(backWall.normals)

    rightwall.createWall(90, 100, 0, 40, 0, 100, 0, null, flatShading)
    vertices = vertices.concat(rightwall.wallVertices)
    wallcolors = wallcolors.concat(rightwall.colors)
    textureCoords = textureCoords.concat(rightwall.textureCoords)
    normals = normals.concat(rightwall.normals)

    lhrf.createWall(30, 40, 0, 40, 10, 40, 0, null, flatShading)
    vertices = vertices.concat(lhrf.wallVertices)
    wallcolors = wallcolors.concat(lhrf.colors)
    textureCoords = textureCoords.concat(lhrf.textureCoords)
    normals = normals.concat(lhrf.normals)

    lhrs.createWall(30, 40, 0, 40, 50, 70, 0, null, flatShading)
    vertices = vertices.concat(lhrs.wallVertices)
    wallcolors = wallcolors.concat(lhrs.colors)
    textureCoords = textureCoords.concat(lhrs.textureCoords)
    normals = normals.concat(lhrs.normals)

    rhrf.createWall(40, 60, 0, 40, 60, 70, 0, null, flatShading)
    vertices = vertices.concat(rhrf.wallVertices)
    wallcolors = wallcolors.concat(rhrf.colors)
    textureCoords = textureCoords.concat(rhrf.textureCoords)
    normals = normals.concat(rhrf.normals)

    rhrs.createWall(70, 90, 0, 40, 60, 70, 0, null, flatShading)
    vertices = vertices.concat(rhrs.wallVertices)
    wallcolors = wallcolors.concat(rhrs.colors)
    textureCoords = textureCoords.concat(rhrs.textureCoords)
    normals = normals.concat(rhrs.normals)


    // ceiling 
    ceiling.createWall(0, 100, 40, 50, 0, 100, 0, null, flatShading)
    vertices = vertices.concat(ceiling.wallVertices)
    wallcolors = wallcolors.concat(ceiling.colors)
    textureCoords = textureCoords.concat(ceiling.textureCoords)
    normals = normals.concat(ceiling.normals)

    // array indexes
    floorsPart.startIndex = 0
    floorsPart.totalIndex = floor.indiceNumber
    floorsPart.endIndex = floorsPart.startIndex + floorsPart.totalIndex

    // walls start when floors end
    wallsPart.startIndex = floorsPart.endIndex
    wallsPart.totalIndex = leftwall.indiceNumber + frontWall.indiceNumber + backWall.indiceNumber +
        rightwall.indiceNumber + lhrf.indiceNumber + lhrs.indiceNumber + rhrf.indiceNumber + rhrs.indiceNumber
    wallsPart.endIndex = wallsPart.startIndex + wallsPart.totalIndex

    ceilingsPart.startIndex = wallsPart.endIndex
    ceilingsPart.totalIndex = ceiling.indiceNumber
    ceilingsPart.endIndex = ceilingsPart.startIndex + ceilingsPart.totalIndex

}

function buildPaintings() {

    // mona lisa
    monaLisa.createWall(29.9, 30, 15, 25, 20, 25, 1, null, flatShading)
    vertices = vertices.concat(monaLisa.wallVertices)
    wallcolors = wallcolors.concat(monaLisa.colors)
    textureCoords = textureCoords.concat(monaLisa.textureCoords)
    normals = normals.concat(monaLisa.normals)
    monaLisa.iStart = ceilingsPart.endIndex // first painting starts when ceilings end
    monaLisa.iEnd = monaLisa.indiceNumber

    vangogh.createWall(10, 10.1, 15, 25, 35, 45, 1, null, flatShading)
    vertices = vertices.concat(vangogh.wallVertices)
    wallcolors = wallcolors.concat(vangogh.colors)
    textureCoords = textureCoords.concat(vangogh.textureCoords)
    normals = normals.concat(vangogh.normals)
    vangogh.iStart = monaLisa.iStart + monaLisa.iEnd
    vangogh.iEnd = vangogh.indiceNumber

    pearlearring.createWall(89.9, 90, 15, 30, 65, 75, 1, null, flatShading)
    vertices = vertices.concat(pearlearring.wallVertices)
    wallcolors = wallcolors.concat(pearlearring.colors)
    textureCoords = textureCoords.concat(pearlearring.textureCoords)
    normals = normals.concat(pearlearring.normals)
    pearlearring.iStart = vangogh.iStart + vangogh.iEnd
    pearlearring.iEnd = pearlearring.indiceNumber

    magritte.createWall(13, 30, 12, 30, 79.9, 80, 1, null, flatShading)
    vertices = vertices.concat(magritte.wallVertices)
    wallcolors = wallcolors.concat(magritte.colors)
    textureCoords = textureCoords.concat(magritte.textureCoords)
    normals = normals.concat(magritte.normals)
    magritte.iStart = pearlearring.iStart + pearlearring.iEnd
    magritte.iEnd = magritte.indiceNumber

    greatwave.createWall(29.9, 30, 15, 25, 45, 55, 1, null, flatShading)
    vertices = vertices.concat(greatwave.wallVertices)
    wallcolors = wallcolors.concat(greatwave.colors)
    textureCoords = textureCoords.concat(greatwave.textureCoords)
    normals = normals.concat(greatwave.normals)
    greatwave.iStart = magritte.iStart + magritte.iEnd
    greatwave.iEnd = greatwave.indiceNumber

    godadam.createWall(45, 75, 17, 27, 79.9, 80, 1, null, flatShading)
    vertices = vertices.concat(godadam.wallVertices)
    wallcolors = wallcolors.concat(godadam.colors)
    textureCoords = textureCoords.concat(godadam.textureCoords)
    normals = normals.concat(godadam.normals)
    godadam.iStart = greatwave.iStart + greatwave.iEnd
    godadam.iEnd = godadam.indiceNumber

    babel.createWall(89.9, 90, 12, 38, 3, 47, 1, null, flatShading)
    vertices = vertices.concat(babel.wallVertices)
    wallcolors = wallcolors.concat(babel.colors)
    textureCoords = textureCoords.concat(babel.textureCoords)
    normals = normals.concat(babel.normals)
    babel.iStart = godadam.iStart + godadam.iEnd
    babel.iEnd = babel.indiceNumber

    uk.createWall(40, 50, 15, 25, 60, 60.1, 1, null, flatShading)
    vertices = vertices.concat(uk.wallVertices)
    wallcolors = wallcolors.concat(uk.colors)
    textureCoords = textureCoords.concat(uk.textureCoords)
    normals = normals.concat(uk.normals)
    uk.iStart = babel.iStart + babel.iEnd
    uk.iEnd = uk.indiceNumber

    door.createWall(12, 27, 10.1, 27, 0, 0.1, 1, null, flatShading)
    vertices = vertices.concat(door.wallVertices)
    wallcolors = wallcolors.concat(door.colors)
    textureCoords = textureCoords.concat(door.textureCoords)
    normals = normals.concat(door.normals)
    door.iStart = uk.iStart + uk.iEnd
    door.iEnd = door.indiceNumber

    welcome.createWall(10, 10.1, 15, 25, 15, 25, 1, null, flatShading)
    vertices = vertices.concat(welcome.wallVertices)
    wallcolors = wallcolors.concat(welcome.colors)
    textureCoords = textureCoords.concat(welcome.textureCoords)
    normals = normals.concat(welcome.normals)
    welcome.iStart = door.iStart + door.iEnd
    welcome.iEnd = welcome.indiceNumber

    buttons.createWall(45, 65, 17, 33, 0, 0.1, 1, null, flatShading)
    vertices = vertices.concat(buttons.wallVertices)
    wallcolors = wallcolors.concat(buttons.colors)
    textureCoords = textureCoords.concat(buttons.textureCoords)
    normals = normals.concat(buttons.normals)
    buttons.iStart = welcome.iStart + welcome.iEnd
    buttons.iEnd = buttons.indiceNumber

    paintingsPart.startIndex = ceilingsPart.endIndex
    paintingsPart.totalIndex = monaLisa.indiceNumber + vangogh.indiceNumber +
        pearlearring.indiceNumber + magritte.indiceNumber + greatwave.indiceNumber + godadam.indiceNumber +
        babel.indiceNumber + uk.indiceNumber + door.indiceNumber + welcome.indiceNumber + buttons.indiceNumber
    paintingsPart.endIndex = paintingsPart.startIndex + paintingsPart.totalIndex
}

function degToRad(d) {
    return d * Math.PI / 180;
}


//#region Hierarchy
// Hierarchy
var instanceMatrix;
var hang = [-45, 0] // hierarchy angle, first book angle, second statue angle
var bookId = 0
var statueId = 1

var stack = []; // stack that transformation matrix use for nodes
var figure = []; // hierarchy figures, in this case they are book and statue

function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}

function initNodes(Id) {
    var ctm = mat4();
    switch (Id) {
        case bookId:

            // transformation
            // first take book to origin
            // then rotate on y axis
            // then take back to its position
            var tback = translate(0.3, 0.3424, 0.5)
            var torigin = translate(-0.3, -0.3424, -0.5)
            var r = rotate(hang[bookId], vec3(0, 1, 0))
            ctm = mult(ctm, tback)
            ctm = mult(ctm, r)
            ctm = mult(ctm, torigin)

            figure[bookId] = createNode(ctm, bookFunc, null, statueId);
            break;

        case statueId:

            // first take statue to origin
            // then rotate on y axis
            // then take back to its position
            var tback = translate(0.3, 0.352, 0.5)
            var torigin = translate(-0.3, -0.352, -0.5)
            var r = rotate(hang[statueId], vec3(0, 1, 0));
            ctm = mult(ctm, tback)
            ctm = mult(ctm, r)
            ctm = mult(ctm, torigin)

            figure[statueId] = createNode(ctm, statueFunc, null, null);
            break;
    }
}

function traverse(Id) {

    if (Id == null) return;
    stack.push(transformationMatrix);
    transformationMatrix = mult(transformationMatrix, figure[Id].transform);
    figure[Id].render();
    if (figure[Id].child != null) traverse(figure[Id].child);
    transformationMatrix = stack.pop();
    if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function bookFunc() {

    bookTexture()

    // transformation - take book to its position in room
    var s = scalem(0.15, 0.15, 0.15)
    var t = translate(0.3, 0.3424, 0.5)
    instanceMatrix = mult(transformationMatrix, t)
    instanceMatrix = mult(instanceMatrix, s)

    gl.uniformMatrix4fv(transformationMatrixLoc, false, flatten(instanceMatrix))
    gl.drawArrays(gl.TRIANGLES, bookPart.startIndex, bookPart.totalIndex);
}

function statueFunc() {

    statueTexture()

    // transformation - take statue to its position
    var s = scalem(0.10, 0.10, 0.10)
    var t = translate(0.3, 0.352, 0.5)

    instanceMatrix = mult(transformationMatrix, t)
    instanceMatrix = mult(instanceMatrix, s)

    gl.uniformMatrix4fv(transformationMatrixLoc, false, flatten(instanceMatrix))
    gl.drawArrays(gl.TRIANGLES, statuePart.startIndex, statuePart.totalIndex);
}
//#endregion Hierarchy

//#region Keyboard
// event listener for keyboard inputs
window.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
    // e.preventDefault();



    // v - toggle inside light
    if (keys['86'] || keys['118']) {
        if (ambientInside == 0.0) {
            ambientInside = 0.3
            diffuseInside = 0.9
        } else {
            ambientInside = 0.0
            diffuseInside = 0.0
        }
    }

    // z - red
    if (keys['90'] || keys['122']) {
        lightColorInside = redLight
    }

    // x - green
    if (keys['88'] || keys['120']) {
        lightColorInside = greenLight
    }

    // c - blue
    if (keys['67'] || keys['99']) {
        lightColorInside = blueLight
    }


});
window.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
    // e.preventDefault();
});

function keyboard() {

    // w - moe forward
    if (keys['87'] || keys['119']) {
        var direction = lookatMatrix[2]
        movex += direction[0] * deltaTime * speed * -1
        movey += direction[1] * deltaTime * speed * -1
        movez += direction[2] * deltaTime * speed * -1
        var t = translate([movex, movey, movez])
        var r = rotateY(moveang)
        var tCameraDefault = translate(firstCameraPosition)

        var ctm = mat4()
        ctm = mult(ctm, t)
        ctm = mult(ctm, tCameraDefault) // camera default position
        ctm = mult(ctm, r) // rotate
        ctm = inverse(ctm)
        lookatMatrix = ctm
        gl.uniformMatrix4fv(lookatMatrixLoc, false, flatten(lookatMatrix))
    }

    // s - move back
    if (keys['83'] || keys['115']) {
        var direction = lookatMatrix[2]
        movex += direction[0] * deltaTime * speed * 1
        movey += direction[1] * deltaTime * speed * 1
        movez += direction[2] * deltaTime * speed * 1
        var t = translate([movex, movey, movez])
        var r = rotateY(moveang)
        var tCameraDefault = translate(firstCameraPosition)

        var ctm = mat4()
        ctm = mult(ctm, t)
        ctm = mult(ctm, tCameraDefault) // camera default position
        ctm = mult(ctm, r) // rotate
        ctm = inverse(ctm)
        lookatMatrix = ctm
        gl.uniformMatrix4fv(lookatMatrixLoc, false, flatten(lookatMatrix))
    }

    // a - turn left
    if (keys['65'] || keys['97']) {
        moveang += deltaTime * turnSpeed * 1
        var t = translate([movex, movey, movez])
        var r = rotateY(moveang)
        var tCameraDefault = translate(firstCameraPosition)

        var ctm = mat4()
        ctm = mult(ctm, t) // yeni yerine cek
        ctm = mult(ctm, tCameraDefault) // camera default position
        ctm = mult(ctm, r) // rotate
        ctm = inverse(ctm)
        lookatMatrix = ctm
        gl.uniformMatrix4fv(lookatMatrixLoc, false, flatten(lookatMatrix))
    }

    // d - turn right
    if (keys['68'] || keys['100']) {
        moveang += deltaTime * turnSpeed * -1
        var t = translate([movex, movey, movez])
        var r = rotateY(moveang)
        var tCameraDefault = translate(firstCameraPosition)

        var ctm = mat4()
        ctm = mult(ctm, t) // yeni yerine cek
        ctm = mult(ctm, tCameraDefault) // camera default position
        ctm = mult(ctm, r) // rotate
        ctm = inverse(ctm)
        lookatMatrix = ctm
        gl.uniformMatrix4fv(lookatMatrixLoc, false, flatten(lookatMatrix))
    }

    // j - rotate statue
    if (keys['74'] || keys['106']) {

        hang[statueId] += 1
        initNodes(statueId);
    }

    // k - rotate statue
    if (keys['75'] || keys['107']) {

        hang[statueId] -= 1
        initNodes(statueId);
    }

    // n - rotate book
    if (keys['78'] || keys['110']) {

        hang[bookId] += 1
        initNodes(bookId);
    }

    // m - rotate book
    if (keys['77'] || keys['109']) {

        hang[bookId] -= 1
        initNodes(bookId);
    }

    // 1
    if (keys['49']) {
        lightPositionLeftHall = vec4(-10.0, 10.0, 10.0, 1.0)
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionL"), lightPositionLeftHall);
    }

    // 2
    if (keys['50']) {
        lightPositionLeftHall = vec4(-10.0, 10.0, -10.0, 1.0)
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionL"), lightPositionLeftHall);
    }

    // 3
    if (keys['51']) {
        lightPositionLeftHall = vec4(10.0, 10.0, -10.0, 1.0)
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionL"), lightPositionLeftHall);
    }

    // 4
    if (keys['52']) {
        lightPositionLeftHall = vec4(10.0, 10.0, 10.0, 1.0)
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionL"), lightPositionLeftHall);
    }


}
//#endregion

function crossOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
        img.crossOrigin = "";
    }
}

function loadImage(url, callback) {
    var image = new Image();
    crossOrigin(image, url)
    image.src = url;
    image.onload = callback;
    return image;
}

function loadImages(urls, callback) {

    var imagesToLoad = urls.length;

    // Called each time an image finished
    // loading.
    var onImageLoad = function () {
        --imagesToLoad;
        // If all the images are loaded call the callback.
        if (imagesToLoad === 0) {
            callback(images);
        }
    };

    for (var ii = 0; ii < imagesToLoad; ++ii) {
        var image = loadImage(urls[ii], onImageLoad);
        images.push(image);
    }
}

function createTextures() {
    // for each texture images in the array
    for (var ii = 0; ii < Object.keys(textureImages).length; ++ii) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);

        // add the texture to the array of textures.
        textures.push(texture);
    }
}

window.onload = function init() {
    // yalin
    // on windows load, first load the images, then start the project
    // because if images load after webgl, textures cant be seen
    loadImages(textureImages, startProject);
};

var table = new Table()
var statue = new Statue()
var book = new Book()

function startProject() {

    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 0.3);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    buildWalls() // build floor, walls, ceiling
    buildPaintings() // build all paintings

    // calculate object vertices, indices, colors, texture coordinates
    // table
    vertices = vertices.concat(table.tableVertices)
    wallcolors = wallcolors.concat(table.tableColors)
    textureCoords = textureCoords.concat(table.tableTextures)
    normals = normals.concat(table.normals)
    tablePart.startIndex = paintingsPart.endIndex
    tablePart.totalIndex = table.tableVertices.length
    tablePart.endIndex = tablePart.startIndex + tablePart.totalIndex
    // book
    vertices = vertices.concat(book.bookVertices)
    wallcolors = wallcolors.concat(book.bookColors)
    textureCoords = textureCoords.concat(book.bookTextures)
    normals = normals.concat(book.normals)
    bookPart.startIndex = tablePart.endIndex
    bookPart.totalIndex = book.bookLength
    bookPart.endIndex = bookPart.startIndex + bookPart.totalIndex
    // statue
    vertices = vertices.concat(statue.statueVertices)
    wallcolors = wallcolors.concat(statue.statueColors)
    textureCoords = textureCoords.concat(statue.statueTextures)
    normals = normals.concat(statue.normals)
    statuePart.startIndex = bookPart.endIndex
    statuePart.totalIndex = statue.statueLength
    statuePart.endIndex = statuePart.startIndex + statuePart.totalIndex

    // light
    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionI"), lightPositionInside);
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionL"), lightPositionLeftHall);

    lightColorInside = redLight
    lightColorLeftHall = whiteLight

    // vertex buffer and vertices [vPosition]
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // uniform matrix used for transformations
    instanceMatrix = mat4();
    transformationMatrix = mat4();
    this.transformationMatrixLoc = gl.getUniformLocation(program, "transformationMatrix");
    gl.uniformMatrix4fv(this.transformationMatrixLoc, false, flatten(transformationMatrix))

    // projection matrix
    this.aspect = canvas.width / canvas.height
    this.projectionMatrixLoc = gl.getUniformLocation(this.program, "projectionMatrix");
    this.projectionMatrix = perspective(this.fovy, this.aspect, this.near, this.far); // perspective
    gl.uniformMatrix4fv(this.projectionMatrixLoc, false, flatten(this.projectionMatrix))

    // camera matrix
    this.lookatMatrixLoc = gl.getUniformLocation(this.program, "lookatMatrix");
    var ctm = mat4() // identity matrix
    var t = translate(firstCameraPosition)
    var r = rotateY(20) // to look at welcome texture
    ctm = mult(ctm, t)
    // ctm = mult(ctm, r)
    ctm = inverse(ctm)
    this.lookatMatrix = ctm
    gl.uniformMatrix4fv(lookatMatrixLoc, false, flatten(lookatMatrix))

    // texture
    createTextures()
    imageLocation = gl.getUniformLocation(program, "textureSample");
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.textureCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    // mouse move
    canvas.addEventListener('mousemove', function (event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    });


    // on start of program, initialize nodes
    for (i = 0; i < 2; i++) initNodes(i);

    render();
}

var render = function (now) {

    // moving speed
    now *= 0.001
    deltaTime = now - then
    then = now
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // until table, nothing will translate, so identity matrix written
    gl.uniformMatrix4fv(transformationMatrixLoc, false, flatten(mat4()))

    drawFloor(0, floorsPart.endIndex)
    drawWalls(wallsPart.startIndex, wallsPart.totalIndex)
    drawCeiling(ceilingsPart.startIndex, ceilingsPart.totalIndex)
    drawPaintings(paintingsPart.startIndex)
    drawTable(paintingsPart.endIndex, table.tableLength)

    traverse(bookId); // hierarchial drawing objects
    // also book and statue is drawn in traverse function

    keyboard()

    drawLightInside()
    drawLightLeftHall()


    requestAnimFrame(render);
}

function drawWalls(from, to) {

    gl.uniform1i(imageLocation, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.drawArrays(gl.TRIANGLES, from, to);
}

function drawFloor(from, to) {

    gl.uniform1i(imageLocation, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    gl.drawArrays(gl.TRIANGLES, from, to);
}

function drawCeiling(from, to) {

    gl.uniform1i(imageLocation, 2);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textures[2]);
    gl.drawArrays(gl.TRIANGLES, from, to);
}

function drawPaintings(beforePaintingsIndices) {

    gl.uniform1i(imageLocation, 3);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, textures[3]);
    gl.drawArrays(gl.TRIANGLES, beforePaintingsIndices, monaLisa.iEnd);

    gl.uniform1i(imageLocation, 4);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, textures[4]);
    gl.drawArrays(gl.TRIANGLES, vangogh.iStart, vangogh.iEnd);

    gl.uniform1i(imageLocation, 5);
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, textures[5]);
    gl.drawArrays(gl.TRIANGLES, pearlearring.iStart, pearlearring.iEnd);

    gl.uniform1i(imageLocation, 6);
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, textures[6]);
    gl.drawArrays(gl.TRIANGLES, magritte.iStart, magritte.iEnd);

    // gl.uniformMatrix4fv(transformationMatrixLoc, false, flatten(mat4()))

    gl.uniform1i(imageLocation, 7);
    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, textures[7]);
    gl.drawArrays(gl.TRIANGLES, greatwave.iStart, greatwave.iEnd);

    gl.uniform1i(imageLocation, 8);
    gl.activeTexture(gl.TEXTURE8);
    gl.bindTexture(gl.TEXTURE_2D, textures[8]);
    gl.drawArrays(gl.TRIANGLES, godadam.iStart, godadam.iEnd);

    gl.uniform1i(imageLocation, 9);
    gl.activeTexture(gl.TEXTURE9);
    gl.bindTexture(gl.TEXTURE_2D, textures[9]);
    gl.drawArrays(gl.TRIANGLES, babel.iStart, babel.iEnd);

    gl.uniform1i(imageLocation, 10);
    gl.activeTexture(gl.TEXTURE10);
    gl.bindTexture(gl.TEXTURE_2D, textures[10]);
    gl.drawArrays(gl.TRIANGLES, uk.iStart, uk.iEnd);

    gl.uniform1i(imageLocation, 11);
    gl.activeTexture(gl.TEXTURE11);
    gl.bindTexture(gl.TEXTURE_2D, textures[11]);
    gl.drawArrays(gl.TRIANGLES, door.iStart, door.iEnd);

    gl.uniform1i(imageLocation, 12);
    gl.activeTexture(gl.TEXTURE12);
    gl.bindTexture(gl.TEXTURE_2D, textures[12]);
    gl.drawArrays(gl.TRIANGLES, welcome.iStart, welcome.iEnd);

    gl.uniform1i(imageLocation, 13);
    gl.activeTexture(gl.TEXTURE13);
    gl.bindTexture(gl.TEXTURE_2D, textures[13]);
    gl.drawArrays(gl.TRIANGLES, buttons.iStart, buttons.iEnd);
}

function drawTable(from, to) {
    gl.uniform1i(imageLocation, 14);
    gl.activeTexture(gl.TEXTURE14);
    gl.bindTexture(gl.TEXTURE_2D, textures[14]);

    var s = scalem(0.30, 0.40, 0.30)
    var t = translate(0.3, 0.2, 0.5)
    var ctm = mat4()
    ctm = mult(ctm, t)
    ctm = mult(ctm, s)

    gl.uniformMatrix4fv(transformationMatrixLoc, false, flatten(ctm))
    gl.drawArrays(gl.TRIANGLES, from, to);
}

function bookTexture() {
    // texture
    gl.uniform1i(imageLocation, 15);
    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, textures[15]);
}

function statueTexture() {
    // texture
    gl.uniform1i(imageLocation, 16);
    gl.activeTexture(gl.TEXTURE16);
    gl.bindTexture(gl.TEXTURE_2D, textures[16]);
}


function drawLightInside() {
    // light
    var insideLightAmbient = vec4(ambientInside, ambientInside, ambientInside, 1.0);
    var insideLightDiffuse = vec4(diffuseInside, diffuseInside, diffuseInside, 1.0);
    var insideLightSpecular = vec4(diffuseInside, diffuseInside, diffuseInside, 1.0);
    var materialAmbientInside = vec4(0.4, 0.4, 0.4, 1.0);
    var materialDiffuseInside = lightColorInside;
    var materialSpecularInside = vec4(0.4, 0.4, 0.4, 1.0);
    var materialShininessInside = 10.0;
    // inside
    var insideLightAmbientProduct = mult(insideLightAmbient, materialAmbientInside);
    var insideLightdiffuseProduct = mult(insideLightDiffuse, materialDiffuseInside);
    var insideLightspecularProduct = mult(insideLightSpecular, materialSpecularInside);

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductI"), insideLightAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProductI"), insideLightdiffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProductI"), insideLightspecularProduct);
    gl.uniform1f(gl.getUniformLocation(program, "uShininessI"), materialShininessInside);
}

function drawLightLeftHall() {
    // light
    var leftLightAmbient = vec4(ambientLeft, ambientLeft, ambientLeft, 1.0);
    var leftLightDiffuse = vec4(diffuseLeft, diffuseLeft, diffuseLeft, 1.0);
    var leftLightSpecular = vec4(diffuseLeft, diffuseLeft, diffuseLeft, 1.0);
    var materialAmbientLeft = vec4(0.4, 0.4, 0.4, 1.0);
    var materialDiffuseLeft = lightColorLeftHall;
    var materialSpecularLeft = vec4(0.4, 0.4, 0.4, 1.0);
    var materialShininessLeft = 1.0;
    // left
    var leftLightAmbientProduct = mult(leftLightAmbient, materialAmbientLeft);
    var leftLightdiffuseProduct = mult(leftLightDiffuse, materialDiffuseLeft);
    var leftLightspecularProduct = mult(leftLightSpecular, materialSpecularLeft);

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductL"), leftLightAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProductL"), leftLightdiffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProductL"), leftLightspecularProduct);
    gl.uniform1f(gl.getUniformLocation(program, "uShininessL"), materialShininessLeft);
}