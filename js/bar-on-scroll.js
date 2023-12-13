// 1. Define a new scroller, and use the `.container` method to specify the desired container
var scroll = scroller()
    .container(d3.select('#steps'));

// 2. Pass in a selection of all elements that you wish to fire a step event:
scroll(d3.selectAll('.step')); // each section with class `step` is a new step

// Specify the function you wish to activate when a section becomes active
scroll.on('active', function(index) {
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });
  update(index);
})

function update(index) {
    switch(index) {
        case 0:
            document.getElementById("circle").style.background = "blue"
            break;
        case 1:
            document.getElementById("circle").style.background = "red"
            break;
        case 2:
            document.getElementById("circle").style.background = "green"
            break;
        case 3:
            document.getElementById("circle").style.background = "yellow"
            break;
        
    }
}