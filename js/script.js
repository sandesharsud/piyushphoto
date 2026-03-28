document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;

  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Sticky Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Portfolio Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 4. Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && portfolioItems.length > 0) {
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
      }
    });
  }

  // 5. Contact Form Submission (WhatsApp + Google Sheets)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service-type').value;
      const date = document.getElementById('date').value;
      const message = document.getElementById('message').value;
      
      if (!phone || phone.length < 10) {
        alert("Please enter a valid phone number.");
        return;
      }

      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;

      // Prepare data for Google Sheets
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Phone', phone);
      formData.append('Service', service);
      formData.append('Date', date);
      formData.append('Message', message);

      // IMPORTANT: REPLACE THIS URL with your deployed Google Apps Script Web App URL
      const googleScriptURL = 'https://script.google.com/macros/s/AKfycbzD9Zi5Lup_Dx8dQYkO-HZ7cN_f1BZKqsyIfuwQinqq9O8TlFY3rb-zlfCFWVTo-yj6MA/exec';

      // Send to Google Sheets invisibly (fire and forget using no-cors)
      if (googleScriptURL && googleScriptURL.startsWith('http')) {
        fetch(googleScriptURL, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        }).catch(error => console.error('Error logging to Google Sheets!', error.message));
      } else {
        console.warn("Google Script URL is not set. Data not saved to sheets.");
      }



      // Formulate WhatsApp Message
      const whatsappNumber = '917276015024';
      const whatsappText = `Hello Piyush Photo! I would like to make an inquiry.

*Name:* ${name}
*Phone:* ${phone}
*Service Requested:* ${service}
*Preferred Date:* ${date}

*Message:* ${message}`;

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

      // Alert, redirect to WhatsApp in a new tab, and reset the form
      alert('Your inquiry details are ready. Redirecting to WhatsApp to send message...');
      window.open(whatsappURL, '_blank');
      
      contactForm.reset();
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    });
  }

  // 6. ScrollSpy (Highlight active nav link based on scroll)
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-menu li a[href^="#"]');

  if (sections.length > 0 && navItems.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // 150px offset to accommodate the fixed sticky header height comfortably
        if (scrollY >= (sectionTop - 150)) {
          current = section.getAttribute('id');
        }
      });

      navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
          a.classList.add('active');
        }
      });
    });
  }

});
