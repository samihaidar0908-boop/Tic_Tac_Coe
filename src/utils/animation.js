/* notes:
You can modify function whatever you want.
But you have be add keyframes in style css and class of animation so it can work.
*/

// popScale the element
export const popScale = (e) => {
    e.classList.remove('popAnimation');
    void e.offsetWidth;
    e.classList.add('popAnimation')
}

// slideDown the element (from top to bottom)
export const fadeSlideDown = (e) => {
    e.classList.remove("fadeSlide");
    void e.offsetWidth;
    e.classList.add("fadeSlide")
}

// fadeIn the element (from 0 opacity to 1 opacity)
export const fadeIn = (e) => {
    e.classList.remove('fadeInAnim');
    void e.offsetWidth;
    e.classList.add('fadeInAnim');
}

// fadeOut the element (from opacity 1 to 0)
export const fadeOut = (element) => {
    element.classList.remove("fadeOutAnim");
    void element.offsetWidth;
    element.classList.add("fadeOutAnim");
}