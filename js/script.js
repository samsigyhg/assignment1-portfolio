const cards =
  document.querySelectorAll(
    ".story-card"
  );

const track =
  document.getElementById(
    "carousel-track"
  );

const prevBtn =
  document.getElementById(
    "prev-btn"
  );

const nextBtn =
  document.getElementById(
    "next-btn"
  );

const dots =
  document.querySelectorAll(
    ".dot"
  );


let currentIndex = 0;


/* 각 카드의 배경색 */

const themes = [
  "#eee8ff",
  "#e4f1df",
  "#ffe5d6",
  "#e1ecff"
];



function updateCarousel() {

  /*
     카드 하나의 너비
     330px

     카드 사이 간격
     24px
  */

  const cardWidth = 330;

  const gap = 24;

  const move =
    currentIndex *
    (cardWidth + gap);


  /*
     중앙 카드 배치
  */

  const viewportWidth =
    document.querySelector(
      ".carousel-viewport"
    ).offsetWidth;


  const centerOffset =
    viewportWidth / 2
    - cardWidth / 2;


  track.style.transform =
    `translateX(${centerOffset - move}px)`;


  /*
     active 카드 변경
  */

  cards.forEach(
    (card, index) => {

      card.classList.toggle(
        "active",
        index === currentIndex
      );

    }
  );


  /*
     indicator dot 변경
  */

  dots.forEach(
    (dot, index) => {

      dot.classList.toggle(
        "active",
        index === currentIndex
      );

    }
  );


  /*
     배경색 변경
  */

 document.body.style.backgroundColor =
  themes[currentIndex];

const storyLaptop =
  document.querySelector(".story-laptop");

if (storyLaptop) {
  storyLaptop.style.backgroundColor =
    themes[currentIndex] + "CC";
}
}


/* 다음 카드 */

nextBtn.addEventListener(
  "click",
  function() {

    if (
      currentIndex
      <
      cards.length - 1
    ) {

      currentIndex++;

    }

    updateCarousel();

  }
);


/* 이전 카드 */

prevBtn.addEventListener(
  "click",
  function() {

    if (
      currentIndex > 0
    ) {

      currentIndex--;

    }

    updateCarousel();

  }
);


/* Dot 클릭 */

dots.forEach(
  function(dot) {

    dot.addEventListener(
      "click",
      function() {

        currentIndex =
          Number(
            dot.dataset.index
          );

        updateCarousel();

      }
    );

  }
);


/* 처음 화면 */

window.addEventListener(
  "load",
  updateCarousel
);


/* 화면 크기가 바뀔 때 */

window.addEventListener(
  "resize",
  updateCarousel
);
/* ==========================================
   MOUSE WHEEL
   ========================================== */

let wheelLocked = false;

window.addEventListener(
  "wheel",
  function(event) {

    /* 너무 빠르게 여러 카드가 넘어가는 것 방지 */
    if (wheelLocked) {
      return;
    }

    /*
      아래로 스크롤
      → 다음 카드
    */
    if (event.deltaY > 0) {

      if (currentIndex < cards.length - 1) {
        currentIndex++;
        updateCarousel();
      }

    }

    /*
      위로 스크롤
      → 이전 카드
    */
    else if (event.deltaY < 0) {

      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }

    }


    wheelLocked = true;


    setTimeout(
      function() {
        wheelLocked = false;
      },
      700
    );

  },
  {
    passive: true
  }
);
/* ==========================================
   MOUSE DRAG
   ========================================== */

const carouselViewport =
  document.querySelector(
    ".carousel-viewport"
  );


let dragStartX = 0;

let dragEndX = 0;

let isDragging = false;


/* 마우스를 눌렀을 때 */

carouselViewport.addEventListener(
  "pointerdown",
  function(event) {

    /*
      MORE 버튼이나 다른 버튼을 누른 경우에는
      drag를 시작하지 않음
    */

    if (
      event.target.closest(
        "a, button"
      )
    ) {
      return;
    }


    isDragging = true;

    dragStartX =
      event.clientX;


    carouselViewport.classList.add(
      "dragging"
    );

  }
);


/* 마우스를 움직일 때 */

carouselViewport.addEventListener(
  "pointermove",
  function(event) {

    if (!isDragging) {
      return;
    }


    dragEndX =
      event.clientX;

  }
);


/* 마우스를 놓았을 때 */

carouselViewport.addEventListener(
  "pointerup",
  function(event) {

    if (!isDragging) {
      return;
    }


    dragEndX =
      event.clientX;


    const dragDistance =
      dragEndX - dragStartX;


    /*
      왼쪽으로 60px 이상 drag
      → 다음 카드
    */

    if (
      dragDistance < -60
      &&
      currentIndex < cards.length - 1
    ) {

      currentIndex++;

    }


    /*
      오른쪽으로 60px 이상 drag
      → 이전 카드
    */

    else if (
      dragDistance > 60
      &&
      currentIndex > 0
    ) {

      currentIndex--;

    }


    updateCarousel();


    isDragging = false;


    carouselViewport.classList.remove(
      "dragging"
    );

  }
);


/* 화면 밖에서 마우스를 놓는 경우 */

carouselViewport.addEventListener(
  "pointercancel",
  function() {

    isDragging = false;

    carouselViewport.classList.remove(
      "dragging"
    );

  }
);