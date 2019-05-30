"use strict";
/**
 * an example of traditional event driven programming style - this is what we are
 * replacing with observable.
 * The following adds a listener for the mouse event
 * handler, sets p and adds or removes a highlight depending on x position
 */
function mousePosEvents() {
    var pos = document.getElementById("pos");
    document.addEventListener("mousemove", function (e) {
        var p = e.clientX + ', ' + e.clientY;
        pos.innerHTML = p;
        if (e.clientX > 400) {
            pos.classList.add('highlight');
        }
        else {
            pos.classList.remove('highlight');
        }
    });
}
/**
 * constructs an Observable event stream with three branches:
 *   Observable<x,y>
 *    |- set <p>
 *    |- add highlight
 *    |- remove highlight
 */
function mousePosObservable() {
    var pos = document.getElementById("pos"), o = Observable
        .fromEvent(document, "mousemove")
        .map(function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        return ({ x: clientX, y: clientY });
    });
    o.map(function (_a) {
        var x = _a.x, y = _a.y;
        return x + "," + y;
    })
        .subscribe(function (s) { return pos.innerHTML = s; });
    o.filter(function (_a) {
        var x = _a.x;
        return x > 400;
    })
        .subscribe(function (_) { return pos.classList.add('highlight'); });
    o.filter(function (_a) {
        var x = _a.x;
        return x <= 400;
    })
        .subscribe(function (_) { return pos.classList.remove('highlight'); });
}
/**
 * animates an SVG rectangle, passing a continuation to the built-in HTML5 setInterval function.
 * a rectangle smoothly moves to the right for 1 second.
 */
function animatedRectTimer() {
    var svg = document.getElementById("animatedRect");
    var rect = new Elem(svg, 'rect')
        .attr('x', 100).attr('y', 70)
        .attr('width', 120).attr('height', 80)
        .attr('fill', '#95B3D7');
    var animate = setInterval(function () { return rect.attr('x', 1 + Number(rect.attr('x'))); }, 10);
    var timer = setInterval(function () {
        clearInterval(animate);
        clearInterval(timer);
    }, 1000);
}
/**
 * Demonstrates the interval method on Observable.
 * The observable stream fires every 10 milliseconds.
 * It terminates after 1 second (1000 milliseconds)
 */
function animatedRect() {
    var svg = document.getElementById("animatedRect");
    var rect = new Elem(svg, 'rect')
        .attr('x', 100).attr('y', 70)
        .attr('width', 120).attr('height', 80)
        .attr('fill', '#95B3D7');
    Observable.interval(10)
        .takeUntil(Observable.interval(1000))
        .subscribe(function () { return rect.attr('x', 1 + Number(rect.attr('x'))); });
}
// an example of traditional event driven programming style - this is what we are 
// replacing with observable
// creates an SVG rectangle that can be dragged with the mouse
function dragRectEvents() {
    var svg = document.getElementById("dragRect"), _a = svg.getBoundingClientRect(), left = _a.left, top = _a.top;
    var rect = new Elem(svg, 'rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', 120).attr('height', 80)
        .attr('fill', '#95B3D7');
    rect.elem.addEventListener('mousedown', (function (e) {
        var xOffset = Number(rect.attr('x')) - e.clientX, yOffset = Number(rect.attr('y')) - e.clientY, moveListener = function (e) {
            rect
                .attr('x', e.clientX + xOffset)
                .attr('y', e.clientY + yOffset);
        }, done = function () {
            svg.removeEventListener('mousemove', moveListener);
        };
        svg.addEventListener('mousemove', moveListener);
        svg.addEventListener('mouseup', done);
        svg.addEventListener('mouseout', done);
    }));
}
/**
 * Observable version of dragRectEvents:
 * Constructs an observable stream for the rectangle that
 * on mousedown creates a new stream to handle drags until mouseup
 *   O<MouseDown>
 *     | map x/y offsets
 *   O<x,y>
 *     | flatMap
 *     +---------------------+------------...
 *   O<MouseMove>          O<MouseMove>
 *     | takeUntil mouseup   |
 *   O<MouseMove>          O<MouseMove>
 *     | map x/y + offsets   |
 *     +---------------------+------------...
 *   O<x,y>
 *     | move the rect
 *    ---
 */
function dragRectObservable() {
    var svg = document.getElementById("dragRect"), mousemove = Observable.fromEvent(svg, 'mousemove'), mouseup = Observable.fromEvent(svg, 'mouseup'), rect = new Elem(svg, 'rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', 120).attr('height', 80)
        .attr('fill', '#95B3D7');
    rect.observe('mousedown')
        .map(function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        return ({ xOffset: Number(rect.attr('x')) - clientX,
            yOffset: Number(rect.attr('y')) - clientY });
    })
        .flatMap(function (_a) {
        var xOffset = _a.xOffset, yOffset = _a.yOffset;
        return mousemove
            .takeUntil(mouseup)
            .map(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            return ({ x: clientX + xOffset, y: clientY + yOffset });
        });
    })
        .subscribe(function (_a) {
        var x = _a.x, y = _a.y;
        return rect.attr('x', x)
            .attr('y', y);
    });
}
/**
 * An example of traditional event driven programming style - this is what we are
 * replacing with observable.
 * It allows the user to draw SVG rectangles by dragging with the mouse
 */
function drawRectsEvents() {
    var svg = document.getElementById("drawRects");
    svg.addEventListener('mousedown', function (e) {
        var svgRect = svg.getBoundingClientRect(), x0 = e.clientX - svgRect.left, y0 = e.clientY - svgRect.top, rect = new Elem(svg, 'rect')
            .attr('x', String(x0))
            .attr('y', String(y0))
            .attr('width', '5')
            .attr('height', '5')
            .attr('fill', '#95B3D7');
        function moveListener(e) {
            var x1 = e.clientX - svgRect.left, y1 = e.clientY - svgRect.top, left = Math.min(x0, x1), top = Math.min(y0, y1), width = Math.abs(x0 - x1), height = Math.abs(y0 - y1);
            rect.attr('x', String(left))
                .attr('y', String(top))
                .attr('width', String(width))
                .attr('height', String(height));
        }
        function cleanup() {
            svg.removeEventListener('mousemove', moveListener);
            svg.removeEventListener('mouseup', cleanup);
        }
        svg.addEventListener('mouseup', cleanup);
        svg.addEventListener('mousemove', moveListener);
    });
}
/**
 * Observable version of the above
 */
function drawRectsObservable() {
    // implement this function!
    var svg = document.getElementById("drawRects"), mousemove = Observable.fromEvent(svg, 'mousemove'), mouseup = Observable.fromEvent(svg, 'mouseup'), rect = new Elem(svg, 'rect');
    Observable.fromEvent(svg, 'mousedown')
        .map(function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        return new Elem(svg, 'rect').attr;
    });
}
/**
 * dragging on an empty spot on the canvas should draw a new rectangle.
 * dragging on an existing rectangle should drag its position.
 */
function drawAndDragRectsObservable() {
    // implement this function!
    // A problem to solve is how to drag a rectangle without starting to draw another rectangle?
    // Two possible solutions: 
    //  (1) introduce a "drag state" by mutating a top level variable at mousedown on the rectangle 
    //  (2) add a parallel subscription to mousedown that calls the "stopPropagation" method on the MouseEvent
    // Which one is better and why?
    // See if you can refactor the code from dragRectObservable and drawRectsObservable into reusable functions
    // that can be composed together to make drawAndDragRectsObservable almost trivial.
}
if (typeof window != 'undefined')
    window.onload = function () {
        // old fashioned continuation spaghetti implementations:
        mousePosEvents();
        animatedRectTimer();
        dragRectEvents();
        drawRectsEvents();
        // when your observable is working replace the above four functions with the following:
        // mousePosObservable();
        // animatedRect()
        // dragRectObservable();
        //drawRectsObservable();
        // you'll need to implement the following function yourself:
        drawAndDragRectsObservable();
    };
