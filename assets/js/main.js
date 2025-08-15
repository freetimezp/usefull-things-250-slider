document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1");

    const sliderImages = document.querySelector(".slider-images");
    const counter = document.querySelector(".counter");
    const title = document.querySelector(".slider-title-wrapper");
    const indicators = document.querySelectorAll(".slider-indicators p");
    const prevSlides = document.querySelectorAll(".slider-preview .preview");
    const sliderPreview = document.querySelector(".slider-preview");

    let currentImg = 1;
    const totalSlides = 5;
    let indicatorRotation = 0;

    const updateCounterAndTitlePosition = () => {
        const titleHeight = document.querySelector(".slider-title-wrapper p").offsetHeight;
        const couterY = -20 * (currentImg - 1);
        const titleY = -titleHeight * (currentImg - 1);

        gsap.to(counter, {
            y: couterY,
            duration: 1,
            ease: "hop",
        });

        gsap.to(title, {
            y: titleY,
            duration: 1,
            ease: "hop",
        });
    };

    const updateActiveSlidePreview = () => {
        prevSlides.forEach((prev) => prev.classList.remove("active"));
        prevSlides[currentImg - 1].classList.add("active");
    };

    const animateSlide = (direction) => {
        const currentSlides = document.querySelectorAll(".slider-images .img");
        let currentSlide;

        if (currentSlides.length > 0) {
            currentSlide = currentSlides[currentSlides.length - 1];
        }

        const slideImg = document.createElement("div");
        slideImg.classList.add("img");

        const slideImgEl = document.createElement("img");
        slideImgEl.src = `./assets/images/img${currentImg}.jpg`;
        slideImg.appendChild(slideImgEl);

        // Incoming image start position
        gsap.set(slideImgEl, {
            x: direction === "left" ? -300 : 300,
        });

        sliderImages.appendChild(slideImg);

        // Outgoing image
        if (currentSlide) {
            gsap.to(currentSlide.querySelector("img"), {
                x: direction === "left" ? 300 : -300,
                duration: 1.5,
                ease: "power4.out",
                onComplete: () => {
                    if (currentSlides.length > 1) {
                        currentSlides[0].remove();
                    }
                },
            });
        }

        // Clip path animation for new slide
        gsap.fromTo(
            slideImg,
            {
                clipPath:
                    direction === "left"
                        ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                        : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 1.5,
                ease: "power4.out",
            }
        );

        // Move incoming image to center
        gsap.to(slideImgEl, {
            x: 0,
            duration: 1.5,
            ease: "power4.out",
        });

        // Rotate indicators
        indicatorRotation += direction === "left" ? -90 : 90;
        indicators.forEach((indicator) => {
            gsap.to(indicator, {
                rotation: indicatorRotation,
                duration: 1,
                ease: "hop",
            });
        });
    };

    const initializeSlider = () => {
        const firstSlide = document.querySelector(".slider-images .img");

        if (firstSlide) {
            gsap.set(firstSlide, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0 100%)",
            });
        }

        updateActiveSlidePreview();
    };

    document.addEventListener("click", (event) => {
        const sliderWidth = document.querySelector(".slider").clientWidth;
        const clickPosition = event.clientX;

        if (sliderPreview.contains(event.target)) {
            const clickedPrev = event.target.closest(".preview");

            if (clickedPrev) {
                const clickedIndex = Array.from(prevSlides).indexOf(clickedPrev) + 1;

                if (clickedIndex !== currentImg) {
                    const direction = clickedIndex > currentImg ? "right" : "left";
                    currentImg = clickedIndex;
                    animateSlide(direction);
                    updateActiveSlidePreview();
                    updateCounterAndTitlePosition();
                }
            }

            return;
        }

        if (clickPosition < sliderWidth / 2 && currentImg > 1) {
            currentImg--;
            animateSlide("left");
            updateActiveSlidePreview();
            updateCounterAndTitlePosition();
        } else if (clickPosition > sliderWidth / 2 && currentImg < totalSlides) {
            currentImg++;
            animateSlide("right");
            updateActiveSlidePreview();
            updateCounterAndTitlePosition();
        }
    });

    initializeSlider();
});
