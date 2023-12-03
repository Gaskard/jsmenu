function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    const slideNext = document.querySelector(nextArrow),
    slider = document.querySelector(container),
    slidePrev = document.querySelector(prevArrow),
    allSlide = document.querySelectorAll(slide),
    current = document.querySelector(currentCounter),
    total = document.querySelector(totalCounter),
    slidesWrapper = document.querySelector(wrapper),
    slidesField = document.querySelector(field),
    width = window.getComputedStyle(slidesWrapper).width;


let slideIndex = 1;
let offset = 0;

if (allSlide.length < 10) {
  total.textContent = `0${allSlide.length}`;
  current.textContent = `0${slideIndex}`;
} else {
  total.textContent = allSlide.length;
  current.textContent = slideIndex;
}


slidesField.style.width = 100 * allSlide.length + '%';
slidesField.style.display = 'flex';
slidesField.style.transition = '0.5s all';

slidesWrapper.style.overflow = 'hidden'

allSlide.forEach(slide => {
  slide.style.width = width;
});

slider.style.position = 'relative';

const indicators = document.createElement('ol'),
    dots = [];

indicators.classList.add('carousel-indicators');
indicators.style.cssText = `
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;
`;

slider.append(indicators);

for (let i = 0; i < allSlide.length; i++) {
  const dot = document.createElement('li');
  dot.setAttribute('data-slide-to', i + 1);
  dot.style.cssText =`
  box-sizing: content-box;
  flex: 0 1 auto;
  width: 30px;
  height: 6px;
  margin-right: 3px;
  margin-left: 3px;
  cursor: pointer;
  background-color: #fff;
  background-clip: padding-box;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  opacity: .5;
  transition: opacity .6s ease;
  `;
  if (i == 0) {
      dot.style.opacity = 1;
  }
  indicators.append(dot);
  dots.push(dot);
}

function delNotNumber(str) {
  return +str.replace(/\D/g, '');
}


slideNext.addEventListener('click', () => {
  if (offset == delNotNumber(width) * ( allSlide.length - 1)) {
      offset = 0;
  } else {
      offset += delNotNumber(width)
  }

  slidesField.style.transform = `translateX(-${offset}px)`;

  if (slideIndex == allSlide.length) {
      slideIndex = 1;
  } else {
      slideIndex++;
  }

  if (allSlide.length < 10) {
      current.textContent = `0${slideIndex}`;
  } else {
      current.textContent = slideIndex;
  }

  dots.forEach(dot => dot.style.opacity = '.5');
  dots[slideIndex - 1].style.opacity = 1;
});


slidePrev.addEventListener('click', () => {
  if (offset == 0) {
      offset = delNotNumber(width) * ( allSlide.length - 1);
  } else {
      offset -= delNotNumber(width);
  }

  slidesField.style.transform = `translateX(-${offset}px)`;


  if (slideIndex == 1) {
      slideIndex = allSlide.length;
  } else {
      slideIndex--;
  }

  if (allSlide.length < 10) {
      current.textContent = `0${slideIndex}`;
  } else {
      current.textContent = slideIndex;
  }

  dots.forEach(dot => dot.style.opacity = '.5');
  dots[slideIndex - 1].style.opacity = 1;
});

dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');

      slideIndex = slideTo;
      offset = delNotNumber(width) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (allSlide.length < 10) {
          current.textContent = `0${slideIndex}`;
      } else {
          current.textContent = slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex - 1].style.opacity = 1;
  });
});
}

export default slider;