'use strict'

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')

const section1 = document.querySelector('#section--1')
const btnScrollTo = document.querySelector('.btn--scroll-to')

const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

const nav = document.querySelector('.nav')

const header = document.querySelector('.header')

////////////////////////////////////////////////////////////////////////////////////////////////////////
// open account modal window
const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = function () {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
// smooth scrolling

// learn more btn
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({
    behavior: 'smooth',
  })
})

// Page navigation - event delegation

// 1.Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target)
  // matching strategy
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    e.preventDefault()
    const id = e.target.getAttribute('href')
    //console.log(id)
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    })
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
// Tabbed Content

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab')

  // Guard clause
  if (!clicked) return

  // Active tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
  // Remove active classes
  tabsContent.forEach(tabs =>
    tabs.classList.remove('operations__content--active')
  )
  // Active tab
  clicked.classList.add('operations__tab--active')
  // Activating content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active')
})

// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this
    })
    logo.style.opacity = this
  }
}

header.addEventListener('mouseover', handleHover.bind(0.5))
header.addEventListener('mouseout', handleHover.bind(1))

// Implementing sticky nav using Intersection Observer
const navHeight = nav.getBoundingClientRect().height

const stickyNav = function (entries) {
  const [entry] = entries
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
})

headerObserver.observe(header)

// implementing section transistions using observer intersection
const allSection = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {
  const [entry] = entries

  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObser = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})

allSection.forEach(function (section) {
  sectionObser.observe(section)
  // section.classList.add('section--hidden')
})

// lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]')

const loading = function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return

  // replace src with data-src
  entry.target.src = entry.target.dataset.src

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
})

imgTargets.forEach(img => imgObserver.observe(img))

// slider
const slider = function () {
  const slides = document.querySelectorAll('.slide')
  const btnLeft = document.querySelector('.slider__btn--left')
  const btnRight = document.querySelector('.slider__btn--right')
  const dotContainer = document.querySelector('.dots')

  let curSlide = 0
  const maxSlide = slides.length

  // functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = "dots__dot" data-slide = "${i}"></button>`
      )
    })
  }

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'))

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active')
  }

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    )
  }

  // Next Slide
  const nexSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0
    else curSlide++
    goToSlide(curSlide)
    activateDot(curSlide)
  }

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1
    else curSlide--
    goToSlide(curSlide)
    activateDot(curSlide)
  }

  const init = function () {
    createDots()
    activateDot(0)
    goToSlide(0)
  }
  init()

  btnRight.addEventListener('click', nexSlide)
  btnLeft.addEventListener('click', prevSlide)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nexSlide()
    else if (e.key === 'ArrowLeft') prevSlide()
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset
      goToSlide(slide)
      activateDot(slide)
    }
  })
}
slider()

/******************************************************************************************************************************************************************************************************** 
// A Better Way: The Intersection Observer API

const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry)
  })
}

const obsOptions = {
  root: null,
  threshold: [0.2],
}

const observer = new IntersectionObserver(obsCallback, obsOptions)
observer.observe(section1)


*/

// Passing 'argument' into handler
// nav.addEventListener('mouseover', handleHover.bind(0.5))
// nav.addEventListener('mouseout', handleHover.bind(1))

// // Sticky navigation
// const initialCoords = section1.getBoundingClientRect()

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky')
//   else if (window.scrollY < initialCoords.top) nav.classList.remove('sticky')
// })

/******************************************************************************************************************************************************************************************************** */

/* Selecting, Creating, and Deleting Elements */

//console.log('===Selecting, Creating, and Deleting Element====')

// selecting elements
//console.log(document.documentElement)
//console.log(document.header)
//console.log(document.body)

/******** 
const header = document.querySelector('.header')

const allSections = document.querySelectorAll('.section')
//console.log(allSections)

document.getElementById('section')
const allButtons = document.getElementsByTagName('button')
//console.log(allButtons)

document.getElementsByClassName('btn')

// Creating and inserting elements
// .insertAdjacentHTML

const message = document.createElement('div')
message.classList.add('cookie-message')
// message.textContent = 'We use cookies for improved functionality and analytics'
message.innerHTML =
  'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>'

header.prepend(message) // prepend adds as first child
//header.append(message) // append add as last child
//header.append(message.cloneNode(true))
//header.before(message)
//header.after(message)

// delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove()
  })

message.style.backgroundColor = '#37383d'
message.style.width = '120%'

console.log(message.style.color)
console.log(message.style.backgroundColor)

console.log(getComputedStyle(message).color)
console.log(getComputedStyle(message).height)

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px'

//document.documentElement.style.setProperty('--color-primary', 'orangered')

// Attributes

const logo = document.querySelector('.nav__logo')
console.log(logo.src)
console.log(logo.alt)
console.log(logo.className)

logo.alt = 'Minimalist Logo'

// non standard
console.log(logo.designer)
console.log(logo.getAttribute('designer'))
logo.setAttribute('company', 'Bankist')

console.log(logo.getAttribute('src'))

const link = document.querySelector('.nav__link--btn')
console.log(link.href)
console.log(link.getAttribute('href'))

// Data attributes
console.log(logo.dataset.versionNumber)

// Classes
logo.classList.add('c', 's')
logo.classList.remove('c', 'd')
logo.classList.toggle('c')
logo.classList.contains('c') // not includes
// don't use will overwrite
logo.className = 'pew'
*/

/**************************************************************************************************************************************************************************************************************** 
 * 
 * IMPLEMENTING SMOOTH SCROLL 



btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect()
  console.log(s1coords)

  console.log(e.target.getBoundingClientRect())

  console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset)

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  )

  scrolling
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  )

  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  })
*/

/************************************************************************************************************************************************************************************************************** 
// Types of Events and Event Handlers

const h1 = document.querySelector('h1')

//h1.addEventListener('mouseenter')

// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading')
// }

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading')
}

h1.addEventListener('mouseenter', alertH1)

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000)
*/

/************************************************************************************************************************************************************************************************************** 
// Event Propagation in Practice

// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor()
  console.log('LINK', e.target, e.currentTarget)
  console.log(e.currentTarget === this)

  // stop event propagation
  // e.stopPropagation()
})

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor()
  console.log('CONTAINER', e.target, e.currentTarget)
})

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor()
  console.log('NAV', e.target, e.currentTarget)
})
*/

/******************************************************************************************************************************************************************************************************************************************************************** 
// DOM Traversing

const h1 = document.querySelector('h1')

// going downwards : child
console.log(h1.querySelectorAll('.highlight'))
console.log(h1.childNodes)
console.log(h1.children)
console.log((h1.firstElementChild.style.color = 'white'))
console.log((h1.lastElementChild.style.color = 'red'))

// goind upwards : parents
console.log(h1.parentNode)
console.log(h1.parentElement)

h1.closest('.header').style.background = 'var(--gradient-secondary)'

h1.closest('h1').style.background = 'var(--gradient-primary)'

// going sideways : siblings
console.log(h1.previousElementSibling)
console.log(h1.nextElementSibling)

console.log(h1.previousSibling)
console.log(h1.nextSibling)

console.log(h1.parentElement.children)
;[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)'
})
*/

/*********************************************************************************************************************************************************************************************************************************************************************/
// LIFE CYCLE
document,
  addEventListener('DOMContentLoaded', function (e) {
    console.log('Html parsed and DOM tree BUILT', e)
  })

window.addEventListener('load', function (e) {
  console.log('PAge fully loaded')
})

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault()
//   console.log(e)
//   e.returnValue = ''
// })
