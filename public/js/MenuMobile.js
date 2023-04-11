document.querySelector('.back').onclick = function(){
    document.querySelector('.chatBox').style.display = 'none';
    document.querySelector('section').style.display = 'block';
}
// document.querySelector('.3points').onclick = function(){
//     document.querySelector('section').style.display = 'none';
//     document.querySelector('header').style.display = 'block';
// }

function menu_display(){
    document.querySelector('section').style.display = 'none';
    document.querySelector('header').style.display = 'block';
}
function menu_display_false(){
    document.querySelector('section').style.display = 'block';
    document.querySelector('header').style.display = 'none';
}

