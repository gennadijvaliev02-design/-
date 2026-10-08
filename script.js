/**
 * Стоматологическая клиника «Ризориус» (г. Елец)
 * Скрипты взаимодействия и интерактива
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Элементы интерфейса ---
  const bookingModal = document.getElementById('bookingModal');
  const openBookingBtns = [
    document.getElementById('openBookingBtn'),
    document.getElementById('heroBookBtn'),
    document.getElementById('doctorConsultBtn'),
    document.getElementById('ctaBookingBtn')
  ].filter(Boolean);

  const closeBookingModal = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const toast = document.getElementById('toastNotification');

  // --- Открытие и закрытие модального окна ---
  const openModal = (preselectedService = null, initialComment = '') => {
    if (preselectedService && serviceSelect) {
      // Ищем совпадение среди опций
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase()) ||
            preselectedService.toLowerCase().includes(serviceSelect.options[i].value.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (initialComment) {
      const commentInput = document.getElementById('clientComment');
      if (commentInput) commentInput.value = initialComment;
    }
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => openModal());
  });

  if (closeBookingModal) {
    closeBookingModal.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Кнопки записи прямо из карточек услуг
  document.querySelectorAll('.select-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      openModal(serviceName);
    });
  });

  // --- Фильтрация услуг по вкладкам ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Интерактивный калькулятор услуг ---
  const calcCheckboxes = document.querySelectorAll('.calc-check');
  const calcTotalValue = document.getElementById('calcTotalValue');
  const calcSelectedList = document.getElementById('calcSelectedList');
  const calcBookBtn = document.getElementById('calcBookBtn');

  const updateCalculator = () => {
    let total = 0;
    const selectedItems = [];

    calcCheckboxes.forEach(cb => {
      if (cb.checked) {
        total += parseInt(cb.value, 10);
        selectedItems.push(cb.getAttribute('data-name'));
      }
    });

    // Форматирование числа в денежный вид
    calcTotalValue.textContent = total.toLocaleString('ru-RU') + ' ₽';

    // Обновление списка выбранных услуг
    calcSelectedList.innerHTML = '';
    if (selectedItems.length === 0) {
      calcSelectedList.innerHTML = '<li class="text-muted">Не выбрано ни одной услуги</li>';
    } else {
      selectedItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        calcSelectedList.appendChild(li);
      });
    }
  };

  calcCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateCalculator);
  });

  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const selected = [];
      calcCheckboxes.forEach(cb => {
        if (cb.checked) selected.push(cb.getAttribute('data-name'));
      });
      const comment = `Расчет из калькулятора (~${calcTotalValue.textContent}): ${selected.join(', ')}`;
      openModal('Консультация и первичный осмотр', comment);
    });
  }

  // --- FAQ Аккордеон ---
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    const body = item.querySelector('.accordion__body');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Закрываем остальные
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion__body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- Мобильное меню ---
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileMenuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // --- Маска для ввода номера телефона ---
  const phoneInput = document.getElementById('clientPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (!x[2]) {
        e.target.value = x[1] ? '+7 (' : '';
      } else {
        e.target.value = !x[3] ? `+7 (${x[2]}` : `+7 (${x[2]}) ${x[3]}${x[4] ? '-' + x[4] : ''}${x[5] ? '-' + x[5] : ''}`;
      }
    });
  }

  // --- Всплывающее уведомление (Toast) ---
  const showToast = (title, message) => {
    const toastTitle = document.getElementById('toastTitle');
    const toastDesc = document.getElementById('toastDesc');
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = message;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  // --- Обработка отправки формы записи ---
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('serviceSelect').value;

      if (!name || !phone) {
        alert('Пожалуйста, заполните имя и номер телефона.');
        return;
      }

      closeModal();
      bookingForm.reset();

      showToast(
        `Спасибо, ${name}! Заявка принята`,
        `Вы записаны на «${service}». Доктор или администратор перезвонит на номер ${phone} для подтверждения.`
      );
    });
  }

  // Установка минимальной даты бронирования на завтра
  const prefDateInput = document.getElementById('prefDate');
  if (prefDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    prefDateInput.min = `${yyyy}-${mm}-${dd}`;
    prefDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

});
