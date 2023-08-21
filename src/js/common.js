document.addEventListener('readystatechange', event => {

    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {

        document.body.addEventListener('click', function(event) {
            var target = event.target;
            var headerInnerHamberger = document.querySelector('.main-header__inner--hamberger');
            var headerInnerNav = document.querySelector('.main-header__inner--nav');
        
            if (headerInnerHamberger && target === headerInnerHamberger) {
                headerInnerNav.classList.toggle('active');
            }
        });

        $('body').on('click', '.init-login', function(){
            HTMLToPDF.system.login();
        });        
    }

    if (event.target.readyState === "complete") {

    }

});