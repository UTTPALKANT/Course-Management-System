function CarouselSlide({
  image,
  title,
  description,
  slideNumber,
  totalSlides,
}) {
  const nextSlide = slideNumber === totalSlides ? 1 : slideNumber + 1;
  const prevSlide = slideNumber === 1 ? totalSlides : slideNumber - 1;

  return (
    <div id={`slide${slideNumber}`} className="carousel-item relative w-full">
      <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
        <img
          src={image}
          className="w-40 rounded-full border-2 border-gray-400"
          alt={title}
        />
        <p className="text-xl text-gray-200">{description}</p>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          {/* Previous button */}
          <a href={`#slide${prevSlide}`} className="btn btn-circle">
            ❮
          </a>
          {/* Next button */}
          <a href={`#slide${nextSlide}`} className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
    </div>
  );
}

export default CarouselSlide;
