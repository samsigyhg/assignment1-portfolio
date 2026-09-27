/* ==========================================
   STORY CAROUSEL
   ========================================== */

const cards =
  document.querySelectorAll(".story-card");

const track =
  document.getElementById("carousel-track");

const prevBtn =
  document.getElementById("prev-btn");

const nextBtn =
  document.getElementById("next-btn");

const dots =
  document.querySelectorAll(".dot");

const carouselViewport =
  document.querySelector(".carousel-viewport");


let currentIndex = 0;


/* 카드별 배경색 */
const themes = [
  "#eee8ff",
  "#e4f1df",
  "#ffe5d6",
  "#e1ecff"
];


/* ==========================================
   CAROUSEL 위치 업데이트
   ========================================== */

function updateCarousel() {

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

  track.style.transform =
    `translateX(${centerOffset - move}px)`;


  /* active 카드 */
  cards.forEach(function(card, index) {

    card.classList.toggle(
      "active",
      index === currentIndex
    );

  });


  /* active dot */
  dots.forEach(function(dot, index) {

    dot.classList.toggle(
      "active",
      index === currentIndex
    );

  });


  /* 배경색 */
  document.body.style.backgroundColor =
    themes[currentIndex];


  const storyLaptop =
    document.querySelector(".story-laptop");

  if (storyLaptop) {

    storyLaptop.style.backgroundColor =
      themes[currentIndex] + "CC";

  }

}


/* ==========================================
   NEXT
   ========================================== */

nextBtn.addEventListener(
  "click",
  function() {

    if (
      currentIndex <
      cards.length - 1
    ) {

      currentIndex++;

      updateCarousel();

    }

  }
);


/* ==========================================
   PREVIOUS
   ========================================== */

prevBtn.addEventListener(
  "click",
  function() {

    if (currentIndex > 0) {

      currentIndex--;

      updateCarousel();

    }

  }
);


/* ==========================================
   DOT
   ========================================== */

dots.forEach(function(dot) {

  dot.addEventListener(
    "click",
    function() {

      currentIndex =
        Number(dot.dataset.index);

      updateCarousel();

    }
  );

});


/* ==========================================
   FIRST LOAD
   처음부터 ABOUT을 중앙에 배치
   ========================================== */

/*
  첫 배치에서는 움직이는 애니메이션 OFF
*/
track.style.transition = "none";


/* ABOUT 즉시 중앙 배치 */
updateCarousel();


/*
  현재 중앙 위치를 브라우저에 확정
*/
track.getBoundingClientRect();


/*
  다음 프레임부터 정상 애니메이션 사용
*/
requestAnimationFrame(function() {

  requestAnimationFrame(function() {

    track.style.transition =
      "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)";

  });

});


/* 화면 크기 변경 */
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

    if (wheelLocked) {
      return;
    }


    /* 아래로 */
    if (event.deltaY > 0) {

      if (
        currentIndex <
        cards.length - 1
      ) {

        currentIndex++;

        updateCarousel();

      }

    }


    /* 위로 */
    else if (event.deltaY < 0) {

      if (currentIndex > 0) {

        currentIndex--;

        updateCarousel();

      }

    }


    wheelLocked = true;


    setTimeout(function() {

      wheelLocked = false;

    }, 700);

  },
  {
    passive: true
  }
);


/* ==========================================
   REAL-TIME DRAG
   ========================================== */

let isDragging = false;

let dragStartX = 0;

let currentDragX = 0;


/* 현재 카드의 기본 위치 */
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


/* ==========================================
   DRAG START
   ========================================== */

carouselViewport.addEventListener(
  "pointerdown",
  function(event) {

    /*
      MORE 버튼이나 기타 링크를 클릭한 경우
      Drag 시작하지 않음
    */
    if (
      event.target.closest("a") ||
      event.target.closest("button")
    ) {
      return;
    }


    isDragging = true;

    dragStartX =
      event.clientX;

    currentDragX = 0;


    carouselViewport.classList.add(
      "dragging"
    );


    /* 드래그 중에는 즉시 따라오게 */
    track.style.transition =
      "none";


    carouselViewport.setPointerCapture(
      event.pointerId
    );

  }
);


/* ==========================================
   DRAG MOVE
   ========================================== */

carouselViewport.addEventListener(
  "pointermove",
  function(event) {

    if (!isDragging) {
      return;
    }


    currentDragX =
      event.clientX -
      dragStartX;


    const baseX =
      getBaseTranslateX();


    const dragOffset =
      currentDragX * 0.85;


    track.style.transform =
      `translateX(${baseX + dragOffset}px)`;

  }
);


/* ==========================================
   DRAG END
   ========================================== */

carouselViewport.addEventListener(
  "pointerup",
  function() {

    if (!isDragging) {
      return;
    }


    isDragging = false;


    carouselViewport.classList.remove(
      "dragging"
    );


    /*
      다시 Snap 애니메이션 활성화
    */
    track.style.transition =
      "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)";


    /*
      왼쪽으로 70px 이상
      → 다음 카드
    */
    if (
      currentDragX < -70 &&
      currentIndex <
      cards.length - 1
    ) {

      currentIndex++;

    }


    /*
      오른쪽으로 70px 이상
      → 이전 카드
    */
    else if (
      currentDragX > 70 &&
      currentIndex > 0
    ) {

      currentIndex--;

    }


    /*
      중앙으로 Snap
    */
    updateCarousel();


    currentDragX = 0;

  }
);


/* ==========================================
   DRAG CANCEL
   ========================================== */

carouselViewport.addEventListener(
  "pointercancel",
  function() {

    if (!isDragging) {
      return;
    }


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