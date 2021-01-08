const nav = document.querySelector('.nav')
window.addEventListener('scroll', fixNav)

function fixNav() {
    if(window.scrollY > nav.offsetHeight + 150) {
        nav.classList.add('active')
    } else {
        nav.classList.remove('active')
    }
}

$(document.body).ready(function() {
	
                var hi = $('.roll');
            
            
                TweenMax.from(hi, 5, {
                    y: 140,
                    opacity: 0,
                    ease: Elastic.easeOut
                })
            });


            const panels = document.querySelectorAll('.panel')

            panels.forEach(panel => {
                panel.addEventListener('click', () => {
                    removeActiveClasses()
                    panel.classList.add('active')
                })
            })
            
            function removeActiveClasses() {
                panels.forEach(panel => {
                    panel.classList.remove('active')
                })
            }