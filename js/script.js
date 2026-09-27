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
/* ==========================================
   REAL-TIME DRAG CAROUSEL
   ========================================== */

const carouselViewport =
  document.querySelector(".carousel-viewport");

let isDragging = false;
let dragStartX = 0;
let currentDragX = 0;


/* 현재 카드의 기본 위치 계산 */
function getBaseTranslateX() {

  const cardWidth = 330;
  const gap = 24;

  const move =
    currentIndex *
    (cardWidth + gap);

  const viewportWidth =
    carouselViewport.offsetWidth;

  const centerOffset =
    viewportWidth / 2 -
    cardWidth / 2;

  return centerOffset - move;
}


/* 드래그 시작 */
carouselViewport.addEventListener(
  "pointerdown",
  function (event) {

    if (
      event.target.closest("a") ||
      event.target.closest("button")
    ) {
      return;
    }

    isDragging = true;

    dragStartX = event.clientX;
    currentDragX = 0;

    carouselViewport.classList.add(
      "dragging"
    );

    /* 잡는 동안 transition 제거 */
    track.style.transition = "none";

    carouselViewport.setPointerCapture(
      event.pointerId
    );
  }
);


/* 실제 마우스를 따라 이동 */
carouselViewport.addEventListener(
  "pointermove",
  function (event) {

    if (!isDragging) return;

    currentDragX =
      event.clientX - dragStartX;

    const baseX =
      getBaseTranslateX();

    /*
      너무 멀리 끌리는 느낌을 줄이기 위해
      0.85 정도만 따라오도록 설정
    */
    const dragOffset =
      currentDragX * 0.85;

    track.style.transform =
      `translateX(${baseX + dragOffset}px)`;
  }
);


/* 드래그 종료 */
carouselViewport.addEventListener(
  "pointerup",
  function () {

    if (!isDragging) return;

    isDragging = false;

    carouselViewport.classList.remove(
      "dragging"
    );

    /*
      다시 부드러운 transition 활성화
    */
    track.style.transition =
      "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)";


    /*
      70px 이상 끌면 카드 변경
    */
    if (
      currentDragX < -70 &&
      currentIndex < cards.length - 1
    ) {

      currentIndex++;

    } else if (
      currentDragX > 70 &&
      currentIndex > 0
    ) {

      currentIndex--;
    }


    /*
      새 카드 중앙으로 Snap
      조금만 끌었다면 기존 위치로 복귀
    */
    updateCarousel();

    currentDragX = 0;
  }
);


/* 드래그가 강제로 취소된 경우 */
carouselViewport.addEventListener(
  "pointercancel",
  function () {

    if (!isDragging) return;

    isDragging = false;

    carouselViewport.classList.remove(
      "dragging"
    );

    track.style.transition =
      "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)";

    updateCarousel();

    currentDragX = 0;
  }
);
