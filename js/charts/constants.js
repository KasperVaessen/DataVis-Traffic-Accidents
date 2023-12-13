const colors = {
    'bar_primary': '#e8290d',
    'color_blind_friendly_4': ["#648fff", "#f0e442", "#009e73", "#e8290d"],
} 

function readableIntegerString(integerString) {
    return integerString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export {colors, readableIntegerString};