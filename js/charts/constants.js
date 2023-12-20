const colors = {
    'bar_primary':  getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color1'),
    'first_graph_color': getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color1'),
    'second_graph_color': getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color2'),
    'third_graph_color': getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color3'),
    'fourth_graph_color': getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color4'),
    'fifth_graph_color': getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color5'),
    'color_blind_friendly_4': [
        getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color1'), 
        getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color2'), 
        getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color3'), 
        getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color4')
],
} 

function readableIntegerString(integerString) {
    return integerString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



export {colors, readableIntegerString};