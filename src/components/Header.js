
function createHeaderElement() {
    const headerElement = document.createElement('header');   
    
    let innerHeader = `<div class="main-haeder container">
                        <div class="main-header__inner">
                            <div class="main-header__inner--logo">
                                <img src="/src/images/logo.png" width="200" height="50" alt="Header Logo" />
                            </div>
                            <div class="mobile-view main-header__inner--hamberger">
                            </div>
                            <div class="main-header__inner--nav">
                                <ul>
                                    <li><a>Live Demo</a></li>
                                    <li><a>Features</a></li>
                                    <li><a>Pricing</a></li>
                                    <li><a>Documentation</a></li>
                                </ul>
                                <div class="main-header__inner--login">
                                    <button class="btn init-login">Login</button>
                                    <div class="loggedin-user hide"></div>
                                </div>
                            </div>                            
                        </div>
                    </div>`;

    headerElement.innerHTML = innerHeader;    
    return headerElement;
}

const myHeader = createHeaderElement();
let headerElm = document.getElementById('header-component');
headerElm.appendChild(myHeader);
