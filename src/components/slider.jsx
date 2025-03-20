import React from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

function Slider() {
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slideChanged() {
        // console.log('slide changed')
      },
    },
    [
      // add plugins here
    ]
  )

  return (
    <div ref={sliderRef} className="keen-slider">
      <div className="keen-slider__slide">1</div>
      <div className="keen-slider__slide">2</div>
      <div className="keen-slider__slide">3</div>
    </div>
  )
}

export default Slider;