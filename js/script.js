document.addEventListener('DOMContentLoaded', () => {

//Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });

    //Timer

    const deadline = '2024-01-01 ';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }
  

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    
        function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    } 

        function setClock(selector, endtime) {
            const timer = document.querySelector(selector),
                  days = timer.querySelector('#days'),
                  hours = timer.querySelector('#hours'),
                  minutes = timer.querySelector('#minutes'),
                  seconds = timer.querySelector('#seconds'),
                  timeInterval = setInterval(updateClock, 1000);

            updateClock();      

            function updateClock() {
                const t = getTimeRemaining(endtime);

                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);

                if (t.total <= 0) {
                    clearInterval(timeInterval);
                }
            }
        }

        setClock('.timer', deadline);


        // Modal 

        const modalTrigger = document.querySelectorAll('[data-modal]'),
              modal = document.querySelector('.modal');

        function openModal() {
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerId);
        }

        modalTrigger.forEach(btn => {
            btn.addEventListener('click', openModal);
        });



        function closeModal() {
            modal.classList.add('hide');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }


        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

             const modalTimerId = setTimeout(openModal, 50000); 

            function showModalByScroll() {
                if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
                    openModal();
                    window.removeEventListener('scroll', showModalByScroll);
                }
            }

        window.addEventListener('scroll', showModalByScroll);


        // Cards with classes

        class MenuCard {
            constructor(src, alt, title, descr, price, parentSelector, ...classes) {
                this.src = src;
                this.alt = alt;
                this.title = title;
                this.descr = descr;
                this.price = price;
                this.classes = classes;
                this.parent = document.querySelector(parentSelector);
                this.transfer = 27;
                this.changeToUAH();
            }

            changeToUAH() {
                this.price = this.price * this.transfer
            }

            render() {
                const element = document.createElement('div');
                
                if (this.classes.length === 0) {
                    this.element = 'menu__item';
                    element.classList.add(this.element);   
                } else {
                    this.classes.forEach(className => element.classList.add(className));
                }


                element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
                `;
                this.parent.append(element);
            }
        }

        const getResource = async (url) => {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }

            return await res.json();
        };

/*         getResource('http://localhost:3000/menu')
            .then(data => {
                data.forEach(({img, altimg, title, descr, price}) => {
                    new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
                });
            }); */


            axios.get('http://localhost:3000/menu')
                .then(data => {
                    data.data.forEach(({img, altimg, title, descr, price}) => {
                        new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
                    });
                });


        // Forms

        const forms = document.querySelectorAll('form');

        const message = {
            loading: 'img/form/spinner.svg',
            success: 'thanks!',
            failure: 'whats happend'
        };

        forms.forEach(item => {
            bindPostData(item);
        });

        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
            });

            return await res.json();
        };

        function bindPostData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                `;
                
                form.insertAdjacentElement('afterend', statusMessage);

  

                const formData = new FormData(form);

                const json = JSON.stringify(Object.fromEntries(formData.entries()));
 
                postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                })
            });
        }

        function showThanksModal(message) {
            const prevModalDialog = document.querySelector('.modal__dialog');

            prevModalDialog.classList.add('hide');
            openModal();

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
                <div class="modal__content">
                    <div class="modal__close" data-close>×</div>
                    <div class="modal__title">${message}</div>
                </div>
            `;

            document.querySelector('.modal').append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');
                closeModal();
            }, 4000);
        }


        fetch('http://localhost:3000/menu')
            .then(data => data.json())
            .then(res => console.log(res));


        // slider

        const slideNext = document.querySelector('.offer__slider-next'),
              slider = document.querySelector('.offer__slider'),
              slidePrev = document.querySelector('.offer__slider-prev'),
              allSlide = document.querySelectorAll('.offer__slide'),
              current = document.querySelector('#current'),
              total = document.querySelector('#total'),
              slidesWrapper = document.querySelector('.offer__slider-wrapper'),
              slidesField = document.querySelector('.offer__slider-inner'),
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

        const indicators = document.createElement('ol');
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

  

/*         function showSlide() {

             if (slideIndex > 4) {
                slideIndex = 1
            }

            if (slideIndex < 1) {
                slideIndex = 4
            }

            if (allSlide.length < 10) {
                current.textContent = `0${slideIndex}`
            } else {
                current.textContent = slideIndex;
            }

            allSlide.forEach(item => {
                item.classList.add('hide'),
                item.classList.remove('show', 'fade'),
                allSlide[slideIndex - 1].classList.add('show', 'fade'),
                allSlide[slideIndex - 1].classList.remove('hide');
            });
        }

        showSlide(slideIndex - 1)

        if (allSlide.length < 10) {
            total.textContent = `0${allSlide.length}`;
        } else {
            total.textContent = allSlide.length;
        }

        slideNext.addEventListener('click', () => {


            slideIndex = slideIndex + 1;
            showSlide(slideIndex - 1);
        });
        
        
        slidePrev.addEventListener('click', () => {
            slideIndex = slideIndex - 1;
            showSlide(slideIndex - 1);
        }) */

        // calc


        const result = document.querySelector('.calculating__result span');
        let sex = 'female',
            height, weight, age, 
            ratio = 1.375;

            if (localStorage.getItem('sex')) {
                sex = localStorage.getItem('sex');
            } else {
                sex = 'female';
                localStorage.setItem('sex', 'female');
            }


            if (localStorage.getItem('ratio')) {
                ratio = localStorage.getItem('ratio');
            } else {
                ratio = 1.375;
                localStorage.setItem('ratio', 1.375);
            }


        function initLocalSettings(selector, activeClass) {
            const elements = document.querySelectorAll(selector);

            elements.forEach(elem => {
                elem.classList.remove(activeClass);
                if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                    elem.classList.add(activeClass);
                }
                if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                    elem.classList.add(activeClass);
                }
            });
        }

        initLocalSettings('#gender div', 'calculating__choose-item_active');
        initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

        function calcTotal() {
            if (!sex || !height || !weight || !age || !ratio) {
                result.textContent = '____';
                return;
            }

            if (sex === 'female') {
                result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
            } else {
                result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
            }
        }

        calcTotal();

        function getStaticInformation(selector, activeClass) {
            const elements = document.querySelectorAll(selector);

            elements.forEach(elem => {
                elem.addEventListener('click', (e) => {
                    if (e.target.getAttribute('data-ratio')) {
                        ratio = +e.target.getAttribute('data-ratio');
                        localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                    } else {
                        sex = e.target.getAttribute('id');
                        localStorage.setItem('sex', e.target.getAttribute('id'));
                    }
    
    
                    elements.forEach(elem => {
                        elem.classList.remove(activeClass);
                    });
    
                    e.target.classList.add(activeClass);
    
                    calcTotal();
                });
            });
        }

        getStaticInformation('#gender div', 'calculating__choose-item_active');
        getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

        function getDynamicInformation(selector) {
            const input = document.querySelector(selector);

            input.addEventListener('input', () => {

                if (input.value.match(/\D/g)) {
                    input.style.border = '1px solid red';
                } else {
                    input.style.border = 'none';
                }

                switch(input.getAttribute('id')) {
                    case 'height': 
                        height = +input.value;
                        break;
                    case 'weight':
                        weight = +input.value;
                        break;

                    case 'age':
                        age = +input.value;
                        break;
                }

                calcTotal();
            });
        }

        getDynamicInformation('#height');
        getDynamicInformation('#weight');
        getDynamicInformation('#age');
});