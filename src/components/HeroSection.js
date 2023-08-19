
function createHeroSection() {
    const heroElement = document.createElement('section');   
    
    let innerHero = `<section class="hero-panel">
                        <div class="hero-panel__inner container">
                            <div class="hero-panel__inner--content">
                                <h1>HTML to PDF conversion API</h1>
                                <h2>Most realistic, high-quality HTML to PDF conversion API service for developers!</h2>
                                <h3>Save your time and effort, by dedicating a PDF <br />conversion task to us.</h3>
                                <div class="hero-panel__inner--content__btn-group">
                                    <button class="btn">Get a free API key</button>
                                    <a class="btn btn-invert">View Pricing</a>
                                </div>
                            </div>
                            <figure class="hero-panel__inner--image">
                                <img src="/src/images/hero_thumb.png" width="490" height="500" alt="Hero Image" />
                            </figure>
                        </div>
                    </section>`;

    heroElement.innerHTML = innerHero;    
    return heroElement;
}

const heroSection = createHeroSection();
let heroElm = document.getElementById('hero_component');
heroElm.appendChild(heroSection);
