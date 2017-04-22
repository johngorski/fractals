"use strict";

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

var diamond = function() {
    return [
        [150, 50],
        [250, 150],
        [150, 250],
        [50, 150]
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

var equilateralTriangle = function() {
    var r = 100;
    var points = [];
    var i, theta;
    for (i = 0; i < 3; i += 1) {
        theta = Math.PI / 2 + i * (2 * Math.PI / 3);
        points.push([200 + r * Math.cos(theta), 200 + r * Math.sin(theta)]);
    }
    return points;
};

var snowflake = function(iterations) {
    var leftBulgeTriangle = function(segment) {
        var displacement = [segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]];
        var a = [segment[0][0] + 1 * displacement[0] / 3, segment[0][1] + 1 * displacement[1] / 3];
        var c = [segment[0][0] + 2 * displacement[0] / 3, segment[0][1] + 2 * displacement[1] / 3];
        var theta = angle(a, c) - Math.PI / 3;
        var d = Math.sqrt(Math.pow(c[0] - a[0], 2) + Math.pow(c[1] - a[1], 2));
        var b = [a[0] + d * Math.cos(theta), a[1] + d * Math.sin(theta)];
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

    var points = diamond();
    var i;
    for (i = 0; i < iterations; i += 1) {
        points = snowflakeIteration(points);
    }

    return pathFromPoints(points);
};
