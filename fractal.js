"use strict";

var pathFromPoints = function(points) {
    return function(canvas) {
        var i;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (i = 1; i < points.length; i += 1) {
            context.lineTo(points[i][0], points[i][1]);
        }
        context.lineTo(points[0][0], points[0][1]);
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

var angle = function(p1, p2) {
    var run = p2[0] - p1[0];
    if (run === 0) {
        if (p2[1] > p1[1]) {
            return Math.PI / 2;
        } else if (p2[1] < p1[1]) {
            return -Math.PI / 2;
        } else {
            return 0 / 0;
        }
    }
    var rise = p2[1] - p1[1];
    var theta = Math.atan(rise / run);
    if (run < 0) {
        theta += Math.PI;
    }
    return theta;
};

var snowflake = function(iterations) {
    var base = function() {
        /*
        return [
            [150, 50],
            [250, 150],
            [150, 250],
            [50, 150]
        ];
       // */
        return [
            [50, 110],
            [250, 140],
            [10, 200]
        ];
       // */
    };

    var leftBulgeTriangle = function(segment) {
        var displacement = [segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]];
        var a = [segment[0][0] + 1 * displacement[0] / 3, segment[0][1] + 1 * displacement[1] / 3];
        var c = [segment[0][0] + 2 * displacement[0] / 3, segment[0][1] + 2 * displacement[1] / 3];
        var theta = angle(a, c) - Math.PI / 2;
        var d = Math.sqrt(Math.pow(c[0] - a[0], 2) + Math.pow(c[1] - a[1], 2));
        var midpoint = [(segment[0][0] + segment[1][0]) / 2, (segment[0][1] + segment[1][1]) / 2];;
        var b = [midpoint[0] + d * Math.cos(theta), midpoint[1] + d * Math.sin(theta)];
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

    var points = base();
    var i;
    for (i = 0; i < iterations; i += 1) {
        points = snowflakeIteration(points);
    }

    return pathFromPoints(points);
};
