var color = [Math.random(), Math.random(), Math.random(), 1.0]

var texCoords = function () {
    return [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ]
}

// functions
var scaleBetween = function (numGonnaScale, min, max, minCoor, maxCoor) {
    return ((maxCoor - minCoor) * ((numGonnaScale - min) / (max - min))) + minCoor
}

var scaleVector = function (vector) {
    var x = scaleBetween(vector[0], -100, 100, -1.0, 1.0)
    var y = scaleBetween(vector[1], -100, 100, -1.0, 1.0)
    var z = scaleBetween(vector[2], -100, 100, -1.0, 1.0)
    return [x, y, z, 1.0]
}

// shape classes
class Table {
    constructor() {
        this.tableLength = tableCoords.length;
        this.tableColors = shapeColors(tableCoords);
        this.tableVertices = shapeVertices(tableCoords, tableIndices);
        this.tableTextures = shapeTextureCoords(this.tableVertices);
        this.normals = tableNormals
    }
}

class Statue{
    constructor() {
        this.statueLength = statueCoords.length;
        this.statueColors = shapeColors(statueCoords);
        this.statueVertices = shapeVertices(statueCoords, statueIndices);
        this.statueTextures = statueTextureCoords(statueTextures) // statue textures acquired by statue.js not texture coordinate system
        this.normals = statueNormals
    }
}

class Book{
    constructor() {
        this.bookLength = bookCoords.length;
        this.bookColors = shapeColors(bookCoords);
        this.bookVertices = shapeVertices(bookCoords, bookIndices);
        this.bookTextures = bookTextureCoords(bookTextures) // book textures acquired by book.js not texture coordinate system
        this.normals = bookNormals
    }
}

// shape calculators
var shapeVertices = function (coords, indices) {
    var vertices = []
    for (let i = 0; i < indices.length; i++) {
        var y = indices[i]
        var cc = coords[y]
        var cs = scaleVector(cc)
        vertices = vertices.concat([cs])
    }
    return vertices
}

var shapeColors = function (vertices) {
    var ca = []
    for (let c = 0; c < vertices.length; c++) {
        ca = ca.concat([color])
    }
    return ca
}

var shapeTextureCoords = function (orderedVertices) {
    var tx = []
    var gt = texCoords()
    for (let t = 0; t < orderedVertices.length / 6; t++) {
        tx = tx.concat([gt[0], gt[1], gt[2], gt[0], gt[2], gt[3]])
    }
    return tx
}

var statueTextureCoords = function(tt){
    var tx = []
    for (let t = 0; t < tt.length; t++) {
        tx = tx.concat([tt[t]])
    }
    return tx
}

var bookTextureCoords = function(tt){
    var tx = []
    for (let t = 0; t < tt.length; t++) {
        tx = tx.concat([tt[t]])
    }
    return tx
}
