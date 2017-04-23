"use strict";

var regularPolygon = function(sides) {
    var r = 100;
    var points = [];
    var i, theta;
    for (i = 0; i < sides; i += 1) {
        theta = Math.PI / 2 + i * (2 * Math.PI / sides);
        points.push([200 + r * Math.cos(theta), 150 + r * Math.sin(theta)]);
    }
    return points;
};

var square = function() {
    return [
        [100, 50],
        [300, 50],
        [300, 250],
        [100, 250]
    ];
};

var scaleneTriangle = function() {
    return [
        [50, 110],
        [250, 140],
        [10, 200]
    ];
};

var pointy = function() {
    return [
        [0, 0],
        [395, 290],
        [390, 295]
    ];
};

var snowflake = function(base, iterations) {
    var leftBulgeTriangle = function(segment) {
        var x = displacement(segment[0], segment[1]);
        var pointAlong = function(w) {
            return vSum(segment[0], scale(w, x));
        };
        var a = pointAlong(1.0 / 3);
        var c = pointAlong(2.0 / 3);
        var deflection = angle(a, c) - Math.PI / 3;
        var b = vSum(a, scale(magnitude(displacement(a, c)), [Math.cos, Math.sin].map(function(f) { return f(deflection); })));
        return [a, b, c];
    };

    var snowflakeIteration = function(points) {
        // the next iteration is the same as the present,
        // with each line segment expanded into an equilateral triangle
        // bulging out to the left.
        var i;
        var segs = segments(points);
        var next = [];

        for (i = 0; i < points.length; i += 1) {
            next.push(points[i]);
            next = next.concat(leftBulgeTriangle(segs[i]));
        }
        return next;
    };

    var points = base;
    var i;
    for (i = 0; i < iterations; i += 1) {
        points = snowflakeIteration(points);
    }

    return pathFromPoints(points);
};

var displacement = function(from, to) {
    return zip(from, to)(function(f, t) { return t - f; });
};

var magnitude = function(x) {
    return Math.sqrt(
        x.map(function(a) {
            return a * a;
        }).reduce(function(a, b) {
            return a + b;
        }, 0)
    );
};

var scale = function(scalar, vector) {
    return vector.map(function(dimension) {return scalar * dimension;});
};

var vSum = function(va, vb) {
    return zip(va, vb)(function(a, b) { return a + b; });
};

var zip = function(va, vb) {
    return function(f) {
        return vb.reduce(function(vector, __, dimension) {
            return vector.concat(f(va[dimension], vb[dimension]));
        }, []);
    };
};

var segments = function(points) {
    var i;
    var segs = [];
    for (i = 0; i < points.length - 1; i += 1) {
        segs.push([points[i], points[i + 1]]);
    }
    segs.push([points[points.length - 1], points[0]]);
    return segs;
};

var angle = function(from, to) {
    var run = to[0] - from[0];
    if (run === 0) {
        if (to[1] > from[1]) {
            return Math.PI / 2;
        } else if (to[1] < from[1]) {
            return -Math.PI / 2;
        } else {
            return 0 / 0;
        }
    }
    var rise = to[1] - from[1];
    var theta = Math.atan(rise / run);
    if (run < 0) {
        theta += Math.PI;
    }
    return theta;
};

var pathFromPoints = function(points) {
    return function(canvas) {
        var context = canvas.getContext('2d');

        context.beginPath();
        context.moveTo(points[points.length - 1][0], points[points.length - 1][1]);
        points.forEach(function(point) {
            context.lineTo(point[0], point[1]);
        });
        context.stroke();
    };
};
