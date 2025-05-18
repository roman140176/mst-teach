import gsap from 'gsap';
import IMask from 'imask';
import 'virtual:svg-icons-register'
if (import.meta.hot) {
  import.meta.hot.accept()
}

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');

  // Добавляем класс для плавного исчезновения
  preloader.classList.add('hide');

  // Ждём, пока завершится CSS-анимация, затем удаляем элемент
  setTimeout(() => {
    if (preloader && preloader.parentNode) {
      preloader.parentNode.removeChild(preloader);
    }
  }, 600); // чуть больше времени, чем transition в SCSS
});

const tabItems = document.querySelectorAll('.js-tab-item');
const tabInfoItems = document.querySelectorAll('.tabs__content-info');

if (tabItems.length) {
  tabItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-comtent');

      // Убираем .active со всех табов
      tabItems.forEach((item) => item.classList.remove('active'));
      e.currentTarget.classList.add('active');

      // Убираем -active со всех блоков
      tabInfoItems.forEach((item) => item.classList.remove('-active'));

      // Добавляем -active нужному
      const targetBlock = document.querySelector(id);
      targetBlock.classList.add('-active');

      // Прокручиваем к блоку
      targetBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
}




// // *******************************

const slides = document.querySelectorAll('.slider__slide');
const nextBtn = document.querySelector('.slider__arrow--right');
const prevBtn = document.querySelector('.slider__arrow--left');
const dots = document.querySelectorAll('.slider__dot');
const sliderContainer = document.querySelector('.slider'); // основной контейнер

// Перевод px в vw
const pxToVw = (px) => (px / 1920) * 100;

// Текущий порядок слайдов
let order = [0, 1, 2, 3];

// Получение адаптивных позиций
function getPositions() {
  const width = window.innerWidth;

  if (width <= 768) {
    return [
      { left: 0,   top: 480, z: 10 },
      { left: 0,   top: 0,   z: 5 },
      { left: 540, top: -70, z: 4 },
      { left: 540, top: 410, z: 3 },
    ];
  } else if (width <= 1200) {
    return [
      { left: 0,   top: 250, z: 10 },
      { left: 0,   top: 0,   z: 5 },
      { left: 315, top: -66, z: 4 },
      { left: 315, top: 190, z: 3 },
    ];
  } else {
    return [
      { left: 0,   top: 193, z: 10 },
      { left: 0,   top: 0,   z: 5 },
      { left: 320, top: -56, z: 4 },
      { left: 320, top: 137, z: 3 },
    ];
  }
}

// Обновление классов .active
function updateActiveClasses() {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[order[0]].classList.add('active');
  dots[order[0]].classList.add('active');
}

// Основная анимация
function animateSlides() {
  const positions = getPositions();

  order.forEach((slideIndex, i) => {
    const slide = slides[slideIndex];
    const pos = positions[i];

    gsap.to(slide, {
      left: `${pxToVw(pos.left)}vw`,
      top: `${pxToVw(pos.top)}vw`,
      duration: 0.6,
      ease: 'power3.inOut',
    });

    slide.style.zIndex = pos.z;
  });

  updateActiveClasses();
}

// Переключение вперёд/назад
function next() {
  order.push(order.shift());
  animateSlides();
}

function prev() {
  order.unshift(order.pop());
  animateSlides();
}

// Обработчики стрелок
nextBtn.addEventListener('click', () => {
  next();
});

prevBtn.addEventListener('click', () => {
  prev();
  // resetAutoSlide();
});

// Обработка буллитов
dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    while (order[0] !== idx) {
      order.push(order.shift());
    }
    animateSlides();
    // resetAutoSlide();
  });
});

// Debounce при resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    animateSlides();
    // startAutoSlide();
  }, 200);
});

// Автопрокрутка
let autoSlideInterval;

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    next();
  }, 4000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// function resetAutoSlide() {
//   stopAutoSlide();
//   startAutoSlide();
// }

// Остановка при наведении
sliderContainer.addEventListener('mouseenter', stopAutoSlide);
sliderContainer.addEventListener('mouseleave', startAutoSlide);

// Инициализация
animateSlides();
// startAutoSlide();


// FORM
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formId');
  const username = document.getElementById('user-id');
  const phone = document.getElementById('input-phone');
  const checkbox = document.getElementById('accept');

  // Инициализация маски для телефона
  const phoneMask = IMask(phone, {
    mask: '+{7} (000) 000-00-00'
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    // Валидация имени
    if (username.value.trim().length < 3) {
      showError(username, 'Имя должно содержать минимум 3 символа');
      hasError = true;
    }

    // Валидация телефона — mask.unmaskedValue должен быть полной длины
    const phoneDigits = phoneMask.unmaskedValue;
    if (phoneDigits.length !== 11) {
      showError(phone, 'Введите корректный номер телефона');
      hasError = true;
    }

    // Валидация чекбокса
    if (!checkbox.checked) {
      showError(checkbox, 'Необходимо согласие');
      hasError = true;
    }

    if (!hasError) {
      showPopup('Форма успешно отправлена!');
      form.reset();
      phoneMask.updateValue(); // сброс маски
    }
  });

  function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    const parent = input.closest('.form-group') || input.parentElement;
    parent.appendChild(error);
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(e => e.remove());
  }

  function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup-success';
    popup.innerHTML = `<div class="popup-content">${message}</div>`;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('visible'), 10);
    // setTimeout(() => {
    //   popup.classList.remove('visible');
    //   setTimeout(() => popup.remove(), 300);
    // }, 2500);
  }
});
