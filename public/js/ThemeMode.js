const btn = document.querySelector('.btn_theme');

btn.addEventListener('click', () => {
    if(document.querySelector('html').classList.contains('darkmode')){
        document.querySelector('html').classList.remove('darkmode');
    }
    else{
        document.querySelector('html').classList.add('darkmode');

    }
})