// used for piece
var piece = 10
var pixel = 20 / 100

class Wall {

    constructor(wallVertices, indiceNumber, cubePiece, colors, textureCoords, iStart, iEnd, normals) {
        this.wallVertices = wallVertices;
        this.indiceNumber = indiceNumber;
        this.cubePiece = cubePiece;
        this.colors = colors;
        this.textureCoords = textureCoords;
        this.iStart = iStart;
        this.iEnd = iEnd;
        this.normals = normals;
    }

    texCoords = function () {
        return [
            vec2(0, 0),
            vec2(0, 1),
            vec2(1, 1),
            vec2(1, 0)
        ]
    }


    quad = function (a, b, c, d, v, s) {
        var vc = [v[a], v[b], v[c], v[a], v[c], v[d]] // vertices of the cube surfaces
        var txc = this.texCoords() // texture coordinates
        var tx = [txc[0], txc[1], txc[2], txc[0], txc[2], txc[3]] // texture points of the cube surfaces
        var nm = []
        if (s) {
            // flat shading
            var t1 = subtract(v[b], v[a]);
            var t2 = subtract(v[c], v[b]);
            var n = cross(t1, t2);
            n = vec4(n, 0.0);
            nm = [n, n, n, n, n, n]
        } else {
            // smooth shading
            nm = [
                vec4(v[a][0], v[a][1], v[a][2], 0.0),
                vec4(v[b][0], v[b][1], v[b][2], 0.0),
                vec4(v[c][0], v[c][1], v[c][2], 0.0),
                vec4(v[a][0], v[a][1], v[a][2], 0.0),
                vec4(v[c][0], v[c][1], v[c][2], 0.0),
                vec4(v[d][0], v[d][1], v[d][2], 0.0)
            ]
        }
        return [vc, tx, nm] // returns vertices and texture points of a cube surface
    }

    createCube = function (v, s) {
        var a = this.quad(0, 3, 2, 1, v, s)
        var b = this.quad(2, 3, 7, 6, v, s)
        var c = this.quad(3, 0, 4, 7, v, s)
        var d = this.quad(6, 5, 1, 2, v, s)
        var e = this.quad(4, 5, 6, 7, v, s)
        var f = this.quad(5, 4, 0, 1, v, s)
        var vc = a[0].concat(b[0], c[0], d[0], e[0], f[0]) // vertices
        var tx = a[1].concat(b[1], c[1], d[1], e[1], f[1]) // textures
        var nm = a[2].concat(b[2], c[2], d[2], e[2], f[2]) // normals
        return [vc, tx, nm] // returns vertices of the cube and texture points and normals array
    }

    scaleValue = function (value, from, to) {
        var scale = (to[1] - to[0]) / (from[1] - from[0]);
        var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
        return (capped * scale + to[0])
    }

    scaleBetween = function (numGonnaScale, min, max, minCoor, maxCoor) {
        return ((maxCoor - minCoor) * ((numGonnaScale - min) / (max - min))) + minCoor
    }

    // random color value for surfaces
    // temporary
    randomColor = function () {
        return [Math.random(), Math.random(), Math.random(), 1.0]
    }

    createWall(xfrom, xto, yfrom, yto, zfrom, zto, pixelCount, texture, shading) {

        // pixelCount == 0
        if (pixelCount == 0) {
            var wv = [] // vertices
            var cv = [] // colors
            var tv = [] // textures
            var nv = [] // normals

            var xPiece = (xto - xfrom) / piece
            var yPiece = (yto - yfrom) / piece
            var zPiece = (zto - zfrom) / piece

            var xStartCoor = this.scaleBetween(xfrom, 0, 100, -1.0, 1.0)
            var yStartCoor = this.scaleBetween(yfrom, 0, 50, 0.0, 1.0)
            var zStartCoor = this.scaleBetween(zfrom, 0, 100, 1.0, -1.0)

            var i = 0

            for (let zp = 0; zp < zPiece; zp++) {
                for (let xp = 0; xp < xPiece; xp++) {
                    for (let yp = 0; yp < yPiece; yp++) {

                        var calcVerticesOne = []
                        var calcTextureOne = []
                        var calcNormalsOne = []
                        var cubeProperties

                        var xc = xStartCoor + (xp * pixel)
                        var yc = yStartCoor + (yp * pixel)
                        var zc = zStartCoor - (zp * pixel)

                        var color = this.randomColor()

                        var koseler = [
                            vec4(xc, yc, (zc + pixel), 1.0),
                            vec4(xc, (yc + pixel), (zc + pixel), 1.0),
                            vec4((xc + pixel), (yc + pixel), (zc + pixel), 1.0),
                            vec4((xc + pixel), yc, (zc + pixel), 1.0),
                            vec4(xc, yc, zc, 1.0),
                            vec4(xc, (yc + pixel), zc, 1.0),
                            vec4((xc + pixel), (yc + pixel), zc, 1.0),
                            vec4((xc + pixel), yc, zc, 1.0)
                        ]

                        cubeProperties = this.createCube(koseler, shading)

                        calcVerticesOne = cubeProperties[0] // vertices
                        wv = wv.concat(calcVerticesOne)

                        calcTextureOne = cubeProperties[1] // textures
                        tv = tv.concat(calcTextureOne)

                        calcNormalsOne = cubeProperties[2] // normals
                        nv = nv.concat(calcNormalsOne)

                        for (let index = 0; index < 6; index++) {

                            for (let j = 0; j < 6; j++) {
                                // for square, we are adding 6 vertices for each surface
                                cv.push(color);
                            }
                        }
                    }
                }
            }

            this.cubePiece = xPiece + yPiece + zPiece
            this.indiceNumber = wv.length
            this.wallVertices = wv
            this.colors = cv
            this.textureCoords = tv
            this.normals = nv
        } else {
            var wv = []
            var cv = []
            var tv = []
            var nv = []

            var xStart = this.scaleBetween(xfrom, 0, 100, -1.0, 1.0)
            var yStart = this.scaleBetween(yfrom, 0, 50, 0.0, 1.0)
            var zStart = this.scaleBetween(zfrom, 0, 100, 1.0, -1.0)

            var xEnd = this.scaleBetween(xto, 0, 100, -1.0, 1.0)
            var yEnd = this.scaleBetween(yto, 0, 50, 0.0, 1.0)
            var zEnd = this.scaleBetween(zto, 0, 100, 1.0, -1.0)


            var calcVerticesOne = []
            var calcTextureOne = []
            var calcNormalsOne = []
            var cubeProperties

            var color = this.randomColor()

            var koseler = [
                vec4(xStart, yStart, zStart, 1.0),
                vec4(xStart, yEnd, zStart, 1.0),
                vec4(xEnd, yEnd, zStart, 1.0),
                vec4(xEnd, yStart, zStart, 1.0),
                vec4(xStart, yStart, zEnd, 1.0),
                vec4(xStart, yEnd, zEnd, 1.0),
                vec4(xEnd, yEnd, zEnd, 1.0),
                vec4(xEnd, yStart, zEnd, 1.0)
            ]

            cubeProperties = this.createCube(koseler)

            calcVerticesOne = cubeProperties[0] // vertices
            wv = wv.concat(calcVerticesOne)

            calcTextureOne = cubeProperties[1] // textures
            tv = tv.concat(calcTextureOne)

            calcNormalsOne = cubeProperties[2] // normals
            nv = nv.concat(calcNormalsOne)

            for (let index = 0; index < 6; index++) {

                for (let j = 0; j < 6; j++) {
                    // for square, we are adding 6 vertices for each surface
                    cv.push(color);
                }
            }


            this.cubePiece = 3
            this.indiceNumber = wv.length
            this.wallVertices = wv
            this.colors = cv
            this.textureCoords = tv
            this.normals = nv
        }
    }
}