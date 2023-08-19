
function createFooterElement() {
    const footerElement = document.createElement('footer');   
    
    let innerFooter = `<div class="main-footer container">
                        <div class="main-footer__inner">
                            <div class="main-footer__inner--logo">
                                <img src="/src/images/logo.png" width="200" height="50" alt="Footer Logo" />
                            </div>
                            <div class="main-footer__inner--nav">
                                <ul>
                                    <li><a>Live Demo</a></li>
                                    <li><a>Features</a></li>
                                    <li><a>Pricing</a></li>
                                    <li><a>Blog</a></li>
                                    <li><a>Documentation</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="main-footer__bottom">
                            <div class="main-footer__bottom--copyright">
                                <p>&copy; 2023 html2pdf.com. All Rights Reserved.</p>
                            </div>
                            <div class="main-footer__bottom--urls">
                                <ul>
                                    <li><a>Privacy Policy</a></li>
                                    <li><a>Term of Service</a></li>                                    
                                </ul>
                            </div>
                        </div>
                    </div>`;
                    
    footerElement.innerHTML = innerFooter;    
    return footerElement;
}

const myFooter = createFooterElement();
let footerElm = document.getElementById('footer_component');
footerElm.appendChild(myFooter);
