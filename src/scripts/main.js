import 'virtual:svg-icons-register'
if (import.meta.hot) {
  import.meta.hot.accept()
}

const header = document.querySelector('.neuron__header')
const neuron__hero = document.querySelector('.neuron__hero')
document.addEventListener('scroll', () => {
  if (window.scrollY > header.offsetHeight) {
    header.classList.add('neuron__header--scrolled')    
    console.log(neuron__hero.offsetHeight, window.scrollY);
    
    
  } else {
    header.classList.remove('neuron__header--scrolled')
  }
  if (window.scrollY >= neuron__hero.offsetHeight - header.offsetHeight) {
    neuron__hero.style.opacity = '0'  
    
  } else {
    neuron__hero.removeAttribute('style')
  }
})

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



window.addEventListener('scroll', () => {
  const scalable = document.querySelector('.neuron__hero-after-bg');
  const scrollTop = window.scrollY;
  const maxScroll = neuron__hero.offsetHeight; // после этой точки масштаб перестаёт увеличиваться
  const maxScale = 1.3;

  const progress = Math.min(scrollTop / maxScroll, 1); // от 0 до 1
  const scale = 1 + progress * (maxScale - 1); // от 1 до maxScale

  scalable.style.transform = `scale(${scale.toFixed(3)})`;
});

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.features');
  const items = section.querySelectorAll('.features__item');
  const button = section.querySelector('.btn-base');

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      // Появление айтемов с задержкой
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 300); // задержка между айтемами
      });

      // Кнопка после всех
      setTimeout(() => {
        button.classList.add('visible');
      }, items.length * 300 + 300);

      observer.disconnect(); // один раз
    }
  }, { threshold: 0.3 });

  observer.observe(section);
});